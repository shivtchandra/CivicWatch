import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import ReportCard from '@/components/ReportCard';
import { SafetyAlert, CivicReport } from '@/hooks/useReports';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ReportsSectionProps {
  loading: boolean;
  currentReports: (SafetyAlert | CivicReport)[];
  activeTab: 'missing' | 'lostfound' | 'safety' | 'civic';
  onViewDetails: (report: SafetyAlert | CivicReport, type: 'missing' | 'lostfound' | 'safety' | 'civic') => void;
  onDelete?: (report: SafetyAlert | CivicReport, type: 'missing' | 'lostfound' | 'safety' | 'civic') => void;
}

const ReportsSection = ({
  loading,
  currentReports,
  activeTab,
  onViewDetails,
  onDelete,
}: ReportsSectionProps) => {
  const { profile } = useAuth();
  const [search, setSearch] = useState('');

  // Updated search logic to be strict for location if location is typed, and still supports other fields
  const filteredReports = useMemo(() => {
    if (!search.trim()) return currentReports;

    const lower = search.trim().toLowerCase();

    // If search matches a location exactly (case insensitive), show those first
    const locationMatches = currentReports.filter((rep) =>
      rep.location?.toLowerCase() === lower
    );

    if (locationMatches.length > 0) {
      console.log('Location matches found:', locationMatches.map(r => r.id));
      return locationMatches;
    }

    // Otherwise, fall back to contains search in location, title, description
    const containsMatches = currentReports.filter((rep) =>
      (rep.title && rep.title.toLowerCase().includes(lower)) ||
      (rep.description && rep.description.toLowerCase().includes(lower)) ||
      (rep.location && rep.location.toLowerCase().includes(lower))
    );

    console.log('Contains matches:', containsMatches.map(r => r.id));
    return containsMatches;
  }, [search, currentReports]);

  if (loading) {
    return null;
  }

  const getEmptyText = () => {
    if (search.trim())
      return `No results found for "${search}".`;

    switch (activeTab) {
      case 'missing':
        return `No missing cases have been posted yet${profile?.city ? ` in ${profile.city}` : ' for any country'}.`;
      case 'lostfound':
        return `No lost & found cases have been posted yet${profile?.city ? ` in ${profile.city}` : ' for any country'}.`;
      case 'safety':
        return `No safety alerts have been posted yet${profile?.city ? ` in ${profile.city}` : ' for any country'}.`;
      case 'civic':
        return `No civic reports have been posted yet${profile?.city ? ` in ${profile.city}` : ' for any country'}.`;
      default:
        return '';
    }
  };

  return (
    <div>
      {/* Slick Glassy Search Bar */}
      <div className="flex items-center justify-center mb-6 md:mb-8">
        <div className="relative w-full md:w-96">
          <span
            className="
              absolute flex items-center justify-center
              left-0 top-1/2 -translate-y-1/2
              bg-white/10 dark:bg-zinc-800/60
              border border-white/20 dark:border-zinc-800
              shadow-lg shadow-black/10 dark:shadow-black/30
              rounded-full
              w-10 h-10
              backdrop-blur
              z-10
              transition-all
              select-none
            "
            style={{ left: '4px' }}
            aria-hidden="true"
          >
            {/* Glassy circular icon */}
            <span className="relative flex items-center justify-center w-full h-full">
              <Search className="w-5 h-5 text-white/80 dark:text-neutral-200" />
            </span>
          </span>
          <Input
            placeholder="Search reports…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`
              pl-14 pr-4 py-3 md:py-3.5
              rounded-2xl
              bg-white/10 dark:bg-zinc-900/50
              text-base text-white
              border border-white/10 dark:border-zinc-800
              shadow-lg shadow-black/10 dark:shadow-black/30
              transition-all duration-200
              focus:ring-2 focus:ring-blue-400 focus:border-blue-600
              focus:bg-white/20 dark:focus:bg-zinc-900/80
              placeholder:text-neutral-400
              backdrop-blur
              font-medium
            `}
            style={{
              boxShadow: "0 2px 18px 0 #0002"
            }}
            autoFocus={false}
            aria-label="Search reports"
          />
        </div>
      </div>
      {/* Results */}
      {filteredReports.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-700 dark:text-neutral-300 text-lg">{getEmptyText()}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              type={activeTab}
              onViewDetails={onViewDetails}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsSection;
