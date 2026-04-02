import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as otplib from 'otplib';

// Core Firebase Authentication Modules
import { auth, googleProvider, appleProvider } from '../../../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  signInWithPopup,
  signOut
} from 'firebase/auth';

// --- SECTION 1: Animated CSS Gradient Engine (Strict Custom Palette & Dark Theme) ---
const AnimatedEditorialBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden bg-[#0C1016]">
    {/* Cinematic Gradient Loop with Deep Blur & Exact Requested Colors */}
    <motion.div 
      className="absolute -top-[30%] -left-[10%] w-[80%] h-[90%] rounded-full blur-[140px] opacity-60"
      style={{ background: 'radial-gradient(circle, #1E6FEA 0%, #1B3A67 60%, transparent 100%)' }}
      animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div 
      className="absolute -bottom-[20%] -right-[10%] w-[90%] h-[90%] rounded-full blur-[150px] opacity-50"
      style={{ background: 'radial-gradient(circle, #4290F3 0%, #212830 60%, transparent 100%)' }}
      animate={{ x: [0, -50, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div 
      className="absolute top-[20%] left-[30%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-40"
      style={{ background: 'radial-gradient(circle, #D5D6D0 0%, #0D1116 60%, transparent 100%)' }}
      animate={{ x: [0, 30, 0], y: [0, -40, 0], scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
      transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

// High-End Precision SVG Icons for Buttons & Inputs (White for Dark Mode)
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25C22.56 11.47 22.49 10.73 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.8 15.7 17.59V20.34H19.26C21.35 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
    <path d="M12 23C14.97 23 17.46 22.02 19.26 20.34L15.7 17.59C14.73 18.24 13.48 18.64 12 18.64C9.13 18.64 6.7 16.7 5.82 14.11H2.15V16.96C3.96 20.55 7.69 23 12 23Z" fill="#34A853"/>
    <path d="M5.82 14.11C5.59 13.44 5.46 12.73 5.46 12C5.46 11.27 5.59 10.56 5.82 9.89V7.04H2.15C1.41 8.52 1 10.21 1 12C1 13.79 1.41 15.48 2.15 16.96L5.82 14.11Z" fill="#FBBC05"/>
    <path d="M12 5.36C13.62 5.36 15.07 5.92 16.21 7.01L19.34 3.88C17.46 2.12 14.97 1 12 1C7.69 1 3.96 3.45 2.15 7.04L5.82 9.89C6.7 7.3 9.13 5.36 12 5.36Z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.423 9.5891C16.4025 7.10659 18.4419 5.8856 18.5342 5.82915C17.3769 4.1407 15.5458 3.87399 14.9332 3.84835C13.421 3.69447 11.9549 4.73587 11.1852 4.73587C10.4052 4.73587 9.20015 3.86373 7.9489 3.88425C6.33325 3.90476 4.8304 4.82285 4.00462 6.25896C2.31202 9.20812 3.56864 13.5831 5.22533 15.9681C6.03572 17.1323 6.98459 18.4351 8.23608 18.3838C9.44654 18.3325 9.91328 17.6042 11.3648 17.6042C12.8164 17.6042 13.2369 18.3838 14.509 18.3633C15.8118 18.3325 16.6324 17.1733 17.4326 16.0092C18.3558 14.6705 18.7354 13.3524 18.7559 13.2805C18.7149 13.2652 16.4435 12.4137 16.423 9.5891Z" fill="#FFFFFF"/>
    <path d="M14.0754 2.50294C14.7473 1.69255 15.1987 0.56417 15.0756 -0.502686C14.1524 0.0358581 12.9625 0.615438 12.2598 1.45659C11.6341 2.20543 11.0853 3.36458 11.2392 4.49295C12.2752 4.57502 13.3729 3.96467 14.0754 2.50294Z" fill="#FFFFFF"/>
  </svg>
);

const EyeIcon = ({ closed }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {closed ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

const BackArrow = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const PagoraLogo = () => (
  <div className="flex flex-col items-center">
    <div className="flex items-end gap-1 mb-4">
      <div className="w-10 h-5 bg-white rounded-sm"></div>
      <div className="w-16 h-8 bg-white rounded-sm relative bottom-2"></div>
      <div className="w-5 h-16 bg-white rounded-sm"></div>
    </div>
    <h1 className="text-[54px] font-serif font-black tracking-tighter text-white leading-none mb-1">Pagora</h1>
    <br></br>
    <p className="text-[12px] font-sans font-bold tracking-[0.2em] text-white/70 uppercase">By PB Books</p>
  </div>
);

export default function AdminLogin({ onAuthSuccess }) {
  // --- UI Router State: 'login', 'signup', 'reset', 'otp' ---
  const [view, setView] = useState('login'); 
  
  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Split OTP State
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const secret = import.meta.env.VITE_ADMIN_TOTP_SECRET || 'PAGORASECRET12345';

  // --- SECTION 2: Master Authentication Logic ---

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true); setError(''); setMessage('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setView('otp');
    } catch (err) {
      setError('Invalid credentials or unauthorized access.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true); setError(''); setMessage('');
    
    // Strict Database Protection
    if (email !== 'testcodecfg@gmail.com') {
      setError('System identity violation. Only the master admin can initialize this portal.');
      setIsLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage('Master account initialized. Please sign in.');
      setTimeout(() => setView('login'), 2000);
    } catch (err) {
      setError('Registration failed. Account may already exist.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setIsLoading(true); setError(''); setMessage('');
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Recovery link securely dispatched to your inbox.');
      setTimeout(() => setView('login'), 3000);
    } catch (err) {
      setError('Failed to dispatch recovery link. Verify email.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- SECTION 3: Real Social SSO Handlers with Strict Blockade ---
  const handleGoogleSSO = async () => {
    setIsLoading(true); setError(''); setMessage('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email !== 'testcodecfg@gmail.com') {
        await signOut(auth); // Instantly destroy the unauthorized session
        setError('Unauthorized Identity. Corporate SSO strictly limited to master admin.');
        setIsLoading(false);
        return;
      }
      setView('otp');
    } catch (err) {
      setError('Google SSO Handshake failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSSO = async () => {
    setIsLoading(true); setError(''); setMessage('');
    try {
      const result = await signInWithPopup(auth, appleProvider);
      if (result.user.email !== 'testcodecfg@gmail.com') {
        await signOut(auth); // Instantly destroy the unauthorized session
        setError('Unauthorized Identity. Corporate SSO strictly limited to master admin.');
        setIsLoading(false);
        return;
      }
      setView('otp');
    } catch (err) {
      setError('Apple SSO Handshake failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- SECTION 4: TOTP & Split Input Logic ---
  const verifyTOTP = (e) => {
    e.preventDefault();
    setIsLoading(true); setError('');
    const code = otpValues.join('');
    
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code.');
      setIsLoading(false);
      return;
    }

    try {
      const isValid = otplib.authenticator.check(code, secret);
      if (isValid) {
        onAuthSuccess();
      } else {
        setError('Invalid or expired authenticator code.');
      }
    } catch (err) {
      setError('Synchronization Error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);
    
    if (value !== '' && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const renderSocialButtons = () => (
    <>
      <div className="flex items-center justify-between my-6 w-full">
        <div className="h-[1px] bg-white/20 flex-1"></div>
        <span className="text-[11px] font-bold text-white/50 px-4 uppercase tracking-widest whitespace-nowrap">OR</span>
        <div className="h-[1px] bg-white/20 flex-1"></div>
      </div>
      <div className="space-y-3 w-full">
        <button type="button" onClick={handleGoogleSSO} disabled={isLoading} className="w-full bg-[#1e1e1e] hover:bg-[#252525] border border-white/10 text-white py-4 rounded-full font-bold text-[14px] flex items-center justify-center gap-3 transition-colors outline-none disabled:opacity-50 shadow-sm">
          <GoogleIcon /> Continue with Google
        </button>
        <button type="button" onClick={handleAppleSSO} disabled={isLoading} className="w-full bg-[#1e1e1e] hover:bg-[#252525] border border-white/10 text-white py-4 rounded-full font-bold text-[14px] flex items-center justify-center gap-3 transition-colors outline-none disabled:opacity-50 shadow-sm">
          <AppleIcon /> Continue with Apple
        </button>
      </div>
    </>
  );

  return (
    /* PERMANENT CUTOFF FIX: min-h-screen with flex-col allows internal centering via my-auto, but scrolls natively if content is too tall */
    <div className="min-h-screen w-full flex flex-col p-4 sm:p-8 relative overflow-x-hidden bg-[#0C1016]">
      <AnimatedEditorialBackground />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        /* STRICT DARK MODE: bg-[#2d2d2d] with light transparency for the blur */
        className="w-full max-w-6xl mx-auto my-auto bg-[#2d2d2d]/90 backdrop-blur-2xl rounded-[40px] shadow-[0_32px_80px_rgba(0,0,0,0.8)] border border-white/10 relative z-10 flex flex-col lg:flex-row overflow-hidden"
      >
        {/* --- DESKTOP WIDE LEFT PANE --- */}
        <div className="hidden lg:flex flex-col w-5/12 bg-black/20 border-r border-white/5 p-12 relative overflow-hidden min-w-[400px]">
          <div className="flex-1 flex flex-col items-center justify-center relative z-10 py-12">
            <PagoraLogo />
          </div>
          <div className="relative z-10 text-center">
            <p className="text-[11px] font-sans font-bold tracking-[0.2em] text-white/50 uppercase">Secure Enterprise Portal</p>
          </div>
        </div>

        {/* --- INTERACTIVE RIGHT PANE --- */}
        <div className="w-full lg:w-7/12 p-6 sm:p-12 md:p-16 flex flex-col justify-center relative bg-transparent min-w-0">
          <AnimatePresence mode="wait">
            
            {/* --- VIEW: SIGN IN --- */}
            {view === 'login' && (
              <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col h-full flex-1 w-full max-w-full box-border">
                <div className="text-center mb-8 lg:text-left">
                  {/* Matching Bookbee Image Font (font-serif) */}
                  <h1 className="font-serif text-[32px] md:text-[36px] font-bold tracking-tight text-white mb-2">Welcome back</h1>
                  <p className="text-[14px] text-white/70 leading-relaxed">Access the Pagora editorial dashboard and manage your ecosystem.</p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-5 flex-1 w-full">
                  <div>
                    <label className="text-[13px] font-bold text-white mb-2 block ml-1">Email</label>
                    <input type="email" placeholder="Enter your email" required value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full bg-[#1e1e1e] px-6 py-4 rounded-full outline-none text-[14px] text-white placeholder-white/40 border border-white/10 focus:border-[#4290F3] focus:bg-[#252525] transition-all box-border shadow-inner" />
                  </div>
                  <div>
                    <label className="text-[13px] font-bold text-white mb-2 block ml-1">Password</label>
                    <div className="relative w-full">
                      <input type={showPassword ? "text" : "password"} placeholder="Enter your password" required value={password} onChange={e => setPassword(e.target.value)}
                        className="w-full bg-[#1e1e1e] px-6 py-4 rounded-full outline-none text-[14px] text-white placeholder-white/40 border border-white/10 focus:border-[#4290F3] focus:bg-[#252525] transition-all box-border shadow-inner" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 outline-none">
                        <EyeIcon closed={!showPassword} />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center px-2 pt-1 pb-2">
                    <label className="flex items-center gap-2 text-[13px] font-bold text-white cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded text-[#4290F3] focus:ring-[#4290F3] border-white/20 accent-[#4290F3] cursor-pointer bg-[#1e1e1e]" defaultChecked />
                      Remember me
                    </label>
                    <button type="button" onClick={() => setView('reset')} className="text-[13px] font-bold text-[#FF3B30] hover:text-[#FF6B60] transition-colors outline-none">
                      Forgot password?
                    </button>
                  </div>

                  {(error || message) && (
                    <div className={`text-[13px] font-bold text-center px-4 ${error ? 'text-[#FF3B30]' : 'text-[#4290F3]'}`}>
                      {error || message}
                    </div>
                  )}

                  <button disabled={isLoading} className="w-full bg-[#1E6FEA] hover:bg-[#4290F3] text-white py-4 rounded-full font-bold text-[15px] transition-colors outline-none mt-2 shadow-[0_8px_24px_rgba(30,111,234,0.4)] active:scale-[0.98] box-border border border-transparent">
                    {isLoading ? 'Authenticating...' : 'Sign in'}
                  </button>
                </form>

                <div className="w-full">
                  {renderSocialButtons()}
                </div>

                <div className="text-center mt-8 w-full">
                  <p className="text-[13px] text-white/70">Don't have an account? <button onClick={() => setView('signup')} className="font-bold text-white outline-none hover:underline">Sign up</button></p>
                </div>
              </motion.div>
            )}

            {/* --- VIEW: SIGN UP --- */}
            {view === 'signup' && (
              <motion.div key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full flex-1 w-full max-w-full box-border">
                <div className="text-center mb-8 lg:text-left">
                  <h1 className="font-serif text-[32px] md:text-[36px] font-bold tracking-tight text-white mb-2">Sign up Account</h1>
                  <p className="text-[14px] text-white/70 leading-relaxed">Initialize the master architecture for a smarter publishing experience.</p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4 flex-1 w-full">
                  <div>
                    <label className="text-[13px] font-bold text-white mb-2 block ml-1">Name</label>
                    <input type="text" placeholder="Enter your name" required value={name} onChange={e => setName(e.target.value)}
                      className="w-full bg-[#1e1e1e] px-6 py-4 rounded-full outline-none text-[14px] text-white placeholder-white/40 border border-white/10 focus:border-[#4290F3] focus:bg-[#252525] transition-all box-border shadow-inner" />
                  </div>
                  <div>
                    <label className="text-[13px] font-bold text-white mb-2 block ml-1">Email</label>
                    <input type="email" placeholder="Enter your email" required value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full bg-[#1e1e1e] px-6 py-4 rounded-full outline-none text-[14px] text-white placeholder-white/40 border border-white/10 focus:border-[#4290F3] focus:bg-[#252525] transition-all box-border shadow-inner" />
                  </div>
                  <div>
                    <label className="text-[13px] font-bold text-white mb-2 block ml-1">Password</label>
                    <div className="relative w-full">
                      <input type={showPassword ? "text" : "password"} placeholder="Enter your password" required value={password} onChange={e => setPassword(e.target.value)}
                        className="w-full bg-[#1e1e1e] px-6 py-4 rounded-full outline-none text-[14px] text-white placeholder-white/40 border border-white/10 focus:border-[#4290F3] focus:bg-[#252525] transition-all box-border shadow-inner" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 outline-none">
                        <EyeIcon closed={!showPassword} />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center px-2 pt-1 pb-1">
                    <label className="flex items-center gap-2 text-[13px] font-bold text-white cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded text-[#4290F3] focus:ring-[#4290F3] border-white/20 accent-[#4290F3] cursor-pointer bg-[#1e1e1e]" defaultChecked />
                      Remember me
                    </label>
                  </div>

                  {(error || message) && (
                    <div className={`text-[13px] font-bold text-center px-4 ${error ? 'text-[#FF3B30]' : 'text-[#4290F3]'}`}>
                      {error || message}
                    </div>
                  )}

                  <button disabled={isLoading} className="w-full bg-[#1E6FEA] hover:bg-[#4290F3] text-white py-4 rounded-full font-bold text-[15px] transition-colors outline-none mt-2 shadow-[0_8px_24px_rgba(30,111,234,0.4)] active:scale-[0.98] box-border border border-transparent">
                    {isLoading ? 'Processing...' : 'Sign up'}
                  </button>
                </form>

                <div className="w-full">
                  {renderSocialButtons()}
                </div>

                <div className="text-center mt-6 w-full">
                  <p className="text-[13px] text-white/70">Already have an account? <button onClick={() => setView('login')} className="font-bold text-white outline-none hover:underline">Sign in</button></p>
                </div>
              </motion.div>
            )}

            {/* --- VIEW: PASSWORD RESET --- */}
            {view === 'reset' && (
              <motion.div key="reset" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col h-full flex-1 justify-center relative pt-12 w-full max-w-full box-border">
                <button onClick={() => setView('login')} className="absolute top-0 left-0 w-10 h-10 bg-[#1e1e1e] rounded-full flex items-center justify-center hover:bg-[#252525] border border-white/10 transition-colors outline-none shadow-sm">
                  <BackArrow />
                </button>
                
                <div className="text-center mb-10">
                  <h1 className="font-serif text-[32px] md:text-[36px] font-bold tracking-tight text-white mb-4">Reset Password</h1>
                  <p className="text-[14px] text-white/70 leading-relaxed">Enter your master administrative email to receive a secure recovery payload.</p>
                </div>

                <form onSubmit={handlePasswordReset} className="space-y-6 w-full">
                  <div>
                    <input type="email" placeholder="Enter your email" required value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full bg-[#1e1e1e] px-6 py-5 rounded-full outline-none text-[15px] text-white placeholder-white/40 border border-white/10 focus:border-[#4290F3] focus:bg-[#252525] text-center transition-colors box-border shadow-inner" />
                  </div>

                  {(error || message) && (
                    <div className={`text-[13px] font-bold text-center px-4 ${error ? 'text-[#FF3B30]' : 'text-[#4290F3]'}`}>
                      {error || message}
                    </div>
                  )}

                  <button disabled={isLoading} className="w-full bg-[#1E6FEA] hover:bg-[#4290F3] text-white py-4 rounded-full font-bold text-[15px] transition-colors outline-none shadow-[0_8px_24px_rgba(30,111,234,0.4)] active:scale-[0.98] box-border border border-transparent">
                    {isLoading ? 'Dispatching...' : 'Send Recovery Link'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* --- VIEW: SPLIT OTP --- */}
            {view === 'otp' && (
              <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full flex-1 relative pt-12 w-full max-w-full box-border">
                <button onClick={() => { setView('login'); setOtpValues(['','','','','','']); }} className="absolute top-0 left-0 w-10 h-10 bg-[#1e1e1e] rounded-full flex items-center justify-center hover:bg-[#252525] border border-white/10 transition-colors outline-none shadow-sm">
                  <BackArrow />
                </button>

                <div className="text-center mb-10 md:text-left md:mt-4">
                  <h1 className="font-serif text-[32px] md:text-[36px] font-bold tracking-tight text-white mb-4">Enter OTP Code</h1>
                  <p className="text-[14px] text-white/70 leading-relaxed">
                    Check your Authenticator App. We require a time-based verification code. Enter the 6-digit code below to verify your session.
                  </p>
                </div>

                <form onSubmit={verifyTOTP} className="flex flex-col flex-1 w-full">
                  <div className="flex justify-between gap-2 sm:gap-3 w-full mb-10 max-w-md mx-auto">
                    {otpValues.map((val, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={val}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-[15%] aspect-square max-w-[60px] bg-[#1e1e1e] rounded-full text-center text-[24px] font-bold text-white outline-none border border-white/10 focus:border-[#4290F3] focus:bg-[#252525] transition-all shadow-inner box-border"
                      />
                    ))}
                  </div>
                  
                  {error && (
                    <div className="text-[#FF3B30] text-[13px] font-bold text-center mb-6">
                      {error}
                    </div>
                  )}

                  <button disabled={isLoading} className="w-full bg-[#1E6FEA] hover:bg-[#4290F3] text-white py-4 rounded-full font-bold text-[15px] transition-colors outline-none shadow-[0_8px_24px_rgba(30,111,234,0.4)] active:scale-[0.98] box-border border border-transparent">
                    {isLoading ? 'Verifying...' : 'Continue'}
                  </button>

                  <div className="text-center mt-8 w-full">
                    <p className="text-[13px] text-white/70">Didn't get OTP? <button type="button" onClick={() => setOtpValues(['','','','','',''])} className="font-bold text-white hover:underline outline-none">Resend OTP</button></p>
                  </div>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}