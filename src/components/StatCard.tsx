import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  bgGradient: string;
  border?: string;
  count: number;
  label: string;
  description: string;
  onClick?: () => void;
  isActive?: boolean;
  trend?: "up" | "down";
  tabKey?: string;
  tabLabel?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  bgGradient,
  border = "",
  count,
  label,
  description,
  onClick,
  isActive,
  trend,
  tabKey,
  tabLabel,
}) => {
  // Animate count up on mount
  const [displayCount, setDisplayCount] = useState(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    let start = 0;
    let step = Math.max(1, Math.floor(count / 24));
    animationRef.current = window.setInterval(() => {
      start += step;
      if (start >= count) {
        setDisplayCount(count);
        if (animationRef.current) clearInterval(animationRef.current);
      } else {
        setDisplayCount(start);
      }
    }, 20);
    return () => animationRef.current && clearInterval(animationRef.current);
  }, [count]);

  // Card state styles
  const ring =
    isActive && !border ? "ring-2 ring-offset-2 ring-blue-500" : "";

  return (
    <button
      type="button"
      tabIndex={0}
      className={cn(
        "group relative flex flex-col text-left rounded-2xl min-h-[226px] w-full px-7 py-10 md:p-12 shadow-sm frictionless-transition outline-none",
        border,
        ring,
        "hover:scale-105 focus:scale-105 hover:shadow-lg focus:ring-2 focus:ring-blue-400",
        bgGradient,
        isActive ? "z-10" : ""
      )}
      aria-label={`Go to ${tabLabel || label}`}
      onClick={onClick}
      style={{ transitionProperty: "transform, box-shadow, background" }}
    >
      {/* ICON REMOVED */}

      <div className="flex items-center space-x-4 mb-2">
        <span
          className={cn(
            "text-5xl md:text-6xl font-extralight font-inter tracking-tight transition-colors text-white"
          )}
        >
          {displayCount}
        </span>
      </div>
      <span className="text-lg md:text-xl font-medium text-white mb-2 block">{label}</span>
      <span className="text-sm md:text-base text-neutral-500 font-light block">{description}</span>
      {/* Subtle effect for high counts */}
      {count > 99 && (
        <span className="absolute top-4 right-4 bg-red-500 text-white px-2 rounded-full text-xs font-medium select-none shadow">
          99+
        </span>
      )}
      <span className="absolute inset-0 rounded-2xl ring-inset group-focus:ring-2 group-focus:ring-blue-400 pointer-events-none" />
    </button>
  );
};

export default StatCard;
