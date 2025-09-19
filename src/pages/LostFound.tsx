import React from "react";
import { useReports, SafetyAlert } from "@/hooks/useReports";
import Header from "@/components/Header";
import ReportsSection from "@/components/ReportsSection";
import Footer from "@/components/Footer";
import ReportDetailsDialog from "@/components/ReportDetailsDialog";
import ProfileSetup from "@/components/ProfileSetup";

const LostFound: React.FC = () => {
  const { safetyAlerts, loading } = useReports();

  const lostFoundCases = safetyAlerts.filter((s) =>
    ["lostfound", "lost_found", "lost", "found"].includes(String(s.type).toLowerCase())
  );

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogReport, setDialogReport] = React.useState<SafetyAlert | null>(null);

  const handleViewDetails = (report: SafetyAlert) => {
    setDialogReport(report);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-minimal">
      <Header />
      <ProfileSetup />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Lost &amp; Found</h1>
        <ReportsSection
          loading={loading}
          currentReports={lostFoundCases}
          activeTab="lostfound"
          onViewDetails={(r) => handleViewDetails(r as SafetyAlert)}
        />
      </main>

      <ReportDetailsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        report={dialogReport}
        type="lostfound"
      />

      <Footer />
    </div>
  );
};

export default LostFound;
