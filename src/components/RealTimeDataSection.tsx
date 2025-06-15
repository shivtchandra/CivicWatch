import React from 'react';
import { Clock, Users, AlertTriangle, TrendingUp, Eye, Zap, Shield, Target, Heart, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const RealTimeDataSection = () => {
  return (
    <section className="container mx-auto px-4 py-24 relative overflow-hidden bg-black text-silver">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-neutral-100/30 rounded-full blur-3xl quiet-motion"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-neutral-200/20 rounded-full blur-3xl quiet-motion" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-neutral-100/40 rounded-full blur-3xl quiet-motion" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h3 className="text-5xl md:text-6xl font-light text-neutral-gradient mb-8 font-inter tracking-tight">
            The Critical Window of Response
          </h3>
          <p className="text-xl md:text-2xl text-silver max-w-4xl mx-auto leading-relaxed font-light">
            Every second counts in emergency situations. Real-world data shows that faster reporting 
            and community visibility can be the difference between life and death.
          </p>
        </div>

        {/* Global Crime Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="invisible-card border-red-200/60 hover:border-red-300/80 frictionless-transition">
            <CardHeader className="pb-3">
              <CardTitle className="text-red-600 flex items-center gap-2 text-lg font-medium">
                <Clock className="h-5 w-5" />
                Global Avg Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-light text-silver mb-2">
                8-15 min
              </div>
              <p className="text-silver/70 text-sm">Police response worldwide</p>
            </CardContent>
          </Card>

          <Card className="invisible-card border-amber-200/60 hover:border-amber-300/80 frictionless-transition">
            <CardHeader className="pb-3">
              <CardTitle className="text-amber-600 flex items-center gap-2 text-lg font-medium">
                <AlertTriangle className="h-5 w-5" />
                Critical Window
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-light text-silver mb-2">
                3-5 min
              </div>
              <p className="text-silver/70 text-sm">Optimal intervention time</p>
            </CardContent>
          </Card>

          <Card className="invisible-card border-blue-200/60 hover:border-blue-300/80 frictionless-transition">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-600 flex items-center gap-2 text-lg font-medium">
                <Eye className="h-5 w-5" />
                Witness Factor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-light text-silver mb-2">
                73%
              </div>
              <p className="text-silver/70 text-sm">Success rate with 3+ witnesses</p>
            </CardContent>
          </Card>

          <Card className="invisible-card border-emerald-200/60 hover:border-emerald-300/80 frictionless-transition">
            <CardHeader className="pb-3">
              <CardTitle className="text-emerald-600 flex items-center gap-2 text-lg font-medium">
                <TrendingUp className="h-5 w-5" />
                Prevention Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-light text-silver mb-2">
                67%
              </div>
              <p className="text-silver/70 text-sm">Crime deterred by visibility</p>
            </CardContent>
          </Card>
        </div>

        {/* The Problem vs Solution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* The Current Problem */}
          <div className="whitespace-card rounded-3xl border-red-200/40 bg-black">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="h-8 w-8 text-red-400" />
              <h4 className="text-2xl font-light text-white">Current Reality</h4>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 bg-red-900/30 rounded-xl border border-red-200/40">
                <div className="text-3xl font-light text-red-400 mb-2">42%</div>
                <p className="text-neutral-100 text-sm leading-relaxed">
                  of crimes go unreported globally due to lack of immediate reporting channels
                </p>
              </div>

              <div className="p-4 bg-red-900/30 rounded-xl border border-red-200/40">
                <div className="text-3xl font-light text-red-400 mb-2">18 min</div>
                <p className="text-neutral-100 text-sm leading-relaxed">
                  average time between incident and first responder arrival in urban areas
                </p>
              </div>

              <div className="p-4 bg-red-900/30 rounded-xl border border-red-200/40">
                <div className="text-3xl font-light text-red-400 mb-2">1 in 4</div>
                <p className="text-neutral-100 text-sm leading-relaxed">
                  incidents escalate due to delayed community awareness and response
                </p>
              </div>

              <div className="mt-6 p-4 bg-neutral-900/80 rounded-xl border border-neutral-200/40">
                <p className="text-neutral-200 text-sm leading-relaxed">
                  <strong className="text-red-400 font-medium">The Gap:</strong> Traditional reporting methods create a 
                  dangerous delay between incident occurrence and community awareness, leaving critical 
                  intervention windows missed.
                </p>
              </div>
            </div>
          </div>

          {/* How CivicWatch Helps Bridge the Gap */}
          <div className="whitespace-card rounded-3xl border-blue-200/40 bg-black">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-8 w-8 text-blue-400" />
              <h4 className="text-2xl font-light text-white">Bridging the Gap</h4>
            </div>
            
            <div className="space-y-6">
              <p className="text-neutral-100 text-lg leading-relaxed font-light">
                CivicWatch addresses the critical gap between incident occurrence and community response by providing 
                an instant, location-based reporting system that connects communities in real-time.
              </p>

              <p className="text-neutral-200 leading-relaxed">
                By enabling immediate reporting and instant community notifications, we transform isolated incidents 
                into community-aware situations where multiple people can respond, assist, or take preventive action 
                within those crucial first few minutes.
              </p>

              <p className="text-neutral-200 leading-relaxed">
                The platform leverages the power of collective awareness - when an entire neighborhood knows about 
                an incident immediately, the combined effect of increased vigilance, coordinated response, and 
                deterrence creates a significantly safer environment for everyone.
              </p>

              <div className="mt-6 p-4 bg-blue-900/80 rounded-xl border border-blue-200/40">
                <p className="text-neutral-100 text-sm leading-relaxed">
                  <strong className="text-blue-400 font-medium">The Solution:</strong> By closing the communication gap 
                  between incident and awareness, CivicWatch transforms individual vulnerability into 
                  community strength, making every report a call to collective action.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* The Science Behind Response Time - ENHANCED CONTRAST SECTION */}
        <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-3xl p-12 mb-16 border border-neutral-700/50 shadow-lg">
          <div className="text-center mb-8">
            <h4 className="text-3xl font-light text-white mb-4">
              Why Every Second Matters
            </h4>
            <p className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed font-light">
              Research from emergency response studies worldwide shows the exponential impact of response time
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white/10 rounded-2xl p-8 border border-white/15">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-400/30 to-emerald-500/50 flex items-center justify-center border border-emerald-400/40">
                <Target className="h-12 w-12 text-emerald-300" />
              </div>
              <h5 className="text-xl font-semibold text-white mb-2">0-3 Minutes</h5>
              <p className="text-emerald-300 font-bold mb-2">Prevention Window</p>
              <p className="text-white/80 text-sm leading-relaxed">
                <span className="font-bold text-emerald-200">89%</span> chance of preventing escalation through immediate community awareness and deterrence
              </p>
            </div>
            
            <div className="text-center bg-white/10 rounded-2xl p-8 border border-white/15">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400/30 to-amber-500/50 flex items-center justify-center border border-amber-400/40">
                <Zap className="h-12 w-12 text-yellow-300" />
              </div>
              <h5 className="text-xl font-semibold text-white mb-2">3-8 Minutes</h5>
              <p className="text-yellow-300 font-bold mb-2">Intervention Window</p>
              <p className="text-white/80 text-sm leading-relaxed">
                <span className="font-bold text-yellow-200">54%</span> chance of successful intervention with coordinated community and official response
              </p>
            </div>
            
            <div className="text-center bg-white/10 rounded-2xl p-8 border border-white/15">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-400/30 to-red-500/50 flex items-center justify-center border border-red-400/40">
                <Clock className="h-12 w-12 text-red-300" />
              </div>
              <h5 className="text-xl font-semibold text-white mb-2">8+ Minutes</h5>
              <p className="text-red-300 font-bold mb-2">Response Only</p>
              <p className="text-white/80 text-sm leading-relaxed">
                <span className="font-bold text-red-200">23%</span> success rate &ndash; primarily damage control and investigation after the fact
              </p>
            </div>
          </div>
        </div>

        {/* Network Effect Visualization */}
        <div className="whitespace-card rounded-3xl mb-16 bg-black border border-neutral-800">
          <h4 className="text-2xl font-light text-white mb-8 text-center">
            The Power of Community Visibility
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="text-6xl font-light text-red-400 mb-2">1</div>
              <div className="text-lg font-medium text-white mb-2">Single Witness</div>
              <div className="text-neutral-400 text-sm mb-4">Individual awareness</div>
              <div className="w-full bg-neutral-800 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full frictionless-transition" style={{ width: '25%' }}></div>
              </div>
              <div className="text-xs text-neutral-400 mt-1">Limited response capability</div>
            </div>

            <div className="text-center">
              <div className="text-6xl font-light text-amber-400 mb-2">5+</div>
              <div className="text-lg font-medium text-white mb-2">Community Aware</div>
              <div className="text-neutral-400 text-sm mb-4">Collective knowledge</div>
              <div className="w-full bg-neutral-800 rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full frictionless-transition" style={{ width: '70%' }}></div>
              </div>
              <div className="text-xs text-neutral-400 mt-1">Coordinated response potential</div>
            </div>

            <div className="text-center">
              <div className="text-6xl font-light text-emerald-400 mb-2">20+</div>
              <div className="text-lg font-medium text-white mb-2">Mass Awareness</div>
              <div className="text-neutral-400 text-sm mb-4">Widespread visibility</div>
              <div className="w-full bg-neutral-800 rounded-full h-2">
                <div className="bg-emerald-400 h-2 rounded-full frictionless-transition" style={{ width: '95%' }}></div>
              </div>
              <div className="text-xs text-neutral-400 mt-1">Maximum deterrence effect</div>
            </div>
          </div>

          <div className="p-6 bg-neutral-900/70 rounded-xl border border-blue-900/50">
            <div className="flex items-center gap-3 mb-3">
              <Users className="h-6 w-6 text-blue-400" />
              <span className="text-white font-medium">Universal Principle of Community Safety</span>
            </div>
            <p className="text-neutral-200 text-sm leading-relaxed">
              Research consistently shows that when multiple people in a community are aware of an incident, 
              the combined effect of increased vigilance, potential intervention, and crime deterrence 
              creates exponentially better outcomes. This principle applies universally — whether through 
              neighborhood watch programs, community alert systems, or modern digital platforms.
            </p>
          </div>
        </div>

        {/* Call to action - CENTERED */}
        <div className="text-center mb-16">
          <div className="max-w-5xl mx-auto">
            <div className="whitespace-card rounded-3xl">
              <h4 className="text-3xl font-light text-neutral-gradient mb-6">
                Close the Critical Gap
              </h4>
              <p className="text-xl text-neutral-600 mb-8 leading-relaxed font-light max-w-4xl mx-auto">
                Every minute we delay in building connected, aware communities, we lose opportunities to prevent 
                incidents and protect lives. The data is clear: visibility saves lives.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-neutral-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm">Instant Community Alert</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Network Effect Response</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm">Prevention Through Visibility</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Missing Persons Use Case */}
        <div className="whitespace-card rounded-3xl mb-16 bg-black border border-neutral-800">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="h-8 w-8 text-red-500" />
              <h4 className="text-3xl font-light text-white">
                Reuniting Families: The Missing Persons Solution
              </h4>
            </div>
            <p className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed font-light">
              One of the most critical applications of community visibility is helping reunite missing children with their families
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Parent's Perspective */}
            <div className="bg-gradient-to-tr from-red-900/70 to-black rounded-2xl p-6 border border-red-800/60">
              <div className="flex items-center gap-3 mb-4">
                <Search className="h-6 w-6 text-red-400" />
                <h5 className="text-xl font-medium text-white">When a Child Goes Missing</h5>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    <strong className="text-red-400 font-medium">Instant Upload:</strong> Parents can immediately upload their child's photo, description, last known location, and what they were wearing
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    <strong className="text-red-400 font-medium">Community Alert:</strong> The entire neighborhood gets notified instantly, creating hundreds of eyes looking for the child
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    <strong className="text-red-400 font-medium">Real-time Updates:</strong> Parents can share new information as the search progresses, keeping everyone informed
                  </p>
                </div>
              </div>
            </div>

            {/* Community Response */}
            <div className="bg-gradient-to-tr from-blue-900/70 to-black rounded-2xl p-6 border border-blue-800/60">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-6 w-6 text-blue-400" />
                <h5 className="text-xl font-medium text-white">Community Response</h5>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    <strong className="text-blue-300 font-medium">Immediate Recognition:</strong> Community members who see the child can instantly recognize them from the alert
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    <strong className="text-blue-300 font-medium">Photo Updates:</strong> Anyone who spots the child can upload a photo with their current location and timestamp
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    <strong className="text-blue-300 font-medium">Direct Contact:</strong> The app provides secure contact information so finders can immediately reach the parents
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* The Power of This Approach */}
          <div className="bg-gradient-to-tr from-emerald-900/70 to-black rounded-xl p-6 border border-emerald-800/60">
            <h5 className="text-xl font-medium text-white mb-4 flex items-center gap-3">
              <Target className="h-6 w-6 text-emerald-400" />
              Why This Approach Works
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-light text-emerald-400 mb-2">Minutes</div>
                <p className="text-white/80 text-sm">vs. hours for traditional methods</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-light text-blue-400 mb-2">Hundreds</div>
                <p className="text-white/80 text-sm">of community members alerted instantly</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-light text-amber-400 mb-2">Real-time</div>
                <p className="text-white/80 text-sm">location updates as search progresses</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-emerald-800/60">
              <p className="text-white/80 text-sm leading-relaxed text-center">
                <strong className="text-emerald-400 font-medium">The Result:</strong> Instead of parents desperately searching alone for hours, 
                they have an entire community actively looking within minutes. This transforms a parent's worst nightmare 
                into a coordinated community effort with exponentially higher chances of a safe, quick reunion.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/80 text-lg leading-relaxed max-w-3xl mx-auto font-light">
              This is just <strong className="text-white font-medium">one of many use cases</strong> where immediate community visibility 
              and coordinated response can make the difference between tragedy and relief. From missing persons to safety alerts 
              to civic issues, the power of connected communities creates solutions that were impossible before.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealTimeDataSection;
