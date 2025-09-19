import React from "react";
import { useReports, SafetyAlert } from "@/hooks/useReports";
import Header from "@/components/Header";
import ReportsSection from "@/components/ReportsSection";
import Footer from "@/components/Footer";
import ReportDetailsDialog from "@/components/ReportDetailsDialog";
import ProfileSetup from "@/components/ProfileSetup";

const SafetyAlerts: React.FC = () => {
  const { safetyAlerts, loading } = useReports();

  const normalSafetyAlerts = safetyAlerts.filter(
    (s) =>
      !["missing", "missing_person", "lostfound", "lost_found", "lost", "found"].includes(
        String(s.type).toLowerCase()
      )
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
        <h1 className="text-2xl font-semibold mb-4">Safety Alerts</h1>
        <ReportsSection
          loading={loading}
          currentReports={normalSafetyAlerts}
          activeTab="safety"
          onViewDetails={(r) => handleViewDetails(r as SafetyAlert)}
        />
      </main>

      <ReportDetailsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        report={dialogReport}
        type="safety"
      />

      <Footer />
    </div>
  );
};

export default SafetyAlerts;
