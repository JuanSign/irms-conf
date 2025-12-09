"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const newsRow1 = [
  "Global Lithium Demand Projections Hit New Highs for 2030",
  "Sustainable Mining: Top 10 Companies Adopting Zero-Carbon Fleets",
  "Copper Prices Surge Amidst Green Energy Transition",
  "AI-Driven Exploration: Reducing Environmental Footprint by 40%",
  "New Safety Standards Introduced for Deep Underground Operations",
];

const newsRow2 = [
  "BREAKING: Major Gold Discovery in Southeast Asia Region",
  "TECH UPDATE: Autonomous Haulage Systems Reach 99.9% Efficiency",
  "MARKET WATCH: Nickel Shortage Predicted by Q4 2026",
  "DIGITAL TWIN: How Virtual Mines are Optimizing Real-World Output",
];

const newsRow3 = [
  "Community Engagement: The New Pillar of ESG Compliance",
  "Rare Earth Elements: Securing the Supply Chain for EV Batteries",
  "Hydrometallurgy Breakthroughs: Cleaner Processing Methods",
  "Investment Alert: Mining Tech Startups See 300% Growth",
  "Circular Economy: Repurposing Mine Tailings into Construction Materials",
];

const neonRed = "#AD0D0E";

export default function NewsRunningText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const row3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const animateTicker = (element: HTMLDivElement | null, speed: number, direction: 1 | -1) => {
        if (!element) return;
    
        gsap.to(element, {
          xPercent: direction === -1 ? -50 : 0,
          startAt: { xPercent: direction === -1 ? 0 : -50 }, 
          ease: "none",
          duration: speed,
          repeat: -1,
        });
      };

      animateTicker(row1Ref.current, 80, -1); 
      animateTicker(row2Ref.current, 70, 1);  
      animateTicker(row3Ref.current, 85, -1); 

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const Separator = () => (
    <span className="mx-6 text-2xl text-[#AD0D0E] select-none">•</span>
  );

  return (
    <section 
      ref={containerRef} 
      className="relative flex w-full flex-col justify-center overflow-hidden bg-[#050505] pt-20 pb-40"
      style={{ borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a" }}
    >
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: "radial-gradient(#333 1px, transparent 1px)", backgroundSize: "30px 30px" }} 
      />
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[#050505] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#050505] to-transparent" />
      <div className="container mx-auto mb-20 px-6 text-center">
        <span className="inline-block rounded-full border border-white/10 bg-white/5 px-8 py-3 text-xl font-bold tracking-[0.2em] text-gray-200 backdrop-blur-sm">
          LATEST NEWS
        </span>
      </div>

      <div className="relative mb-6 flex w-full -rotate-1 transform opacity-80 transition-opacity hover:opacity-100">
        <div ref={row1Ref} className="flex whitespace-nowrap">
          {[...newsRow1, ...newsRow1, ...newsRow1].map((item, i) => (
            <div key={i} className="flex items-center text-xl font-medium text-gray-400">
              <span className="uppercase tracking-wide transition-colors hover:text-white">
                {item}
              </span>
              <Separator />
            </div>
          ))}
        </div>
      </div>

      <div className="relative mb-6 flex w-full rotate-1 transform bg-[#AD0D0E]/5 py-4 backdrop-blur-sm">
        <div ref={row2Ref} className="flex whitespace-nowrap">
          {[...newsRow2, ...newsRow2, ...newsRow2].map((item, i) => (
            <div key={i} className="flex items-center text-4xl font-black uppercase italic tracking-tighter text-white/90">
              <span 
                className="transition-colors hover:text-[#AD0D0E]"
                style={{ 
                   WebkitTextStroke: "1px rgba(255,255,255,0.3)", 
                   color: "transparent" 
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#AD0D0E"; 
                    e.currentTarget.style.webkitTextStroke = "0px";
                    e.currentTarget.style.textShadow = "0 0 20px #AD0D0E";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.color = "transparent";
                    e.currentTarget.style.webkitTextStroke = "1px rgba(255,255,255,0.3)";
                    e.currentTarget.style.textShadow = "none";
                }}
              >
                {item}
              </span>
              <span className="mx-8 text-3xl text-[#AD0D0E] opacity-50">///</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex w-full -rotate-1 transform opacity-60 transition-opacity hover:opacity-100">
        <div ref={row3Ref} className="flex whitespace-nowrap">
          {[...newsRow3, ...newsRow3, ...newsRow3].map((item, i) => (
            <div key={i} className="flex items-center text-lg font-medium text-gray-500">
              <span className="uppercase tracking-wide transition-colors hover:text-white">
                {item}
              </span>
              <Separator />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}