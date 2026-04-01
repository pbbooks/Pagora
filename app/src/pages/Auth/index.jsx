import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ChevronLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AuthPage({ onNavigate }) {
  // State Machine: 'login' | 'signup_email' | 'signup_otp' | 'signup_password' | 'forgot_password'
  const [view, setView] = useState('login');
  
  // Form Data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  
  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Providers
  const googleProvider = new GoogleAuthProvider();

  // --- Handlers ---

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onNavigate('home'); // Returning users go straight to home
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Determine if this is a brand new user or returning user
      const creationTime = new Date(user.metadata.creationTime).getTime();
      const lastSignInTime = new Date(user.metadata.lastSignInTime).getTime();
      
      // If created in the last 2 seconds, they are brand new -> Force Pricing Page
      if (Math.abs(creationTime - lastSignInTime) < 2000) {
        onNavigate('pricing');
      } else {
        onNavigate('home'); // Returning users bypass pricing
      }
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { to_name: name, to_email: email, otp_code: code }
      );
      setView('signup_otp');
    } catch (err) {
      console.error("EmailJS Error:", err);
      setError('Failed to send verification code. Please check your email address.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value !== '' && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const enteredOtp = otp.join('');
    setTimeout(() => {
      if (enteredOtp === generatedOtp) {
        setView('signup_password');
      } else {
        setError("Invalid verification code. Please try again.");
      }
      setIsLoading(false);
    }, 600);
  };

  const handleSignupPasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // New signups explicitly routed to pricing to enforce subscription
      onNavigate('pricing');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if(!email) {
      setError("Please enter your email address.");
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      // Triggers the official Firebase email notification securely
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render Helpers (High-End SVG Background Illustration) ---

  const AuthBackground = () => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center bg-[#FFFFFF]">
      {/* Soft elegant gradient mesh */}
      <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[60%] bg-gradient-to-br from-[#F8FAFC] to-transparent rounded-full blur-[100px] opacity-80"></div>
      <div className="absolute top-[30%] right-[-30%] w-[70%] h-[70%] bg-gradient-to-tl from-[#F1F5F9] to-transparent rounded-full blur-[120px] opacity-70"></div>
      
      {/* High-End Book and Pen Illustration */}
      <svg className="absolute w-[160%] h-[160%] sm:w-[120%] sm:h-[120%] opacity-[0.035]" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left Page */}
        <motion.path 
          d="M 400 650 C 250 680 150 600 150 450 L 150 200 C 150 350 250 420 400 350 Z" 
          fill="none" stroke="#111111" strokeWidth="3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, ease: "easeInOut" }}
        />
        {/* Right Page */}
        <motion.path 
          d="M 400 650 C 550 680 650 600 650 450 L 650 200 C 650 350 550 420 400 350 Z" 
          fill="none" stroke="#111111" strokeWidth="3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, ease: "easeInOut", delay: 0.5 }}
        />
        {/* Center Spine */}
        <motion.path d="M 400 350 L 400 650" stroke="#111111" strokeWidth="3" strokeDasharray="6 6" />
        
        {/* Flowing Text Lines on Left Page */}
        <motion.path d="M 220 380 Q 280 400 350 370" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 4 }} />
        <motion.path d="M 200 440 Q 280 460 360 420" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 4, delay: 1 }} />
        <motion.path d="M 180 500 Q 260 520 340 470" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 4, delay: 2 }} />
        
        {/* Elegant Quill / Fountain Pen */}
        <motion.g 
          initial={{ y: -80, x: 80, opacity: 0 }} 
          animate={{ y: 0, x: 0, opacity: 1 }} 
          transition={{ duration: 2.5, ease: "easeOut", delay: 1.5 }}
        >
          <path d="M 600 200 L 480 400 L 510 410 L 650 250 Z" fill="#F8FAFC" stroke="#111111" strokeWidth="2" />
          <path d="M 480 400 L 460 450 L 510 410 Z" fill="#111111" />
          <path d="M 600 200 C 650 120 720 150 720 150 C 720 150 680 210 650 250" fill="none" stroke="#111111" strokeWidth="2" />
        </motion.g>

        {/* Decorative Flowing Ink Curve */}
        <motion.path 
          d="M 460 450 C 400 550 300 450 200 500 C 100 550 250 650 350 600" 
          stroke="#111111" strokeWidth="2.5" fill="none" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 4, delay: 2.5, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );

  const SocialButtons = () => (
    <div className="w-full flex flex-col gap-3 mt-6 z-10 relative">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-1 h-[1px] bg-[#EAEAEA]"></div>
        <span className="text-[11px] font-bold text-[#888888] uppercase tracking-widest">OR</span>
        <div className="flex-1 h-[1px] bg-[#EAEAEA]"></div>
      </div>
      
      <button 
        type="button" 
        onClick={handleGoogleSignIn}
        className="w-full bg-[#F5F5F7] text-[#111111] py-[15px] rounded-xl font-semibold text-[14px] flex items-center justify-center gap-3 active:scale-[0.98] transition-transform outline-none shadow-sm"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      <button 
        type="button" 
        onClick={() => setError("Apple Sign-In requires Developer Account setup.")}
        className="w-full bg-[#F5F5F7] text-[#111111] py-[15px] rounded-xl font-semibold text-[14px] flex items-center justify-center gap-3 active:scale-[0.98] transition-transform outline-none shadow-sm"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.05 2.53.68 3.14.68.65 0 2.02-.74 3.55-.61 1.54.12 2.84.77 3.59 1.94-3.11 1.83-2.6 5.86.41 7.05-.72 1.6-1.57 3.08-2.69 3.91zm-3.69-14.9c-.19-1.63.58-3.25 1.76-4.22 1.25 1.15 3.01 2.72 2.76 4.41-1.49.12-3.11-.79-4.52-1.8z" />
        </svg>
        Continue with Apple
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 w-full bg-[#FFFFFF] flex flex-col overflow-y-auto">
      
      <AuthBackground />

      {/* Dynamic Navigation Header */}
      <div className="w-full px-6 pt-10 pb-2 flex items-center min-h-[80px] z-20 relative">
        {view !== 'login' && (
          <button 
            onClick={() => {
              if(view === 'signup_password') setView('signup_otp');
              else if(view === 'signup_otp') setView('signup_email');
              else { setView('login'); setError(''); setResetSent(false); }
            }}
            className="p-2 -ml-2 rounded-full hover:bg-[#F5F5F7] transition-colors outline-none tap-highlight-transparent"
          >
            <ChevronLeft size={26} className="text-[#111111]" strokeWidth={2.5} />
          </button>
        )}
      </div>

      <div className="flex-1 w-full px-8 pb-10 max-w-md mx-auto flex flex-col justify-center pt-2 z-10 relative">
        <AnimatePresence mode="wait">
          
          {/* LOGIN VIEW */}
          {view === 'login' && (
            <motion.div 
              key="login"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}
              className="flex flex-col w-full"
            >
              <h1 className="text-[44px] font-serif leading-[1.05] tracking-tight font-bold text-[#111111] text-center mb-3">Welcome back</h1>
              <p className="text-[13px] text-[#888888] font-sans text-center mb-8 px-4 leading-relaxed">Access your library, reading stats, and personalized book recommendations.</p>

              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-[12px] uppercase tracking-wider font-bold text-[#111111] mb-2 block">Email Address</label>
                  <input type="email" placeholder="Enter your email" required value={email} onChange={e => setEmail(e.target.value)}
                         className="w-full bg-[#F5F5F7] text-[#111111] px-4 py-4 rounded-xl outline-none font-medium placeholder:text-[#A1A1A1] transition-all focus:ring-2 focus:ring-[#111111]" />
                </div>
                
                <div>
                  <label className="text-[12px] uppercase tracking-wider font-bold text-[#111111] mb-2 block">Password</label>
                  <div className="relative flex items-center">
                    <input type={showPassword ? "text" : "password"} placeholder="Enter your password" required value={password} onChange={e => setPassword(e.target.value)}
                           className="w-full bg-[#F5F5F7] text-[#111111] pl-4 pr-12 py-4 rounded-xl outline-none font-medium placeholder:text-[#A1A1A1] transition-all focus:ring-2 focus:ring-[#111111]" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-[#888888] hover:text-[#111111] transition-colors outline-none">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-1 mb-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 accent-[#111111] rounded-sm cursor-pointer" defaultChecked />
                    <span className="text-[13px] font-semibold text-[#888888] group-hover:text-[#111111] transition-colors">Remember me</span>
                  </label>
                  <button type="button" onClick={() => { setView('forgot_password'); setError(''); setResetSent(false); }} className="text-[13px] font-bold text-[#FF3B30] hover:text-[#D70015] transition-colors outline-none">
                    Forgot password?
                  </button>
                </div>

                {error && <p className="text-[#FF3B30] text-[13px] flex items-center gap-1 font-semibold"><AlertCircle size={14}/> {error}</p>}

                <button type="submit" disabled={isLoading} className="w-full bg-[#111111] text-white py-[18px] rounded-full font-semibold text-[15px] mt-2 active:scale-[0.98] transition-transform shadow-[0_8px_16px_rgba(0,0,0,0.1)] outline-none">
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>

              <SocialButtons />

              <p className="text-center text-[13px] font-semibold text-[#888888] mt-8 z-10">
                Don't have an account? <button onClick={() => { setView('signup_email'); setError(''); }} className="text-[#111111] hover:underline outline-none">Sign up</button>
              </p>
            </motion.div>
          )}

          {/* SIGNUP EMAIL VIEW */}
          {view === 'signup_email' && (
            <motion.div 
              key="signup_email"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
              className="flex flex-col w-full"
            >
              <h1 className="text-[44px] font-serif leading-[1.05] tracking-tight font-bold text-[#111111] text-center mb-3">Sign up Account</h1>
              <p className="text-[13px] text-[#888888] font-sans text-center mb-8 px-4 leading-relaxed">Join now for a faster, smarter reading experience.</p>

              <form onSubmit={handleSignupEmailSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-[12px] uppercase tracking-wider font-bold text-[#111111] mb-2 block">Full Name</label>
                  <input type="text" placeholder="Enter your name" required value={name} onChange={e => setName(e.target.value)}
                         className="w-full bg-[#F5F5F7] text-[#111111] px-4 py-4 rounded-xl outline-none font-medium placeholder:text-[#A1A1A1] transition-all focus:ring-2 focus:ring-[#111111]" />
                </div>

                <div>
                  <label className="text-[12px] uppercase tracking-wider font-bold text-[#111111] mb-2 block">Email Address</label>
                  <input type="email" placeholder="Enter your email" required value={email} onChange={e => setEmail(e.target.value)}
                         className="w-full bg-[#F5F5F7] text-[#111111] px-4 py-4 rounded-xl outline-none font-medium placeholder:text-[#A1A1A1] transition-all focus:ring-2 focus:ring-[#111111]" />
                </div>

                {error && <p className="text-[#FF3B30] text-[13px] flex items-center gap-1 font-semibold"><AlertCircle size={14}/> {error}</p>}

                <button type="submit" disabled={isLoading} className="w-full bg-[#111111] text-white py-[18px] rounded-full font-semibold text-[15px] mt-4 active:scale-[0.98] transition-transform shadow-[0_8px_16px_rgba(0,0,0,0.1)] outline-none">
                  {isLoading ? 'Sending Code...' : 'Continue'}
                </button>
              </form>

              <SocialButtons />

              <p className="text-center text-[13px] font-semibold text-[#888888] mt-8 z-10">
                Already have an account? <button onClick={() => { setView('login'); setError(''); }} className="text-[#111111] hover:underline outline-none">Sign in</button>
              </p>
            </motion.div>
          )}

          {/* SIGNUP OTP VIEW */}
          {view === 'signup_otp' && (
            <motion.div 
              key="signup_otp"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
              className="flex flex-col w-full pt-2"
            >
              <h1 className="text-[44px] font-serif leading-[1.05] tracking-tight font-bold text-[#111111] text-center mb-4">Enter OTP Code</h1>
              <p className="text-[13px] text-[#888888] font-sans text-center mb-10 px-2 leading-relaxed">
                Check your email. We've sent a one-time verification code to <span className="font-bold text-[#111111]">{email}</span>.
              </p>

              <form onSubmit={handleVerifyOTP} className="flex flex-col gap-8 items-center">
                <div className="flex gap-4 justify-center w-full">
                  {otp.map((digit, index) => (
                    <input 
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-14 h-14 sm:w-16 sm:h-16 bg-[#F5F5F7] rounded-2xl text-center text-2xl font-bold text-[#111111] outline-none focus:ring-2 focus:ring-[#111111] transition-all shadow-sm"
                    />
                  ))}
                </div>

                {error && <p className="text-[#FF3B30] text-[13px] flex items-center gap-1 font-semibold"><AlertCircle size={14}/> {error}</p>}

                <button type="submit" disabled={isLoading || otp.join('').length !== 4} className="w-full bg-[#111111] text-white py-[18px] rounded-full font-semibold text-[15px] active:scale-[0.98] transition-transform shadow-[0_8px_16px_rgba(0,0,0,0.1)] disabled:opacity-50 outline-none">
                  {isLoading ? 'Verifying...' : 'Verify Account'}
                </button>
              </form>

              <p className="text-center text-[13px] font-semibold text-[#888888] mt-8 z-10">
                Didn't get OTP? <button onClick={handleSignupEmailSubmit} className="text-[#111111] hover:underline outline-none">Resend OTP</button>
              </p>
            </motion.div>
          )}

          {/* SIGNUP PASSWORD VIEW */}
          {view === 'signup_password' && (
            <motion.div 
              key="signup_password"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
              className="flex flex-col w-full pt-2"
            >
              <h1 className="text-[44px] font-serif leading-[1.05] tracking-tight font-bold text-[#111111] text-center mb-4">Secure Account</h1>
              <p className="text-[13px] text-[#888888] font-sans text-center mb-10 px-2 leading-relaxed">
                Your email <span className="font-bold text-[#111111]">{email}</span> is verified. Set a strong password to protect your library.
              </p>

              <form onSubmit={handleSignupPasswordSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-[12px] uppercase tracking-wider font-bold text-[#111111] mb-2 block">Create Password</label>
                  <div className="relative flex items-center">
                    <input type={showPassword ? "text" : "password"} placeholder="Enter your new password" required minLength="6" value={password} onChange={e => setPassword(e.target.value)}
                           className="w-full bg-[#F5F5F7] text-[#111111] pl-4 pr-12 py-4 rounded-xl outline-none font-medium placeholder:text-[#A1A1A1] transition-all focus:ring-2 focus:ring-[#111111]" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-[#888888] hover:text-[#111111] transition-colors outline-none">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {error && <p className="text-[#FF3B30] text-[13px] flex items-center gap-1 font-semibold"><AlertCircle size={14}/> {error}</p>}

                <button type="submit" disabled={isLoading} className="w-full bg-[#111111] text-white py-[18px] rounded-full font-semibold text-[15px] mt-4 active:scale-[0.98] transition-transform shadow-[0_8px_16px_rgba(0,0,0,0.1)] outline-none">
                  {isLoading ? 'Creating Account...' : 'Complete Sign up'}
                </button>
              </form>
            </motion.div>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {view === 'forgot_password' && (
            <motion.div 
              key="forgot_password"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
              className="flex flex-col w-full pt-2"
            >
              <h1 className="text-[44px] font-serif leading-[1.05] tracking-tight font-bold text-[#111111] text-center mb-4">Reset Password</h1>
              
              {!resetSent ? (
                <>
                  <p className="text-[13px] text-[#888888] font-sans text-center mb-8 px-2 leading-relaxed">
                    Enter the email address associated with your account and we'll send you a link to reset your password.
                  </p>

                  <form onSubmit={handleForgotPasswordSubmit} className="flex flex-col gap-4">
                    <div>
                      <label className="text-[12px] uppercase tracking-wider font-bold text-[#111111] mb-2 block">Email Address</label>
                      <input type="email" placeholder="Enter your email" required value={email} onChange={e => setEmail(e.target.value)}
                             className="w-full bg-[#F5F5F7] text-[#111111] px-4 py-4 rounded-xl outline-none font-medium placeholder:text-[#A1A1A1] transition-all focus:ring-2 focus:ring-[#111111]" />
                    </div>

                    {error && <p className="text-[#FF3B30] text-[13px] flex items-center gap-1 font-semibold"><AlertCircle size={14}/> {error}</p>}

                    <button type="submit" disabled={isLoading} className="w-full bg-[#111111] text-white py-[18px] rounded-full font-semibold text-[15px] mt-4 active:scale-[0.98] transition-transform shadow-[0_8px_16px_rgba(0,0,0,0.1)] outline-none">
                      {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                    </button>
                  </form>
                </>
              ) : (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center text-center mt-4 z-10"
                >
                  <div className="w-16 h-16 bg-[#34A853] rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <CheckCircle2 size={32} className="text-white" />
                  </div>
                  <h2 className="text-[20px] font-bold text-[#111111] mb-2">Check your email</h2>
                  <p className="text-[14px] text-[#888888] mb-8 leading-relaxed">
                    We've sent a password reset link to <br/><span className="font-bold text-[#111111]">{email}</span>.
                  </p>
                  <button onClick={() => { setView('login'); setResetSent(false); }} className="w-full bg-[#F5F5F7] text-[#111111] py-[16px] rounded-full font-semibold text-[15px] active:scale-[0.98] transition-transform outline-none shadow-sm">
                    Return to Login
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}