import React from 'react';
import { AlertTriangle, Users, HelpCircle, Box } from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface TabNavigationProps {
  activeTab: 'missing' | 'lostfound' | 'safety' | 'civic';
  setActiveTab: (tab: 'missing' | 'lostfound' | 'safety' | 'civic') => void;
  missingCasesCount: number;
  lostFoundCount: number;
  safetyAlertsCount: number;
  civicReportsCount: number;
}

const TabNavigation = ({
  activeTab,
  setActiveTab,
  missingCasesCount,
  lostFoundCount,
  safetyAlertsCount,
  civicReportsCount,
}: TabNavigationProps) => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center mb-20">
      <div className="bg-white border border-neutral-200/60 rounded-2xl p-2 shadow-sm">
        <div className="flex space-x-1">
          <button
            onClick={() => navigate("/missing")}
            className={`px-7 py-6 rounded-xl font-light frictionless-transition ${
              activeTab === 'missing'
                ? 'bg-yellow-50 text-yellow-800 border border-yellow-200/80 shadow-sm transform scale-105'
                : 'text-neutral-600 hover:text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <HelpCircle className="h-5 w-5 inline mr-2 text-yellow-700" />
            Missing Cases ({missingCasesCount})
          </button>
          <button
            onClick={() => navigate("/lostfound")}
            className={`px-7 py-6 rounded-xl font-light frictionless-transition ${
              activeTab === 'lostfound'
                ? 'bg-fuchsia-50 text-fuchsia-800 border border-fuchsia-200/80 shadow-sm transform scale-105'
                : 'text-neutral-600 hover:text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <Box className="h-5 w-5 inline mr-2 text-fuchsia-700" />
            Lost &amp; Found ({lostFoundCount})
          </button>
          <button
            onClick={() => navigate("/safety")}
            className={`px-7 py-6 rounded-xl font-light frictionless-transition ${
              activeTab === 'safety'
                ? 'bg-red-50 text-red-700 border border-red-200/80 shadow-sm transform scale-105'
                : 'text-neutral-600 hover:text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <AlertTriangle className="h-5 w-5 inline mr-2 text-red-700" />
            Safety Alerts ({safetyAlertsCount})
          </button>
          <button
            onClick={() => navigate("/civic")}
            className={`px-7 py-6 rounded-xl font-light frictionless-transition ${
              activeTab === 'civic'
                ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-sm transform scale-105'
                : 'text-neutral-600 hover:text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <Users className="h-5 w-5 inline mr-2 text-blue-700" />
            Civic Reports ({civicReportsCount})
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
