"use client";
import Link from "next/link";
import React from "react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col p-8 md:p-16 bg-[#04233A] rounded-t-[2.5rem] md:rounded-t-[3rem] text-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 w-full h-full content-start">
        

        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="flex flex-col">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-2">
              ROCKS,
            </h1>
            <p className="text-lg md:text-xl text-white/70 font-light">
              Presented by IRMS <br />
              (Indonesian Rock Mechanics Society)
            </p>
          </div>

          <div className="flex gap-4 items-center mt-4">
            <a href="#" className="hover:opacity-80 transition-opacity">
                <img src="/IG.svg" alt="Instagram" className="w-10 h-10 object-cover" />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity">
                <img src="/linkedin.svg" alt="LinkedIn" className="w-10 h-10 object-cover" />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity">
                <img src="/fb.svg" alt="Facebook" className="w-10 h-10 object-cover" />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity">
                <img src="/twitter.svg" alt="Twitter" className="w-11 h-11 object-cover" />
            </a>
          </div>


          <div className="mt-8">
            <button 
                onClick={scrollToTop}
                className="px-6 py-3 border border-white/30 rounded-full text-sm hover:bg-white hover:text-black transition-all duration-300"
            >
                BACK TO TOP
            </button>

          </div>
        </div>


        <div className="lg:col-span-3 flex flex-col gap-6 pt-2">
            <h3 className="text-white/50 font-bold uppercase tracking-widest text-sm">
                Menu
            </h3>
            <ul className="flex flex-col gap-4 text-xl font-medium">
                <li><Link href="/" className="hover:text-white/70 transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-white/70 transition-colors">About IRMS</Link></li>
                <li><Link href="/submission" className="hover:text-white/70 transition-colors">Submission</Link></li>
                <li><Link href="/schedule" className="hover:text-white/70 transition-colors">Schedule</Link></li>
                <li><Link href="/sponsors" className="hover:text-white/70 transition-colors">Sponsors</Link></li>
            </ul>
        </div>


        <div className="lg:col-span-4 flex flex-col gap-6 pt-2">
            <h3 className="text-white/50 font-bold uppercase tracking-widest text-sm">
                Contact Details
            </h3>


            <div className="flex flex-col gap-8 lg:text-left">
                
                <div>
                    <h4 className="text-white/70 text-sm font-bold uppercase mb-2">Secretariat Office</h4>
                    <a href="mailto:arms14.secretariat@rocknet-japan.org" className="text-lg md:text-xl hover:text-white transition-colors block wrap-break-word">
                        arms14.secretariat@rocknet-japan.org
                    </a>
                </div>
                
                <div>
                    <h4 className="text-white/70 text-sm font-bold uppercase mb-2">Registration Office</h4>
                    <a href="mailto:arms14@ec-mice.com" className="text-lg md:text-xl hover:text-white transition-colors block">
                        arms14@ec-mice.com
                    </a>
                </div>

            </div>
        </div>

      </div>


      <div className="w-full mt-auto pt-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-white/40 text-sm gap-4">
        <p>© 2025 ROCKS. All Rights Reserved.</p>
        <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>

    </div>
  );
}