'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || pathname?.startsWith('/admin')) return null;

  const elements = Array.from({ length: 25 });

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none w-full h-full bg-gradient-to-br from-[#e1f5fe]/50 to-[#b3e5fc]/50">
      {elements.map((_, i) => {
        const isGear = i % 3 === 0;
        const isCube = i % 3 === 1;
        const size = Math.random() * 60 + 20; // 20px - 80px
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const duration = Math.random() * 25 + 20; // 20s - 45s
        const direction = i % 2 === 0 ? 1 : -1;
        
        return (
          <motion.div
            key={i}
            className={`absolute mix-blend-multiply opacity-[0.35] ${isGear ? 'text-orange-400' : isCube ? 'text-blue-400' : 'text-sky-300'}`}
            style={{ width: size, height: size, left: `${startX}%`, top: `${startY}%` }}
            animate={{
              y: [0, direction * 300, direction * -100, 0],
              x: [0, direction * -200, direction * 200, 0],
              rotate: isGear ? [0, 360 * direction] : isCube ? [0, direction * 180, direction * 360] : 0,
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {isGear ? (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-md">
                <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29l-2.39-0.96c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
              </svg>
            ) : isCube ? (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-md">
                <path d="M20.5 8l-8-4-8 4v8l8 4 8-4z" opacity="0.8"/>
                <path d="M12.5 4l8 4-8 4-8-4z" opacity="0.4"/>
                <path d="M4.5 12l8 4v8l-8-4z" opacity="0.6"/>
              </svg>
            ) : (
              <div className="w-full h-full rounded-full bg-current shadow-lg" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
