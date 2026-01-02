"use client";

import Link from "next/link";
import OverlayNav from "../../components/OverlayNav"; 
import { Calendar, FileText, Award, Layers, ArrowRight } from "lucide-react";

export default function SubmissionPage() {
  return (
    <>
      <OverlayNav />

      <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen w-full bg-[#050505] text-zinc-200">
        <div className="w-full lg:w-[65%] h-auto lg:h-full lg:overflow-y-auto px-6 pt-32 pb-20 lg:py-24 sm:px-12 md:px-24 custom-scrollbar scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-12 md:space-y-16">
            <section className="animate-fade-in-up">
              <div className="border-l-4 border-red-700 pl-4 md:pl-6 mb-8">
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">
                  Call for <span className="text-zinc-600">Abstract</span>
                </h1>
                <p className="mt-2 text-sm md:text-lg text-red-500 font-bold tracking-widest uppercase">
                  Submission has been started!
                </p>
              </div>

              <div className="prose prose-invert prose-zinc max-w-none text-justify text-zinc-400 text-sm md:text-base">
                <p className="mb-4">
                  Prospective authors are kindly asked to submit an abstract related to one of the proposed symposium topics
                  to participate in the symposium. The abstracts should be written in English and should clearly explain the
                  contents of the studies discussed. Specifically, it is strongly recommended that the abstracts states:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-6 text-zinc-300">
                  <li>Objective of the study</li>
                  <li>Results obtained in the study and their significance</li>
                  <li>Advancements beyond previous research or novelties</li>
                  <li><span className="text-red-400">Note:</span> Previously published results will not be accepted.</li>
                  <li>The length of the abstracts should be around <strong>300 words</strong>.</li>
                </ul>
                
                <div className="bg-zinc-900/50 border border-zinc-800 p-4 md:p-6 rounded-none border-l-2 border-l-blue-600">
                  <h4 className="text-white font-bold uppercase tracking-wider mb-2 text-sm">Review Process</h4>
                  <p className="text-xs md:text-sm">
                    Submitted abstracts will be reviewed by two independent experts specializing in the relevant fields.
                    Author(s) information do not need to be included in the PDF body (blind review).
                  </p>
                </div>
              </div>

               <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button className="flex justify-center items-center gap-3 bg-red-800 hover:bg-red-700 text-white px-8 py-4 font-bold uppercase tracking-widest transition-all clip-path-slant text-sm md:text-base">
                  Submit Abstract <ArrowRight size={20} />
                </button>
                <button className="flex justify-center items-center gap-3 border border-zinc-700 hover:border-zinc-500 text-zinc-300 px-8 py-4 font-bold uppercase tracking-widest transition-all text-sm md:text-base">
                  How to Submit <FileText size={20} />
                </button>
              </div>
            </section>

            <div className="w-full h-px bg-zinc-800" />

            <section>
              <div className="flex items-center gap-3 mb-8">
                <Calendar className="text-red-600 w-6 h-6 md:w-7 md:h-7" />
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">Important Dates</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="group relative bg-zinc-900/40 p-6 border-b-2 border-zinc-800 hover:border-red-600 transition-colors">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Deadline</span>
                    <h3 className="text-2xl font-bold text-white mt-1">Dec 19, 2025</h3>
                    <p className="text-zinc-400 mt-2 text-sm group-hover:text-red-400 transition-colors">Abstract Submission Deadline</p>
                 </div>
                 <div className="group relative bg-zinc-900/40 p-6 border-b-2 border-zinc-800 hover:border-blue-600 transition-colors">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Notification</span>
                    <h3 className="text-2xl font-bold text-white mt-1">Jan 31, 2026</h3>
                    <p className="text-zinc-400 mt-2 text-sm group-hover:text-blue-400 transition-colors">Notification of Abstract Acceptance</p>
                 </div>
                 <div className="group relative bg-zinc-900/40 p-6 border-b-2 border-zinc-800 hover:border-red-600 transition-colors">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Deadline</span>
                    <h3 className="text-2xl font-bold text-white mt-1">Apr 30, 2026</h3>
                    <p className="text-zinc-400 mt-2 text-sm group-hover:text-red-400 transition-colors">Full Paper Submission Deadline</p>
                 </div>
                 <div className="group relative bg-zinc-900/40 p-6 border-b-2 border-zinc-800 hover:border-blue-600 transition-colors">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Notification</span>
                    <h3 className="text-2xl font-bold text-white mt-1">Jun 30, 2026</h3>
                    <p className="text-zinc-400 mt-2 text-sm group-hover:text-blue-400 transition-colors">Notification of Paper Acceptance</p>
                 </div>
              </div>
            </section>

            <div className="w-full h-px bg-zinc-800" />

            <section>
              <div className="flex items-center gap-3 mb-8">
                <Layers className="text-blue-600 w-6 h-6 md:w-7 md:h-7" />
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">Topics</h2>
              </div>

              <div className="space-y-6">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="bg-zinc-900 p-6 border-l-2 border-zinc-700">
                      <h3 className="text-lg font-bold text-white mb-2 uppercase text-red-500">Topic {num}</h3>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                          {num === 1 && "Civil engineering aspects, Mining engineering aspects, Petroleum Engineering aspects, Geological/Hydrological aspects, Geophysical aspects, Earth science, Material science, Others."}
                          {num === 2 && "Mitigation of Geo-hazards, Environmental issues, Energy Resources, Fundamental Aspects, New Technologies, Others."}
                          {num === 3 && "Risk and Hazard Management, Disaster Mitigation, Slope Stability, Tunnels and Underground Spaces, Maintenance and Life Cycle Costs, Global Warming, Carbon Dioxide Capture and Storage."}
                          {num === 4 && "Site investigation/Characterization, Laboratory Test, In-situ Test, Theoretical development/Analytical solution, Numerical model/simulations, Field measurement/monitoring."}
                      </p>
                  </div>
                ))}
              </div>
            </section>

            <div className="w-full h-px bg-zinc-800" />

            {/* 4. Awards */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <Award className="text-yellow-600 w-6 h-6 md:w-7 md:h-7" />
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">Awards</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-6">
                      <div className="absolute top-0 right-0 p-2 opacity-10">
                          <Award size={60} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">ISRM Best Paper Award</h3>
                      <p className="text-xs text-zinc-500 text-justify">
                          Presented to the authors of the orally presented best paper. Two categories: General Category and Young Category.
                      </p>
                  </div>
                  <div className="relative border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-6">
                      <div className="absolute top-0 right-0 p-2 opacity-10">
                          <Award size={60} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Outstanding Poster Award</h3>
                      <p className="text-xs text-zinc-500 text-justify">
                           Presented to the authors of the most outstanding poster presentation. Two categories: General Category and Young Category.
                      </p>
                  </div>
              </div>
            </section>

          </div>
        </div>

        <div className="relative flex flex-col w-full lg:w-[35%] h-auto lg:h-full justify-between bg-zinc-900 border-l border-zinc-800 overflow-hidden shrink-0">
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-red-900/30 via-[#0a0a0a] to-[#050505] z-0"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 mix-blend-overlay pointer-events-none"></div>

          <div className="relative z-10 flex h-full flex-col justify-between p-8 md:p-16">

            <div className="hidden lg:flex justify-end gap-6 text-xs font-bold uppercase tracking-widest text-zinc-500">
            </div>

            <div className="my-10 lg:my-auto">
              <div className="inline-block border border-red-900/50 p-4 bg-black/40 backdrop-blur-sm mb-6 shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                <h1 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter">
                  <span className="text-red-600">R</span>OCKS
                </h1>
              </div>
              <p className="text-xl md:text-2xl font-bold text-zinc-200 mb-2">
                IRMS Conference 2026
              </p>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-sm border-l-2 border-blue-900 pl-4">
                "Rock Engineering for a Sustainable Future"
                <br />Innovations, Sustainability, and Resilience.
              </p>
              
              <div className="mt-8 p-6 bg-zinc-800/50 border border-zinc-700 backdrop-blur-md">
                 <h4 className="text-white font-bold uppercase text-sm mb-2">Program Outline</h4>
                 <ul className="text-xs text-zinc-400 space-y-1 mb-4">
                    <li>• Nov 22: Registration & Workshop</li>
                    <li>• Nov 23: Commission Meetings</li>
                    <li>• Nov 24: Opening Ceremony</li>
                 </ul>
                 
                 <Link 
                    href="/program" 
                    className="group flex items-center gap-2 text-xs text-red-400 hover:text-white transition-colors uppercase font-bold tracking-wider"
                 >
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /> 
                    View Full Schedule
                 </Link>
              </div>
            </div>

            <div className="space-y-4">
                <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-blue-900"></div>
                <div className="w-full text-[10px] text-zinc-700 uppercase tracking-[0.2em]">
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
          background: #050505; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333; 
          border-radius: 0px;
          border: 1px solid #050505;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #b91c1c; 
        }
        .clip-path-slant {
            clip-path: polygon(0 0, 100% 0, 95% 100%, 0% 100%);
        }
      `}</style>
    </>
  );
}