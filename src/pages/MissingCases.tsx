import React from "react";
import { useReports, SafetyAlert } from "@/hooks/useReports";
import Header from "@/components/Header";
import ReportsSection from "@/components/ReportsSection";
import Footer from "@/components/Footer";
import ReportDetailsDialog from "@/components/ReportDetailsDialog";
import ProfileSetup from "@/components/ProfileSetup";

const MissingCases: React.FC = () => {
  const { safetyAlerts, loading } = useReports();

  const missingCases = safetyAlerts.filter(
    (s) => ["missing", "missing_person"].includes(String(s.type).toLowerCase())
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
        <h1 className="text-2xl font-semibold mb-4">Missing Persons</h1>
        <ReportsSection
          loading={loading}
          currentReports={missingCases}
          activeTab="missing"
          onViewDetails={(r) => handleViewDetails(r as SafetyAlert)}
        />
      </main>

      <ReportDetailsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        report={dialogReport}
        type="missing"
      />

      <Footer />
    </div>
  );
};

export default MissingCases;
