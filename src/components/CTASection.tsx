
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const CTASection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleReportIssue = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/report');
  };

  return (
    <section className="bg-black py-40 border-t border-neutral-200/10 relative">
      <div className="container mx-auto px-12 text-center relative z-10 space-y-20">
        <div className="space-y-16">
          <h3 className="text-5xl md:text-6xl font-extralight text-silver font-inter tracking-tight">
            Your Voice, Your Community, Real Change
          </h3>
          <p className="text-xl md:text-2xl text-silver max-w-4xl mx-auto leading-relaxed font-light">
            Don't let your important reports get lost in the noise of social media entertainment. 
          </p>
          <p className="text-lg md:text-xl text-silver max-w-3xl mx-auto leading-relaxed font-light">
            Join thousands of community members who choose focused action over forgotten posts. 
            Report crimes, fraud, and infrastructure issues where they'll get the serious attention they deserve.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center pt-12">
          <Button 
            size="lg" 
            className="bg-red-600 hover:bg-red-700 text-white font-light px-16 py-6 text-lg rounded-xl frictionless-transition shadow-sm hover:shadow-md"
            onClick={handleReportIssue}
          >
            Report Safety Issue
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={handleReportIssue}
            className="border-blue-300 text-blue-700 hover:bg-blue-50 font-light px-16 py-6 text-lg rounded-xl frictionless-transition"
          >
            Report Civic Problem
          </Button>
        </div>
        
        <p className="text-base text-silver pt-16 font-light max-w-2xl mx-auto leading-relaxed">
          Every report matters. Every voice counts. Real issues deserve real attention on a platform built for impact, not entertainment.
        </p>
      </div>
    </section>
  );
};

export default CTASection;

