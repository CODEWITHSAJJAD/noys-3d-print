'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SectionWrapperProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  delay?: number;
}

export function SectionWrapper({ title, subtitle, children, delay = 0.2 }: SectionWrapperProps) {
  return (
    <div className="w-full max-w-7xl z-10 my-20 px-4 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay }}
        className="flex flex-col items-center justify-center mb-12"
      >
        <div className="flex items-center justify-center gap-4 mb-4 opacity-80">
          <div className="h-[2px] w-12 sm:w-20 bg-blue-300"></div>
          <h3 className="text-3xl sm:text-5xl font-black text-[#0c2a50] text-center drop-shadow-[0_2px_0_rgba(0,0,0,0.05)]">
            {title}
          </h3>
          <div className="h-[2px] w-12 sm:w-20 bg-blue-300"></div>
        </div>
        {subtitle && (
          <p className="text-xl font-bold text-blue-500 text-center max-w-2xl px-4 drop-shadow-sm">
            {subtitle}
          </p>
        )}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, delay: delay + 0.2 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
