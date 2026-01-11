"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

const KeynoteGSAP = () => {
  // --- 1. SETUP REFS & STATE (Dari HowWeWork) ---
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);

  // --- 2. DATA (Dari Keynote) ---
  const cards = [
    {
      img: "/KomangAnggayana.png",
      title: "Fracture Intersections & Network Connectivity",
      speaker: "Prof. Komang Anggayana",
      institute: "Bandung Institute of Technology",
      desc: "We begin with listening and study. Site, climate, and daily routines inform the brief so we can define aims, constraints, and measures of success with clarity."
    },
    {
      img: "/LilikEkoWidodo.png",
      title: "Rock Mechanics Applications in Indonesian Mining",
      speaker: "Prof. Lilik Eko Widodo",
      institute: "Bandung Institute of Technology",
      desc: "We set guiding principles for light, massing, and flow. Quick models and diagrams test options and reveal the direction that best serves the brief."
    },
    {
      img: "/Budi-Sulistianto.png",
      title: "Geomechanics for the Solution of Energy Trilemma",
      speaker: "Prof. Budi Sulistianto",
      institute: "Bandung Institute of Technology",
      desc: "We develop drawings and specifications across structure, services, and joinery. Materials and samples are reviewed in natural light while budget and timeline stay in view."
    },
    {
      img: "/syafrijal.png",
      title: "Estimation of Joint Size",
      speaker: "Prof. Syafrizal",
      institute: "Bandung Institute of Technology",
      desc: "We oversee construction with care and precision. After final review and finishing, we hand over a space that is ready to live in, complete with guidance for long term care."
    }
  ];

  // --- 3. LOGIC CHECK MOBILE ---
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1000);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // --- 4. ANIMASI ENTRY STEPS (GSAP) ---
  useGSAP(
    () => {
      if (!stepsRef.current) return;
      // Target class .gsap-step
      const steps = stepsRef.current.querySelectorAll(".gsap-step");
      gsap.set(steps, { opacity: 0, x: -40 });

      ScrollTrigger.create({
        trigger: stepsRef.current,
        start: "top 75%",
        once: true,
        animation: gsap.to(steps, {
          opacity: 1,
          x: 0,
          duration: 0.3,
          stagger: -0.1,
          ease: "none",
        }),
      });
    },
    { scope: stepsRef }
  );

  // --- 5. SCROLL TRIGGER MAIN LOGIC (Pinning & Active State) ---
  useEffect(() => {
    const container = containerRef.current;
    const header = headerRef.current;
    const cards = cardsRef.current;

    if (!container || !header || !cards) return;

    if (!isMobile) {
      // Logic Pinning Header
      const mainTrigger = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        endTrigger: cards,
        end: "bottom bottom",
        pin: header,
        pinSpacing: false, // Penting untuk layout flex
      });
      scrollTriggersRef.current.push(mainTrigger);

      // Logic Active State Change per Card
      const cardElements = cards.querySelectorAll(".gsap-card");

      cardElements.forEach((card, index) => {
        const cardTrigger = ScrollTrigger.create({
          trigger: card,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveStep(index),
          onEnterBack: () => setActiveStep(index),
          onLeave: () => {
            if (index < cardElements.length - 1) setActiveStep(index + 1);
          },
          onLeaveBack: () => {
            if (index > 0) setActiveStep(index - 1);
          },
        });
        scrollTriggersRef.current.push(cardTrigger);
      });
    }

    return () => {
      scrollTriggersRef.current.forEach((trigger) => trigger.kill());
      scrollTriggersRef.current = [];
    };
  }, [isMobile]);

  return (
    // CONTAINER UTAMA (Style Keynote - Light Theme)
    <div 
      className="relative w-full min-h-screen flex flex-col lg:flex-row bg-white text-gray-800"
      ref={containerRef}
    >
      
      {/* --- KOLOM KIRI (HEADER) --- 
          NOTE: Saya hapus 'sticky top-0' karena GSAP 'pin' yang akan menanganinya.
      */}
      <div 
        className="w-full lg:w-[60%] lg:h-screen flex flex-col lg:justify-center"
        ref={headerRef}
      >
        <div className="container mx-auto px-4 lg:px-0 w-full h-full lg:h-auto">
          {/* Wrapper Content */}
          <div className="flex flex-col gap-8 py-10 lg:py-0 lg:pl-16 w-full lg:w-[80%]">
            
            {/* Label Kecil */}
            <div>
              <p className="font-medium text-[#6A96B7]">Keynote Speakers</p>
            </div>

            {/* Judul Besar */}
            <h3 className="text-[2rem] lg:text-[2.5rem] leading-[1.1] font-medium tracking-tight text-[#04233A]">
              Insights from global experts shaping the future of rock mechanics and engineering.
            </h3>

            {/* Navigasi Steps */}
            <div className="hidden gap-4 lg:flex mt-8" ref={stepsRef}>
              {[1, 2, 3, 4].map((step, index) => {
                const isActive = activeStep === index;
                return (
                  <div
                    key={index}
                    className={`gsap-step group relative p-5 h-16 flex items-center justify-center border rounded-2xl transition-all duration-500 ease-out overflow-hidden select-none
                      ${
                        isActive
                          ? "w-40 bg-[#C71F2D] text-white"
                          : "w-16 border-[#6A96B7]/40 border-4 text-[#04233A]"
                      }`}
                  >
                    {/* Teks "Step" */}
                    <span 
                      className={`absolute left-6 font-semibold text-lg transition-all duration-500 transform
                      ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
                    >
                      Speaker
                    </span>
                    
                    {/* Angka (1,2,3,4) */}
                    <span 
                      className={`relative font-semibold text-lg transition-all duration-500 transform
                      ${isActive ? "translate-x-12" : "translate-x-0"}`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

      {/* --- KOLOM KANAN (CARDS) --- */}
      <div 
        className="w-full lg:w-[40%] bg-transparent px-4 lg:px-0 pb-20 lg:py-32 flex flex-col gap-8 lg:pr-16"
        ref={cardsRef}
      >
        {cards.map((item, i) => (
          <div 
            key={i} 
            // Class 'gsap-card' ditambahkan untuk target ScrollTrigger
            className="gsap-card flex flex-col gap-6 p-4 rounded-2xl shadow-sm bg-white border border-gray-200 hover:border-[#C71F2D] transition-colors"
          >
            {/* Gambar */}
            <div className="relative overflow-hidden aspect-square rounded-xl bg-gray-200">
              <Image
                src={item.img}
                alt={item.title}
                fill
                className="object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
              />
              <div className="absolute z-10 bottom-4 right-4 p-4 bg-white/90 backdrop-blur-[15px] rounded-xl max-[1000px]:hidden shadow-lg">
                <h3 className="text-xl font-bold text-[#04233A]">{item.speaker}</h3>
                <p className="text-[#6A96B7]">{item.institute}</p>
                </div>
            </div>

            {/* Teks Deskripsi (Style Keynote) */}
            <div className="p-2">
              <div className="mb-5">
                <h3 className="text-[1.75rem] leading-none tracking-tight font-medium text-[#04233A]">
                  {item.title}
                </h3>
              </div>
              <p className="text-[1rem] leading-[1.6] text-gray-600">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default KeynoteGSAP;