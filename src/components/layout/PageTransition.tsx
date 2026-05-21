"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef } from "react";
import FrozenRoute from "./FrozenRoute";

function getPageLevel(path: string): number {
  if (path === "/dashboard/register") return 0;
  if (path === "/") return 1;
  if (path.startsWith("/schedule")) return 2;
  if (path === "/dashboard") return 3;
  if (path.startsWith("/dashboard/submission")) return 4;
  return 1;
}

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const currentLevel = getPageLevel(pathname);
  const prevLevelRef = useRef(currentLevel);
  const isFirstRender = useRef(true);

  useEffect(() => {
    isFirstRender.current = false;
    prevLevelRef.current = currentLevel;
  }, [currentLevel]);

  const isForward = currentLevel >= prevLevelRef.current;

  const variants: Variants = {
    initial: (isForward: boolean) => ({
      x: isFirstRender.current ? 0 : (isForward ? "100vw" : "-100vw"),
      opacity: 1,
      zIndex: 10,
    }),
    animate: {
      x: 0,
      opacity: 1,
      zIndex: 10,
      transition: {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      },
      transitionEnd: {
        transform: "none",
      }
    },
    exit: (isForward: boolean) => ({
      x: isForward ? "-100vw" : "100vw",
      opacity: 1,
      zIndex: 1,
      transition: {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <div className="grid w-full">
      <AnimatePresence custom={isForward}>
        <motion.div
          key={pathname}
          custom={isForward}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full bg-white origin-top shadow-xl"
          style={{ gridArea: "1 / 1 / 2 / 2" }}
        >
          <FrozenRoute>
            {children}
          </FrozenRoute>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}