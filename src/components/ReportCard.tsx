import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, MessageSquare, Phone, User, ShieldAlert, AlertTriangle, HelpCircle, Box } from 'lucide-react';
import { SafetyAlert, CivicReport } from '@/hooks/useReports';
import { useAuth } from '@/contexts/AuthContext';

interface ReportCardProps {
  report: SafetyAlert | CivicReport;
  type: 'missing' | 'lostfound' | 'safety' | 'civic';
  onViewDetails: (report: SafetyAlert | CivicReport, type: 'missing' | 'lostfound' | 'safety' | 'civic') => void;
  onDelete?: (report: SafetyAlert | CivicReport, type: 'missing' | 'lostfound' | 'safety' | 'civic') => void;
}

const ReportCard = ({ report, type, onViewDetails, onDelete }: ReportCardProps) => {
  // Theme settings by type
  const typeTheme =
    type === 'missing'
      ? {
          cardBg: 'bg-yellow-50 dark:bg-yellow-900/60',
          border: 'border-yellow-200 dark:border-yellow-700',
          accent: 'bg-yellow-500 text-white',
          headerText: 'text-yellow-800 dark:text-yellow-200',
          iconColor: 'text-yellow-600',
          shadow: 'shadow-lg hover:shadow-2xl',
          tagIcon: <HelpCircle className="h-4 w-4 mr-2 text-yellow-700" />,
        }
      : type === 'lostfound'
      ? {
          cardBg: 'bg-fuchsia-50 dark:bg-fuchsia-900/60',
          border: 'border-fuchsia-200 dark:border-fuchsia-700',
          accent: 'bg-fuchsia-500 text-white',
          headerText: 'text-fuchsia-800 dark:text-fuchsia-200',
          iconColor: 'text-fuchsia-600',
          shadow: 'shadow-lg hover:shadow-2xl',
          tagIcon: <Box className="h-4 w-4 mr-2 text-fuchsia-700" />,
        }
      : type === 'safety'
      ? {
          cardBg: 'bg-red-50 dark:bg-red-900/50',
          border: 'border-red-200 dark:border-red-700',
          accent: 'bg-red-500 text-white',
          headerText: 'text-red-700 dark:text-red-300',
          iconColor: 'text-red-500',
          shadow: 'shadow-lg hover:shadow-xl',
          tagIcon: <ShieldAlert className="h-4 w-4 mr-2 text-red-400" />,
        }
      : {
          cardBg: 'bg-blue-50 dark:bg-blue-900/50',
          border: 'border-blue-200 dark:border-blue-700',
          accent: 'bg-blue-500 text-white',
          headerText: 'text-blue-700 dark:text-blue-300',
          iconColor: 'text-blue-500',
          shadow: 'shadow-lg hover:shadow-xl',
          tagIcon: <AlertTriangle className="h-4 w-4 mr-2 text-blue-400" />,
        };

  const getPriorityColor = (priority: string) => {
    if (type === 'missing') return 'bg-yellow-400 text-black';
    if (type === 'lostfound') return 'bg-fuchsia-400 text-black';
    switch (priority) {
      case 'high': return type === 'safety' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white';
      case 'medium': return type === 'safety' ? 'bg-orange-400 text-white' : 'bg-cyan-500 text-white';
      case 'low': return type === 'safety' ? 'bg-yellow-300 text-black' : 'bg-green-300 text-black';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getStatusColor = (status: string, reportType: string) => {
    if (reportType === 'missing') {
      switch (status) {
        case 'active': return 'bg-yellow-100 text-yellow-900 border-l-4 border-yellow-500';
        case 'investigating': return 'bg-orange-100 text-orange-900 border-l-4 border-orange-400';
        case 'resolved': return 'bg-green-100 text-green-900 border-l-4 border-green-500';
        default: return 'bg-gray-100 text-gray-800';
      }
    } else if (reportType === 'lostfound') {
      switch (status) {
        case 'active': return 'bg-fuchsia-100 text-fuchsia-900 border-l-4 border-fuchsia-600';
        case 'investigating': return 'bg-orange-100 text-orange-900 border-l-4 border-orange-400';
        case 'resolved': return 'bg-green-100 text-green-900 border-l-4 border-green-500';
        default: return 'bg-gray-100 text-gray-800';
      }
    } else if (reportType === 'safety') {
      switch (status) {
        case 'active': return 'bg-red-100/90 text-red-800 border-l-4 border-red-500';
        case 'investigating': return 'bg-amber-100/90 text-amber-800 border-l-4 border-amber-500';
        case 'resolved': return 'bg-green-100/90 text-green-900 border-l-4 border-green-600';
        default: return 'bg-gray-100/80 text-gray-800';
      }
    } else {
      switch (status) {
        case 'reported': return 'bg-sky-100 text-sky-900 border-l-4 border-sky-400';
        case 'in_progress': return 'bg-yellow-100 text-yellow-900 border-l-4 border-yellow-400';
        case 'resolved': return 'bg-green-100 text-green-900 border-l-4 border-green-400';
        case 'rejected': return 'bg-red-100 text-red-900 border-l-4 border-red-400';
        default: return 'bg-gray-100 text-gray-800';
      }
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Less than 1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const formatType = (typeString: string) => {
    return typeString
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const { user } = useAuth();
  const isOwnedByUser = user && report.user_id === user.id;

  return (
    <Card className={`${typeTheme.cardBg} ${typeTheme.border} ${typeTheme.shadow} border-2 rounded-xl transition-all`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center">
                {typeTheme.tagIcon}
                <Badge className={`${typeTheme.accent} font-semibold px-3 py-1 shadow-sm`}>
                  {type === 'missing'
                    ? 'Missing Case'
                    : type === 'lostfound'
                    ? 'Lost & Found'
                    : type === 'safety'
                    ? 'Safety Alert'
                    : 'Civic Report'}
                </Badge>
              </span>
              <Badge className={`${getPriorityColor(report.priority)} border border-white/40 shadow-md ml-2`}>
                {formatType(report.priority)} Priority
              </Badge>
            </div>
            <CardTitle className={`text-xl font-bold mb-1 ${typeTheme.headerText}`}>
              {report.title}
            </CardTitle>
            {report.profiles?.full_name && (
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <User className="h-3 w-3 mr-1" />
                Reported by {report.profiles.full_name}
              </div>
            )}
          </div>
        </div>
        <CardDescription className="flex items-center text-sm mt-2 font-medium">
          <MapPin className={`h-4 w-4 mr-1 ${typeTheme.iconColor}`} />
          <span className="truncate">{report.location}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`${getStatusColor(report.status, type)} px-4 py-2 mb-4 rounded-md shadow-inner flex items-center`}>
          <span className="font-semibold text-xs uppercase tracking-wide">{formatType(report.status)}</span>
        </div>

        <p className="mb-4 leading-relaxed text-gray-800 dark:text-gray-200">{report.description}</p>

        {report.image_url && (
          <div className="mb-4">
            <img
              src={report.image_url}
              alt="Report evidence"
              className="w-full h-48 object-cover rounded-md border border-white/30 shadow-lg"
            />
          </div>
        )}

        {/* Only safety alert supports contact info */}
        {type === 'safety' && 'contact_info' in report && report.contact_info && (
          <div className="flex items-center text-sm mb-4 p-3 bg-white/80 dark:bg-gray-800/60 border-l-4 border-blue-400 rounded">
            <Phone className="h-4 w-4 mr-2 text-blue-500" />
            <span className="font-semibold text-blue-700 dark:text-blue-300">Contact: </span>&nbsp;
            <span className="text-gray-600 dark:text-gray-300">{report.contact_info}</span>
          </div>
        )}

        {/* Only civic report supports government response */}
        {type === 'civic' && 'government_response' in report && report.government_response && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-400 rounded">
            <p className="text-sm font-medium text-green-700 dark:text-green-300">Government Response:</p>
            <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{report.government_response}</p>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-300 mb-4 mt-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {formatTimeAgo(report.created_at)}
          </div>
          <div className="flex items-center font-medium">
            <MessageSquare className="h-4 w-4 mr-1" />
            View Details
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            className={`${typeTheme.accent} w-full hover:opacity-90 transition rounded-full font-semibold tracking-wide shadow`}
            variant="default"
            onClick={() => onViewDetails(report, type)}
          >
            View Details & Help
          </Button>
          {isOwnedByUser && onDelete && (
            <Button
              variant="destructive"
              className="w-full rounded-full mt-2"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this report?')) {
                  onDelete(report, type);
                }
              }}
            >
              Delete Report
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;

// Note: This file is over 200 lines. Consider refactoring it into smaller components for maintainability.
