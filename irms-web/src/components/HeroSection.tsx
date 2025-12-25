"use client";

import Image from "next/image";
// 1. Import useLayoutEffect di sini
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

type DivRef = HTMLDivElement | null;

const letters = ["R", "O", "C", "K", "S"];
const overlayOpacity = 0.8;
const centerLogo = "/hero-section/home_logo.jpeg";
const neonColor = "#AD0D0E";

export default function HeroSection() {
  const rootRef = useRef<DivRef>(null);
  const blockRefs = useRef<DivRef[]>([]);
  // Menu refs dihapus jika tidak dipakai, atau biarkan jika ada rencana pakai
  const circleOneRef = useRef<DivRef>(null);
  const circleShowRef = useRef<DivRef>(null);

  const setBlockRef = (index: number) => (el: DivRef) => {
    blockRefs.current[index] = el;
  };

  // 2. Gunakan useLayoutEffect (Jalan sebelum browser painting)
  useLayoutEffect(() => {
    // Safety check: Jika elemen utama belum ada, batalkan
    if (!rootRef.current) return;

    const mm = gsap.matchMedia();

    // 3. Masukkan scope (rootRef) sebagai parameter kedua
    mm.add(
      {
        isMobile: "(max-width: 640px)",
        isDesktop: "(min-width: 641px)",
      },
      (context) => {
        // Ambil kondisi dari context
        const { isMobile } = context.conditions as { isMobile: boolean };

        // Filter refs yang valid
        const blocks = blockRefs.current.filter(
          (el): el is HTMLDivElement => Boolean(el)
        );

        if (blocks.length === 0) return;

        // --- SETUP AWAL ---
        gsap.set(blocks, {
          textShadow: `0 0 0px ${neonColor}00`,
        });

        // --- LOGIKA POSISI (Tentukan koordinat berdasarkan kondisi) ---
        const offsets = isMobile
          ? [
              { x: -15, y: -120, scale: 1.5 }, // R
              { x: 160, y: -140, scale: 1.7 }, // O
              { x: -150, y: 80, scale: 1.05 }, // C
              { x: -70, y: 170, scale: 1.25 }, // K
              { x: 10, y: 130, scale: 1.1 },   // S
            ]
          : [
              { x: -120, y: -200, scale: 2 },
              { x: -240, y: 200, scale: 1.2 },
              { x: 290, y: -290, scale: 1.1 },
              { x: 230, y: 240, scale: 0.8 },
              { x: 190, y: 0, scale: 0.8 },
            ];

        // --- ANIMASI INTRO (SCATTER) ---
        blocks.forEach((block, idx) => {
          if (offsets[idx]) {
            gsap.to(block, {
              duration: 2,
              x: offsets[idx].x,
              y: offsets[idx].y,
              scale: offsets[idx].scale,
              ease: "expo.inOut",
            });
          }
        });

        // Animasi Glow
        gsap.to(blocks, {
          duration: 1.2,
          color: "#ffffff",
          textShadow: `0 0 5px ${neonColor}, 0 0 5px ${neonColor}, 0 0 10px ${neonColor}`,
          ease: "expo.out",
          delay: 0.4,
        });

        // Animasi Logo Tengah
        if (circleShowRef.current) {
          gsap.to(circleShowRef.current, {
            duration: 2,
            scale: 1,
            opacity: 1,
            ease: "expo.inOut",
            delay: 0.2,
          });
        }

        // Animasi Lingkaran Luar
        if (circleOneRef.current) {
          gsap.to(circleOneRef.current, {
            duration: 2.4,
            scale: 1,
            opacity: 1,
            ease: "expo.inOut",
          });
        }

        // --- SCROLL TRIGGER (EXIT / ASSEMBLY) ---
        // Animasi saat user scroll ke bawah: huruf menyatu kembali
        const exitTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current, // Mengacu ke section container
            start: "top top",
            end: "60% top",
            scrub: 0.5,
          },
        });

        // Tarik semua huruf ke posisi 0 (tengah)
        exitTimeline.to(
          blocks,
          {
            x: 0,
            y: 0,
            scale: 1,
            ease: "power2.inOut",
          },
          0
        );

        // Matikan glow saat menyatu
        exitTimeline.to(
          blocks,
          {
            color: "#ffffff",
            textShadow: `0 0 0px ${neonColor}00, 0 0 0px ${neonColor}00, 0 0 0px ${neonColor}00`,
            ease: "power2.inOut",
          },
          0
        );

        // Sembunyikan lingkaran logo & background circle
        if (circleShowRef.current) {
          exitTimeline.to(
            circleShowRef.current,
            { scale: 0, opacity: 0, ease: "power2.inOut" },
            0
          );
        }
        if (circleOneRef.current) {
          exitTimeline.to(
            circleOneRef.current,
            { scale: 0, opacity: 0, ease: "power2.inOut" },
            0
          );
        }
      },
      rootRef // Scope ref (PENTING untuk cleanup otomatis)
    );

    // Cleanup function
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-black text-[#8d785b]"
    >
      <div
        className="absolute inset-0 -z-20 bg-center bg-cover"
        style={{ backgroundImage: "url('/hero-section/home_background.jpg')" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10"
        style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
        aria-hidden
      />

      <div className="relative flex h-[90vh] w-full items-center justify-center px-4 sm:px-8">
        <div
          ref={circleOneRef}
          className="opacity-0 scale-0 pointer-events-none absolute h-[22rem] w-[22rem] rounded-full border border-white/10 sm:h-[36rem] sm:w-[36rem] md:h-[44rem] md:w-[44rem] xl:h-[52rem] xl:w-[52rem]"
          aria-hidden
        />

        <div className="relative z-10 flex items-center justify-center">
          <div
            ref={circleShowRef}
            className="opacity-0 scale-0 absolute z-0 grid h-28 w-28 place-items-center rounded-full border border-white/30 bg-black/60 backdrop-blur sm:h-40 sm:w-40 md:h-48 md:w-48"
            style={{ boxShadow: "inset 0 0 50px rgba(0,0,0,0.9)" }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-full">
              <Image
                src={centerLogo}
                alt="IRMS Conference 2026 logo"
                fill
                className="object-cover rounded-full"
                sizes="160px"
                priority
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-[64px] font-black leading-none sm:gap-4 sm:text-[110px] md:text-[140px]">
            {letters.map((char, index) => (
              <div
                key={char}
                ref={setBlockRef(index)}
                className="select-none text-white"
                style={{ textShadow: `0 0 2px ${neonColor}15` }}
              >
                {char}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}