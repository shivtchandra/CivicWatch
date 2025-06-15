
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface City {
  id: string;
  name: string;
  state: string | null;
  country: string | null;
}

// Simple type guard to check array of objects with name property (minimal, but safe for our use)
function isCitiesArray(input: any): input is City[] {
  return (
    Array.isArray(input) &&
    input.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.name === 'string' &&
        typeof item.id === 'string'
    )
  );
}

export function useCities() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCities = async () => {
    try {
      console.log('Starting to fetch cities from Supabase...');
      setLoading(true);
      setError(null);

      // Workaround: Use a generic type for this query, since cities is missing in the generated types.
      const { data, error: fetchError } = await supabase
        .from('cities' as any)
        .select('*')
        .order('name');

      console.log('Supabase cities response:', { data, error: fetchError });

      if (fetchError) {
        console.error('Supabase error:', fetchError);
        setError(fetchError.message || 'Failed to fetch cities');
        setCities([]);
        return;
      }

      // Defensive: Ensure data is an array of City, else set empty array
      if (isCitiesArray(data)) {
        setCities(data);
        console.log('Successfully fetched cities:', data.length);
      } else {
        console.warn('Cities data not in expected shape. Data:', data);
        setCities([]);
      }
    } catch (err: any) {
      console.error('Error in fetchCities:', err);
      setError(err.message || 'Failed to fetch cities');
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  return { cities, loading, error, refresh: fetchCities };
}

