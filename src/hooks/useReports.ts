// src/hooks/useReports.ts
import { useState, useEffect } from 'react';
import { getReports, Report } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export interface SafetyAlert {
  id: string | number;
  type: string;
  title: string;
  description: string;
  location?: string | null;
  priority?: string;
  status?: string;
  contact_info?: string;
  image_url?: string | null;
  created_at: string;
  user_id?: string | number;
  city?: string | null;
  profiles?: {
    full_name?: string | null;
  } | null;
}

export interface CivicReport {
  id: string | number;
  type: string;
  title: string;
  description: string;
  location?: string | null;
  priority?: string;
  status?: string;
  government_response?: string;
  image_url?: string | null;
  created_at: string;
  user_id?: string | number;
  city?: string | null;
  profiles?: {
    full_name?: string | null;
  } | null;
}

export function useReports() {
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>([]);
  const [civicReports, setCivicReports] = useState<CivicReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { profile } = useAuth();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const reports: Report[] = (await getReports()) || [];

      // Defensive check for profile city
      const profileCity =
        profile && typeof (profile as any).city === 'string' && (profile as any).city.trim().length > 0
          ? (profile as any).city.trim()
          : null;

      // If profileCity exists, filter reports to that city (case sensitive trimmed compare)
      const filtered = profileCity
        ? reports.filter((r) => {
            const candidates: Array<string | undefined | null> = [];

            if ((r as any).city) candidates.push((r as any).city);
            if (r.user && (r.user as any).city) candidates.push((r.user as any).city);
            if ((r as any).location) candidates.push((r as any).location);

            return candidates.some((c) => typeof c === 'string' && c.trim() === profileCity);
          })
        : reports;

      // Helper to compute display location
      const computeLocation = (r: Report): string | null => {
        const explicitLocation = (r as any).location;
        if (explicitLocation && typeof explicitLocation === 'string' && explicitLocation.trim().length > 0)
          return explicitLocation;

        if (r.user && (r.user as any).city) return (r.user as any).city;

        if (r.lat != null && r.lng != null) return `${r.lat}, ${r.lng}`;

        return null;
      };

      // Map to SafetyAlert bucket
      const mappedSafety: SafetyAlert[] = filtered
        .filter((r) => {
          const cat = String((r as any).category ?? (r as any).type ?? 'general').toLowerCase();
          return [
            'missing',
            'missing_person',
            'lostfound',
            'lost_found',
            'lost',
            'found',
            'safety',
            'safety_alert',
            'suspicious_activity',
          ].includes(cat);
        })
        .map((r) => {
          const loc = computeLocation(r);
          return {
            id: r.id as any,
            type: String((r as any).category ?? (r as any).type ?? 'general'),
            title: r.title ?? '',
            description: r.description ?? '',
            location: loc,
            priority: (r as any).priority ?? 'low',
            status: (r as any).status ?? 'open',
            contact_info: (r as any).contact_info ?? '',
            image_url: (r as any).imageUrl ?? (r as any).image_url ?? null,
            created_at: (r as any).createdAt ?? (r as any).created_at ?? new Date().toISOString(),
            user_id: r.createdBy ?? (r as any).created_by ?? (r as any).user_id,
            city: (r as any).city ?? (r.user && (r.user as any).city) ?? null,
            profiles: r.user ? { full_name: (r.user as any).name ?? (r.user as any).full_name ?? (r.user as any).email } : null,
          } as SafetyAlert;
        });

      // Map to CivicReport bucket
      const mappedCivic: CivicReport[] = filtered
        .filter((r) => {
          const cat = String((r as any).category ?? (r as any).type ?? 'general').toLowerCase();
          return ['civic', 'infrastructure', 'public_services', 'environment', 'transportation'].includes(cat);
        })
        .map((r) => {
          const loc = computeLocation(r);
          return {
            id: r.id as any,
            type: String((r as any).category ?? (r as any).type ?? 'civic'),
            title: r.title ?? '',
            description: r.description ?? '',
            location: loc,
            priority: (r as any).priority ?? 'low',
            status: (r as any).status ?? 'open',
            government_response: (r as any).government_response ?? undefined,
            image_url: (r as any).imageUrl ?? (r as any).image_url ?? null,
            created_at: (r as any).createdAt ?? (r as any).created_at ?? new Date().toISOString(),
            user_id: r.createdBy ?? (r as any).created_by ?? (r as any).user_id,
            city: (r as any).city ?? (r.user && (r.user as any).city) ?? null,
            profiles: r.user ? { full_name: (r.user as any).name ?? (r.user as any).full_name ?? (r.user as any).email } : null,
          } as CivicReport;
        });

      setSafetyAlerts(mappedSafety);
      setCivicReports(mappedCivic);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setSafetyAlerts([]);
      setCivicReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // If you want near-realtime polling uncomment below:
    // const id = setInterval(fetchReports, 15000);
    // return () => clearInterval(id);
  }, [profile?.city]);

  return {
    safetyAlerts,
    civicReports,
    loading,
    refresh: fetchReports,
  };
}
