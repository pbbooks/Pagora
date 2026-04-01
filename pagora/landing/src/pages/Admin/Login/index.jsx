
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, CheckCircle2, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import * as otplib from 'otplib';

export default function AdminLogin({ onAuthSuccess }) {
  const [step, setStep] = useState(1); // 1: Email, 2: TOTP
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [error, setError] = useState('');

  // The secret used for TOTP (Should match your .env)
  const secret = import.meta.env.VITE_ADMIN_TOTP_SECRET || 'PAGORASECRET12345';
  const otpauth = `otpauth://totp/PagoraAdmin:admin@pagora.ai?secret=${secret}&issuer=Pagora`;

  const handleInitialAuth = (e) => {
    e.preventDefault();
    // Simulate standard Firebase Auth check
    if (email === 'admin@pagora.ai' && password === 'Pagora@2026') {
      setStep(2);
    } else {
      setError('Invalid system credentials.');
    }
  };

  const verifyTOTP = (e) => {
    e.preventDefault();
    const isValid = otplib.authenticator.check(totpCode, secret);
    if (isValid) {
      onAuthSuccess();
    } else {
      setError('Invalid or expired time-based code.');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#FAFAFA] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[32px] p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-[#EAEAEA]">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
            <Shield className="text-white" size={32} />
          </div>
        </div>

        <h2 className="font-serif text-3xl font-bold text-center mb-2">Internal Access</h2>
        <p className="text-center text-[#888888] text-sm mb-10">Verification required for administrative privileges.</p>

        {step === 1 ? (
          <form onSubmit={handleInitialAuth} className="space-y-4">
            <input type="email" placeholder="System ID" required value={email} onChange={e => setEmail(e.target.value)}
                   className="w-full bg-[#F5F5F7] px-6 py-4 rounded-xl outline-none focus:ring-2 ring-black transition-all" />
            <input type="password" placeholder="Key Phrase" required value={password} onChange={e => setPassword(e.target.value)}
                   className="w-full bg-[#F5F5F7] px-6 py-4 rounded-xl outline-none focus:ring-2 ring-black transition-all" />
            {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
            <button className="w-full bg-black text-white py-4 rounded-xl font-bold hover:opacity-90 transition-opacity">Request OTP</button>
          </form>
        ) : (
          <form onSubmit={verifyTOTP} className="space-y-8 flex flex-col items-center">
            <div className="p-4 bg-white border border-[#EAEAEA] rounded-2xl">
              <QRCodeSVG value={otpauth} size={160} />
            </div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#888888]">Scan with Google Authenticator</p>
            
            <input type="text" placeholder="000000" maxLength="6" required value={totpCode} onChange={e => setTotpCode(e.target.value)}
                   className="w-full bg-[#F5F5F7] text-center text-3xl tracking-[0.5em] font-bold px-6 py-4 rounded-xl outline-none border-2 border-black" />
            
            {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
            <button className="w-full bg-black text-white py-4 rounded-xl font-bold hover:opacity-90 transition-opacity">Verify & Enter</button>
          </form>
        )}
      </div>
    </div>
  );
}
