"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";

export default function OverlayNav() {
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const theme = {
    red: "#8e0c0cff",
    blue: "#0055ff",
    dark: "#050505",
    white: "#ffffff",
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleMenu = () => {
    if (isAnimating || !containerRef.current || !menuRef.current) return;

    setIsAnimating(true);
    const container = containerRef.current;
    
    container.innerHTML = "";
    
    const squareSize = 80; 
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const numCols = Math.ceil(screenWidth / squareSize);
    const numRows = Math.ceil(screenHeight / squareSize);
    const numSquares = numCols * numRows;

    container.style.width = `${numCols * squareSize}px`;
    container.style.height = `${numRows * squareSize}px`;

    const squares: HTMLDivElement[] = [];
    for (let i = 0; i < numSquares; i++) {
      const square = document.createElement("div");
      
      square.style.width = `${squareSize}px`;
      square.style.height = `${squareSize}px`;
      square.style.backgroundColor = theme.red;
      square.style.position = "relative";
      square.style.opacity = "0";
      square.style.border = "1px solid rgba(0,0,0,0.1)"; 
      
      container.appendChild(square);
      squares.push(square);
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
            container.innerHTML = ""; 
            setIsAnimating(false);
        }
      });

      tl.fromTo(squares, 
        { opacity: 0, scale: 0.5 }, 
        { 
            opacity: 1, 
            scale: 1,
            duration: 0.05,
            ease: "power1.inOut",
            stagger: {
                each: 0.005,
                from: "random"
            }
        }
      );

      tl.add(() => {
        setIsOpen((prev) => !prev);
      }, "+=0.3"); 

      tl.to(squares, {
        opacity: 0,
        scale: 0.5,
        duration: 0.05,
        stagger: {
            each: 0.005,
            from: "random"
        }
      }, "+=0.1");

    }, containerRef);
  };

  return (
    <>
      <button
        onClick={toggleMenu}
        className="fixed right-8 top-8 z-[2000] flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-md transition-all duration-300 hover:border-[#AD0D0E] hover:bg-black/80 hover:shadow-[0_0_20px_rgba(173,13,14,0.4)] active:scale-95"
      >
        <div className="flex flex-col gap-1.5">
            <span 
                className={`block h-[2px] w-6 bg-white transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2 bg-[#AD0D0E]" : ""}`} 
                style={{ boxShadow: isOpen ? `0 0 10px ${theme.red}` : "none" }}
            />
            <span 
                className={`block h-[2px] w-4 bg-white transition-all duration-300 self-end ${isOpen ? "opacity-0" : ""}`} 
            />
            <span 
                className={`block h-[2px] w-6 bg-white transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2 bg-[#AD0D0E]" : ""}`} 
                style={{ boxShadow: isOpen ? `0 0 10px ${theme.red}` : "none" }}
            />
        </div>
      </button>

      <div
        ref={containerRef}
        className="pointer-events-none fixed left-0 top-0 z-[1500] flex flex-wrap content-start justify-start overflow-hidden"
      />

      <div
        ref={menuRef}
        className={`fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden transition-opacity duration-0 ${
            isOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
        }`}
        style={{ backgroundColor: theme.dark }}
      >
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[#0055ff]/10 blur-[150px]" />
        <div className="absolute left-0 bottom-0 h-[500px] w-[500px] rounded-full bg-[#AD0D0E]/10 blur-[150px]" />
        
        <div 
            className="absolute inset-0 opacity-10" 
            style={{ 
                backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)", 
                backgroundSize: "50px 50px" 
            }} 
        />

        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
            {["HOME", "SPEAKERS", "SCHEDULE", "NEWS"].map((item, idx) => (
                <div key={item} className="group relative overflow-hidden p-2">
                    
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-600 transition-all duration-300 group-hover:left-[-20px] group-hover:text-[#AD0D0E] group-hover:opacity-0 md:-left-8">
                        0{idx + 1}
                    </span>

                    <Link 
                        href="#" 
                        className="relative block font-black uppercase italic tracking-tighter text-white transition-all duration-300 hover:tracking-widest"
                        style={{ fontSize: "clamp(3rem, 6vw, 6rem)", lineHeight: 0.9 }}
                    >
                        <span className="relative z-10 transition-colors duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-500">
                            {item}
                        </span>
                        
                        <span 
                            className="absolute left-0 top-0 z-0 opacity-0 transition-all duration-300 group-hover:opacity-100"
                            style={{ 
                                WebkitTextStroke: `1px ${theme.red}`, 
                                color: "transparent",
                                textShadow: `0 0 10px ${theme.red}` 
                            }}
                        >
                            {item}
                        </span>
                    </Link>
                </div>
            ))}
        </div>

        <div className="absolute bottom-10 left-0 w-full text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                IRMS Conference 2026
            </p>
        </div>
      </div>
    </>
  );
}