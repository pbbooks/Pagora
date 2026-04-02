import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import * as otplib from 'otplib';

// Corrected relative paths for backend consistency
import { auth } from '../../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

// --- SECTION 1: Cinematic Page Background Illustration (No SVG Icons) ---
const LoginBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden bg-[#0a0a0a]">
    {/* High-end cinematic library background replacing SVG icons */}
    <motion.div 
      className="absolute inset-0 bg-cover bg-center grayscale-[0.85] opacity-40 mix-blend-luminosity"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-[#000000] opacity-80"></div>
  </div>
);

// --- SECTION 2: CSS-Based Pagora Geometric Logo (Matching the "EXC" image style) ---
const PagoraLogo = () => (
  <div className="flex flex-col items-center">
    {/* Pure CSS Geometric Books/Blocks instead of SVG */}
    <div className="flex items-end gap-1 mb-3">
      <div className="w-8 h-4 bg-[#111111] rounded-sm"></div>
      <div className="w-12 h-6 bg-[#111111] rounded-sm relative bottom-2"></div>
      <div className="w-4 h-12 bg-[#111111] rounded-sm"></div>
    </div>
    <h1 className="text-[42px] font-sans font-black tracking-tighter text-[#111111] leading-none mb-1">Pagora</h1>
    <p className="text-[10px] font-sans font-bold tracking-[0.2em] text-[#666666] uppercase">Publishing Engine</p>
  </div>
);

export default function AdminLogin({ onAuthSuccess }) {
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Time-Based Security Configuration (Real logic using otplib)
  const secret = import.meta.env.VITE_ADMIN_TOTP_SECRET || 'PAGORASECRET12345';
  const otpauth = `otpauth://totp/PagoraAdmin:testcodecfg@gmail.com?secret=${secret}&issuer=Pagora`;

  // --- SECTION 3 LOGIC: Strict Firebase Identity Check ---
  const handleInitialAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Strict Hardcoded System Identity Block
    if (email !== 'testcodecfg@gmail.com') {
      setError('Unauthorized Identity. Access restricted.');
      setIsLoading(false);
      return;
    }

    try {
      // Real Firebase Authentication Verification
      await signInWithEmailAndPassword(auth, email, password);
      setStep(2); // Move to 2FA state
    } catch (err) {
      setError('Invalid Security Key.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- SECTION 4 LOGIC: Time-Based One Time Password (TOTP) Verification ---
  const verifyTOTP = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Real OTPLIB token verification against the server secret
      const isValid = otplib.authenticator.check(totpCode, secret);
      if (isValid) {
        onAuthSuccess(); // Grants access to the Dashboard
      } else {
        setError('Invalid or expired time-based token.');
      }
    } catch (err) {
      setError('Internal Synchronization Error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 md:p-10 z-[9999] overflow-y-auto">
      <LoginBackground />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-xl shadow-[0_32px_80px_-16px_rgba(0,0,0,0.5)] relative z-10 overflow-hidden min-h-[500px]"
      >
        
        {/* LEFT PANE: Branding exactly matching the image layout */}
        <div className="hidden md:flex flex-col w-5/12 bg-white border-r border-[#E5E7EB] relative">
          <div className="flex-1 flex flex-col items-center justify-center p-12">
            <PagoraLogo />
          </div>
          
          {/* Footer matching "Content Management System" */}
          <div className="w-full border-t border-[#E5E7EB] py-4 px-6">
            <p className="text-[11px] font-sans font-bold tracking-wide text-[#666666]">Content Management System</p>
          </div>
        </div>

        {/* RIGHT PANE: Interactive Authentication Forms matching the image layout */}
        <div className="w-full md:w-7/12 p-10 md:p-14 flex flex-col justify-center bg-white relative">
          
          <AnimatePresence mode="wait">
            {step === 1 ? (
              /* --- Step 1: Firebase Identity Form --- */
              <motion.form 
                key="step1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                onSubmit={handleInitialAuth} className="space-y-5"
              >
                <div>
                  <label className="text-[13px] font-bold text-[#333333] mb-2 block">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px] text-[#999999] opacity-80">✉</span>
                    <input 
                      type="email" placeholder="Enter your email" required value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full bg-white px-10 py-3 rounded-md outline-none text-[14px] text-[#333333] border border-[#D1D5DB] focus:border-[#6B7280] transition-colors" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[13px] font-bold text-[#333333] mb-2 block">Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-[45%] text-[16px] text-[#999999] opacity-80" style={{ transform: 'translateY(-50%) rotate(45deg)' }}>⚿</span>
                    <input 
                      type={showPassword ? "text" : "password"} placeholder="Enter your password" required value={password} onChange={e => setPassword(e.target.value)}
                      className="w-full bg-white px-10 py-3 rounded-md outline-none text-[14px] text-[#333333] border border-[#D1D5DB] focus:border-[#6B7280] transition-colors" 
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-1 pb-2">
                  <label className="flex items-center gap-2 text-[12px] font-bold text-[#666666] cursor-pointer">
                    <input type="checkbox" className="rounded-sm border-[#D1D5DB] text-[#9CA3AF] focus:ring-0 w-3.5 h-3.5 cursor-pointer" />
                    Remember me
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[12px] font-bold text-[#333333] hover:text-[#000000] transition-colors"
                  >
                    Show Password
                  </button>
                </div>

                {error && (
                  <div className="text-[#FF3B30] text-[12px] font-bold text-center">
                    {error}
                  </div>
                )}
                
                <button 
                  disabled={isLoading}
                  className="w-full bg-[#9CA3AF] hover:bg-[#6B7280] text-white py-3.5 rounded-md font-bold text-[13px] flex items-center justify-center gap-2 transition-colors outline-none"
                >
                  {isLoading ? 'Authenticating...' : <>Login to my account <span className="text-[16px] leading-none mb-[2px]">→</span></>}
                </button>

                <div className="pt-3">
                  <button type="button" className="text-[12px] text-[#888888] font-medium hover:text-[#333333] transition-colors">
                    Forgot your password?
                  </button>
                </div>
              </motion.form>
            ) : (
              /* --- Step 2: TOTP 2FA Verification Form --- */
              <motion.form 
                key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                onSubmit={verifyTOTP} className="flex flex-col w-full h-full justify-center"
              >
                <div className="flex justify-center mb-6">
                  <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-sm">
                    <QRCodeSVG value={otpauth} size={140} level="H" includeMargin className="rounded-lg" />
                  </div>
                </div>

                <div className="text-center mb-6">
                  <label className="text-[13px] font-bold text-[#333333] mb-2 block">Authenticator Code</label>
                  <input 
                    type="text" placeholder="000000" maxLength="6" required value={totpCode} onChange={e => setTotpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-white text-center text-[28px] tracking-[0.5em] font-mono font-bold py-3 rounded-md outline-none border border-[#D1D5DB] focus:border-[#6B7280] transition-colors" 
                  />
                </div>
                
                {error && (
                  <div className="text-[#FF3B30] text-[12px] font-bold text-center mb-4">
                    {error}
                  </div>
                )}

                <button 
                  disabled={isLoading}
                  className="w-full bg-[#9CA3AF] hover:bg-[#6B7280] text-white py-3.5 rounded-md font-bold text-[13px] flex items-center justify-center gap-2 transition-colors outline-none mb-4"
                >
                  {isLoading ? 'Verifying Identity...' : <>Authorize Portal <span className="text-[16px] leading-none mb-[2px]">→</span></>}
                </button>

                <div className="text-center">
                  <button 
                    type="button" onClick={() => { setStep(1); setError(''); setTotpCode(''); setPassword(''); }} 
                    className="text-[12px] text-[#888888] font-medium hover:text-[#333333] transition-colors"
                  >
                    Cancel & Return
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}