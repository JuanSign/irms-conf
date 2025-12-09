"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const events = [
  {
    id: 1,
    date: "December 19, 2025",
    title: "Abstract Submission Deadline",
    description: "The final deadline for research abstract submissions. Ensure the summary comprehensively covers the objectives, methodology, and preliminary results.",
  },
  {
    id: 2,
    date: "January 31, 2026",
    title: "Notification of Abstract Acceptance",
    description: "Announcement of abstract selection results. Successful authors will be invited to submit their full manuscripts.",
  },
  {
    id: 3,
    date: "April 30, 2026",
    title: "Full Paper Submission Deadline",
    description: "The deadline for full paper submissions. Manuscripts must adhere strictly to the IRMS 2026 template and guidelines.",
  },
  {
    id: 4,
    date: "June 30, 2026",
    title: "Notification of Paper Acceptance",
    description: "Final notification of paper acceptance for presentation at the main conference.",
  },
];

const neonRed = "#AD0D0E";
const neonBlue = "#0055ff";

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
          color: neonBlue,
          textShadow: `0 0 20px ${neonBlue}66`,
          duration: 1,
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
      className="relative w-full overflow-hidden bg-black pt-20 pb-40 text-white"
    >
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-red-900/10 blur-[120px]" />
      <div className="absolute left-0 bottom-0 h-96 w-96 rounded-full bg-red-900/10 blur-[120px]" />

      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-20 text-center">
          <h2 className="text-4xl font-bold uppercase tracking-wider md:text-5xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
              Important
            </span>{" "}
            <span
              ref={titleTextRef}
              style={{
                color: neonRed,
                textShadow: `0 0 20px ${neonRed}66`
              }}
            >
              Dates
            </span>
          </h2>
          <p className="mt-4 text-gray-400">Key milestones leading up to the IRMS Conference 2026.</p>
        </div>

        <div className="relative mx-auto max-w-6xl">

          <div
            className="absolute left-6 top-0 h-full w-1 -translate-x-1/2 rounded-full bg-gray-800 md:left-1/2"
            aria-hidden="true"
          />

          <div
            className="absolute left-6 top-0 h-full w-1 -translate-x-1/2 overflow-hidden md:left-1/2"
          >
            <div
              ref={lineProgressRef}
              className="w-full rounded-full bg-gradient-to-b from-[#AD0D0E] to-[#5e0000]"
              style={{
                height: "0%",
                boxShadow: `0 0 15px ${neonRed}`
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
                      className="h-5 w-5 rounded-full border-[3px] border-black bg-white"
                    >
                      <div className="h-full w-full rounded-full bg-[#AD0D0E]"></div>
                    </div>
                  </div>

                  <div
                    ref={(el) => addToRefs(el, cardsRef) as any}
                    className={`w-full pl-16 md:w-5/12 md:pl-0 ${isEven ? 'md:text-right' : 'md:text-left'}`}
                  >
                    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] p-6 transition-all hover:border-[#AD0D0E]/50 hover:bg-[#111]">

                      <div className="absolute -inset-1 z-0 rounded-xl bg-gradient-to-r from-[#AD0D0E] to-red-900 opacity-0 blur transition duration-500 group-hover:opacity-20" />

                      <div className="relative z-10">
                        <span
                          className="mb-3 inline-block rounded border border-[#AD0D0E]/30 bg-[#AD0D0E]/10 px-3 py-1 text-sm font-bold tracking-wide text-white backdrop-blur-sm"
                          style={{ boxShadow: `0 0 10px ${neonRed}15` }}
                        >
                          {event.date}
                        </span>

                        <h3 className="mb-2 text-xl font-bold text-white group-hover:text-red-100 md:text-2xl">
                          {event.title}
                        </h3>

                        <p className="text-sm leading-relaxed text-gray-400 group-hover:text-gray-300">
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