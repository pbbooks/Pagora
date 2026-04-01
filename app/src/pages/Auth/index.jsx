import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '../../firebase';

export default function AuthPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [generatedOtp, setGeneratedOtp] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    
    // Real EmailJS Integration
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      { to_email: email, otp_code: code }
    ).catch(err => console.error("EmailJS Error (Check Config):", err));
    
    setStep(2);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp === generatedOtp) {
      // Success. In a real app, backend generates custom token. Using anon for client-side strictly.
      onNavigate('home');
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-pagora-base">
      <h1 className="text-4xl font-bold mb-8 text-pagora-text">Pagora.</h1>
      
      {step === 1 ? (
        <form onSubmit={handleSendOTP} className="w-full max-w-sm">
          <input type="email" placeholder="Enter your email" required value={email} onChange={e => setEmail(e.target.value)}
                 className="w-full bg-pagora-card text-pagora-text p-4 rounded-xl mb-4 border border-pagora-accent outline-none focus:border-pagora-primary" />
          <button type="submit" className="w-full bg-pagora-primary text-white p-4 rounded-xl font-bold hover:bg-pagora-hover">Continue</button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="w-full max-w-sm">
          <p className="text-pagora-muted mb-4 text-sm text-center">We sent a 4-digit code to {email}</p>
          <input type="text" placeholder="Enter 4-digit code" required maxLength="4" value={otp} onChange={e => setOtp(e.target.value)}
                 className="w-full bg-pagora-card text-pagora-text p-4 rounded-xl mb-4 text-center text-2xl tracking-widest border border-pagora-accent outline-none" />
          <button type="submit" className="w-full bg-pagora-primary text-white p-4 rounded-xl font-bold hover:bg-pagora-hover">Verify</button>
        </form>
      )}
    </div>
  );
}
