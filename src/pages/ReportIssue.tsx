
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReportIssueForm from '@/components/ReportIssueForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ReportIssue = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 dark-glass-card relative">
      {/* background accent */}
      <div className="blur-accent-dark w-48 h-32 left-0 top-0 bg-blue-700/30"></div>
      <div className="container max-w-2xl mx-auto z-10 relative">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mr-4 text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-white">Report Issue</h1>
        </div>
        <ReportIssueForm onSuccess={() => navigate('/')} />
      </div>
    </div>
  );
};

export default ReportIssue;
