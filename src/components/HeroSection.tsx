import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from "react-router-dom";
import StatCard from "./StatCard";

interface HeroSectionProps {
  safetyAlertsCount: number;
  civicReportsCount: number;
  missingCasesCount: number;
  lostFoundCount: number;
  onTabChange?: (tab: string) => void; // New: optional for parent to control tabs
  activeTab?: string;
}

const TRENDS: Record<string, "up" | "down" | undefined> = {
  // Example placeholders, you may want to wire this with real trend data.
  missing: "up",
  lostfound: "down",
  safety: undefined,
  civic: undefined,
};

const HeroSection = ({
  safetyAlertsCount,
  civicReportsCount,
  missingCasesCount,
  lostFoundCount,
  onTabChange,
  activeTab,
}: HeroSectionProps) => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const cards = [
    {
      key: 'missing',
      bgGradient: "bg-black",
      border: activeTab === "missing" ? "border-2 border-silver" : "border border-silver/60",
      count: missingCasesCount,
      label: "Missing Cases",
      description: profile?.city
        ? `Missing persons in ${profile.city}`
        : "Reported missing persons",
      tabLabel: "Missing Cases",
      trend: TRENDS.missing,
      navigateTo: "/missing"
    },
    {
      key: 'lostfound',
      bgGradient: "bg-black",
      border: activeTab === "lostfound" ? "border-2 border-silver" : "border border-silver/60",
      count: lostFoundCount,
      label: "Lost & Found",
      description: profile?.city
        ? `Lost items & found people in ${profile.city}`
        : "Lost items & found people",
      tabLabel: "Lost & Found",
      trend: TRENDS.lostfound,
      navigateTo: "/lostfound"
    },
    {
      key: 'safety',
      bgGradient: "bg-black",
      border: activeTab === "safety" ? "border-2 border-silver" : "border border-silver/60",
      count: safetyAlertsCount,
      label: "Safety Alerts",
      description: profile?.city
        ? `Incidents & alerts in ${profile.city}`
        : "Incidents & safety alerts",
      tabLabel: "Safety Alerts",
      trend: TRENDS.safety,
      navigateTo: "/safety"
    },
    {
      key: 'civic',
      bgGradient: "bg-black",
      border: activeTab === "civic" ? "border-2 border-silver" : "border border-silver/60",
      count: civicReportsCount,
      label: "Civic Reports",
      description: profile?.city
        ? `Civic issues in ${profile.city}`
        : "Civic infrastructure issues",
      tabLabel: "Civic Reports",
      trend: TRENDS.civic,
      navigateTo: "/civic"
    },
  ];

  return (
    <section className="container mx-auto px-4 md:px-8 py-16 md:py-32 text-center relative dark-glass-card text-silver">
      <div className="blur-accent-dark w-56 h-56 left-0 top-8 bg-indigo-400/30"></div>
      <div className="blur-accent-dark w-56 h-40 right-0 -bottom-16 bg-blue-600/20"></div>
      <div className="relative z-10 space-y-16">
        <div className="space-y-12 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-extralight text-silver mb-10 md:mb-16 font-inter tracking-tight leading-tight">
            Where Serious Issues Get Serious Attention
          </h2>
          <p className="text-base md:text-xl text-silver mb-8 md:mb-12 max-w-5xl mx-auto leading-relaxed font-light">
            Unlike social media platforms designed for entertainment, CivicWatch provides a dedicated space 
            where crimes, fraud, and public infrastructure issues receive the focused attention they deserve.
          </p>
          <p className="text-md md:text-lg text-silver mb-10 md:mb-16 max-w-4xl mx-auto leading-relaxed font-light">
            Swift reporting system designed for real impact - not lost in the noise of social feeds.
            {profile?.city ? (
              <span className="block mt-5 md:mt-8 text-white font-normal text-lg md:text-xl animate-fade-in">
                Currently showing reports for {profile.city}
              </span>
            ) : (
              <span className="block mt-5 md:mt-8 text-silver font-light text-base md:text-lg animate-fade-in">
                Currently showing reports for all countries
              </span>
            )}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mx-auto relative max-w-7xl animate-fade-in">
          {cards.map((card) => (
            <StatCard
              key={card.key}
              bgGradient={card.bgGradient}
              border={card.border}
              count={card.count}
              label={card.label}
              description={card.description}
              trend={card.trend}
              tabKey={card.key}
              tabLabel={card.tabLabel}
              isActive={activeTab === card.key}
              onClick={() => navigate(card.navigateTo)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
