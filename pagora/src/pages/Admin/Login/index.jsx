import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowRight, Smartphone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import * as otplib from 'otplib';

// Corrected relative paths for backend consistency
import { auth, db } from '../../../firebase';
import { pb } from '../../../pocketbase';

// High-End SVG Background Illustration (Floating Quill & Abstract Ink)
const LoginBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#FFFFFF]">
    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[50%] bg-gradient-to-bl from-[#F8FAFC] to-transparent rounded-full blur-[100px] opacity-60"></div>
    <div className="absolute bottom-[-10%] left-[-10%] w-[70%] h-[60%] bg-gradient-to-tr from-[#F1F5F9] to-transparent rounded-full blur-[120px] opacity-70"></div>
    
    <svg className="absolute w-full h-full opacity-[0.04]" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Topographic Editorial Lines */}
      <motion.path 
        d="M0 200C200 150 400 250 800 200V800H0V200Z" 
        fill="#111111" 
        animate={{ d: ["M0 200C200 150 400 250 800 200V800H0V200Z", "M0 220C250 100 450 300 800 220V800H0V220Z", "M0 200C200 150 400 250 800 200V800H0V200Z"] }}
        transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
      />
      {/* Abstract Quill Pen Illustration - Corrected Syntax */}
      <motion.g 
        initial={{ rotate: -15, y: 100 }}
        animate={{ y: [0, -20, 0], rotate: [-15, -12, -15] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      >
        <path d="M600 100 L550 300 L580 320 L650 120 Z" fill="#111111" />
        <path d="M550 300 L530 350 L580 320 Z" fill="#1E6FEA" />
      </motion.g>
    </svg>
  </div>
);

export default function AdminLogin({ onAuthSuccess }) {
  const [step, setStep] = useState(1); // 1: System Credentials, 2: TOTP Verification
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Secure TOTP Configuration (Strictly Time-Based)
  const secret = import.meta.env.VITE_ADMIN_TOTP_SECRET || 'PAGORASECRET12345';
  const otpauth = `otpauth://totp/PagoraAdmin:admin@pagora.ai?secret=${secret}&issuer=Pagora`;

  const handleInitialAuth = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate high-security system credential check
    setTimeout(() => {
      if (email === 'admin@pagora.ai' && password === 'Pagora@2026') {
        setStep(2);
      } else {
        setError('Unauthorized System Identity or Key Phrase.');
      }
      setIsLoading(false);
    }, 800);
  };

  const verifyTOTP = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const isValid = otplib.authenticator.check(totpCode, secret);
      if (isValid) {
        onAuthSuccess();
      } else {
        setError('Invalid or expired time-based verification code.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('System Clock Synchronization Error.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-6 z-[9999]">
      <LoginBackground />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[40px] p-10 sm:p-12 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.12)] border border-[#EAEAEA] relative z-10"
      >
        <header className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-[#111111] rounded-2xl flex items-center justify-center mb-6 shadow-xl">
            <Shield className="text-white" size={32} strokeWidth={2.5} />
          </div>
          <h1 className="font-serif text-[42px] leading-[1.05] tracking-tighter font-bold text-[#111111] text-center mb-2">Internal Access</h1>
          <p className="text-[13px] font-sans font-semibold text-[#888888] tracking-widest uppercase text-center">System Gateway Layer {step}</p>
        </header>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form 
              key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              onSubmit={handleInitialAuth} className="space-y-5"
            >
              <div>
                <label className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#888888] mb-2 block ml-1">System Identifier</label>
                <input 
                  type="email" placeholder="admin@pagora.ai" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#F5F5F7] px-6 py-5 rounded-2xl outline-none font-medium text-[#111111] focus:ring-2 ring-[#111111] transition-all" 
                />
              </div>
              <div>
                <label className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#888888] mb-2 block ml-1">Security Key Phrase</label>
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
                {isLoading ? 'Decrypting...' : <>Request TOTP Code <ArrowRight size={18} /></>}
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              onSubmit={verifyTOTP} className="flex flex-col items-center"
            >
              <div className="bg-[#FFFFFF] p-6 rounded-[32px] border border-[#EAEAEA] shadow-inner mb-8 relative group">
                <QRCodeSVG value={otpauth} size={180} level="H" includeMargin />
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-[32px] cursor-help">
                  <Smartphone size={40} className="text-[#111111]" />
                </div>
              </div>

              <div className="text-center mb-8">
                <p className="text-[14px] font-bold text-[#111111] mb-1">Rolling Token Required</p>
                <p className="text-[12px] text-[#888888]">Synchronize with your authenticator app.</p>
              </div>
              
              <input 
                type="text" placeholder="000000" maxLength="6" required value={totpCode} onChange={e => setTotpCode(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-[#F5F5F7] text-center text-[42px] tracking-[0.4em] font-serif font-bold py-6 rounded-2xl outline-none border-2 border-transparent focus:border-[#111111] transition-all mb-6" 
              />
              
              {error && (
                <div className="w-full flex items-center gap-2 text-[#FF3B30] text-xs font-bold bg-[#FF3B30]/10 p-4 rounded-xl mb-6 text-center justify-center">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <button 
                disabled={isLoading}
                className="w-full bg-[#1E6FEA] text-white py-5 rounded-full font-bold text-[15px] flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_12px_24px_-8px_rgba(30,111,234,0.4)] outline-none"
              >
                {isLoading ? 'Verifying Identity...' : <>Authorize & Initialize <CheckCircle2 size={18} /></>}
              </button>

              <button 
                type="button" onClick={() => setStep(1)} 
                className="mt-6 text-[13px] font-bold text-[#888888] hover:text-[#111111] transition-colors outline-none"
              >
                Back to Credentials
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}