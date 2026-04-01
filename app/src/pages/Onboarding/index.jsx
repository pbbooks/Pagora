import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

// Strict Color Palette
const COLORS = {
  bgBase: '#0C1016',
  bgElevated: '#0D1116',
  card: '#212830',
  accent: '#202930',
  blueDeep: '#1B3A67',
  primary: '#1E6FEA',
  hover: '#4290F3',
  textMuted: '#D5D6D0',
  textPrimary: '#EFF0E6',
};

// High-Fidelity Custom SVG Illustrations for the 6 Steps
const slides = [
  {
    id: 1,
    title: "Welcome to Pagora",
    subtitle: "The ultimate super app for reading, scanning, and exploring literature.",
    illustration: (
      <svg viewBox="0 0 200 200" className="w-64 h-64 drop-shadow-2xl">
        <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.8 }} cx="100" cy="100" r="80" fill={COLORS.blueDeep} opacity="0.5" />
        <motion.rect initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }} x="60" y="40" width="80" height="120" rx="8" fill={COLORS.primary} />
        <motion.rect initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} x="75" y="60" width="40" height="8" rx="4" fill={COLORS.textPrimary} />
        <motion.rect initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} x="75" y="80" width="50" height="8" rx="4" fill={COLORS.hover} opacity="0.8" />
        <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 1 }} d="M60 160 L140 160" stroke={COLORS.textPrimary} strokeWidth="4" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 2,
    title: "Advanced Reading Engine",
    subtitle: "Customize typography, themes, and layouts for the perfect reading experience.",
    illustration: (
      <svg viewBox="0 0 200 200" className="w-64 h-64 drop-shadow-2xl">
        <motion.rect initial={{ opacity: 0 }} animate={{ opacity: 1 }} x="30" y="30" width="140" height="140" rx="16" fill={COLORS.card} />
        <motion.rect initial={{ width: 0 }} animate={{ width: 100 }} transition={{ delay: 0.2 }} x="50" y="60" height="12" rx="6" fill={COLORS.textMuted} />
        <motion.rect initial={{ width: 0 }} animate={{ width: 120 }} transition={{ delay: 0.3 }} x="50" y="85" height="12" rx="6" fill={COLORS.textPrimary} />
        <motion.rect initial={{ width: 0 }} animate={{ width: 80 }} transition={{ delay: 0.4 }} x="50" y="110" height="12" rx="6" fill={COLORS.hover} />
        <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} cx="150" cy="150" r="16" fill={COLORS.primary} />
        <path d="M144 150 L156 150 M150 144 L150 156" stroke={COLORS.textPrimary} strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 3,
    title: "Smart Library",
    subtitle: "Organize your collections, track progress, and sync across all your devices.",
    illustration: (
      <svg viewBox="0 0 200 200" className="w-64 h-64 drop-shadow-2xl">
        <motion.rect initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} x="80" y="30" width="40" height="140" rx="6" fill={COLORS.blueDeep} />
        <motion.rect initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} x="40" y="50" width="30" height="120" rx="4" fill={COLORS.accent} />
        <motion.rect initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} x="130" y="60" width="35" height="110" rx="4" fill={COLORS.hover} />
        <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.8 }} d="M20 180 L180 180" stroke={COLORS.textPrimary} strokeWidth="6" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 4,
    title: "Physical Book Scanner",
    subtitle: "Instantly digitize pages using our advanced OCR camera technology.",
    illustration: (
      <svg viewBox="0 0 200 200" className="w-64 h-64 drop-shadow-2xl">
        <motion.rect initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} x="40" y="40" width="120" height="120" rx="12" fill={COLORS.bgElevated} stroke={COLORS.primary} strokeWidth="4" strokeDasharray="10 10" />
        <motion.path initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} d="M30 30 L50 30 M30 30 L30 50 M170 30 L150 30 M170 30 L170 50 M30 170 L50 170 M30 170 L30 150 M170 170 L150 170 M170 170 L170 150" stroke={COLORS.hover} strokeWidth="4" strokeLinecap="round" />
        <motion.line initial={{ y1: 40, y2: 40 }} animate={{ y1: 160, y2: 160 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} x1="40" y1="40" x2="160" y2="40" stroke={COLORS.primary} strokeWidth="2" />
        <motion.rect initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} x="60" y="70" width="80" height="60" rx="4" fill={COLORS.card} />
      </svg>
    )
  },
  {
    id: 5,
    title: "AI Companion",
    subtitle: "Ask questions, generate chapter summaries, and get character analysis instantly.",
    illustration: (
      <svg viewBox="0 0 200 200" className="w-64 h-64 drop-shadow-2xl">
        <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} cx="100" cy="100" r="40" fill={COLORS.blueDeep} />
        <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} cx="100" cy="100" r="20" fill={COLORS.primary} />
        <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 1 }} d="M100 60 L100 20 M100 140 L100 180 M60 100 L20 100 M140 100 L180 100 M72 72 L40 40 M128 128 L160 160 M72 128 L40 160 M128 72 L160 40" stroke={COLORS.hover} strokeWidth="4" strokeLinecap="round" />
        <motion.circle animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 2 }} cx="100" cy="100" r="8" fill={COLORS.textPrimary} />
      </svg>
    )
  },
  {
    id: 6,
    title: "Immersive Audio",
    subtitle: "Listen on the go with high-fidelity Text-to-Speech and background playback.",
    illustration: (
      <svg viewBox="0 0 200 200" className="w-64 h-64 drop-shadow-2xl">
        <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} d="M50 120 C 50 60, 150 60, 150 120" fill="none" stroke={COLORS.primary} strokeWidth="12" strokeLinecap="round" />
        <motion.rect initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.5 }} x="40" y="110" width="20" height="40" rx="10" fill={COLORS.hover} />
        <motion.rect initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.5 }} x="140" y="110" width="20" height="40" rx="10" fill={COLORS.hover} />
        
        {/* Animated Audio Waves */}
        <motion.rect animate={{ height: [10, 30, 10] }} transition={{ repeat: Infinity, duration: 1 }} x="80" y="120" width="6" height="10" rx="3" fill={COLORS.textPrimary} />
        <motion.rect animate={{ height: [10, 40, 10] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} x="95" y="115" width="6" height="20" rx="3" fill={COLORS.textPrimary} />
        <motion.rect animate={{ height: [10, 25, 10] }} transition={{ repeat: Infinity, duration: 0.9, delay: 0.4 }} x="110" y="125" width="6" height="15" rx="3" fill={COLORS.textPrimary} />
      </svg>
    )
  }
];

