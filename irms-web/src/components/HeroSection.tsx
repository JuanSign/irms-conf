"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type DivRef = HTMLDivElement | null;

const letters = ["R", "O", "C", "K", "S"];
const overlayOpacity = 0.8;
const centerLogo = "/hero-section/home_logo.jpeg";
const neonColor = "#AD0D0E";

export default function HeroSection() {
  const rootRef = useRef<DivRef>(null);
  const blockRefs = useRef<DivRef[]>([]);
  const menuRefs = useRef<DivRef[]>([]);
  const boxRef = useRef<DivRef>(null);
  const circleOneRef = useRef<DivRef>(null);
  const circleShowRef = useRef<DivRef>(null);
  const logoRef = useRef<DivRef>(null);
  const showreelRef = useRef<DivRef>(null);

  const setBlockRef = (index: number) => (el: DivRef) => {
    blockRefs.current[index] = el;
  };

  const setMenuRef = (index: number) => (el: DivRef) => {
    menuRefs.current[index] = el;
  };

  useEffect(() => {
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      const blocks = blockRefs.current.filter(
        (el): el is HTMLDivElement => Boolean(el)
      );

      gsap.set(blocks, { 
        textShadow: `0 0 0px ${neonColor}00`
      });

      const animateLetters = (offsets: Array<{ x: number; y: number; scale: number }>) => {
        offsets.forEach((offset, idx) => {
          if (blocks[idx]) {
            gsap.to(blocks[idx], {
              duration: 2,
              x: offset.x,
              y: offset.y,
              scale: offset.scale,
              ease: "expo.inOut",
            });
          }
        });
      };

      mm.add("(max-width: 640px)", () => {
        animateLetters([
          { x: -15, y: -120, scale: 1.5 }, // R
          { x: 160, y: -140, scale: 1.7 }, // O
          { x: -150, y: 80, scale: 1.05 }, // C
          { x: -70, y: 170, scale: 1.25 }, // K
          { x: 10, y: 130, scale: 1.1 }, // S
        ]);
      });

      mm.add("(min-width: 641px)", () => {
        animateLetters([
          { x: -120, y: -200, scale: 2 },
          { x: -240, y: 200, scale: 1.2 },
          { x: 290, y: -290, scale: 1.1 },
          { x: 230, y: 240, scale: 0.8 },
          { x: 190, y: 0, scale: 0.8 },
        ]);
      });

      if (blocks.length) {
        gsap.to(blocks, {
          duration: 1.2,
          color: "#ffffff",
          textShadow: `0 0 5px ${neonColor}, 0 0 5px ${neonColor}, 0 0 10px ${neonColor}`,
          ease: "expo.out",
          delay: 0.4,
        });
      }

      if (circleShowRef.current) {
        gsap.to(circleShowRef.current, { 
          duration: 2, 
          scale: 1, 
          opacity: 1, 
          ease: "expo.inOut", 
          delay: 0.2 
        });
      }
      
      const circles = [circleOneRef.current].filter((el) => Boolean(el));
      if (circles.length) {
        gsap.to(circles, { 
          duration: 2.4, 
          scale: 1, 
          opacity: 1,
          ease: "expo.inOut", 
          stagger: 0.05 
        });
      }

      const exitTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "60% top", 
          scrub: 0.5,    
        }
      });

      exitTimeline.to(blocks, {
        x: 0,
        y: 0,
        scale: 1,
        ease: "power2.inOut", 
      }, 0);

      exitTimeline.to(blocks, {
        color: "#ffffff", 
        textShadow: `0 0 0px ${neonColor}00, 0 0 0px ${neonColor}00, 0 0 0px ${neonColor}00`,
        ease: "power2.inOut" 
      }, 0);

      if (circleShowRef.current) {
        exitTimeline.to(circleShowRef.current, { scale: 0, opacity: 0, ease: "power2.inOut" }, 0);
      }
      if (circleOneRef.current) {
        exitTimeline.to(circleOneRef.current, { scale: 0, opacity: 0, ease: "power2.inOut" }, 0);
      }

    }, rootRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
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