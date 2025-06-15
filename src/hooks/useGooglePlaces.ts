
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PlaceResult {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export function useGooglePlaces() {
  const [places, setPlaces] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Map<string, { results: PlaceResult[], timestamp: number }>>(new Map());
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const searchPlaces = useCallback(async (input: string) => {
    if (!input.trim() || input.length < 2) {
      setPlaces([]);
      setLoading(false);
      return;
    }

    const normalizedInput = input.toLowerCase().trim();
    
    // Check cache first (with 5 minute expiry)
    const cached = cacheRef.current.get(normalizedInput);
    const now = Date.now();
    if (cached && (now - cached.timestamp) < 300000) { // 5 minutes
      setPlaces(cached.results);
      setLoading(false);
      return;
    }

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Set loading immediately for better UX
    setLoading(true);
    setError(null);

    // Debounce with shorter delay for countries
    searchTimeoutRef.current = setTimeout(async () => {
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const { data, error: functionError } = await supabase.functions.invoke('search-places', {
          body: { input: normalizedInput }
        });

        if (abortController.signal.aborted) return;

        if (functionError) throw functionError;

        const results = data?.predictions || [];
        
        // Cache the results with timestamp
        cacheRef.current.set(normalizedInput, {
          results,
          timestamp: now
        });
        
        setPlaces(results);
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error('Error searching places:', err);
        setError(err.message || 'Failed to search countries');
        setPlaces([]);
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    }, 50); // Reduced debounce to 50ms for faster response
  }, []);

  return { places, loading, error, searchPlaces };
}
