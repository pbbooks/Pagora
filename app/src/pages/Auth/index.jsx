import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '../../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, KeyRound, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

// Strict Color Palette mapped for inline use where Tailwind config isn't enough
const COLORS = {
  bgBase: '#0C1016',
  card: '#212830',
  primary: '#1E6FEA',
  hover: '#4290F3',
  blueDeep: '#1B3A67',
  textPrimary: '#EFF0E6',
  textMuted: '#D5D6D0'
};

export default function AuthPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    
    // Real EmailJS Integration
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { to_email: email, otp_code: code }
      );
      setStep(2);
    } catch (err) {
      console.error("EmailJS Error (Check Config):", err);
      setError('Failed to send code. Check console.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simulating network delay for smooth UX
    setTimeout(() => {
      if (otp === generatedOtp) {
        // Success. In a real app, backend generates custom token. Using anon for client-side strictly.
        onNavigate('home');
      } else {
        setError("Invalid OTP code. Please try again.");
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden" style={{ backgroundColor: COLORS.bgBase }}>
      
      {/* Abstract Animated SVG Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute w-[800px] h-[800px] opacity-10"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0" fill="none" stroke={COLORS.primary} strokeWidth="1" strokeDasharray="5 15" />
            <circle cx="100" cy="25" r="4" fill={COLORS.hover} />
            <circle cx="175" cy="100" r="4" fill={COLORS.hover} />
            <circle cx="100" cy="175" r="4" fill={COLORS.hover} />
            <circle cx="25" cy="100" r="4" fill={COLORS.hover} />
          </svg>
        </motion.div>
        {/* Glow Effects */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] blur-[120px] rounded-full" style={{ backgroundColor: COLORS.blueDeep, opacity: 0.3 }}></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] blur-[120px] rounded-full" style={{ backgroundColor: COLORS.primary, opacity: 0.15 }}></div>
      </div>

      <div className="z-10 w-full max-w-md flex flex-col items-center">
        {/* Brand Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-extrabold tracking-tight mb-3" style={{ color: COLORS.textPrimary }}>Pagora.</h1>
          <p className="text-sm font-medium tracking-wide" style={{ color: COLORS.textMuted }}>Your gateway to boundless reading.</p>
        </motion.div>

        {/* Dynamic Form Container */}
        <div className="w-full relative min-h-[250px]">
          <AnimatePresence mode="wait">
            
            {step === 1 ? (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSendOTP} 
                className="w-full bg-transparent flex flex-col gap-4"
              >
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={20} style={{ color: COLORS.textMuted }} className="group-focus-within:text-pagora-primary transition-colors" />
                  </div>
                  <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    required 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl text-lg font-medium outline-none transition-all duration-300 border-2"
                    style={{ 
                      backgroundColor: COLORS.card, 
                      color: COLORS.textPrimary,
                      borderColor: 'transparent'
                    }}
                    onFocus={(e) => e.target.style.borderColor = COLORS.primary}
                    onBlur={(e) => e.target.style.borderColor = 'transparent'}
                  />
                </div>
                
                {error && <p className="text-red-400 text-sm flex items-center gap-1 font-medium"><AlertCircle size={14}/> {error}</p>}
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl font-bold text-lg flex justify-center items-center gap-2 shadow-xl transition-all disabled:opacity-70 mt-2"
                  style={{ backgroundColor: COLORS.primary, color: COLORS.textPrimary }}
                >
                  {isLoading ? 'Sending code...' : <>Continue <ArrowRight size={20} strokeWidth={2.5} /></>}
                </motion.button>
              </motion.form>
            ) : (
              <motion.form 
                key="step2"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleVerifyOTP} 
                className="w-full flex flex-col gap-4"
              >
                <div className="text-center mb-2">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3" style={{ backgroundColor: `${COLORS.primary}20` }}>
                    <Mail size={20} style={{ color: COLORS.primary }} />
                  </div>
                  <p className="text-sm font-medium" style={{ color: COLORS.textMuted }}>
                    We sent a secure 4-digit code to<br/>
                    <span className="font-bold text-white">{email}</span>
                  </p>
                </div>

                <div className="relative group mt-2">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <KeyRound size={20} style={{ color: COLORS.textMuted }} className="group-focus-within:text-pagora-primary transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="• • • •" 
                    required 
                    maxLength="4" 
                    value={otp} 
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} // strictly numbers
                    className="w-full pl-12 pr-4 py-4 rounded-2xl text-center text-3xl tracking-[1em] font-bold outline-none transition-all duration-300 border-2"
                    style={{ 
                      backgroundColor: COLORS.card, 
                      color: COLORS.textPrimary,
                      borderColor: 'transparent'
                    }}
                    onFocus={(e) => e.target.style.borderColor = COLORS.primary}
                    onBlur={(e) => e.target.style.borderColor = 'transparent'}
                  />
                </div>
                
                {error && <p className="text-red-400 text-sm flex items-center justify-center gap-1 font-medium"><AlertCircle size={14}/> {error}</p>}
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={isLoading || otp.length !== 4}
                  className="w-full py-4 rounded-2xl font-bold text-lg flex justify-center items-center gap-2 shadow-xl transition-all disabled:opacity-50 mt-2"
                  style={{ backgroundColor: COLORS.primary, color: COLORS.textPrimary }}
                >
                  {isLoading ? 'Verifying...' : <>Verify & Enter <CheckCircle2 size={20} strokeWidth={2.5} /></>}
                </motion.button>
                
                <button type="button" onClick={() => setStep(1)} className="text-sm font-medium mt-2 transition-colors hover:text-white" style={{ color: COLORS.textMuted }}>
                  Use a different email
                </button>
              </motion.form>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}