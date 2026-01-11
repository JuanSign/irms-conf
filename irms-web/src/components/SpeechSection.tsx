"use client";
import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SpeechSection() {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Setup Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          end: "bottom center",
          toggleActions: "play none none reverse",
        }
      });

      // 2. Animasi Kolom Kiri (Images) - Muncul dari kiri
      tl.from(".left-column-images", {
        x: -50, // Geser dari KIRI (karena posisi gambar di kiri)
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });

      // 3. Animasi Judul (Header)
      tl.from(".welcome-header", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      }, "-=0.5"); // Jalan bareng dikit sama gambar

      // 4. Animasi Paragraf (Staggered)
      tl.from(".welcome-text p", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1 // Muncul satu-satu
      }, "-=0.6");

      // 5. Animasi Signature / TTD
      tl.from(".signature", {
        opacity: 0,
        y: 20,
        duration: 1
      }, "-=0.2");

      tl.from(".red-glow", { 
        opacity: 0, 
        scale: 0.8, 
        duration: 1.5, 
        ease: "power2.out" }, 
        0);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-full h-screen min-h-svh flex justify-center items-center overflow-hidden bg-background">
        <div ref={containerRef} className="w-full h-full flex justify-center items-center gap-2 max-[1000px]:flex-col text-[#fdb1b1] [text-shadow:0_0px_20px_rgb(239_22_24/0.8)] p-10"> 
            
        {/* Kolom Kiri (Images) */}
        {/* Tambah class "left-column-images" buat target animasi */}
        <div className="left-column-images flex-1 flex flex-col gap-4 w-full">
            
            {/* Row 1 */}
            <div className="relative -left-[5vw] flex w-full gap-4 items-end max-[1000px]:left-0">
            <div className="relative aspect-5/4 flex-[0.75] rounded-xl overflow-hidden">
                <img src="/RidhoKresna1.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="relative aspect-5/4 flex-1 rounded-xl overflow-hidden">
                <img src="/RidhoKresna1.png" alt="" className="w-full h-full object-cover" />
                <div className="absolute z-10 bottom-4 left-4 p-4 bg-[rgba(20,19,19,0.25)] backdrop-blur-[15px] text-[#fdb1b1] rounded-xl max-[1000px]:hidden">
                <h3 className="text-xl font-bold">Ridho Kresna Wattimena</h3>
                <p className="text-[#fee7e7]">President IRMS</p>
                </div>
            </div>
            </div>

            {/* Row 2 */}
            <div className="relative -left-[5vw] flex w-full gap-4 items-start max-[1000px]:left-0">
            <div className="relative aspect-5/4 flex-1 rounded-xl overflow-hidden">
                <img src="/RidhoKresna1.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="relative aspect-5/4 flex-[0.75] rounded-xl overflow-hidden">
                <img src="/RidhoKresna1.png" alt="" className="w-full h-full object-cover" />
            </div>
            </div>
        </div>

        {/* Kolom Kanan (Copy/Text) */}
        <div className="flex-1 mr-10 max-[1000px]:mr-0 max-[1000px]:mt-10 relative">
            {/* <div className="red-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-[rgb(239,22,24)] rounded-full blur-[100px] opacity-25 pointer-events-none z-0 mix-blend-screen"></div>  */}
            <div className="relative z-10 flex flex-col gap-4">
            
            {/* Tambah class "welcome-header" */}
            <h3 className="text-red-800 text-4xl md:text-4xl font-bold text-justify leading-snug">
                Dear Valued Potential Sponsors,
            </h3>

            {/* Wrapper class "welcome-text" dan ganti h4 jadi p */}
            <div className="welcome-text flex flex-col gap-4">
                <p className='text-red-800 text-sm text-justify leading-snug'>
                My name is Ridho Kresna Wattimena, and it is my pleasure to serve as the President of the Indonesian Rock Mechanics Society (IRMS). 
                On behalf of IRMS and the organising committee, I invite your organisation to become valued partners for our upcoming
                Indonesian Rock Mechanics Society Conference 2026 (IRMS Conference 2026).
                </p>

                <p className='text-red-800 text-sm text-justify leading-snug'>
                For over 18 years, the IRMS has provided significant contributions to the advancement of the field of rock mechanics and rock 
                engineering through organising various activities to increase the knowledge of its members and the wider community and active 
                participation in international scientific conferences. Our conference is our most significant event, bringing together over 200 high-level professionals, 
                decision-makers, and industry leaders from across the South East Asia.
                </p>

                <p className='text-red-800 text-sm text-justify leading-snug'>
                The IRMS Conference 2026 is a continuation of our National Workshop and Symposium on Geomechanics (WSNG). 
                The previous WSNG series (Yogyakarta 2012, Bandung 2013, Jakarta 2015, Padang 2017, and Makassar 2019) have 
                been premier scientific events with international networks and professional forums for the Indonesian rock 
                mechanics community to exchange ideas, research findings, and practical experiences.
                </p>

                <p className='text-red-800 text-sm text-justify leading-snug'>
                We look forward to meeting you in Fukuoka and sharing meaningful discussions and exchanges.
                </p>
            </div>

            {/* Tambah class "signature" */}
            <div className='signature text-red-800 text-sm text-start mt-4'>
                <p>Kindly Regards,</p>
                <p className='font-black'>Ridho Kresna Wattimena</p>
                <p>President,</p>
                <p>Indonesian Rock Mechanics Society (IRMS)</p>
            </div>

            </div>
        </div>
        </div>
    </div>
    // PENTING: ref dipasang disini
        
  )
}