"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InteractiveGridBackground from "./InteractiveGridBackground"; 

gsap.registerPlugin(ScrollTrigger);

const events = [
  {
    id: 1,
    date: "December 22, 2025",
    title: "Open Registration",
    description: "Official opening of the registration period. Participants and authors can begin registering for the conference.",
  },
  {
    id: 2,
    date: "February 23, 2026",
    title: "Abstract Submission Deadline",
    description: "The final deadline for research abstract submissions. Ensure the summary comprehensively covers the objectives, methodology, and preliminary results.",
  },
  {
    id: 3,
    date: "March 15, 2026",
    title: "Notification of Abstract Acceptance",
    description: "Announcement of abstract selection results. Successful authors will be invited to submit their full manuscripts.",
  },
  {
    id: 4,
    date: "June 1, 2026",
    title: "Full Paper Submission Deadline",
    description: "The deadline for full paper submissions. Manuscripts must adhere strictly to the IRMS 2026 template and guidelines.",
  },
];

const theme = {
  darkMaroon: "#590004", 
  vintageRed: "#C71F2D", 
  cream: "#FCEECB",      
  deepNavy: "#04233A",   
  steelBlue: "#6A96B7",  
};

export default function ImportantDates() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineProgressRef = useRef<HTMLDivElement>(null);
  const titleTextRef = useRef<HTMLSpanElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);

  const addToRefs = (el: HTMLDivElement | null, refObj: React.MutableRefObject<(HTMLDivElement | null)[]>) => {
    if (el && !refObj.current.includes(el)) {
      refObj.current.push(el);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(cardsRef.current, { autoAlpha: 0, y: 50 });
      gsap.set(dotsRef.current, { scale: 0, autoAlpha: 0 });
      gsap.set(lineProgressRef.current, { height: "0%" });

      if (titleTextRef.current) {
        gsap.to(titleTextRef.current, {
          textShadow: `0 0 25px ${theme.vintageRed}66`, 
          color: theme.vintageRed,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 20%",
          end: "bottom 90%",
          scrub: 1,
        },
      });

      tl.to(lineProgressRef.current, {
        height: "100%",
        ease: "none",
        duration: 10,
      });

      events.forEach((_, i) => {
        const progressPoint = i * 2.3;

        tl.to(dotsRef.current[i],
          { scale: 1.5, autoAlpha: 1, duration: 0.5, ease: "back.out(1.7)" },
          progressPoint + 0.5
        );

        tl.to(dotsRef.current[i],
          { scale: 1, duration: 0.2 },
          progressPoint + 1
        );

        tl.to(cardsRef.current[i],
          { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out" },
          progressPoint + 0.8
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden pt-20 pb-40"
      style={{ color: theme.cream }} 
    >
      <InteractiveGridBackground />
      
      <div 
        className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full blur-[120px] opacity-40" 
        style={{ backgroundColor: theme.vintageRed }}
      />
      <div 
        className="pointer-events-none absolute left-0 bottom-0 h-96 w-96 rounded-full blur-[120px] opacity-60" 
        style={{ backgroundColor: theme.darkMaroon }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="mb-20 text-center">
          <h2 className="text-4xl font-bold uppercase tracking-wider md:text-5xl">
            <span 
              className="bg-clip-text text-transparent"
              style={{ 
                backgroundImage: `linear-gradient(to right, ${theme.deepNavy}, ${theme.steelBlue})` 
              }}
            >
              Important
            </span>{" "}
            <span
              ref={titleTextRef}
              style={{
                color: theme.vintageRed,
                textShadow: `0 0 20px ${theme.vintageRed}40`
              }}
            >
              Dates
            </span>
          </h2>
          <p 
            className="mt-4 font-medium"
            style={{ color: theme.deepNavy   }}
          >
            Key milestones leading up to the IRMS Conference 2026.
          </p>
        </div>

        <div className="relative mx-auto max-w-6xl">

          <div
            className="absolute left-6 top-0 h-full w-1 -translate-x-1/2 rounded-full md:left-1/2"
            style={{ backgroundColor: `${theme.steelBlue}30` }} 
            aria-hidden="true"
          />

          <div
            className="absolute left-6 top-0 h-full w-1 -translate-x-1/2 overflow-hidden md:left-1/2"
          >
            <div
              ref={lineProgressRef}
              className="w-full rounded-full"
              style={{
                height: "0%",
                background: `linear-gradient(to bottom, ${theme.vintageRed}, ${theme.darkMaroon})`,
                boxShadow: `0 0 15px ${theme.vintageRed}66`
              }}
            />
          </div>

          <div className="relative flex flex-col gap-16 md:gap-32">
            {events.map((event, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={event.id}
                  className={`relative flex items-center md:justify-between ${isEven ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                >
                  <div className="hidden w-5/12 md:block" />

                  <div className="absolute left-6 z-10 flex -translate-x-1/2 items-center justify-center md:left-1/2">
                    <div
                      ref={(el) => addToRefs(el, dotsRef) as any}
                      className="h-5 w-5 rounded-full shadow-md flex items-center justify-center"
                      style={{ 
                        border: `3px solid ${theme.cream}`, 
                        backgroundColor: theme.cream 
                      }}
                    >
                      <div 
                        className="h-full w-full rounded-full" 
                        style={{ backgroundColor: theme.vintageRed }}
                      ></div>
                    </div>
                  </div>

                  <div
                    ref={(el) => addToRefs(el, cardsRef) as any}
                    className={`w-full pl-16 md:w-5/12 md:pl-0 ${isEven ? 'md:text-right' : 'md:text-left'}`}
                  >
                    <div 
                      className="group relative overflow-hidden rounded-xl border p-6 transition-all duration-300 shadow-2xl"
                      style={{ 
                        backgroundColor: theme.deepNavy, 
                        borderColor: `${theme.steelBlue}20`, 
                      }}
                    >
                      
                      <div className="absolute inset-0 rounded-xl border border-transparent transition-colors duration-300 group-hover:border-[#C71F2D] pointer-events-none" />

                      <div 
                        className="absolute -inset-1 z-0 rounded-xl opacity-0 blur transition duration-500 group-hover:opacity-30" 
                        style={{ 
                          background: `linear-gradient(to right, ${theme.vintageRed}, ${theme.darkMaroon})` 
                        }}
                      />

                      <div className="relative z-10">
                        <span
                          className="mb-3 inline-block rounded px-3 py-1 text-sm font-bold tracking-wide backdrop-blur-sm border"
                          style={{ 
                            backgroundColor: `${theme.darkMaroon}E6`, 
                            color: theme.cream,                        
                            borderColor: `${theme.vintageRed}66`,      
                            boxShadow: `0 0 10px ${theme.darkMaroon}80`
                          }}
                        >
                          {event.date}
                        </span>

                        <h3 
                          className="mb-2 text-xl font-bold transition-colors md:text-2xl"
                          style={{ color: theme.cream }}
                        >
                          {event.title}
                        </h3>

                        <p 
                          className="text-sm leading-relaxed"
                          style={{ color: theme.steelBlue }}
                        >
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}