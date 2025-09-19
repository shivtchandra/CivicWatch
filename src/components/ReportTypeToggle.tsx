
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle, Users } from "lucide-react";

interface ReportTypeToggleProps {
  reportType: "missing" | "lostfound" | "safety" | "civic";
  setReportType: (type: "missing" | "lostfound" | "safety" | "civic") => void;
}

const ReportTypeToggle: React.FC<ReportTypeToggleProps> = ({ reportType, setReportType }) => (
  <div className="flex justify-center mb-8">
    <div className="bg-white rounded-lg p-1 shadow-md flex flex-wrap justify-center gap-1">
      <button
        onClick={() => setReportType('missing')}
        className={`px-6 py-3 rounded-md font-medium transition-colors ${
          reportType === 'missing'
            ? 'bg-yellow-400 text-white'
            : 'text-gray-600 hover:text-yellow-800'
        }`}
        aria-label="Report Missing Case"
      >
        Missing Case
      </button>
      <button
        onClick={() => setReportType('lostfound')}
        className={`px-6 py-3 rounded-md font-medium transition-colors ${
          reportType === 'lostfound'
            ? 'bg-fuchsia-400 text-white'
            : 'text-gray-600 hover:text-fuchsia-800'
        }`}
        aria-label="Report Lost & Found"
      >
        Lost &amp; Found
      </button>
      <button
        onClick={() => setReportType('safety')}
        className={`px-6 py-3 rounded-md font-medium transition-colors ${
          reportType === 'safety'
            ? 'bg-red-500 text-white'
            : 'text-gray-600 hover:text-red-700'
        }`}
        aria-label="Report Safety Alert"
      >
        Safety Alert
      </button>
      <button
        onClick={() => setReportType('civic')}
        className={`px-6 py-3 rounded-md font-medium transition-colors ${
          reportType === 'civic'
            ? 'bg-blue-500 text-white'
            : 'text-gray-600 hover:text-blue-700'
        }`}
        aria-label="Report Civic Issue"
      >
        Civic Report
      </button>
    </div>
  </div>
);

export default ReportTypeToggle;