export default function OnboardingPage({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < slides.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Mark as onboarded in local storage and trigger parent callback
      localStorage.setItem('pagora_onboarded', 'true');
      if (onComplete) onComplete();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('pagora_onboarded', 'true');
    if (onComplete) onComplete();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 pt-12 pb-10 overflow-hidden relative" style={{ backgroundColor: COLORS.bgBase }}>
      
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center z-10">
        <div className="font-extrabold text-xl tracking-tight" style={{ color: COLORS.textPrimary }}>Pagora.</div>
        {currentStep < slides.length - 1 && (
          <button onClick={handleSkip} className="text-sm font-semibold tracking-wide transition-opacity hover:opacity-70" style={{ color: COLORS.textMuted }}>
            Skip
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full flex flex-col items-center justify-center mt-8 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center text-center w-full"
          >
            {/* SVG Illustration Container */}
            <div className="w-full max-w-[320px] aspect-square flex items-center justify-center mb-12 relative">
              {/* Background Glow */}
              <div className="absolute inset-0 blur-3xl opacity-20 rounded-full" style={{ backgroundColor: COLORS.primary }}></div>
              {slides[currentStep].illustration}
            </div>

            {/* Text Content */}
            <h1 className="text-3xl font-extrabold mb-4 leading-tight tracking-tight" style={{ color: COLORS.textPrimary }}>
              {slides[currentStep].title}
            </h1>
            <p className="text-base leading-relaxed px-4" style={{ color: COLORS.textMuted }}>
              {slides[currentStep].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="w-full flex flex-col items-center z-10 mt-8">
        
        {/* Pagination Dots */}
        <div className="flex gap-2 mb-8">
          {slides.map((_, idx) => (
            <motion.div 
              key={idx}
              animate={{
                width: currentStep === idx ? 24 : 8,
                backgroundColor: currentStep === idx ? COLORS.primary : COLORS.accent
              }}
              transition={{ duration: 0.3 }}
              className="h-2 rounded-full"
            />
          ))}
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="w-full max-w-[320px] py-4 rounded-2xl font-bold text-lg shadow-2xl flex items-center justify-center gap-2 transition-all"
          style={{ backgroundColor: COLORS.primary, color: COLORS.textPrimary }}
        >
          {currentStep === slides.length - 1 ? (
            <>Get Started <Check size={20} strokeWidth={3} /></>
          ) : (
            <>Continue <ArrowRight size={20} strokeWidth={3} /></>
          )}
        </motion.button>

      </div>

      {/* Abstract Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[30%] blur-[100px] opacity-10 rounded-full pointer-events-none" style={{ backgroundColor: COLORS.blueDeep }}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] blur-[120px] opacity-10 rounded-full pointer-events-none" style={{ backgroundColor: COLORS.hover }}></div>
    </div>
  );
}