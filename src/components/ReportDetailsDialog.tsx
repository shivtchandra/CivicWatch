import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, User, Phone, Image } from "lucide-react";
import { SafetyAlert, CivicReport } from "@/hooks/useReports";
import { useAuth } from "@/contexts/AuthContext";
import MessageThread from "@/components/MessageThread";
import ReporterProfileDropdown from "./ReporterProfileDropdown";

interface ReportDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  report: SafetyAlert | CivicReport | null;
  type: 'missing' | 'lostfound' | 'safety' | 'civic';
}

const formatType = (typeString: string) => {
  return typeString
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  if (diffInHours < 1) return "Less than 1 hour ago";
  if (diffInHours < 24) return `${diffInHours} hours ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "1 day ago";
  return `${diffInDays} days ago`;
};

const ReportDetailsDialog: React.FC<ReportDetailsDialogProps> = ({
  open,
  onClose,
  report,
  type,
}) => {
  if (!report) return null;

  const { user } = useAuth();

  // Helper function to check if report is SafetyAlert and has contact_info.
  const isSafetyAlert = (r: SafetyAlert | CivicReport): r is SafetyAlert =>
    (r as SafetyAlert).contact_info !== undefined;

  // Omit phone number from reporter and from "contact_info" for safety alerts
  let showContactInfo = true;
  let contactInfoValue = '';
  if (type === "safety" && isSafetyAlert(report) && report.contact_info) {
    // Hide phone number, so only show if it's an email or not a phone number
    if (/^\+?\d[\d -]{7,}\d$/.test(report.contact_info.trim())) {
      showContactInfo = false;
    }
    contactInfoValue = report.contact_info;
  } else if (type === "safety" && isSafetyAlert(report)) {
    contactInfoValue = report.contact_info || '';
  }

  // Helper to avoid showing phone in any type
  const maskPhone = (info: string | undefined) => {
    if (!info) return "";
    return /^\+?\d[\d -]{7,}\d$/.test(info.trim()) ? "[hidden]" : info;
  };

  // Get reporter info
  const reporterId = report?.user_id ?? "";
  const reporterName = report?.profiles?.full_name ?? "Reporter";
  const reporterEmail = (report as any)?.profiles?.email || undefined;

  const isMyReport = user && user.id === reporterId;
  // Determine report_type for messages
  const reportType = type === "civic" ? "civic_report" : "safety_alert";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* dialog content */}
      <DialogContent className="max-w-lg bg-black/80 text-silver dark-glass-card border-white/10 shadow-xl shadow-black/70">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">{report.title}</DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="default" className="bg-white/10 text-silver border-white/20">{formatType(report.type)}</Badge>
              <Badge variant="secondary" className="bg-white/10 text-silver border-white/20">{formatType(report.priority)} Priority</Badge>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1">
          <div className="flex items-center text-sm text-silver mb-2">
            <MapPin className="h-4 w-4 mr-1 text-silver" />
            <span className="truncate">{report.location}</span>
          </div>
          {/* Reporter profile dropdown */}
          {reporterId && user && (
            <div className="flex items-center text-sm mb-2">
              <ReporterProfileDropdown
                reporterId={reporterId}
                reporterName={reporterName}
                reporterEmail={reporterEmail}
                currentUserId={user.id}
              />
            </div>
          )}
          {report.profiles?.full_name && (
            <div className="flex items-center text-sm text-silver">
              <User className="h-4 w-4 mr-1 text-silver" /> Reported by {report.profiles.full_name}
            </div>
          )}
          <div className="text-xs text-muted-foreground mb-2">
            Posted {formatTimeAgo(report.created_at)}
          </div>
          <div>
            <span className="block font-semibold text-white/90">Status:</span>{" "}
            <span className="text-silver">{formatType(report.status)}</span>
          </div>
          <div className="my-2">
            <span className="block font-semibold text-white/90">Description:</span>
            <div className="text-silver whitespace-pre-line">{report.description}</div>
          </div>
          {report.image_url && (
            <div className="mb-2">
              <img
                src={report.image_url}
                alt="Report evidence"
                className="w-full h-48 object-cover rounded border border-white/10 shadow"
              />
            </div>
          )}
          {/* Only show contact info for SafetyAlert, and never show phone number */}
          {type === "safety" && (report as SafetyAlert).contact_info && (
            <div className="flex items-center text-sm mb-1 bg-blue-900/30 rounded px-2 py-1 border border-blue-400/20">
              <Phone className="h-4 w-4 mr-2 text-blue-300" />
              <span className="font-semibold text-blue-200">Contact:</span>&nbsp;
              <span className="text-blue-100">
                {/* Mask phone number */}
                {(() => {
                  const info = (report as SafetyAlert).contact_info;
                  if (!info) return "";
                  return /^\+?\d[\d -]{7,}\d$/.test(info.trim()) ? "[hidden]" : info;
                })()}
              </span>
            </div>
          )}
          {type === "civic" && "government_response" in report && report.government_response && (
            <div className="mb-2 p-2 bg-green-800/30 rounded border border-green-300/20">
              <span className="font-semibold text-green-100">Government Response:</span>
              <div className="text-green-50 mt-1">{report.government_response}</div>
            </div>
          )}
        </div>
        {/* Removed: Message Button & Thread */}
        <DialogFooter>
          <DialogClose asChild>
            <button className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-silver font-semibold frictionless-transition">
              Close
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDetailsDialog;
