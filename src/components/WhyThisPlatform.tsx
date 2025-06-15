import React from 'react';
import { AlertTriangle, Users, Shield, Zap } from 'lucide-react';

const WhyThisPlatform = () => {
  return (
    <section className="container mx-auto px-4 md:px-12 py-40 relative dark-glass-card text-silver">
      <div className="blur-accent-dark w-80 h-60 left-8 -top-10 bg-purple-400/30"></div>
      <div className="relative z-10 space-y-32">
        <div className="text-center space-y-16">
          <h3 className="text-5xl md:text-6xl font-extralight text-silver mb-16 font-inter tracking-tight">
            Why CivicWatch Exists
          </h3>
          <p className="text-xl md:text-2xl text-silver max-w-4xl mx-auto leading-relaxed font-light">
            Social media platforms prioritize entertainment over serious community issues. 
            Important reports of crimes, fraud, and infrastructure problems get buried in endless feeds 
            designed for likes and shares, not real solutions.
          </p>
        </div>

        {/* Card Layout with better visibility */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 max-w-5xl mx-auto">
          <div className="dark-glass-card p-12 group hover:shadow-2xl hover:border-silver/40">
            <div className="text-center space-y-8">
              <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mx-auto group-hover:bg-black border border-silver/40">
                <AlertTriangle className="h-8 w-8" color="#c0c0c0" />
              </div>
              <h4 className="text-2xl font-light text-silver font-inter">
                Focused Attention
              </h4>
              <p className="text-silver leading-relaxed font-light text-lg">
                Serious issues get the dedicated attention they deserve, not lost in entertainment feeds.
              </p>
            </div>
          </div>

          <div className="dark-glass-card p-12 group hover:shadow-2xl hover:border-silver/40">
            <div className="text-center space-y-8">
              <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mx-auto group-hover:bg-black border border-silver/40">
                <Zap className="h-8 w-8" color="#c0c0c0" />
              </div>
              <h4 className="text-2xl font-light text-silver font-inter">
                Swift Reporting
              </h4>
              <p className="text-silver leading-relaxed font-light text-lg">
                Streamlined system designed for quick, effective reporting when time matters most.
              </p>
            </div>
          </div>

          <div className="dark-glass-card p-12 group hover:shadow-2xl hover:border-silver/40">
            <div className="text-center space-y-8">
              <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mx-auto group-hover:bg-black border border-silver/40">
                <Users className="h-8 w-8" color="#c0c0c0" />
              </div>
              <h4 className="text-2xl font-light text-silver font-inter">
                Real Impact
              </h4>
              <p className="text-silver leading-relaxed font-light text-lg">
                Community-focused platform where every report contributes to meaningful change.
              </p>
            </div>
          </div>

          <div className="dark-glass-card p-12 group hover:shadow-2xl hover:border-silver/40">
            <div className="text-center space-y-8">
              <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mx-auto group-hover:bg-black border border-silver/40">
                <Shield className="h-8 w-8" color="#c0c0c0" />
              </div>
              <h4 className="text-2xl font-light text-silver font-inter">
                Purpose-Built
              </h4>
              <p className="text-silver leading-relaxed font-light text-lg">
                Specifically designed for safety alerts and civic issues, not distracted by entertainment.
              </p>
            </div>
          </div>
        </div>

        {/* Problem/Solution Split with better contrast */}
        <div className="relative max-w-6xl mx-auto">
          <div className="dark-glass-card overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Problem */}
              <div className="p-16 border-r border-silver/20">
                <div className="space-y-12">
                  <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center border border-silver/30">
                    <AlertTriangle className="h-8 w-8" color="#c0c0c0" />
                  </div>
                  <h4 className="text-3xl font-light text-silver font-inter">
                    The Problem
                  </h4>
                  <p className="text-lg text-silver leading-relaxed font-light">
                    When you report a crime, fraud, or broken infrastructure on social platforms, your post competes with 
                    memes, personal updates, and viral content.
                  </p>
                  <p className="text-lg text-silver leading-relaxed font-light">
                    Important community safety issues get scrolled past, buried under algorithm-driven entertainment feeds.
                  </p>
                </div>
              </div>
              {/* Solution */}
              <div className="p-16">
                <div className="space-y-12">
                  <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center border border-silver/30">
                    <Shield className="h-8 w-8" color="#c0c0c0" />
                  </div>
                  <h4 className="text-3xl font-light text-silver font-inter">
                    The Solution
                  </h4>
                  <p className="text-lg text-silver leading-relaxed font-light">
                    <span className="text-white font-normal text-xl">CivicWatch changes this.</span> Every report here matters. 
                    Every voice is heard.
                  </p>
                  <p className="text-lg text-silver leading-relaxed font-light">
                    Every issue gets the serious consideration it deserves on a platform built for impact, not entertainment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyThisPlatform;
