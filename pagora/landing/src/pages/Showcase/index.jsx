
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Smartphone, Zap, ShieldCheck } from 'lucide-react';

const EditorialBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none opacity-5">
    <svg className="w-full h-full" viewBox="0 0 100 100">
      <path d="M10,10 Q50,90 90,10" fill="none" stroke="currentColor" strokeWidth="0.1" />
      <path d="M0,50 Q50,0 100,50" fill="none" stroke="currentColor" strokeWidth="0.1" />
    </svg>
  </div>
);

export default function Showcase() {
  return (
    <div className="relative bg-white min-h-screen overflow-hidden">
      <EditorialBackground />
      <nav className="flex justify-between items-center px-12 py-8 relative z-10">
        <div className="font-serif text-3xl font-bold tracking-tighter">Pagora.</div>
        <div className="flex gap-8 font-sans font-semibold text-sm uppercase tracking-widest text-[#888888]">
          <a href="#" className="hover:text-black">Features</a>
          <a href="#" className="hover:text-black">Pricing</a>
          <a href="#" className="hover:text-black">Community</a>
        </div>
      </nav>

      <main className="px-12 pt-20 relative z-10">
        <div className="max-w-4xl">
          <motion.h1 
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="font-serif text-[120px] leading-[0.9] tracking-tighter font-bold mb-12"
          >
            Read. <br/> Beyond. <br/> Limits.
          </motion.h1>
          
          <p className="font-sans text-xl text-[#888888] max-w-xl leading-relaxed mb-12">
            The world's most advanced editorial reading ecosystem. AI-powered summaries, 
            pixel-perfect typography, and a library that understands you.
          </p>

          <div className="flex gap-4">
            <button className="bg-black text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform">
              Get the App <Smartphone size={20}/>
            </button>
            <button className="border border-[#EAEAEA] px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition-colors">
              Watch Preview
            </button>
          </div>
        </div>
      </main>

      <footer className="absolute bottom-12 left-12 right-12 flex justify-between items-end border-t border-[#EAEAEA] pt-12">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#888888]">
          © 2026 Pagora Inc. / Established in Literature
        </div>
      </footer>
    </div>
  );
}
