"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";

interface RippleCardProps {
  children: React.ReactNode;
  className?: string;
}

const RippleCard = ({ children, className }: RippleCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-xl bg-white ${className}`}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50" />

      {/* Animated border */}
      <div className="absolute inset-0">
        <div className="absolute inset-px z-10">
          <motion.div
            className="h-full w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(48,103,222,0.2), transparent)",
              position: "absolute",
              top: 0,
              left: 0,
              transform: "translateX(-100%)",
            }}
            animate={{
              transform: ["translateX(-100%)", "translateX(100%)"],
            }}
            transition={{
              duration: 3,
              ease: "linear",
              repeat: Infinity,
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20">{children}</div>
    </div>
  );
};

export default RippleCard;
