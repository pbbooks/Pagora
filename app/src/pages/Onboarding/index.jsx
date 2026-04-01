import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// High-Fidelity CSS Book Covers & Feature Cards
const slides = [
  {
    id: 1,
    match: "87%",
    title: "Discover books that\ntruly match you",
    subtitle: "Let AI tailor recommendations based on your reading style, interests, and favorite genres.",
    cover: (
      <div className="w-full h-full bg-[#1A1C1E] p-5 flex flex-col relative border-l-4 border-white/10">
        <div className="text-white/40 text-[9px] uppercase font-bold tracking-[0.2em] mb-4">Biography</div>
        <div className="text-white font-serif font-bold text-5xl tracking-tighter leading-[0.85]">
          NE<br/><span className="text-[22px] tracking-normal">STORY</span>
        </div>
        <div className="absolute bottom-5 left-5 text-white/50 text-[10px] uppercase tracking-wider">#1 Bestseller</div>
      </div>
    )
  },
  {
    id: 2,
    match: "AI",
    title: "Interact with\nyour books",
    subtitle: "Ask questions, generate chapter summaries, and analyze characters instantly with your AI companion.",
    cover: (
      <div className="w-full h-full bg-[#0F172A] p-5 flex flex-col items-center justify-center relative overflow-hidden border border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20"></div>
        <svg viewBox="0 0 100 100" className="w-24 h-24 z-10 drop-shadow-2xl">
           <motion.path 
             d="M50 10 C 50 40, 60 50, 90 50 C 60 50, 50 60, 50 90 C 50 60, 40 50, 10 50 C 40 50, 50 40, 50 10 Z" 
             fill="url(#ai-gradient)" 
             animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }} 
             transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} 
           />
           <defs>
             <linearGradient id="ai-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
               <stop offset="0%" stopColor="#818CF8" />
               <stop offset="100%" stopColor="#C084FC" />
             </linearGradient>
           </defs>
        </svg>
        <div className="absolute bottom-6 text-indigo-200 text-[10px] uppercase tracking-[0.2em] font-bold z-10">Smart Companion</div>
      </div>
    )
  },
  {
    id: 3,
    match: "OCR",
    title: "Digitize your\nphysical shelf",
    subtitle: "Instantly scan and convert physical pages into digital text using advanced OCR camera tech.",
    cover: (
      <div className="w-full h-full bg-[#1C1917] p-5 flex flex-col items-center justify-center relative overflow-hidden">
        <svg viewBox="0 0 100 100" className="w-24 h-24 z-10">
           {/* Reticle */}
           <path d="M10 30 L10 10 L30 10 M70 10 L90 10 L90 30 M90 70 L90 90 L70 90 M30 90 L10 90 L10 70" fill="none" stroke="#A8A29E" strokeWidth="4" strokeLinecap="round" />
           {/* Document */}
           <rect x="25" y="20" width="50" height="60" rx="4" fill="#44403C" opacity="0.8" />
           <line x1="35" y1="35" x2="65" y2="35" stroke="#78716C" strokeWidth="3" strokeLinecap="round" />
           <line x1="35" y1="45" x2="55" y2="45" stroke="#78716C" strokeWidth="3" strokeLinecap="round" />
           {/* Laser Scanner */}
           <motion.line 
             x1="5" y1="50" x2="95" y2="50" 
             stroke="#F97316" strokeWidth="2" 
             animate={{ y1: [15, 85, 15], y2: [15, 85, 15] }} 
             transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }} 
             style={{ filter: "drop-shadow(0 0 4px #F97316)" }}
           />
        </svg>
        <div className="absolute bottom-6 text-orange-200 text-[10px] uppercase tracking-[0.2em] font-bold z-10">Camera Scanner</div>
      </div>
    )
  },
  {
    id: 4,
    match: "Audio",
    title: "Immersive audio\nexperiences",
    subtitle: "Listen on the go with high-fidelity Text-to-Speech and background playback features.",
    cover: (
      <div className="w-full h-full bg-[#064E3B] p-5 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 to-transparent"></div>
        <div className="flex items-center gap-[6px] z-10 h-16">
           {[1, 2, 3, 4, 5, 6].map(i => (
             <motion.div 
               key={i} 
               className="w-2 bg-emerald-400 rounded-full" 
               animate={{ height: [12, 20 + Math.random() * 40, 12] }} 
               transition={{ repeat: Infinity, duration: 1 + Math.random(), delay: i * 0.1 }} 
             />
           ))}
        </div>
        <div className="absolute bottom-6 text-emerald-200 text-[10px] uppercase tracking-[0.2em] font-bold z-10">Neural TTS</div>
      </div>
    )
  },
  {
    id: 5,
    match: "Genres",
    title: "Pick your\nfavourite genres",
    subtitle: "Select the styles you love to fine-tune your completely personalized book recommendations.",
    cover: (
      <div className="w-full h-full bg-[#FAFAFA] border border-[#EAEAEA] p-3 flex flex-wrap content-center justify-center gap-2 relative overflow-hidden">
        <motion.div animate={{y:[-2, 2, -2]}} transition={{repeat: Infinity, duration: 3}} className="px-3 py-1.5 bg-white border border-[#EAEAEA] rounded-full text-[10px] shadow-[0_4px_14px_rgba(0,0,0,0.05)] font-sans text-[#111111] font-medium">Thriller</motion.div>
        <motion.div animate={{y:[2, -2, 2]}} transition={{repeat: Infinity, duration: 3.5, delay: 0.2}} className="px-3 py-1.5 bg-[#111111] text-white rounded-full text-[10px] shadow-[0_4px_14px_rgba(0,0,0,0.05)] font-sans font-medium">Sci-Fi & Fantasy</motion.div>
        <motion.div animate={{y:[-1.5, 1.5, -1.5]}} transition={{repeat: Infinity, duration: 2.8, delay: 0.5}} className="px-3 py-1.5 bg-white border border-[#EAEAEA] rounded-full text-[10px] shadow-[0_4px_14px_rgba(0,0,0,0.05)] font-sans text-[#111111] font-medium">Romance</motion.div>
        <motion.div animate={{y:[1.5, -1.5, 1.5]}} transition={{repeat: Infinity, duration: 3.2, delay: 0.1}} className="px-3 py-1.5 bg-[#1E6FEA] text-white rounded-full text-[10px] shadow-[0_4px_14px_rgba(0,0,0,0.05)] font-sans font-medium">Non-Fiction</motion.div>
        <motion.div animate={{y:[-2, 2, -2]}} transition={{repeat: Infinity, duration: 4, delay: 0.8}} className="px-3 py-1.5 bg-white border border-[#EAEAEA] rounded-full text-[10px] shadow-[0_4px_14px_rgba(0,0,0,0.05)] font-sans text-[#111111] font-medium">History</motion.div>
        <motion.div animate={{y:[2, -2, 2]}} transition={{repeat: Infinity, duration: 3.7, delay: 0.4}} className="px-3 py-1.5 bg-[#FF6536] text-white rounded-full text-[10px] shadow-[0_4px_14px_rgba(0,0,0,0.05)] font-sans font-medium">Self-Help</motion.div>
        <div className="absolute bottom-6 text-[#888888] text-[10px] uppercase tracking-[0.2em] font-bold z-10 w-full text-center">Taste Profile</div>
      </div>
    )
  },
  {
    id: 6,
    match: "Stats",
    title: "Track your\nreading progress",
    subtitle: "Visualize your reading habits with beautiful insights, streaks, and completion charts.",
    cover: (
      <div className="w-full h-full bg-[#111111] p-5 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="flex items-end gap-2 h-20 z-10 border-b border-white/20 pb-1 w-full justify-center">
           <motion.div animate={{ height: [20, 40, 20] }} transition={{ repeat: Infinity, duration: 3 }} className="w-4 bg-white/30 rounded-t-sm" />
           <motion.div animate={{ height: [30, 60, 30] }} transition={{ repeat: Infinity, duration: 3, delay: 0.2 }} className="w-4 bg-[#1E6FEA] rounded-t-sm" />
           <motion.div animate={{ height: [40, 25, 40] }} transition={{ repeat: Infinity, duration: 3, delay: 0.4 }} className="w-4 bg-white/30 rounded-t-sm" />
           <motion.div animate={{ height: [50, 75, 50] }} transition={{ repeat: Infinity, duration: 3, delay: 0.6 }} className="w-4 bg-[#FF6536] rounded-t-sm" />
        </div>
        <div className="absolute bottom-6 text-white/50 text-[10px] uppercase tracking-[0.2em] font-bold z-10 w-full text-center">Habit Tracker</div>
      </div>
    )
  },
  {
    id: 7,
    match: "Goals",
    title: "Set your own\nreading goals",
    subtitle: "Challenge yourself. Set daily reading goals and watch your personal progress soar.",
    cover: (
      <div className="w-full h-full bg-[#4C1D95] p-5 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Background Ring */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
            <motion.circle 
              cx="50" cy="50" r="40" fill="none" stroke="#38BDF8" strokeWidth="8" strokeLinecap="round"
              strokeDasharray="251.2"
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 60 }} // Approx 75% complete
              transition={{ duration: 2, ease: "easeOut", repeat: Infinity, repeatType: "reverse", repeatDelay: 1 }}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="text-white font-serif font-bold text-2xl z-10">75%</div>
        </div>
        <div className="absolute bottom-6 text-sky-200 text-[10px] uppercase tracking-[0.2em] font-bold z-10 w-full text-center">Daily Target</div>
      </div>
    )
  },
  {
    id: 8,
    match: "Font",
    title: "Read your way,\nevery single day",
    subtitle: "Customize typography, line-height, and margins for the absolute perfect reading experience.",
    cover: (
      <div className="w-full h-full bg-[#F8FAFC] border border-[#EAEAEA] p-5 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
        <motion.div 
          className="text-[#111111] font-serif text-[72px] leading-none mb-4 z-10 tracking-tight"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          Aa
        </motion.div>
        <div className="w-[80%] h-1 bg-slate-200 rounded-full relative z-10">
          <motion.div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#111111] rounded-full shadow-sm"
            animate={{ left: ["10%", "80%", "10%"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          />
        </div>
        <div className="absolute bottom-6 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold z-10">Editorial Typography</div>
      </div>
    )
  },
  {
    id: 9,
    match: "Dark",
    title: "Easy on the eyes,\nday or night",
    subtitle: "Automatic dark mode and beautiful sepia themes reduce eye strain during late-night reads.",
    cover: (
      <div className="w-full h-full bg-[#030712] p-5 flex flex-col items-center justify-center relative overflow-hidden border border-slate-800">
        <div className="absolute top-4 right-4 w-1 h-1 bg-white rounded-full animate-ping"></div>
        <div className="absolute top-10 left-8 w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse"></div>
        <div className="absolute bottom-12 right-12 w-1 h-1 bg-white/30 rounded-full animate-ping delay-700"></div>
        <motion.svg viewBox="0 0 24 24" className="w-20 h-20 text-amber-200 z-10" fill="currentColor"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </motion.svg>
        <div className="absolute bottom-6 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold z-10">Smart Dark Theme</div>
      </div>
    )
  },
  {
    id: 10,
    match: "Sync",
    title: "Everything in\none place",
    subtitle: "Organize your collections, track reading progress, and sync across all your devices.",
    cover: (
      <div className="w-full h-full bg-[#27272A] p-5 flex flex-col items-center justify-center relative overflow-hidden">
        <motion.div 
          className="w-20 h-20 rounded-2xl bg-zinc-800 border border-zinc-700 shadow-2xl z-20 flex items-center justify-center"
          animate={{ y: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <div className="w-8 h-8 rounded-full border-4 border-zinc-500 border-t-zinc-300 animate-spin"></div>
        </motion.div>
        <motion.div 
          className="w-16 h-16 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 absolute z-10 top-16 left-8"
          animate={{ y: [-3, 3, -3] }}
          transition={{ repeat: Infinity, duration: 5, delay: 1, ease: "easeInOut" }}
        />
        <motion.div 
          className="w-16 h-16 rounded-2xl bg-zinc-800/30 border border-zinc-700/30 absolute z-10 bottom-16 right-8"
          animate={{ y: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 4.5, delay: 0.5, ease: "easeInOut" }}
        />
        <div className="absolute bottom-6 text-zinc-400 text-[10px] uppercase tracking-[0.2em] font-bold z-10">Cloud Storage</div>
      </div>
    )
  },
  {
    id: 11,
    match: "Offline",
    title: "Take your books\nanywhere you go",
    subtitle: "Download your entire library for seamless, uninterrupted reading without the internet.",
    cover: (
      <div className="w-full h-full bg-[#0284C7] p-5 flex flex-col items-center justify-center relative overflow-hidden">
        <motion.svg viewBox="0 0 24 24" className="w-20 h-20 text-white z-10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          animate={{ y: [-3, 3, -3] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <path d="M12 17v-6" />
          <path d="M9 14l3 3 3-3" />
          <path d="M20 16.2A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
        </motion.svg>
        <div className="absolute bottom-6 text-sky-200 text-[10px] uppercase tracking-[0.2em] font-bold z-10">Offline Mode</div>
      </div>
    )
  },
  {
    id: 12,
    match: "93%",
    title: "Curated for the\ncurious mind",
    subtitle: "Explore high-fidelity digital books with pixel-perfect editorial typography and layouts.",
    cover: (
      <div className="w-full h-full bg-[#FF6536] p-5 flex flex-col relative">
        <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white/90 text-[8px] italic font-serif leading-none mb-3">The<br/>Book</div>
        <div className="text-white font-serif font-bold text-[40px] leading-[0.9] tracking-tight">Design<br/>of<br/>Books</div>
        <div className="text-white/90 text-[10px] mt-3 leading-[1.3] pr-4 opacity-90">An Explainer for Authors, Editors, Agents, and Other Curious Readers</div>
        <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between border-t border-white/20 pt-3">
           <div className="text-white font-bold text-[11px] font-serif tracking-wide">Debbie Berne</div>
        </div>
      </div>
    )
  },
  {
    id: 13,
    match: "99%",
    title: "Ready to start\nyour journey?",
    subtitle: "Join Pagora today and experience the absolute future of reading and literature.",
    cover: (
      <div className="w-full h-full bg-[#111111] p-5 flex flex-col items-center justify-center relative border border-[#222222]">
        <div className="text-white font-serif font-bold text-5xl mb-6 tracking-tight text-center">Pagora.</div>
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg transform rotate-12">
           <div className="w-8 h-8 border-4 border-[#111111] rounded-sm"></div>
        </div>
        <div className="absolute bottom-6 text-white/50 text-[10px] uppercase tracking-[0.2em] font-bold text-center w-full">The Super App</div>
      </div>
    )
  }
];

export default function OnboardingPage({ onComplete }) {
  const [isLaunching, setIsLaunching] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Pagora Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLaunching(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleDragEnd = (event, info) => {
    const threshold = 40;
    if (info.offset.x < -threshold && currentIndex < slides.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (info.offset.x > threshold && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishOnboarding();
    }
  };

  const finishOnboarding = () => {
    localStorage.setItem('pagora_onboarded', 'true');
    if (onComplete) onComplete();
  };

  // 1. Initial Launch Screen
  if (isLaunching) {
    return (
      <motion.div 
        className="fixed inset-0 w-full bg-[#111111] flex flex-col items-center justify-center z-50"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-white font-serif font-bold text-5xl tracking-tight"
        >
          Pagora.
        </motion.div>
      </motion.div>
    );
  }

  // 2. Main Onboarding Flow
  // USING 'fixed inset-0' to permanently kill the scroll/overflow bug on mobile browsers
  return (
    <div className="fixed inset-0 flex flex-col bg-[#FFFFFF] w-full overflow-hidden select-none">
      
      {/* Fixed Top Bar (Includes Skip Button) */}
      <div className="shrink-0 w-full flex justify-between items-center px-6 h-20 pt-4 z-20">
        <div className="font-serif font-bold text-xl tracking-tight text-[#111111]">Pagora.</div>
        {currentIndex < slides.length - 1 && (
          <button 
            onClick={finishOnboarding} 
            className="text-[15px] font-bold tracking-wide text-[#888888] hover:text-[#111111] transition-colors px-2 py-1 outline-none tap-highlight-transparent"
          >
            Skip
          </button>
        )}
      </div>

      {/* Dynamic 3D Coverflow Carousel (Responsive Percentage Height) */}
      <div className="flex-1 w-full relative flex items-center justify-center">
        {slides.map((slide, index) => {
          const offset = index - currentIndex;
          const isCenter = offset === 0;
          
          if (Math.abs(offset) > 2) return null;

          return (
            <motion.div
              key={slide.id}
              className="absolute flex flex-col w-[200px]"
              initial={false}
              animate={{
                x: offset * 135,
                scale: isCenter ? 1 : 0.85,
                zIndex: 10 - Math.abs(offset),
                opacity: Math.abs(offset) > 1 ? 0 : 1
              }}
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
            >
              {/* Carousel bounds dynamically restricted via vh to fit small screens */}
              <div className="w-full h-[40vh] min-h-[240px] max-h-[300px] rounded-lg shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] overflow-hidden bg-white cursor-grab active:cursor-grabbing border border-[#EAEAEA]">
                {slide.cover}
              </div>

              <motion.div 
                animate={{ opacity: isCenter ? 1 : 0.4 }}
                className="mt-4 flex justify-between items-end px-1"
              >
                <div className="text-[11px] leading-tight text-[#888888] w-[90px] font-medium tracking-tight">
                  {slide.match.includes('%') ? <><span className="hidden sm:inline">Your read</span><br/>match score</> : <><span className="hidden sm:inline">Pagora App</span><br/>Feature</>}
                </div>
                <div className="font-serif text-[34px] leading-none font-bold text-[#111111] tracking-tighter">
                  {slide.match}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Fixed Bottom Footer Region (Button visibility absolutely guaranteed) */}
      <div className="shrink-0 flex flex-col items-center w-full px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-2 z-20">
        
        {/* Typography Content */}
        <div className="flex flex-col items-center text-center h-[90px] w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center w-full"
            >
              <h1 className="font-serif text-[26px] sm:text-[28px] leading-[1.05] font-bold text-[#111111] tracking-tight mb-2 whitespace-pre-line">
                {slides[currentIndex].title}
              </h1>
              <p className="font-sans text-[13px] text-[#888888] leading-relaxed max-w-[300px]">
                {slides[currentIndex].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-[4px] mb-5 mt-1 flex-wrap px-8">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-[4px] rounded-full transition-all duration-300 ${currentIndex === idx ? 'w-[14px] bg-[#111111]' : 'w-[4px] bg-[#EAEAEA]'}`}
            />
          ))}
        </div>

        {/* Primary Action Button (Hardcoded to strictly Dark BG and White Text) */}
        <button
          onClick={handleNext}
          className="w-full bg-[#111111] text-[#FFFFFF] py-[18px] rounded-full font-sans font-semibold text-[16px] shadow-[0_8px_16px_rgba(0,0,0,0.15)] active:scale-[0.98] transition-transform flex items-center justify-center outline-none tap-highlight-transparent"
        >
          {currentIndex === slides.length - 1 ? 'Start Reading' : 'Continue'}
        </button>
      </div>

    </div>
  );
}