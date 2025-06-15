import React, { useState } from "react";
import { useReports } from "@/hooks/useReports";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import ReportsSection from "@/components/ReportsSection";
import ReportDetailsDialog from "@/components/ReportDetailsDialog";
import Footer from "@/components/Footer";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MissingCases = () => {
  const { user } = useAuth();
  const { safetyAlerts, loading, refresh } = useReports();
  const navigate = useNavigate();

  // Dialog state for viewing report details
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogReport, setDialogReport] = useState(null);
  const [dialogType, setDialogType] = useState('missing');

  const missingCases = safetyAlerts.filter((sa) => sa.type === 'missing_person');

  const handleViewDetails = (report) => {
    setDialogReport(report);
    setDialogType('missing');
    setDialogOpen(true);
  };

  const handleDelete = async (report) => {
    // Deletion is handled via parent with supabase in Index, for consistency, kept minimal here
    window.location.reload(); // For now: refresh after deletion
  };

  return (
    <div className="min-h-screen bg-minimal">
      <Header />
      <div className="container mx-auto px-4 pt-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 text-white bg-black/60 hover:bg-black/80 border border-white/10 shadow backdrop-blur px-4 py-2 rounded-xl mb-8 transition-colors"
        >
          <Home className="h-5 w-5 mr-2" />
          <span>Home</span>
        </button>
      </div>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-silver">Missing Cases</h1>
        <ReportsSection
          loading={loading}
          currentReports={missingCases}
          activeTab="missing"
          onViewDetails={handleViewDetails}
        />
        <ReportDetailsDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          report={dialogReport}
          type="missing"
        />
      </main>
      <Footer />
    </div>
  );
};

export default MissingCases;
