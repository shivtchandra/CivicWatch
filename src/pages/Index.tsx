// src/pages/Index.tsx
import { useState } from "react";
import { useReports } from "@/hooks/useReports";
import { useAuth } from "@/contexts/AuthContext";
import ProfileSetup from "@/components/ProfileSetup";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ReportsSection from "@/components/ReportsSection";
import RealTimeDataSection from "@/components/RealTimeDataSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { SafetyAlert, CivicReport } from "@/hooks/useReports";
import { toast } from "@/hooks/use-toast";
import ReportDetailsDialog from "@/components/ReportDetailsDialog";
import WhyThisPlatform from "@/components/WhyThisPlatform";
import WhySafetyAndCivicMatter from "@/components/WhySafetyAndCivicMatter";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [activeTab, setActiveTab] = useState<
    "missing" | "lostfound" | "safety" | "civic"
  >("missing");

  const { profile } = useAuth();
  const navigate = useNavigate();
  const { safetyAlerts, civicReports, loading, refresh } = useReports();

  // Dialog state for viewing report details
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogReport, setDialogReport] = useState<
    SafetyAlert | CivicReport | null
  >(null);
  const [dialogType, setDialogType] = useState<
    "missing" | "lostfound" | "safety" | "civic"
  >("missing");

  // Partition safetyAlerts into missing / lostfound / other safety
  const missingCases = safetyAlerts.filter(
    (sa) =>
      sa.type === "missing" ||
      sa.type === "missing_person"
  );
  const lostFoundCases = safetyAlerts.filter(
    (sa) =>
      sa.type === "lostfound" ||
      sa.type === "lost_found"
  );
  const normalSafetyAlerts = safetyAlerts.filter(
    (sa) =>
      !["missing", "missing_person", "lostfound", "lost_found"].includes(
        sa.type
      )
  );

  let currentReports: (SafetyAlert | CivicReport)[];
  if (activeTab === "missing") {
    currentReports = missingCases;
  } else if (activeTab === "lostfound") {
    currentReports = lostFoundCases;
  } else if (activeTab === "safety") {
    currentReports = normalSafetyAlerts;
  } else {
    currentReports = civicReports;
  }

  const handleViewDetails = (
    report: SafetyAlert | CivicReport,
    type: "missing" | "lostfound" | "safety" | "civic"
  ) => {
    setDialogReport(report);
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleDelete = async (
    report: SafetyAlert | CivicReport,
    type: "missing" | "lostfound" | "safety" | "civic"
  ) => {
    const table = type === "civic" ? "civic_reports" : "safety_alerts";
    toast({
      title: "Deleting...",
      description: "Removing your report.",
    });

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/${table}/${encodeURIComponent(report.id)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      let body = null;
      try {
        body = await res.json();
      } catch {
        /* ignore */
      }

      if (!res.ok) {
        const message = body?.message || `Delete failed with ${res.status}`;
        toast({
          title: "Error deleting report",
          description: message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Report deleted!",
        description: "Your report has been removed.",
      });
      refresh();
    } catch (err: any) {
      toast({
        title: "Error deleting report",
        description: err?.message || String(err),
        variant: "destructive",
      });
    }
  };

  const handleReportClick = () => {
    if (profile) {
      navigate("/report");
    } else {
      navigate("/auth", { state: { from: "/report" } });
    }
  };

  return (
    <div className="min-h-screen bg-minimal">
      {profile && <ProfileSetup />}
      <Header />

      <HeroSection
        safetyAlertsCount={normalSafetyAlerts.length}
        civicReportsCount={civicReports.length}
        missingCasesCount={missingCases.length}
        lostFoundCount={lostFoundCases.length}
        onTabChange={(tab) =>
          setActiveTab(tab as "missing" | "lostfound" | "safety" | "civic")
        }
        activeTab={activeTab}
      />

      <section className="container mx-auto px-4">
        <ReportsSection
          loading={loading}
          currentReports={currentReports}
          activeTab={activeTab}
          onViewDetails={handleViewDetails}
          onDelete={handleDelete}
        />
      </section>

      <ReportDetailsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        report={dialogReport}
        type={dialogType}
      />

      <WhyThisPlatform />
      <RealTimeDataSection />
      <WhySafetyAndCivicMatter />
      <CTASection />
      <Footer />

      {/* Floating Report Button */}
      <Button
        onClick={handleReportClick}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full text-lg bg-blue-600 text-white shadow-lg hover:bg-blue-700"
      >
        R
      </Button>
    </div>
  );
};

export default Index;
