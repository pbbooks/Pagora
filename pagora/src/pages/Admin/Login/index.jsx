import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowRight, Smartphone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import * as otplib from 'otplib';

// Corrected relative paths for backend consistency
import { auth, db } from '../../../firebase';
import { pb } from '../../../pocketbase';

// High-End SVG Background Illustration (Floating Manuscript & Quill)
const LoginBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#FFFFFF]">
    {/* Soft Editorial Gradients */}
    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[50%] bg-gradient-to-bl from-[#F8FAFC] to-transparent rounded-full blur-[100px] opacity-60"></div>
    <div className="absolute bottom-[-10%] left-[-10%] w-[70%] h-[60%] bg-gradient-to-tr from-[#F1F5F9] to-transparent rounded-full blur-[120px] opacity-70"></div>
    
    <svg className="absolute w-full h-full opacity-[0.05]" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Flowing Manuscript Lines */}
      <motion.path 
        d="M100 200 Q 400 150 700 200 M100 300 Q 400 250 700 300 M100 400 Q 400 350 700 400" 
        stroke="#111111" strokeWidth="1" strokeDasharray="4 4"
        initial={{ pathLength: 0, opacity: 0 }} 
        animate={{ pathLength: 1, opacity: 1 }} 
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
      />
      
      {/* High-End Fountain Pen / Quill Illustration */}
      <motion.g 
        initial={{ rotate: -10, x: 50, y: 50 }}
        animate={{ x: [0, -10, 0], y: [0, 10, 0], rotate: [-10, -5, -10] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      >
        <path d="M550 150 L480 400 L510 415 L580 165 Z" fill="#111111" />
        <path d="M480 400 L465 440 L510 415 Z" fill="#1E6FEA" />
        <path d="M550 150 C 600 80 650 100 650 100 C 650 100 620 150 580 165" stroke="#111111" strokeWidth="2" fill="none" />
      </motion.g>

      {/* Abstract ink blot animation */}
      <motion.circle 
        cx="465" cy="445" r="4" fill="#1E6FEA" 
        animate={{ scale: [1, 2, 1], opacity: [0.3, 0.6, 0.3] }} 
        transition={{ repeat: Infinity, duration: 3 }}
      />
    </svg>
  </div>
);

export default function AdminLogin({ onAuthSuccess }) {
  const [step, setStep] = useState(1); // 1: Credentials, 2: TOTP
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Time-Based Security Configuration
  const secret = import.meta.env.VITE_ADMIN_TOTP_SECRET || 'PAGORASECRET12345';
  const otpauth = `otpauth://totp/PagoraAdmin:admin@pagora.ai?secret=${secret}&issuer=Pagora`;

  const handleInitialAuth = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Strict System ID check
    setTimeout(() => {
      if (email === 'admin@pagora.ai' && password === 'Pagora@2026') {
        setStep(2);
      } else {
        setError('Unauthorized System Identity or Security Key.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const verifyTOTP = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const isValid = otplib.authenticator.check(totpCode, secret);
      if (isValid) {
        onAuthSuccess();
      } else {
        setError('Invalid or expired time-based token.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Internal Synchronization Error.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-6 z-[9999] overflow-y-auto">
      <LoginBackground />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[48px] p-10 sm:p-12 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.12)] border border-[#EAEAEA] relative z-10 my-auto"
      >
        <header className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-[#111111] rounded-2xl flex items-center justify-center mb-6 shadow-xl relative overflow-hidden group">
            <Shield className="text-white z-10" size={32} strokeWidth={2.5} />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent group-hover:scale-110 transition-transform"></div>
          </div>
          <h1 className="font-serif text-[42px] leading-[1.05] tracking-tighter font-bold text-[#111111] mb-2">Internal Access</h1>
          <p className="text-[13px] font-sans font-semibold text-[#888888] tracking-widest uppercase">System Layer 0{step}</p>
        </header>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form 
              key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              onSubmit={handleInitialAuth} className="space-y-6"
            >
              <div>
                <label className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#888888] mb-2 block ml-1">System Identity</label>
                <input 
                  type="email" placeholder="admin@pagora.ai" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#F5F5F7] px-6 py-5 rounded-2xl outline-none font-medium text-[#111111] focus:ring-2 ring-[#111111] transition-all" 
                />
              </div>
              <div>
                <label className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#888888] mb-2 block ml-1">Security Key</label>
                <input 
                  type="password" placeholder="••••••••" required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#F5F5F7] px-6 py-5 rounded-2xl outline-none font-medium text-[#111111] focus:ring-2 ring-[#111111] transition-all" 
                />
              </div>
              
              {error && (
                <div className="flex items-center gap-2 text-[#FF3B30] text-xs font-bold bg-[#FF3B30]/10 p-4 rounded-xl">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
              
              <button 
                disabled={isLoading}
                className="w-full bg-[#111111] text-white py-5 rounded-full font-bold text-[15px] flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-xl outline-none"
              >
                {isLoading ? 'Decrypting Access...' : <>Request TOTP Auth <ArrowRight size={18} /></>}
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              onSubmit={verifyTOTP} className="flex flex-col items-center"
            >
              <div className="bg-[#FFFFFF] p-6 rounded-[40px] border border-[#EAEAEA] shadow-inner mb-8 relative group cursor-help">
                <QRCodeSVG value={otpauth} size={180} level="H" includeMargin />
                <div className="absolute inset-0 bg-white/70 backdrop-blur-md opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity rounded-[40px] p-4 text-center">
                  <Smartphone size={32} className="text-[#111111] mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#111111]">Authenticator Scan</p>
                </div>
              </div>

              <div className="text-center mb-8 px-4">
                <p className="text-[14px] font-bold text-[#111111] mb-1">Time-Based Token</p>
                <p className="text-[12px] text-[#888888] leading-relaxed">Enter the 6-digit code from your system security app.</p>
              </div>
              
              <input 
                type="text" placeholder="000000" maxLength="6" required value={totpCode} onChange={e => setTotpCode(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-[#F5F5F7] text-center text-[42px] tracking-[0.4em] font-serif font-bold py-6 rounded-3xl outline-none border-2 border-transparent focus:border-[#111111] transition-all mb-6" 
              />
              
              {error && (
                <div className="w-full flex items-center gap-2 text-[#FF3B30] text-xs font-bold bg-[#FF3B30]/10 p-4 rounded-xl mb-6 text-center justify-center">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <button 
                disabled={isLoading}
                className="w-full bg-[#1E6FEA] text-white py-5 rounded-full font-bold text-[15px] flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-pill outline-none"
              >
                {isLoading ? 'Verifying Identity...' : <>Authorize Portal <CheckCircle2 size={18} /></>}
              </button>

              <button 
                type="button" onClick={() => setStep(1)} 
                className="mt-6 text-[13px] font-bold text-[#888888] hover:text-[#111111] transition-colors outline-none"
              >
                Return to Credentials
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}