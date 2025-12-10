"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const rowImages = [
  { left: "/KAjima.jpg", right: "/Hazama.jpg" },
  { left: "/KumagaiGumi.png", right: "/Shimizu.png" },
  { left: "/Toda.png", right: "/Durex.jpg" },
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

        // Config Animasi (Angka ini mengatur seberapa jauh gambar "terbang")
        const leftXValues = [-1100, -1300, -700]; // Jarak terbang ke kiri
        const rightXValues = [1100, 1300, 700];   // Jarak terbang ke kanan
        const yValues = [-500, 100, 600];       // Jarak terbang vertikal (atas/bawah)
        const leftRotationValues = [-15, -20, -10];
        const rightRotationValues = [15, 20, 10];

        if (leftXValues[index] === undefined) return;

        gsap.to(cardLeft, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top center", // Mulai animasi saat section masuk tengah layar
            end: "bottom top",   // Selesai saat section lewat
            scrub: 1,            // Angka 1 bikin animasi lebih smooth (ada delay dikit)
            onUpdate: (self) => {
              const progress = self.progress;
              // STARTING OFFSET: Kita tambah offset agar tidak mulai tepat di titik 0,0 (biar agak renggang)
              const startSpread = 50; 
              
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
    <section
      ref={containerRef}
      className="cta relative w-full h-screen overflow-hidden bg-black flex justify-center items-center"
    >
      {/* --- GRID BACKGROUND (Hiasan biar mirip referensi) --- */}
      <div className=" opacity-20 pointer-events-none z-0" 
           style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '100px 100px' }}>
      </div>

      {/* --- CONTENT UTAMA (TEXT) --- */}
      {/* Z-Index 20 agar selalu di atas gambar */}
      <div className="cta-content relative z-20 flex flex-col items-center text-center pointer-events-none">
        {/* Text */}
        <div className="max-w-md px-7 mb-8">
          <p className="text-white text-sm md:text-base leading-loose font-extralight">
            We extend our deepest gratitude to all partners who collaborated with IRMS to make ROCKS a reality. 
            Your support and dedication were the driving force behind this initiative. 
            Together, we have built something monumental.
          </p>
        </div>
      </div>

      {/* --- IMAGE LAYERS (CARDS) --- */}
      {/* Container ini dibuat ABSOLUTE INSET-0 agar menumpuk pas di tengah layar */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center pointer-events-none">
        {rowImages.map((images, i) => (
          <div key={i} className="cta-row absolute flex justify-center items-center w-full h-full">
            
            {/* Card Left */}
            {/* Translate default CSS dihapus, biarkan GSAP yang geser */}
            <div className="cta-card cta-card-left absolute w-full h-40 md:w-[320px] md:h-[220px] rounded-xl overflow-hidden shadow-2xl shadow-orange-500/10 border border-white/10 filter brightness-75 will-change-transform">
              <div className="w-full h-full relative bg-[#1a1a1a]" style={cardFrameStyle}>
                <img src={images.left} alt="Left" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent"></div>
              </div>
            </div>

            {/* Card Right */}
            <div className="cta-card cta-card-right absolute w-full h-40 md:w-[320px] md:h-[220px] rounded-xl overflow-hidden shadow-2xl shadow-orange-500/10 border border-white/10 filter brightness-75 will-change-transform">
              <div className="w-full h-full relative bg-[#1a1a1a]" style={cardFrameStyle}>
                <img src={images.right} alt="Right" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent"></div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}