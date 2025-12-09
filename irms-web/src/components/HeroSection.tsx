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
    const ctx = gsap.context(() => {
      const blocks = blockRefs.current.filter(
        (el): el is HTMLDivElement => Boolean(el)
      );

      gsap.set(blocks, { 
        textShadow: `0 0 0px ${neonColor}00`
      });

      if (blocks[0]) gsap.to(blocks[0], { duration: 2, x: -120, y: -200, scale: 2, ease: "expo.inOut" });
      if (blocks[1]) gsap.to(blocks[1], { duration: 2, x: -240, y: 200, scale: 1.2, ease: "expo.inOut" });
      if (blocks[2]) gsap.to(blocks[2], { duration: 2, x: 290, y: -290, scale: 1.1, ease: "expo.inOut" });
      if (blocks[3]) gsap.to(blocks[3], { duration: 2, x: 230, y: 240, scale: 0.8, ease: "expo.inOut" });
      if (blocks[4]) gsap.to(blocks[4], { duration: 2, x: 190, y: 0, scale: 0.8, ease: "expo.inOut" });

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
        gsap.fromTo(circleShowRef.current, 
          { scale: 0, opacity: 0 }, 
          { duration: 2, scale: 1, opacity: 1, ease: "expo.inOut", delay: 0.2 }
        );
      }
      
      const circles = [circleOneRef.current].filter((el) => Boolean(el));
      if (circles.length) {
        gsap.from(circles, { duration: 2.4, scale: 0, ease: "expo.inOut", stagger: 0.05 });
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

    return () => ctx.revert();
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

      <div className="relative flex h-[90vh] w-full items-center justify-center">
        <div
          ref={circleOneRef}
          className="pointer-events-none absolute h-[52rem] w-[52rem] rounded-full border border-white/10"
          aria-hidden
        />

        <div className="relative z-10 flex items-center justify-center">
          <div
            ref={circleShowRef}
            className="absolute z-0 grid h-40 w-40 place-items-center rounded-full border border-white/30 bg-black/60 backdrop-blur"
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
          
          <div className="flex items-center gap-4 text-[110px] font-black leading-none sm:text-[140px]">
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