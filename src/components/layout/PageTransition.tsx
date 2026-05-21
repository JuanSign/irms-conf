"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import FrozenRoute from "./FrozenRoute";

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timeout = setTimeout(() => {
      setIsAnimating(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [pathname]);

  const isDashboard = pathname.startsWith("/dashboard");

  const variants: Variants = {
    initial: (isDash: boolean) => ({
      y: isDash ? "100vh" : 0,
      x: isDash ? 0 : "100vw",
      opacity: 1,
    }),
    animate: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
    exit: (isDash: boolean) => ({
      y: isDash ? "-100vh" : 0,
      x: isDash ? 0 : "-100vw",
      opacity: 1,
      transition: {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <>
      {isAnimating && (
        <div className="fixed inset-0 z-9999 touch-none" />
      )}

      <AnimatePresence mode="popLayout" custom={isDashboard}>
        <motion.div
          key={pathname}
          custom={isDashboard}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full bg-white origin-top shadow-xl"
        >
          <FrozenRoute>
            {children}
          </FrozenRoute>
        </motion.div>
      </AnimatePresence>
    </>
  );
}