
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
import WhyThisPlatform from "@/components/WhyThisPlatform";
import WhySafetyAndCivicMatter from "@/components/WhySafetyAndCivicMatter";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import ReportDetailsDialog from "@/components/ReportDetailsDialog";
// Removed: import TabNavigation from "@/components/TabNavigation";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'missing' | 'lostfound' | 'safety' | 'civic'>('missing');
  const { user } = useAuth();
  const { safetyAlerts, civicReports, loading, refresh } = useReports();

  // Dialog state for viewing report details
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogReport, setDialogReport] = useState<SafetyAlert | CivicReport | null>(null);
  const [dialogType, setDialogType] = useState<'missing' | 'lostfound' | 'safety' | 'civic'>('missing');

  // Partition safetyAlerts
  const missingCases = safetyAlerts.filter((sa) => sa.type === 'missing_person');
  const lostFoundCases = safetyAlerts.filter((sa) => sa.type === 'lost_found');
  const normalSafetyAlerts = safetyAlerts.filter((sa) => sa.type !== 'missing_person' && sa.type !== 'lost_found');

  let currentReports: (SafetyAlert | CivicReport)[];
  if (activeTab === 'missing') {
    currentReports = missingCases;
  } else if (activeTab === 'lostfound') {
    currentReports = lostFoundCases;
  } else if (activeTab === 'safety') {
    currentReports = normalSafetyAlerts;
  } else {
    currentReports = civicReports;
  }

  const handleViewDetails = (report: SafetyAlert | CivicReport, type: 'missing' | 'lostfound' | 'safety' | 'civic') => {
    setDialogReport(report);
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleDelete = async (
    report: SafetyAlert | CivicReport,
    type: 'missing' | 'lostfound' | 'safety' | 'civic'
  ) => {
    // Explicit literal assignment for Supabase type safety
    const table: "safety_alerts" | "civic_reports" = type === "civic" ? "civic_reports" : "safety_alerts";
    toast({
      title: "Deleting...",
      description: "Removing your report.",
    });
    const { error } = await supabase.from(table).delete().eq("id", report.id);
    if (error) {
      toast({
        title: "Error deleting report",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Report deleted!",
        description: "Your report has been removed.",
      });
      refresh();
    }
  };

  return (
    <div className="min-h-screen bg-minimal">
      {user && <ProfileSetup />}
      <Header />

      <HeroSection
        safetyAlertsCount={normalSafetyAlerts.length}
        civicReportsCount={civicReports.length}
        missingCasesCount={missingCases.length}
        lostFoundCount={lostFoundCases.length}
        onTabChange={(tab) =>
          setActiveTab(tab as 'missing' | 'lostfound' | 'safety' | 'civic')
        }
        activeTab={activeTab}
      />

      <section className="container mx-auto px-4">
        {/* TabNavigation removed */}
        <ReportsSection
          loading={loading}
          currentReports={currentReports}
          activeTab={activeTab}
          onViewDetails={handleViewDetails}
          onDelete={handleDelete}
        />
      </section>

      {/* Details Dialog */}
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
    </div>
  );
};

export default Index;

