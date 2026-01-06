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

// Definisi Tema (Sesuai Request)
const theme = {
  darkMaroon: "#590004", // Background strip tengah / Shadow
  vintageRed: "#C71F2D", // Highlight utama / Separator
  cream: "#FCEECB",      // Text highlight / Stroke / Badge Text
  deepNavy: "#04233A",   // Background Utama
  steelBlue: "#6A96B7",  // Text normal / Pattern
};

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
    // Separator menggunakan Vintage Red agar kontras dengan Navy
    <span className="mx-6 text-xl md:text-2xl select-none" style={{ color: theme.vintageRed }}>•</span>
  );

  return (
    <section 
      ref={containerRef} 
      className="relative flex w-full flex-col justify-center overflow-hidden pt-24 pb-44"
      style={{ 
        // BACKGROUND: Deep Navy Solid dengan gradasi radial ke arah hitam di pinggir (Vignette alami)
        background: `radial-gradient(circle at center, ${theme.deepNavy} 0%, #02121f 100%)`,
        borderTop: `1px solid ${theme.steelBlue}15`, 
        borderBottom: `1px solid ${theme.steelBlue}15` 
      }}
    >
      {/* UBAH: Pattern dots jadi Steel Blue dengan opacity rendah */}
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: `radial-gradient(${theme.steelBlue} 1px, transparent 1px)`, backgroundSize: "30px 30px" }} 
      />
      
      <div className="container mx-auto mb-16 px-6 text-center relative z-20">
        <span 
          className="inline-block px-6 py-2 text-xs md:text-sm font-bold tracking-[0.3em] uppercase backdrop-blur-md rounded-full transition-all duration-500 hover:tracking-[0.4em]"
          style={{ 
            backgroundColor: `${theme.deepNavy}80`, // Navy transparan
            color: theme.vintageRed,                // Aksen Merah Vintage
            border: `5px solid ${theme.vintageRed}40`, 
            boxShadow: `0 0 35px ${theme.vintageRed}10` 
          }}
        >
          Latest Intelligence
        </span>
      </div>

      {/* ROW 1 */}
      <div className="relative mb-6 flex w-full -rotate-1 transform opacity-80 transition-opacity hover:opacity-100">
        <div ref={row1Ref} className="flex whitespace-nowrap">
          {[...newsRow1, ...newsRow1, ...newsRow1].map((item, i) => (
            <div 
                key={i} 
                className="flex items-center text-sm md:text-xl font-medium transition-colors duration-300"
                style={{ color: theme.steelBlue }}
            >
              <span 
                className="uppercase tracking-wide transition-colors hover:cursor-default"
                onMouseEnter={(e) => e.currentTarget.style.color = theme.cream}
                onMouseLeave={(e) => e.currentTarget.style.color = "inherit"}
              >
                {item}
              </span>
              <Separator />
            </div>
          ))}
        </div>
      </div>

      {/* ROW 2 (BIG TEXT - HERO) */}
      <div 
        className="relative mb-6 flex w-full rotate-1 transform py-4 backdrop-blur-sm"
        style={{ 
            backgroundColor: `${theme.darkMaroon}40`, // Dark Maroon transparan
            borderTop: `1px solid ${theme.vintageRed}20`,
            borderBottom: `1px solid ${theme.vintageRed}20`
        }}
      >
        <div ref={row2Ref} className="flex whitespace-nowrap">
          {[...newsRow2, ...newsRow2, ...newsRow2].map((item, i) => (
            <div key={i} className="flex items-center text-2xl sm:text-3xl md:text-4xl font-black uppercase italic tracking-tighter">
              <span 
                className="transition-all duration-300 cursor-default"
                style={{ 
                   // UBAH: Stroke warna Cream (elegan), Fill transparan
                   WebkitTextStroke: `1px ${theme.cream}66`, // 66 = opacity 40%
                   color: "transparent" 
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.color = theme.vintageRed; // Isi jadi Merah Klasik
                    e.currentTarget.style.webkitTextStroke = "0px";
                    e.currentTarget.style.textShadow = `0 0 30px ${theme.vintageRed}80`; // Glow
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.color = "transparent";
                    e.currentTarget.style.webkitTextStroke = `1px ${theme.cream}66`;
                    e.currentTarget.style.textShadow = "none";
                }}
              >
                {item}
              </span>
              <span 
                className="mx-8 text-xl sm:text-2xl md:text-3xl opacity-50"
                style={{ color: theme.vintageRed }}
              >
                ///
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ROW 3 */}
      <div className="relative flex w-full -rotate-1 transform opacity-60 transition-opacity hover:opacity-100">
        <div ref={row3Ref} className="flex whitespace-nowrap">
          {[...newsRow3, ...newsRow3, ...newsRow3].map((item, i) => (
            // UBAH: Sama seperti Row 1, Steel Blue -> Cream
            <div 
                key={i} 
                className="flex items-center text-sm md:text-lg font-medium transition-colors duration-300"
                style={{ color: theme.steelBlue }}
            >
              <span 
                className="uppercase tracking-wide transition-colors hover:cursor-default"
                onMouseEnter={(e) => e.currentTarget.style.color = theme.cream}
                onMouseLeave={(e) => e.currentTarget.style.color = "inherit"}
              >
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