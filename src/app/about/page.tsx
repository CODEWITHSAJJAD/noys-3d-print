'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          className="text-center mb-16 pt-12"
        >
          <div className="flex justify-center gap-4 mb-6">
            {["About", "Us"].map((word, index) => (
              <motion.h1 
                key={word}
                initial={{ y: -500, opacity: 0, rotate: index === 0 ? -10 : 10 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  damping: 12, 
                  stiffness: 100, 
                  delay: index * 0.2 
                }}
                className={`text-6xl sm:text-8xl font-black drop-shadow-sm ${index === 0 ? 'text-[#0c2a50]' : 'text-primary'}`}
              >
                {word}
              </motion.h1>
            ))}
          </div>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="h-2 w-24 bg-orange-500 mx-auto rounded-full" 
          />
          <p className="text-2xl text-[#1a4073] font-bold italic opacity-80 max-w-2xl mx-auto mt-6">
            Bring ideas to life with modern AI and traditional 3D design.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-8"
          >
            <div className="bg-white p-10 rounded-[3rem] border-8 border-[#123968] shadow-[12px_12px_0px_#123968] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[3rem] -mr-4 -mt-4 transition-all group-hover:bg-blue-100" />
              <h2 className="text-3xl font-black text-[#0c2a50] mb-6 flex items-center gap-4">
                <span className="text-4xl">👨‍👩‍👧‍👦</span> Our Story
              </h2>
              <p className="text-xl text-[#1a4073] leading-relaxed font-bold">
                We are a small, family-run business focused on creating high-quality 3D printed models 
                for hobbyists, collectors, and custom projects.
              </p>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border-8 border-orange-500 shadow-[12px_12px_0px_#ea580c] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-[3rem] -mr-4 -mt-4 transition-all group-hover:bg-orange-100" />
              <h2 className="text-3xl font-black text-[#0c2a50] mb-6 flex items-center gap-4">
                <span className="text-4xl">🛠️</span> What We Do
              </h2>
              <p className="text-xl text-[#1a4073] leading-relaxed font-bold">
                From dollhouse furniture and tabletop terrain to completely bespoke designs, we bring 
                ideas to life using both modern AI tools and traditional 3D design methods.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-blue-600 rounded-[4rem] border-[12px] border-[#0c2a50] shadow-[20px_20px_0px_#0c2a50] flex flex-col items-center justify-center p-12 text-center text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-800 opacity-50" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
            />
            
              <div className="relative z-10">
                <div className="text-9xl mb-8 filter drop-shadow-lg animate-bounce">🏰</div>
                <h3 className="text-4xl font-black mb-4 uppercase tracking-tighter">Bespoke Models</h3>
                <p className="text-xl font-bold text-blue-100 max-w-xs mx-auto mb-8">
                  Each piece is crafted with care for your collection.
                </p>
                <Link href="/shop">
                  <div className="bg-orange-500 text-white font-black px-10 py-5 rounded-3xl border-4 border-white shadow-[6px_6px_0px_white] hover:scale-105 transition-transform cursor-pointer">
                    SHOP COLLECTION
                  </div>
                </Link>
              </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-24 bg-[#0c2a50] p-16 rounded-[4rem] text-center border-[10px] border-blue-400 shadow-[20px_20px_0px_rgba(12,42,80,0.3)]"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-8">Ready to bring your ideas to life?</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/contact">
              <div className="bg-white text-[#0c2a50] font-black px-12 py-6 rounded-3xl text-2xl shadow-[8px_8px_0px_#3b82f6] hover:translate-x-1 hover:-translate-y-1 transition-all cursor-pointer">
                Contact Us Now
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
