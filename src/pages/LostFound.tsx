
import React, { useState, useEffect } from "react";
import { useReports } from "@/hooks/useReports";
import Header from "@/components/Header";
import ReportsSection from "@/components/ReportsSection";
import ReportDetailsDialog from "@/components/ReportDetailsDialog";
import Footer from "@/components/Footer";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { SafetyAlert } from "@/hooks/useReports";
import { useAuth } from "@/contexts/AuthContext";

const LostFound = () => {
  const { safetyAlerts, loading, refresh } = useReports();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to log in to view lost & found cases.",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [user, navigate]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogReport, setDialogReport] = useState<SafetyAlert | null>(null);

  const lostFoundCases = safetyAlerts.filter((sa) => sa.type === "lost_found");

  const handleViewDetails = (report: SafetyAlert) => {
    setDialogReport(report);
    setDialogOpen(true);
  };

  // Provide onDelete handler so owners can delete their own reports
  const handleDelete = async (report: SafetyAlert) => {
    toast({
      title: "Deleting...",
      description: "Removing your report.",
    });
    const { error } = await supabase.from("safety_alerts").delete().eq("id", report.id);
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
      refresh?.();
    }
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
        <h1 className="text-3xl font-bold mb-8 text-silver">Lost &amp; Found</h1>
        <ReportsSection
          loading={loading}
          currentReports={lostFoundCases}
          activeTab="lostfound"
          onViewDetails={handleViewDetails}
          onDelete={handleDelete}
        />
        <ReportDetailsDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          report={dialogReport}
          type="lostfound"
        />
      </main>
      <Footer />
    </div>
  );
};

export default LostFound;
