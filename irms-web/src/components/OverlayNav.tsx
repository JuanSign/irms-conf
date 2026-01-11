"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useRouter, usePathname } from "next/navigation";

const theme = {
  brandBlue: "#04233A",
  cyanBlue: "#00d2ff",
  bg: "#ffffff",
  text: "#0a0a0a",
};

export default function OverlayNav() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const createGrid = (container: HTMLDivElement) => {
    if (container.childElementCount > 0) return;

    const squareSize = 80;
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
    const numCols = Math.ceil(screenWidth / squareSize);
    const numRows = Math.ceil(screenHeight / squareSize);
    const numSquares = numCols * numRows;

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < numSquares; i++) {
      const square = document.createElement("div");
      square.style.width = `${100 / numCols}%`;
      square.style.height = `${100 / numRows}%`;
      
      square.style.backgroundColor = theme.brandBlue; 
      
      square.style.opacity = "0"; 
      square.style.border = "0.5px solid rgba(255,255,255,0.1)"; 
      fragment.appendChild(square);
    }
    container.appendChild(fragment);
  };

  const animateCover = (onCompleteCallback?: () => void) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    createGrid(container);
    
    const squares = container.children;
    container.style.display = "flex";
    container.style.pointerEvents = "all"; 

    gsap.context(() => {
        gsap.killTweensOf(squares);
        gsap.to(squares, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "power2.inOut",
            stagger: { amount: 0.5, from: "random", grid: "auto" },
            onComplete: () => {
                if (onCompleteCallback) onCompleteCallback();
            }
        });
    }, containerRef);
  };

  const animateReveal = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const squares = container.children;

    gsap.context(() => {
        gsap.killTweensOf(squares);
        gsap.to(squares, {
            opacity: 0,
            scale: 0.5,
            duration: 0.6, 
            ease: "power2.inOut",
            stagger: { amount: 0.3, from: "random", grid: "auto" },
            onComplete: () => {
                container.style.display = "none";
                container.style.pointerEvents = "none";
            }
        });
    }, containerRef);
  };

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    createGrid(container);

    let isNavigating = false;
    try {
        isNavigating = sessionStorage.getItem("is-navigating") === "true";
    } catch {
        // sessionStorage not available
    }

    if (isNavigating) {
      const squares = container.children;
  
      container.style.display = "flex";
      container.style.pointerEvents = "all";
      gsap.set(squares, { opacity: 1, scale: 1 });

      sessionStorage.removeItem("is-navigating");

      setTimeout(() => {
        animateReveal();
      }, 800);
    }
  }, []);

  const handleNavigation = (href: string) => {
    if (href === pathname) {
        setIsOpen(false);
        animateReveal(); 
        return;
    }
    
    animateCover(() => {
        sessionStorage.setItem("is-navigating", "true");
        router.push(href);
    });
  };

  const toggleMenu = () => {
    if (!isOpen) {
        animateCover(() => { setIsOpen(true); animateReveal(); });
    } else {
        animateCover(() => { setIsOpen(false); animateReveal(); });
    }
  };

  return (
    <>
      <button
        onClick={toggleMenu}
        className="fixed right-8 top-8 z-[2000] flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white/80 shadow-md backdrop-blur-md transition-all duration-300 hover:border-[#0055ff] hover:bg-white hover:shadow-xl active:scale-95"
      >
        <div className="flex flex-col gap-1.5">
          <span 
            className={`block h-[2px] w-6 bg-gray-900 transition-all duration-300 ${
                isOpen ? "rotate-45 translate-y-2 bg-[#0055ff]" : ""
            }`} 
          />
          
          <span 
            className={`block h-[2px] w-4 bg-gray-900 transition-all duration-300 self-end ${
                isOpen ? "opacity-0" : ""
            }`} 
          />
          
          <span 
            className={`block h-[2px] w-6 bg-gray-900 transition-all duration-300 ${
                isOpen ? "-rotate-45 -translate-y-2 bg-[#0055ff]" : ""
            }`} 
          />
        </div>
      </button>

      <div 
        ref={containerRef} 
        className="fixed inset-0 z-[9999] flex flex-wrap content-start justify-start overflow-hidden pointer-events-none" 
        style={{ display: 'none' }}
      />

      <div
        className={`fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden transition-opacity duration-0 ${
          isOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
        }`}
        style={{ backgroundColor: theme.bg }} 
      >
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[#0055ff]/5 blur-[120px]" />
        
        <div className="absolute left-0 bottom-0 h-[500px] w-[500px] rounded-full bg-[#00d2ff]/5 blur-[120px]" />
        
        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          {["HOME", "SCHEDULE", "SUBMISSION"].map((item) => {
            const href = item === "SUBMISSION" ? "/submission" : item === "HOME" ? "/" : item === "SCHEDULE" ? "/schedule" : "#";
            return (
              <div key={item} className="group relative overflow-hidden p-2">
                <a
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(href);
                  }}
                  className="relative block font-black uppercase italic tracking-tighter text-gray-900 transition-all duration-300 hover:text-transparent hover:tracking-widest"
                  style={{ 
                    fontSize: "clamp(3rem, 6vw, 6rem)", 
                    lineHeight: 0.9,
                    WebkitTextStroke: "0px", 
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.webkitTextStroke = `2px ${theme.brandBlue}`;
                    e.currentTarget.style.color = "transparent";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.webkitTextStroke = "0px";
                    e.currentTarget.style.color = theme.text;
                  }}
                >
                  {item}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}