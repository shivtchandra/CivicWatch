
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SafetyAlert {
  id: string;
  type: string;
  title: string;
  description: string;
  location: string;
  priority: string;
  status: string;
  contact_info?: string;
  image_url?: string;
  created_at: string;
  user_id: string;
  city?: string;
  profiles?: {
    full_name: string;
  };
}

export interface CivicReport {
  id: string;
  type: string;
  title: string;
  description: string;
  location: string;
  priority: string;
  status: string;
  government_response?: string;
  image_url?: string;
  created_at: string;
  user_id: string;
  city?: string;
  profiles?: {
    full_name: string;
  };
}

export function useReports() {
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>([]);
  const [civicReports, setCivicReports] = useState<CivicReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  const fetchReports = async () => {
    try {
      setLoading(true);
      
      // Build query with city filter if user has a city set
      let safetyQuery = supabase
        .from('safety_alerts')
        .select('*')
        .order('created_at', { ascending: false });

      let civicQuery = supabase
        .from('civic_reports')
        .select('*')
        .order('created_at', { ascending: false });

      // Filter by user's city if they have one set
      if (profile?.city) {
        safetyQuery = safetyQuery.eq('city', profile.city);
        civicQuery = civicQuery.eq('city', profile.city);
      }

      const { data: safetyData, error: safetyError } = await safetyQuery;
      if (safetyError) throw safetyError;

      const { data: civicData, error: civicError } = await civicQuery;
      if (civicError) throw civicError;

      // Fetch all user profiles separately
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name');

      if (profilesError) throw profilesError;

      // Create a map of user_id to profile
      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

      // Combine data with profiles
      const safetyAlertsWithProfiles = safetyData?.map(alert => ({
        ...alert,
        profiles: profilesMap.get(alert.user_id) || null
      })) || [];

      const civicReportsWithProfiles = civicData?.map(report => ({
        ...report,
        profiles: profilesMap.get(report.user_id) || null
      })) || [];

      setSafetyAlerts(safetyAlertsWithProfiles);
      setCivicReports(civicReportsWithProfiles);
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

    // Set up real-time subscriptions
    const safetyChannel = supabase
      .channel('safety_alerts_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'safety_alerts' },
        () => fetchReports()
      )
      .subscribe();

    const civicChannel = supabase
      .channel('civic_reports_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'civic_reports' },
        () => fetchReports()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(safetyChannel);
      supabase.removeChannel(civicChannel);
    };
  }, [profile?.city]); // Re-fetch when user's city changes

  return {
    safetyAlerts,
    civicReports,
    loading,
    refresh: fetchReports
  };
}
