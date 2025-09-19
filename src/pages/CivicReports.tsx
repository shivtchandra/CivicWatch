import React from "react";
import { useReports, CivicReport } from "@/hooks/useReports";
import Header from "@/components/Header";
import ReportsSection from "@/components/ReportsSection";
import Footer from "@/components/Footer";
import ReportDetailsDialog from "@/components/ReportDetailsDialog";
import ProfileSetup from "@/components/ProfileSetup";

const CivicReports: React.FC = () => {
  const { civicReports, loading } = useReports();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogReport, setDialogReport] = React.useState<CivicReport | null>(null);

  const handleViewDetails = (report: CivicReport) => {
    setDialogReport(report);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-minimal">
      <Header />
      <ProfileSetup />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Civic Reports</h1>
        <ReportsSection
          loading={loading}
          currentReports={civicReports}
          activeTab="civic"
          onViewDetails={(r) => handleViewDetails(r as CivicReport)}
        />
      </main>

      <ReportDetailsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        report={dialogReport}
        type="civic"
      />

      <Footer />
    </div>
  );
};

export default CivicReports;
