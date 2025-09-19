import React, { useState } from "react";
import { AlertTriangle, Landmark, Leaf, Shield, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "./ui/card";

const stories = [
  {
    title: "Safety Alerts: Saving Lives Through Timely Information",
    description: (
      <>
        <span className="block mb-2 font-medium text-silver">
          During the 2021 Texas winter storm, thousands reported power outages and falling trees in real-time, helping communities prioritize shelter and rescue operations.
        </span>
        <span className="text-silver">
          With CivicWatch, reporting dangers—like broken streetlights, unsafe roads, suspicious activity or environmental hazards—means communities and authorities can respond swiftly, potentially preventing accidents and protecting lives.
        </span>
      </>
    ),
    icon: <AlertTriangle className="h-7 w-7" color="#c0c0c0" />,
  },
  {
    title: "Civic Reports: Fixing What Matters Most",
    description: (
      <>
        <span className="block mb-2 font-medium text-silver">
          In Boston, the Street Bump app enabled citizens to log potholes, leading to 20,000+ road repairs and a safer commute.
        </span>
        <span className="text-silver">
          From collapsed bridges and burst pipes to public service failures, CivicWatch lets everyone report issues that threaten daily life, bringing municipal attention where it's critically needed.
        </span>
      </>
    ),
    icon: <Landmark className="h-7 w-7" color="#c0c0c0" />,
  },
  {
    title: "Environmental Action Starts Local",
    description: (
      <>
        <span className="block mb-2 font-medium text-silver">
          In Flint, Michigan, local reports exposed the water crisis, leading to national action and reforms.
        </span>
        <span className="text-silver">
          When communities log illegal dumping, pollution, or contaminated water, CivicWatch helps environmental agencies respond faster—protecting public health and local ecosystems.
        </span>
      </>
    ),
    icon: <Leaf className="h-7 w-7" color="#c0c0c0" />,
  },
  {
    title: "How CivicWatch Makes a Difference",
    description: (
      <>
        <ul className="list-disc ml-6 mb-2 text-silver">
          <li>Early reporting can reduce costly repairs—Boston saved millions via crowdsourced infrastructure fixes.</li>
          <li>Faster responses to emergencies lower injury rates and property damage.</li>
          <li>Communities empowered by data see increased satisfaction and safety.</li>
        </ul>
        <span className="text-silver">
          A dedicated platform like CivicWatch gives your alerts priority—creating real change, not just raising awareness, and ensuring every voice contributes to safer, better cities.
        </span>
      </>
    ),
    icon: <Shield className="h-7 w-7" color="#c0c0c0" />,
  },
];

// Updated dropdown to remove the photo and keep only the text content.
const StoryDropdown = ({
  story,
  expanded,
  onClick,
  idx,
}: {
  story: typeof stories[number];
  expanded: boolean;
  onClick: () => void;
  idx: number;
}) => (
  <div
    className={`transition-all mb-5
      bg-neutral-950/90 dark:bg-neutral-950/90 backdrop-blur-xl
      border border-blue-900 rounded-2xl
      shadow-xl shadow-blue-900/30
      ${expanded ? "ring-2 ring-blue-700 shadow-2xl scale-[1.025]" : "hover:shadow-2xl hover:scale-[1.01] hover:ring-1 hover:ring-blue-800"}
      relative
      overflow-hidden
      min-h-[78px]
      frictionless-transition
    `}
    style={{}}
  >
    <button
      className="flex w-full items-center justify-between gap-4 px-7 py-7 focus:outline-none cursor-pointer z-10 backdrop-filter"
      onClick={onClick}
      aria-expanded={expanded}
      aria-controls={`story-desc-${idx}`}
      tabIndex={0}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <span className="flex items-center gap-5">
        <span className={`rounded-xl bg-neutral-900/70 p-3 border border-neutral-800 shadow-sm backdrop-blur-lg`}>
          {story.icon}
        </span>
        <span className="text-xl md:text-2xl font-semibold text-white">
          {story.title}
        </span>
      </span>
      {expanded ? (
        <ChevronUp className="w-6 h-6 text-blue-400 transition-transform" />
      ) : (
        <ChevronDown className="w-6 h-6 text-neutral-500 transition-transform" />
      )}
    </button>
    <div
      id={`story-desc-${idx}`}
      className={`transition-all px-7 pb-7 max-h-[900px] overflow-hidden ${expanded ? "opacity-100 pt-0" : "max-h-0 opacity-0 p-0"} `}
      style={{ transition: "all 0.42s cubic-bezier(.4,0,.2,1)" }}
      aria-hidden={!expanded}
    >
      {expanded && (
        // Only display the story description (text) - no photo
        <div className="text-white text-base leading-relaxed font-light animate-fade-in">
          {story.description}
        </div>
      )}
    </div>
    {/* Subtle accent layer depth */}
    <div className="absolute -bottom-4 -right-4 w-28 h-16 rounded-3xl bg-blue-700/30 blur-2xl opacity-60 pointer-events-none" />
  </div>
);

const WhySafetyAndCivicMatter = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="container mx-auto px-4 py-24 relative bg-black text-white">
      <div className="blur-accent-dark w-52 h-44 left-0 top-24 bg-blue-800/30"></div>
      <div className="blur-accent-dark w-44 h-36 right-0 bottom-12 bg-indigo-900/30"></div>
      <div className="max-w-4xl mx-auto text-center mb-16 relative z-10">
        <h3 className="text-4xl md:text-5xl font-extralight text-white mb-8">
          The Critical Need for Safety Alerts & Civic Reports
        </h3>
        <p className="text-lg text-neutral-300 font-light">
          Real-life events show that a dedicated reporting platform isn't just helpful—it's essential.
          CivicWatch harnesses the collective power of a community, giving priority to urgent safety alerts and crucial civic issues.
        </p>
      </div>
      <div className="max-w-3xl mx-auto flex flex-col gap-2 relative z-10">
        {stories.map((story, idx) => (
          <StoryDropdown
            key={story.title}
            story={story}
            expanded={openIdx === idx}
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            idx={idx}
          />
        ))}
      </div>
      {/* SUMMARY BOX */}
      <div className="dark-glass-card max-w-3xl mx-auto mt-12 p-10 flex flex-col items-center justify-center relative border border-blue-900/70 bg-neutral-950/90">
        <div className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
          <Shield className="inline w-7 h-7" color="#c0c0c0" />
          Why All of This Matters
        </div>
        <div className="text-base md:text-lg text-neutral-200 font-normal leading-relaxed text-center max-w-2xl mx-auto">
          Timely and accurate reporting by communities truly saves lives, drives repairs, and helps protect people and environments. From emergencies to infrastructure and environmental issues, CivicWatch empowers everyone to make a difference by alerting authorities and each other—resulting in faster action, reduced harm, better public health, and stronger, safer neighborhoods for all.
        </div>
        <div className="blur-accent-dark -left-10 -bottom-8 w-40 h-28 bg-blue-800/40"></div>
      </div>
    </section>
  );
};

export default WhySafetyAndCivicMatter;
