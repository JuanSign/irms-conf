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

      // 2. Animasi Kolom Kiri (Images)
      tl.from(".left-column-images", {
        x: -50, 
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });

      // 3. Animasi Judul
      tl.from(".welcome-header", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      }, "-=0.5");

      // 4. Animasi Paragraf
      tl.from(".welcome-text p", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1 
      }, "-=0.6");

      // 5. Animasi Signature
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
    <div className="relative w-full h-screen min-h-svh flex justify-center items-center overflow-hidden bg-white">
        
        <div ref={containerRef} className="w-full h-full flex justify-center items-center gap-2 max-[1000px]:flex-col text-gray-900 p-10"> 
            
        {/* Kolom Kiri (Images) */}
        <div className="left-column-images flex-1 flex flex-col gap-4 w-full">
            
            {/* Row 1 */}
            <div className="relative -left-[5vw] flex w-full gap-4 items-end max-[1000px]:left-0">
                {/* ADDED: border border-gray-200 */}
                <div className="relative aspect-5/4 flex-[0.75] rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    <img src="/palbot.jpg" alt="" className="w-full h-full object-cover" />
                </div>
                
                {/* ADDED: border border-gray-200 */}
                <div className="relative aspect-5/4 flex-1 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    <img src="/palbot.jpg" alt="" className="w-full h-full object-cover" />
                    
                    {/* Floating Card Name */}
                    <div className="absolute z-10 bottom-4 left-4 p-4 bg-white/90 backdrop-blur-[15px] shadow-lg border border-gray-100 text-gray-900 rounded-xl max-[1000px]:hidden">
                        <h3 className="text-xl font-bold">Jhonny Sins</h3>
                        <p className="text-[#AD0D0E] font-semibold">IRMS Chairman</p>
                    </div>
                </div>
            </div>

            {/* Row 2 */}
            <div className="relative -left-[5vw] flex w-full gap-4 items-start max-[1000px]:left-0">
                {/* ADDED: border border-gray-200 */}
                <div className="relative aspect-5/4 flex-1 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    <img src="/palbot.jpg" alt="" className="w-full h-full object-cover" />
                </div>
                
                {/* ADDED: border border-gray-200 */}
                <div className="relative aspect-5/4 flex-[0.75] rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    <img src="/palbot.jpg" alt="" className="w-full h-full object-cover" />
                </div>
            </div>
        </div>

        {/* Kolom Kanan (Copy/Text) */}
        <div className="flex-1 mr-10 max-[1000px]:mr-0 max-[1000px]:mt-10 relative">
            <div className="red-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-red-500 rounded-full blur-[120px] opacity-[0.05] pointer-events-none z-0"></div> 
            
            <div className="relative z-10 flex flex-col gap-4">
            
            <h3 className="welcome-header text-4xl md:text-4xl font-bold text-justify leading-snug text-[#AD0D0E]">
                Welcome to IRMS Conference!
            </h3>

            <div className="welcome-text flex flex-col gap-4">
                <p className='text-gray-800 text-sm text-justify leading-snug'>
                On behalf of the organizers, I would like to extend a warm welcome to the 14th Asian Rock Mechanics Symposium (ARMS14), which will be held in November 2026. This conference is a valuable 
                opportunity to share the latest research findings and technological innovations in the field of rock mechanics in the Asian region, and to deepen exchanges among researchers and engineers. This is the third 
                time Japan has hosted ARMS, following ARMS3 in Kyoto and ARMS8 in Sapporo. This time, ARMS14 has been selected as an official international symposium of the International Society for Rock Mechanics and Rock Engineering 
                (ISRM).
                </p>

                <p className='text-gray-800 text-sm text-justify leading-snug'>
                The theme of the conference is “Rock Mechanics for the Next Generation - Innovations, Sustainability, and Resilience -.” This theme reflects our commitment to pursuing innovation, enhancing sustainability, and 
                building resilience to address the next generation of challenges in rock engineering. This symposium will provide a platform to share the latest research findings and technologies, fostering new perspectives and collaborations. 
                Additionally, we encourage the participation of young researchers through presentations and poster sessions, incorporating new viewpoints and ideas. We hope this will help the next generation of leaders grow and pave the way for the future of rock engineering.
                </p>

                <p className='text-gray-800 text-sm text-justify leading-snug'>
                Fukuoka, the host city, is known as an “international city” with strong ties to Asia, offering an attractive environment where history and modernity harmonize. During the symposium, 
                in addition to academic discussions, you will have the opportunity to experience the nature and culture of Fukuoka, gaining further inspiration.
                </p>

                <p className='text-gray-800 text-sm text-justify leading-snug'>
                Finally, we hope that ARMS14 will be a significant opportunity to shape the future of the rock engineering field. We sincerely expect this international conference to be a 
                starting point for next-generation research and technological innovation, contributing to new solutions for regional and international challenges.
                </p>

                <p className='text-gray-800 text-sm text-justify leading-snug'>
                We look forward to meeting you in Fukuoka and sharing meaningful discussions and exchanges.
                </p>
            </div>

            <div className='signature text-gray-900 text-sm text-end mt-4'>
                <p className='font-black text-[#AD0D0E]'>Panitia IRMS</p>
                <p>Jhonny Sins S.Pnis</p>
            </div>

            </div>
        </div>
        </div>
    </div>
  )
}