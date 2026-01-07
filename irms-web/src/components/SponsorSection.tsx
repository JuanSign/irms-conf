"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const rowImages = [
  { left: "/KAjima.jpg", right: "/Hazama.jpg" },
  { left: "/KumagaiGumi.png", right: "/Shimizu.png" },
  { left: "/Toda.png", right: "/KAjima.jpg" },
];

export default function SponsorSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context((self) => {
      const rows = self.selector ? self.selector(".cta-row") : [];

      rows.forEach((row: HTMLElement, index: number) => {
        const cardLeft = row.querySelector(".cta-card-left") as HTMLElement;
        const cardRight = row.querySelector(".cta-card-right") as HTMLElement;

        const leftXValues = [-500, -700, -300]; 
        const rightXValues = [500, 700, 300];   
        const yValues = [-300, 100, 400];       
        const leftRotationValues = [-15, -20, -10];
        const rightRotationValues = [15, 20, 10];

        if (leftXValues[index] === undefined) return;

        gsap.to(cardLeft, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom", 
            end: "bottom top",   
            scrub: 1,            
            onUpdate: (self) => {
              const progress = self.progress;
              const startSpread = 60; 
              
              if (cardLeft?.style) {
                cardLeft.style.transform = `
                  translateX(${ -startSpread + (progress * leftXValues[index]) }px) 
                  translateY(${ progress * yValues[index] }px) 
                  rotate(${ progress * leftRotationValues[index] }deg)
                `;
              }
              if (cardRight?.style) {
                cardRight.style.transform = `
                  translateX(${ startSpread + (progress * rightXValues[index]) }px) 
                  translateY(${ progress * yValues[index] }px) 
                  rotate(${ progress * rightRotationValues[index] }deg)
                `;
              }
            },
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Style Clip-path
  const cardFrameStyle: React.CSSProperties = {
    clipPath:
      "polygon(2rem 0px, calc(100% - 2rem) 0px, 100% 2rem, 100% calc(100% - 2rem), calc(100% - 2rem) 100%, 2rem 100%, 0px calc(100% - 2rem), 0px 2rem)",
  };

  return (
    <div
      ref={containerRef}
      // CHANGE: bg-background -> bg-white
      className="cta relative w-full h-screen overflow-hidden bg-white flex justify-center items-center"
    >
      {/* --- CONTENT UTAMA (TEXT) --- */}
      <div className="cta-content relative z-20 flex flex-col items-center text-center pointer-events-none">
        <div className="max-w-md px-8 mb-8">
          {/* CHANGE: text-white -> text-[#AD0D0E] (Red Accent) */}
          <p className="text-[#AD0D0E] text-sm md:text-base leading-loose font-bold mb-4 tracking-wider uppercase">
            Our Sponsor
          </p>
          {/* CHANGE: text-white -> text-gray-600 */}
          <p className="text-gray-700 text-sm md:text-base leading-loose font-normal">
            We extend our deepest gratitude to all partners who collaborated with IRMS to make ROCKS a reality. 
            Your support and dedication were the driving force behind this initiative. 
            Together, we have built something monumental.
          </p>
        </div>
      </div>

      {/* --- IMAGE LAYERS (CARDS) --- */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center pointer-events-none">
        {rowImages.map((images, i) => (
          <div key={i} className="cta-row absolute flex justify-center items-center w-full h-full">
            
            {/* Card Left */}
            {/* CHANGE: 
                - bg-[#1a1a1a] -> bg-white
                - border-white/10 -> border-gray-200
                - shadow-orange... -> shadow-xl (clean shadow)
                - Removed brightness-75
            */}
            <div className="cta-card cta-card-left absolute w-full h-40 md:w-[320px] md:h-[220px] rounded-xl overflow-hidden shadow-xl border border-gray-200 will-change-transform">
              <div className="w-full h-full relative bg-white" style={cardFrameStyle}>
                {/* Removed Opacity & Dark Overlay */}
                <img src={images.left} alt="Left" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Card Right */}
            <div className="cta-card cta-card-right absolute w-full h-40 md:w-[320px] md:h-[220px] rounded-xl overflow-hidden shadow-xl border border-gray-200 will-change-transform">
              <div className="w-full h-full relative bg-white" style={cardFrameStyle}>
                {/* Removed Opacity & Dark Overlay */}
                <img src={images.right} alt="Right" className="w-full h-full object-cover" />
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}