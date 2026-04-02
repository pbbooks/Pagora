import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authenticator } from '@otplib/preset-browser';
import emailjs from '@emailjs/browser';
import { QRCodeSVG } from 'qrcode.react';

// Core Firebase Authentication Modules
import { auth, googleProvider, appleProvider } from '../../../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  signInWithPopup,
  signOut
} from 'firebase/auth';

// --- SECTION 1: High-End Custom Assets & Illustrations ---

// Centered 3D Animated Orbital Illustration (Strict Palette)
const HighEndIllustration = () => (
  <div className="fixed inset-0 w-full h-full flex items-center justify-center pointer-events-none z-0 overflow-hidden">
    {/* Deep Glowing Cores */}
    <motion.div
      className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full blur-[100px] opacity-20"
      style={{ background: 'radial-gradient(circle, #1E6FEA 0%, #1B3A67 50%, transparent 100%)' }}
      animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full blur-[80px] opacity-15"
      style={{ background: 'radial-gradient(circle, #4290F3 0%, #0C1016 50%, transparent 100%)' }}
      animate={{ scale: [1.1, 1, 1.1], rotate: [0, -90, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
    />
    
    {/* Abstract 3D Orbital Rings */}
    <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] flex items-center justify-center opacity-30">
      <motion.div
        className="absolute w-[80%] h-[30%] rounded-[50%] border border-[#4290F3]/40"
        animate={{ rotateZ: 360, rotateX: [60, 75, 60] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{ transformStyle: 'preserve-3d' }}
      />
      <motion.div
        className="absolute w-[90%] h-[25%] rounded-[50%] border border-[#1E6FEA]/50"
        animate={{ rotateZ: -360, rotateY: [60, 80, 60] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ transformStyle: 'preserve-3d' }}
      />
      <motion.div
        className="absolute w-[100%] h-[20%] rounded-[50%] border border-[#D5D6D0]/20"
        animate={{ rotateZ: 360, rotateX: [-50, -70, -50] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      />
    </div>
  </div>
);

// High-End Precision SVG Icons for Buttons & Inputs
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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

export default function AdminLogin({ onAuthSuccess }) {
  // --- UI Router State: 'login', 'signup', 'reset', 'email-otp', 'otp' ---
  const [view, setView] = useState('login'); 
  
  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // OTP States
  const [emailOtpValues, setEmailOtpValues] = useState(['', '', '', '']); // 4-digit for Sign Up
  const [generatedEmailOtp, setGeneratedEmailOtp] = useState('');
  
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']); // 6-digit TOTP for Sign In
  // FIX: Base32 strictly requires characters A-Z and numbers 2-7. (No 0, 1, 8, 9).
  const secret = import.meta.env.VITE_ADMIN_TOTP_SECRET || 'PAGORASECRET234567';
  const otpauthUrl = `otpauth://totp/PagoraAdmin:${email || 'admin'}?secret=${secret}&issuer=Pagora`;

  // --- AUTHORIZED ADMIN LIST ---
  const ALLOWED_ADMINS = ['testcodecfg@gmail.com', 'auth.mv@outlook.com', 'auth.pagora@outlook.com'];

  // --- SECTION 2: Master Authentication Logic ---

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true); setError(''); setMessage('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setView('otp'); // Route strictly to 6-digit TOTP
    } catch (err) {
      setError('Invalid credentials or unauthorized access.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1 of Sign Up: Generate and Send 4-Digit Email OTP
  const handleSignUpInitiate = async (e) => {
    e.preventDefault();
    setIsLoading(true); setError(''); setMessage('');
    
    // Strict Database Protection
    if (!ALLOWED_ADMINS.includes(email.toLowerCase())) {
      setError('System identity violation. Only authorized master admins can initialize this portal.');
      setIsLoading(false);
      return;
    }

    try {
      const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedEmailOtp(newOtp);

      // EmailJS Dispatch
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

      await emailjs.send(
        serviceId,
        templateId,
        {
          to_email: email,
          to_name: name || 'Admin',
          otp_code: newOtp,
        },
        publicKey
      );

      setMessage('A 4-digit verification code has been sent to your email.');
      setView('email-otp');
    } catch (err) {
      console.error("EmailJS Error:", err);
      setError('Failed to dispatch verification email. Please verify EmailJS configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2 of Sign Up: Verify 4-Digit Email OTP and Create Account
  const verifyEmailOtpAndRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true); setError('');
    
    const code = emailOtpValues.join('');
    if (code.length !== 4) {
      setError('Please enter the complete 4-digit code.');
      setIsLoading(false);
      return;
    }

    if (code !== generatedEmailOtp && code !== '0000') { // '0000' as emergency fallback for testing
      setError('Invalid or incorrect email verification code.');
      setIsLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage('Master account initialized perfectly. Please sign in.');
      setTimeout(() => {
        setView('login');
        setEmailOtpValues(['', '', '', '']);
      }, 2000);
    } catch (err) {
      console.error("Firebase Auth Error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setMessage('Account already exists. Redirecting to login...');
        setTimeout(() => {
          setView('login');
          setEmailOtpValues(['', '', '', '']);
        }, 2000);
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use at least 12 characters.');
      } else {
        setError('Registration failed. Please try again.');
      }
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

  // --- SECTION 3: Real Social SSO Handlers with Strict Blockade & Error Tracing ---
  const handleGoogleSSO = async () => {
    setIsLoading(true); setError(''); setMessage('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (!ALLOWED_ADMINS.includes(result.user.email.toLowerCase())) {
        await signOut(auth);
        setError('Unauthorized Identity. Corporate SSO strictly limited to master admins.');
        setIsLoading(false);
        return;
      }
      setView('otp');
    } catch (err) {
      console.error("Google SSO Auth Error:", err);
      if (err.code === 'auth/unauthorized-domain') {
        setError('CRITICAL: Domain not authorized. Add pbpagoraweb.web.app in Firebase Console -> Auth -> Settings -> Authorized Domains.');
      } else {
        setError('Google SSO Handshake failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSSO = async () => {
    setIsLoading(true); setError(''); setMessage('');
    try {
      const result = await signInWithPopup(auth, appleProvider);
      if (!ALLOWED_ADMINS.includes(result.user.email.toLowerCase())) {
        await signOut(auth);
        setError('Unauthorized Identity. Corporate SSO strictly limited to master admins.');
        setIsLoading(false);
        return;
      }
      setView('otp');
    } catch (err) {
      console.error("Apple SSO Auth Error:", err);
      if (err.code === 'auth/unauthorized-domain') {
        setError('CRITICAL: Domain not authorized. Add pbpagoraweb.web.app in Firebase Console -> Auth -> Settings -> Authorized Domains.');
      } else {
        setError('Apple SSO Handshake failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- SECTION 4: TOTP & Split Input Logic ---
  
  // 6-Digit TOTP Handlers
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
      const isValid = authenticator.check(code, secret);
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
    if (value !== '' && index < 5) document.getElementById(`otp-${index + 1}`).focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) document.getElementById(`otp-${index - 1}`).focus();
  };

  // 4-Digit Email OTP Handlers
  const handleEmailOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...emailOtpValues];
    newOtp[index] = value;
    setEmailOtpValues(newOtp);
    if (value !== '' && index < 3) document.getElementById(`e-otp-${index + 1}`).focus();
  };

  const handleEmailOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !emailOtpValues[index] && index > 0) document.getElementById(`e-otp-${index - 1}`).focus();
  };

  const renderSocialButtons = () => (
    <>
      <div className="flex items-center justify-between my-8 w-full max-w-md mx-auto lg:mx-0">
        <div className="h-[1px] bg-white/10 flex-1"></div>
        <span className="text-[10px] font-bold text-white/40 px-4 uppercase tracking-[0.2em] whitespace-nowrap">OR</span>
        <div className="h-[1px] bg-white/10 flex-1"></div>
      </div>
      <div className="space-y-4 w-full max-w-md mx-auto lg:mx-0">
        <button type="button" onClick={handleGoogleSSO} disabled={isLoading} className="w-full bg-[#111111] hover:bg-[#1A1A1A] border border-[#222222] text-white py-4 sm:py-5 rounded-full font-bold text-[14px] flex items-center justify-center gap-3 transition-colors outline-none disabled:opacity-50 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          <GoogleIcon /> Continue with Google
        </button>
        <button type="button" onClick={handleAppleSSO} disabled={isLoading} className="w-full bg-[#111111] hover:bg-[#1A1A1A] border border-[#222222] text-white py-4 sm:py-5 rounded-full font-bold text-[14px] flex items-center justify-center gap-3 transition-colors outline-none disabled:opacity-50 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          <AppleIcon /> Continue with Apple
        </button>
      </div>
    </>
  );

  // Reusable Bottom Logo Component (Video + Typography)
  const BottomLogo = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-16 pt-8 border-t border-[#151515] flex items-center justify-center gap-5 w-full"
    >
      <div className="relative w-[52px] h-[52px] flex items-center justify-center rounded-xl overflow-hidden shadow-[0_0_20px_rgba(30,111,234,0.15)] border border-white/5 bg-[#050505]">
        {/* CSS Magic to make solid background transparent and isolate white animation */}
        <video 
          src="/logo.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute w-[140px] h-[140px] max-w-none object-cover scale-[2.0]"
          style={{ mixBlendMode: 'screen', filter: 'grayscale(100%) contrast(300%) brightness(1.5)' }}
        />
      </div>
      <div className="flex flex-col items-start">
        <h2 className="text-[32px] font-serif font-black tracking-tighter leading-none text-white">Pagora.</h2>
        <p className="text-[10px] font-sans font-bold tracking-[0.25em] text-[#1E6FEA] uppercase mt-1">By PB Books</p>
      </div>
    </motion.div>
  );

  return (
    /* PERMANENT CUTOFF FIX: Centered Flex Column. Natively scrolls if height exceeds viewport. */
    <div className="min-h-screen w-full flex flex-col items-center bg-[#050505] text-white relative overflow-x-hidden font-sans">
      <HighEndIllustration />

      <div className="flex-1 flex flex-col justify-center w-full px-6 py-12 relative z-20">
        <div className="w-full max-w-md mx-auto flex flex-col my-auto">
          <AnimatePresence mode="wait">
            
            {/* --- VIEW: SIGN IN --- */}
            {view === 'login' && (
              <motion.div key="login" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col w-full box-border">
                <div className="text-center mb-10">
                  <h1 className="font-serif text-[48px] sm:text-[56px] font-black tracking-tighter text-white leading-[1.05] mb-4">Welcome<br/>Back.</h1>
                  <p className="text-[15px] sm:text-[16px] text-[#888888] leading-relaxed font-medium">Access your editorial ecosystem and manage database architecture.</p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-4 sm:space-y-5 w-full">
                  <div className="relative w-full">
                    <input type="email" placeholder="Enter your email address" required value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full bg-[#111111] px-6 py-5 sm:py-6 rounded-full outline-none text-[15px] text-white placeholder-white/30 border border-[#222222] focus:border-[#1E6FEA] focus:bg-[#161616] transition-colors box-border" />
                  </div>
                  <div className="relative w-full">
                    <input type={showPassword ? "text" : "password"} placeholder="Enter your password" required value={password} onChange={e => setPassword(e.target.value)}
                      className="w-full bg-[#111111] px-6 py-5 sm:py-6 rounded-full outline-none text-[15px] text-white placeholder-white/30 border border-[#222222] focus:border-[#1E6FEA] focus:bg-[#161616] transition-colors box-border" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 outline-none opacity-50 hover:opacity-100 transition-opacity">
                      <EyeIcon closed={!showPassword} />
                    </button>
                  </div>

                  <div className="flex justify-between items-center px-3 pt-2 pb-2">
                    <label className="flex items-center gap-3 text-[13px] font-bold text-[#888888] cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded text-[#1E6FEA] focus:ring-[#1E6FEA] border-[#333333] accent-[#1E6FEA] cursor-pointer bg-[#111111]" defaultChecked />
                      Remember me
                    </label>
                    <button type="button" onClick={() => setView('reset')} className="text-[13px] font-bold text-white/50 hover:text-white transition-colors outline-none">
                      Forgot password?
                    </button>
                  </div>

                  {(error || message) && (
                    <div className={`text-[13px] font-bold text-center px-2 ${error ? 'text-[#FF3B30]' : 'text-[#1E6FEA]'}`}>
                      {error || message}
                    </div>
                  )}

                  <button disabled={isLoading} className="w-full bg-[#1E6FEA] hover:bg-[#1A5BCE] text-white py-5 sm:py-6 rounded-full font-bold text-[16px] transition-colors outline-none mt-4 active:scale-[0.98] box-border shadow-[0_8px_24px_rgba(30,111,234,0.3)]">
                    {isLoading ? 'Authenticating...' : 'Sign in'}
                  </button>
                </form>

                <div className="w-full">
                  {renderSocialButtons()}
                </div>

                <div className="text-center mt-10 w-full">
                  <p className="text-[15px] text-[#888888] font-medium">Don't have an account? <button onClick={() => setView('signup')} className="font-bold text-white outline-none hover:underline ml-1">Sign up</button></p>
                </div>
              </motion.div>
            )}

            {/* --- VIEW: SIGN UP (Initializes EmailJS) --- */}
            {view === 'signup' && (
              <motion.div key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col w-full max-w-full box-border">
                <div className="text-center mb-10">
                  <h1 className="font-serif text-[48px] sm:text-[56px] font-black tracking-tighter text-white leading-[1.05] mb-4">Sign Up.</h1>
                  <p className="text-[15px] sm:text-[16px] text-[#888888] leading-relaxed font-medium">Initialize the master architecture for a smarter publishing experience.</p>
                </div>

                <form onSubmit={handleSignUpInitiate} className="space-y-4 sm:space-y-5 w-full">
                  <div className="relative w-full">
                    <input type="text" placeholder="Enter your name" required value={name} onChange={e => setName(e.target.value)}
                      className="w-full bg-[#111111] px-6 py-5 sm:py-6 rounded-full outline-none text-[15px] text-white placeholder-white/30 border border-[#222222] focus:border-[#1E6FEA] focus:bg-[#161616] transition-colors box-border" />
                  </div>
                  <div className="relative w-full">
                    <input type="email" placeholder="Enter your email address" required value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full bg-[#111111] px-6 py-5 sm:py-6 rounded-full outline-none text-[15px] text-white placeholder-white/30 border border-[#222222] focus:border-[#1E6FEA] focus:bg-[#161616] transition-colors box-border" />
                  </div>
                  <div className="relative w-full">
                    <input type={showPassword ? "text" : "password"} placeholder="Enter your password" required value={password} onChange={e => setPassword(e.target.value)}
                      className="w-full bg-[#111111] px-6 py-5 sm:py-6 rounded-full outline-none text-[15px] text-white placeholder-white/30 border border-[#222222] focus:border-[#1E6FEA] focus:bg-[#161616] transition-colors box-border" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 outline-none opacity-50 hover:opacity-100 transition-opacity">
                      <EyeIcon closed={!showPassword} />
                    </button>
                  </div>

                  {(error || message) && (
                    <div className={`text-[13px] font-bold text-center px-2 ${error ? 'text-[#FF3B30]' : 'text-[#1E6FEA]'}`}>
                      {error || message}
                    </div>
                  )}

                  <button disabled={isLoading} className="w-full bg-[#1E6FEA] hover:bg-[#1A5BCE] text-white py-5 sm:py-6 rounded-full font-bold text-[16px] transition-colors outline-none mt-6 active:scale-[0.98] box-border shadow-[0_8px_24px_rgba(30,111,234,0.3)]">
                    {isLoading ? 'Processing...' : 'Create Account'}
                  </button>
                </form>

                <div className="w-full">
                  {renderSocialButtons()}
                </div>

                <div className="text-center mt-10 w-full">
                  <p className="text-[15px] text-[#888888] font-medium">Already have an account? <button onClick={() => setView('login')} className="font-bold text-white outline-none hover:underline ml-1">Sign in</button></p>
                </div>
              </motion.div>
            )}

            {/* --- VIEW: 4-DIGIT EMAIL OTP (Registration Finalization) --- */}
            {view === 'email-otp' && (
              <motion.div key="email-otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col w-full max-w-full box-border relative">
                <button onClick={() => { setView('signup'); setEmailOtpValues(['','','','']); }} className="absolute top-0 left-0 w-12 h-12 bg-[#111111] rounded-full flex items-center justify-center hover:bg-[#1A1A1A] border border-[#222222] transition-colors outline-none z-10">
                  <BackArrow />
                </button>

                <div className="text-center mb-12 pt-16 sm:pt-20">
                  <h1 className="font-serif text-[48px] sm:text-[56px] font-black tracking-tighter text-white leading-[1.05] mb-4">Verify<br/>Email.</h1>
                  <p className="text-[15px] sm:text-[16px] text-[#888888] leading-relaxed font-medium">
                    A secure 4-digit code has been dispatched to your inbox. Enter it below to finalize your master registration.
                  </p>
                </div>

                <form onSubmit={verifyEmailOtpAndRegister} className="flex flex-col flex-1 w-full max-w-md mx-auto">
                  <div className="flex justify-between gap-4 w-full mb-12 px-4">
                    {emailOtpValues.map((val, index) => (
                      <input
                        key={index}
                        id={`e-otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={val}
                        onChange={(e) => handleEmailOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleEmailOtpKeyDown(index, e)}
                        className="w-[20%] aspect-square max-w-[70px] bg-[#111111] rounded-full text-center text-[32px] font-bold text-white outline-none border border-[#222222] focus:border-[#1E6FEA] focus:bg-[#161616] transition-colors box-border"
                      />
                    ))}
                  </div>
                  
                  {error && (
                    <div className="text-[#FF3B30] text-[13px] font-bold text-center mb-6 px-2">
                      {error}
                    </div>
                  )}

                  <button disabled={isLoading} className="w-full bg-[#1E6FEA] hover:bg-[#1A5BCE] text-white py-6 rounded-full font-bold text-[16px] transition-colors outline-none active:scale-[0.98] box-border shadow-[0_8px_24px_rgba(30,111,234,0.3)]">
                    {isLoading ? 'Verifying...' : 'Finalize Registration'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* --- VIEW: PASSWORD RESET --- */}
            {view === 'reset' && (
              <motion.div key="reset" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col w-full max-w-full box-border relative">
                <button onClick={() => setView('login')} className="absolute top-0 left-0 w-12 h-12 bg-[#111111] rounded-full flex items-center justify-center hover:bg-[#1A1A1A] border border-[#222222] transition-colors outline-none z-10">
                  <BackArrow />
                </button>
                
                <div className="text-center mb-12 pt-16 sm:pt-20">
                  <h1 className="font-serif text-[48px] sm:text-[56px] font-black tracking-tighter text-white leading-[1.05] mb-4">Reset<br/>Access.</h1>
                  <p className="text-[15px] sm:text-[16px] text-[#888888] leading-relaxed font-medium">Enter your master administrative email to receive a secure recovery payload.</p>
                </div>

                <form onSubmit={handlePasswordReset} className="space-y-6 w-full max-w-md mx-auto">
                  <div className="relative w-full">
                    <input type="email" placeholder="Enter your email address" required value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full bg-[#111111] px-6 py-6 rounded-full outline-none text-[16px] text-white placeholder-white/30 border border-[#222222] focus:border-[#1E6FEA] focus:bg-[#161616] text-center transition-colors box-border" />
                  </div>

                  {(error || message) && (
                    <div className={`text-[13px] font-bold text-center px-2 ${error ? 'text-[#FF3B30]' : 'text-[#1E6FEA]'}`}>
                      {error || message}
                    </div>
                  )}

                  <button disabled={isLoading} className="w-full bg-[#1E6FEA] hover:bg-[#1A5BCE] text-white py-6 rounded-full font-bold text-[16px] transition-colors outline-none active:scale-[0.98] box-border shadow-[0_8px_24px_rgba(30,111,234,0.3)]">
                    {isLoading ? 'Dispatching...' : 'Send Recovery Link'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* --- VIEW: 6-DIGIT SPLIT TOTP (Sign-In Authorization) --- */}
            {view === 'otp' && (
              <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col w-full max-w-full box-border relative">
                <button onClick={() => { setView('login'); setOtpValues(['','','','','','']); }} className="absolute top-0 left-0 w-12 h-12 bg-[#111111] rounded-full flex items-center justify-center hover:bg-[#1A1A1A] border border-[#222222] transition-colors outline-none z-10">
                  <BackArrow />
                </button>

                <div className="text-center mb-8 pt-16">
                  <h1 className="font-serif text-[42px] sm:text-[52px] font-black tracking-tighter text-white leading-[1.05] mb-2">Authorize.</h1>
                  <p className="text-[14px] sm:text-[15px] text-[#888888] leading-relaxed font-medium">
                    Scan the QR code below with Google Authenticator, then enter the 6-digit code.
                  </p>
                </div>

                <div className="flex justify-center mb-10">
                  <div className="bg-white p-3 rounded-2xl shadow-[0_0_30px_rgba(30,111,234,0.3)]">
                    <QRCodeSVG value={otpauthUrl} size={160} level="H" includeMargin={false} />
                  </div>
                </div>

                <form onSubmit={verifyTOTP} className="flex flex-col flex-1 w-full max-w-md mx-auto">
                  <div className="flex justify-between gap-2 sm:gap-3 w-full mb-10">
                    {otpValues.map((val, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={val}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-[15%] aspect-square max-w-[56px] bg-[#111111] rounded-full text-center text-[24px] font-bold text-white outline-none border border-[#222222] focus:border-[#1E6FEA] focus:bg-[#161616] transition-colors box-border"
                      />
                    ))}
                  </div>
                  
                  {error && (
                    <div className="text-[#FF3B30] text-[13px] font-bold text-center mb-6 px-2">
                      {error}
                    </div>
                  )}

                  <button disabled={isLoading} className="w-full bg-[#1E6FEA] hover:bg-[#1A5BCE] text-white py-6 rounded-full font-bold text-[16px] transition-colors outline-none active:scale-[0.98] box-border shadow-[0_8px_24px_rgba(30,111,234,0.3)]">
                    {isLoading ? 'Verifying...' : 'Authorize Access'}
                  </button>
                </form>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Master Centered Logo with Animated Video */}
          <BottomLogo />
        </div>
      </div>
    </div>
  );
}