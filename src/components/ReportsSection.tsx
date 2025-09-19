// src/components/ReportsSection.tsx
import React, { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import ReportCard from '@/components/ReportCard';
import { SafetyAlert, CivicReport } from '@/hooks/useReports';
import { useAuth } from '@/contexts/AuthContext';

interface ReportsSectionProps {
  loading: boolean;
  currentReports: (SafetyAlert | CivicReport)[];
  activeTab: 'missing' | 'lostfound' | 'safety' | 'civic';
  onViewDetails: (
    report: SafetyAlert | CivicReport,
    type: 'missing' | 'lostfound' | 'safety' | 'civic'
  ) => void;
  onDelete?: (
    report: SafetyAlert | CivicReport,
    type: 'missing' | 'lostfound' | 'safety' | 'civic'
  ) => void;
}

const ReportsSection: React.FC<ReportsSectionProps> = ({
  loading,
  currentReports,
  activeTab,
  onViewDetails,
  onDelete,
}) => {
  const { profile } = useAuth();
  const [search, setSearch] = useState<string>('');

  // Normalize the report type for safer search usage
  type Normalized = (SafetyAlert | CivicReport) & {
    id: number | string;
    title?: string | null;
    description?: string | null;
    location?: string | null;
    createdAt?: string | null;
  };

  const filteredReports = useMemo(() => {
    if (!search.trim()) return currentReports;

    const lower = search.trim().toLowerCase();

    // first: exact location matches (case-insensitive)
    const locationMatches = (currentReports as Normalized[]).filter(
      (rep) => {
        const loc = rep.location;
        return typeof loc === 'string' && loc.toLowerCase() === lower;
      }
    );

    if (locationMatches.length > 0) return locationMatches;

    // fallback: contains in title/description/location
    const containsMatches = (currentReports as Normalized[]).filter((rep) => {
      const title = rep.title ?? '';
      const description = rep.description ?? '';
      const location = rep.location ?? '';
      return (
        (title && title.toLowerCase().includes(lower)) ||
        (description && description.toLowerCase().includes(lower)) ||
        (location && location.toLowerCase().includes(lower))
      );
    });

    return containsMatches;
  }, [search, currentReports]);

  if (loading) {
    return null; // keep original behavior
  }

  const getEmptyText = () => {
    if (search.trim()) return `No results found for "${search}".`;

    const placeSuffix = profile?.city ? ` in ${profile.city}` : ' for any country';
    switch (activeTab) {
      case 'missing':
        return `No missing cases have been posted yet${placeSuffix}.`;
      case 'lostfound':
        return `No lost & found cases have been posted yet${placeSuffix}.`;
      case 'safety':
        return `No safety alerts have been posted yet${placeSuffix}.`;
      case 'civic':
        return `No civic reports have been posted yet${placeSuffix}.`;
      default:
        return '';
    }
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="flex items-center justify-center mb-6 md:mb-8">
        <div className="relative w-full md:w-96">
          <span
            className="absolute flex items-center justify-center left-0 top-1/2 -translate-y-1/2
              bg-white/10 dark:bg-zinc-800/60 border border-white/20 dark:border-zinc-800
              shadow-lg shadow-black/10 dark:shadow-black/30 rounded-full w-10 h-10 backdrop-blur z-10 select-none"
            style={{ left: '4px' }}
            aria-hidden="true"
          >
            <span className="relative flex items-center justify-center w-full h-full">
              <Search className="w-5 h-5 text-white/80 dark:text-neutral-200" />
            </span>
          </span>

          <Input
            placeholder="Search reports…"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className={`
              pl-14 pr-4 py-3 md:py-3.5 rounded-2xl bg-white/10 dark:bg-zinc-900/50
              text-base text-white border border-white/10 dark:border-zinc-800
              shadow-lg shadow-black/10 dark:shadow-black/30 transition-all duration-200
              focus:ring-2 focus:ring-blue-400 focus:border-blue-600 focus:bg-white/20 dark:focus:bg-zinc-900/80
              placeholder:text-neutral-400 backdrop-blur font-medium
            `}
            style={{ boxShadow: '0 2px 18px 0 #0002' }}
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
              key={`${report.id}`}
              report={report as any}
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
