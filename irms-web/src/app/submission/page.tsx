"use client";

import Link from "next/link";
import OverlayNav from "../../components/OverlayNav"; 
import { Calendar, FileText, Award, Layers, ArrowRight } from "lucide-react";

// PALETTE REFERENCE:
// 1. Dark Maroon: #590004
// 2. Vintage Red: #C71F2D
// 3. Cream / Beige: #FCEECB
// 4. Deep Navy: #04233A
// 5. Steel Blue: #6A96B7

export default function SubmissionPage() {
  const events = [
  {
    id: 1,
    date: "Dec 22, 2025",
    label: "Notification", // Sesuaikan dengan label di desain (Notification/Deadline)
    title: "Open Registration",
    desc: "Official opening of the registration period.",
  },
  {
    id: 2,
    date: "Feb 23, 2026",
    label: "Deadline",
    title: "Abstract Submission",
    desc: "Final deadline for research abstract submissions.",
  },
  {
    id: 3,
    date: "Mar 15, 2026",
    label: "Notification",
    title: "Abstract Acceptance",
    desc: "Announcement of abstract selection results.",
  },
  {
    id: 4,
    date: "Jun 1, 2026",
    label: "Deadline",
    title: "Full Paper Submission",
    desc: "Deadline for full paper submissions.",
  },
];

  return (
    <>
      <OverlayNav />
      <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen w-full bg-[#FAF9F6] text-[#04233A]">
        
        <div className="w-full lg:w-[65%] h-auto lg:h-full lg:overflow-y-auto px-6 pt-32 pb-20 lg:py-24 sm:px-12 md:px-24 custom-scrollbar scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-12 md:space-y-16">
            
            <section className="animate-fade-in-up">
              <div className="border-l-4 border-[#C71F2D] pl-4 md:pl-6 mb-8">
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#04233A]">
                  Call for <span className="text-[#C71F2D]">Abstract</span>
                </h1>
                <p className="mt-2 text-sm md:text-lg text-[#6A96B7] font-bold tracking-widest uppercase">
                  Submission has been started!
                </p>
              </div>

              <div className="prose max-w-none text-justify text-[#04233A]/80 text-sm md:text-base leading-relaxed">
                <p className="mb-4">
                  Prospective authors are invited to submit an abstract aligned with one of the symposium topics for consideration. Abstracts must be written in English and provide a clear explanation of the research content. It is highly recommended that each abstract explicitly includes:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-6 text-[#04233A] font-medium marker:text-[#C71F2D]">
                  <li>The study's objective</li>
                  <li>The results and their significance</li>
                  <li>Advancements or novel contributions relative to prior work</li>
                  <li><span className="text-[#590004] font-bold">Note:</span> Previously published findings are not eligible for submission.</li>
                </ul>
                <p className="mb-4">
                  Abstracts should be approximately 500 words in length and must contain:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-6 text-[#04233A] font-medium marker:text-[#C71F2D]">
                  <li>The paper title</li>
                  <li>Indication of the chosen symposium topic</li>
                  <li>4–5 keywords</li>
                  <li>(Author information is not required at this stage.)</li>
                </ul>
                <p>
                  Submissions must be prepared as a PDF file and uploaded via the online submission system, which will become active in December 2025. No specific formatting template is provided.
                </p>
              </div>

               <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button className="flex justify-center items-center gap-3 bg-[#C71F2D] hover:bg-[#590004] text-[#FCEECB] px-8 py-4 font-bold uppercase tracking-widest transition-all clip-path-slant text-sm md:text-base shadow-lg shadow-[#C71F2D]/20 hover:shadow-[#590004]/40">
                  Submit Abstract <ArrowRight size={20} />
                </button>
                <button className="flex justify-center items-center gap-3 border border-[#04233A] hover:bg-[#04233A] text-[#04233A] hover:text-[#FCEECB] px-8 py-4 font-bold uppercase tracking-widest transition-all text-sm md:text-base">
                  How to Submit <FileText size={20} />
                </button>
              </div>
            </section>

            <div className="w-full h-px bg-[#04233A]/10" />

<section className="w-full">
      <div className="flex items-center gap-3 mb-8">
        <Calendar className="text-[#C71F2D] w-6 h-6 md:w-7 md:h-7" />
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#04233A]">
          Important Dates
        </h2>
      </div>

      {/* Ganti Flex dengan Grid agar lebar kartu PASTI sama rata */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {events.map((item, index) => (
          <div key={item.id} className="relative group w-full">
            
            {/* KARTU */}
            <div className="bg-white p-6 border border-[#6A96B7]/30 shadow-sm hover:shadow-md hover:border-[#C71F2D] transition-all duration-300 h-full flex flex-col relative z-10">
              <span className="text-xs font-bold text-[#6A96B7] uppercase tracking-widest mb-1">
                {item.label}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-[#04233A] mb-2">
                {item.date}
              </h3>
              {/* min-h-[3rem] menjaga agar judul 1 baris tetap punya tinggi sama dengan judul 2 baris */}
              <p className="text-[#04233A]/80 text-sm font-medium leading-tight min-h-[2.5rem] flex items-center group-hover:text-[#C71F2D] transition-colors">
                {item.title}
              </p>
            </div>

            {/* PANAH (Absolute Position) */}
            {/* Logika: Munculkan panah jika bukan item terakhir */}
            {index !== events.length - 1 && (
              <div className="absolute z-0 flex items-center justify-center 
                              /* Posisi Mobile: Di bawah tengah */
                              left-1/2 -translate-x-1/2 -bottom-6
                              /* Posisi Desktop: Di kanan tengah */
                              lg:left-auto lg:-right-9 lg:top-1/2 lg:-translate-y-1/2 lg:bottom-auto">
                <ArrowRight 
                  className="w-5 h-5 text-[#C71F2D] 
                             transform rotate-90 lg:rotate-0" 
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>

            <div className="w-full h-px bg-[#04233A]/10" />

            <section>
              <div className="flex items-center gap-3 mb-8">
                {/* Icon: Steel Blue */}
                <Layers className="text-[#6A96B7] w-6 h-6 md:w-7 md:h-7" />
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#04233A]">Topics</h2>
              </div>

              <div className="space-y-6">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="bg-white p-6 border-l-2 border-[#6A96B7] hover:border-[#C71F2D] shadow-sm hover:shadow-md transition-all duration-300 group">
                      {/* Topic Title: Navy, turns Red on Hover */}
                      <h3 className="text-lg font-bold text-[#04233A] group-hover:text-[#C71F2D] mb-2 uppercase transition-colors">Topic {num}</h3>
                      <p className="text-sm text-[#04233A]/70 leading-relaxed">
                          {num === 1 && "Civil engineering aspects, Mining engineering aspects, Petroleum Engineering aspects, Geological/Hydrological aspects, Geophysical aspects, Earth science, Material science, Others."}
                          {num === 2 && "Mitigation of Geo-hazards, Environmental issues, Energy Resources, Fundamental Aspects, New Technologies, Others."}
                          {num === 3 && "Risk and Hazard Management, Disaster Mitigation, Slope Stability, Tunnels and Underground Spaces, Maintenance and Life Cycle Costs, Global Warming, Carbon Dioxide Capture and Storage."}
                          {num === 4 && "Site investigation/Characterization, Laboratory Test, In-situ Test, Theoretical development/Analytical solution, Numerical model/simulations, Field measurement/monitoring."}
                      </p>
                  </div>
                ))}
              </div>
            </section>

            <div className="w-full h-px bg-[#04233A]/10" />

            <section>
              <div className="flex items-center gap-3 mb-8">
                {/* Icon: Dark Maroon (Royalty feel) */}
                <Award className="text-[#590004] w-6 h-6 md:w-7 md:h-7" />
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#04233A]">Awards</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Award Cards: Gradient subtle Cream */}
                  <div className="relative border border-[#6A96B7]/40 bg-gradient-to-br from-white to-[#FCEECB]/30 p-6 hover:border-[#04233A] hover:shadow-lg transition-all">
                      <div className="absolute top-0 right-0 p-2 opacity-10 text-[#04233A]">
                          <Award size={60} />
                      </div>
                      <h3 className="text-xl font-bold text-[#04233A] mb-2">ISRM Best Paper Award</h3>
                      <p className="text-xs text-[#04233A]/70 text-justify">
                          Presented to the authors of the orally presented best paper. Two categories: General Category and Young Category.
                      </p>
                  </div>
                  <div className="relative border border-[#6A96B7]/40 bg-gradient-to-br from-white to-[#FCEECB]/30 p-6 hover:border-[#C71F2D] hover:shadow-lg transition-all">
                      <div className="absolute top-0 right-0 p-2 opacity-10 text-[#C71F2D]">
                          <Award size={60} />
                      </div>
                      <h3 className="text-xl font-bold text-[#04233A] mb-2">Outstanding Poster Award</h3>
                      <p className="text-xs text-[#04233A]/70 text-justify">
                           Presented to the authors of the most outstanding poster presentation. Two categories: General Category and Young Category.
                      </p>
                  </div>
              </div>
            </section>

          </div>
        </div>

        <div className="relative flex flex-col w-full lg:w-[35%] h-auto lg:h-full justify-between bg-[#04233A] border-l border-[#6A96B7]/20 overflow-hidden shrink-0">
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#590004]/40 via-[#04233A] to-[#04233A] z-0"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 z-0 pointer-events-none mix-blend-overlay"></div>

          <div className="relative z-10 flex h-full flex-col justify-between p-8 md:p-16">

            <div className="hidden lg:flex justify-end gap-6 text-xs font-bold uppercase tracking-widest text-[#6A96B7]">
            </div>

            <div className="my-10 lg:my-auto">
              <div className="inline-block border border-[#FCEECB]/30 p-4 bg-[#04233A]/50 backdrop-blur-md mb-6 shadow-2xl shadow-[#04233A]">
                <h1 className="text-4xl md:text-6xl font-black text-[#FCEECB] leading-none tracking-tighter">
                  <span className="text-[#C71F2D]">R</span>OCKS
                </h1>
              </div>
              <p className="text-xl md:text-2xl font-bold text-[#FCEECB] mb-2">
                IRMS Conference 2026
              </p>
              <p className="text-[#6A96B7] text-sm leading-relaxed max-w-sm border-l-2 border-[#6A96B7] pl-4 italic">
                "Rock Engineering for a Sustainable Future"
                <br />Innovations, Sustainability, and Resilience.
              </p>
              
              <div className="mt-8 p-6 bg-[#001524] border border-[#6A96B7]/20 shadow-lg">
                 <h4 className="text-[#FCEECB] font-bold uppercase text-sm mb-2">Program Outline</h4>
                 <ul className="text-xs text-[#6A96B7] space-y-1 mb-4">
                    <li>• Nov 22: Registration & Workshop</li>
                    <li>• Nov 23: Commission Meetings</li>
                    <li>• Nov 24: Opening Ceremony</li>
                 </ul>
                 
                 <Link 
                    href="/program" 
                    className="group flex items-center gap-2 text-xs text-[#C71F2D] hover:text-[#FCEECB] transition-colors uppercase font-bold tracking-wider"
                 >
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /> 
                    View Full Schedule
                 </Link>
              </div>
            </div>

            <div className="space-y-4">
                {/* Bottom Line: Vintage Red to Cream Gradient */}
                <div className="w-16 h-1 bg-gradient-to-r from-[#C71F2D] to-[#FCEECB]"></div>
                <div className="w-full text-[10px] text-[#6A96B7] uppercase tracking-[0.2em]">
                    Fukuoka • Japan • November 2026
                </div>
            </div>
          </div>
        </div>

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #FAF9F6; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6A96B7; /* Steel Blue Thumb */
          border-radius: 0px;
          border: 1px solid #FAF9F6;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #04233A; /* Deep Navy Hover */
        }
        .clip-path-slant {
            clip-path: polygon(0 0, 100% 0, 95% 100%, 0% 100%);
        }
      `}</style>
    </>
  );
}