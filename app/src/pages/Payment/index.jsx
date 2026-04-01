import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { auth } from '../../firebase';
import { ChevronLeft, Lock, ShieldCheck, CreditCard } from 'lucide-react';

export default function PaymentPage({ onNavigate, routeData }) {
  // Redirect back if accessed without a selected plan
  useEffect(() => {
    if (!routeData || !routeData.plan) {
      onNavigate('pricing');
    }
  }, [routeData, onNavigate]);

  const plan = routeData?.plan;
  const cycle = routeData?.cycle || 'monthly';
  
  // Real-time Order Calculations
  const planPrice = plan ? plan.price[cycle] : 0;
  const gstAmount = parseFloat((planPrice * 0.18).toFixed(2));
  const totalAmount = parseFloat((planPrice + gstAmount).toFixed(2));

  // User & Payment State
  const user = auth.currentUser;
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const formRef = useRef(null);

  // PayU Configuration (Uses Vite Env Variables or Fallbacks for safety)
  const PAYU_MERCHANT_KEY = import.meta.env.VITE_PAYU_KEY || 'YOUR_PAYU_KEY';
  const PAYU_SALT = import.meta.env.VITE_PAYU_SALT || 'YOUR_PAYU_SALT';
  const PAYU_BASE_URL = import.meta.env.VITE_PAYU_ENV === 'prod' 
    ? 'https://secure.payu.in/_payment' 
    : 'https://test.payu.in/_payment';

  const [payuData, setPayuData] = useState(null);

  // Secure Frontend SHA-512 Hashing using Web Crypto API
  const generateHash = async (hashString) => {
    const utf8 = new TextEncoder().encode(hashString);
    const hashBuffer = await crypto.subtle.digest('SHA-512', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!name || !email || !phone) {
      alert("Please fill in all contact details securely process your payment.");
      setIsProcessing(false);
      return;
    }

    try {
      const txnid = 'Txn' + Date.now() + Math.floor(Math.random() * 1000);
      const productinfo = `${plan.name} Plan - ${cycle}`;
      const surl = `${window.location.origin}/?status=success`;
      const furl = `${window.location.origin}/?status=failure`;

      // PayU Strict Hash Sequence: key|txnid|amount|productinfo|firstname|email|||||||||||salt
      const hashString = `${PAYU_MERCHANT_KEY}|${txnid}|${totalAmount}|${productinfo}|${name}|${email}|||||||||||${PAYU_SALT}`;
      const hash = await generateHash(hashString);

      setPayuData({
        key: PAYU_MERCHANT_KEY,
        txnid: txnid,
        amount: totalAmount,
        productinfo: productinfo,
        firstname: name,
        email: email,
        phone: phone,
        surl: surl,
        furl: furl,
        hash: hash,
        service_provider: 'payu_paisa'
      });

      // Allow state to update, then submit the hidden form directly to PayU
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.submit();
        }
      }, 500);

    } catch (error) {
      console.error("Payment Initialization Error:", error);
      setIsProcessing(false);
    }
  };

  if (!plan) return null; // Prevent render flash while redirecting

  // High-End SVG Illustration Background (Editorial Flowing Pages)
  const PremiumCheckoutBackground = () => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#FFFFFF]">
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-gradient-to-br from-[#F8FAFC] to-transparent rounded-full blur-[100px] opacity-70"></div>
      <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] bg-gradient-to-tl from-[#F1F5F9] to-transparent rounded-full blur-[120px] opacity-60"></div>
      
      <svg className="absolute w-[100%] h-[100%] opacity-[0.05]" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path 
          d="M0,20 C30,40 70,0 100,20 L100,100 L0,100 Z" 
          fill="#111111" 
          animate={{ d: ["M0,20 C30,40 70,0 100,20 L100,100 L0,100 Z", "M0,25 C40,10 60,30 100,25 L100,100 L0,100 Z", "M0,20 C30,40 70,0 100,20 L100,100 L0,100 Z"] }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
        />
        <motion.path 
          d="M0,35 C40,55 60,15 100,35 L100,100 L0,100 Z" 
          fill="#111111" 
          animate={{ d: ["M0,35 C40,55 60,15 100,35 L100,100 L0,100 Z", "M0,40 C30,25 70,45 100,40 L100,100 L0,100 Z", "M0,35 C40,55 60,15 100,35 L100,100 L0,100 Z"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );

  return (
    <div className="fixed inset-0 w-full flex flex-col overflow-y-auto bg-[#FFFFFF]">
      <PremiumCheckoutBackground />

      {/* Hidden PayU Form */}
      {payuData && (
        <form ref={formRef} action={PAYU_BASE_URL} method="POST" className="hidden">
          {Object.entries(payuData).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
        </form>
      )}

      {/* Fixed Top Header */}
      <div className="shrink-0 w-full px-6 pt-12 pb-2 flex items-center min-h-[80px] z-20">
        <button 
          onClick={() => onNavigate('pricing')}
          className="p-2 -ml-2 rounded-full hover:bg-[#F5F5F7] transition-colors outline-none tap-highlight-transparent"
        >
          <ChevronLeft size={26} className="text-[#111111]" strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex-1 w-full px-6 pb-12 max-w-md mx-auto flex flex-col pt-2 z-10">
        
        {/* Editorial Typography Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-[38px] font-serif leading-[1.05] tracking-tight font-bold text-[#111111] mb-2">Review & Pay</h1>
          <p className="text-[13px] text-[#888888] font-sans mb-8 leading-relaxed">
            Complete your subscription to unlock the full Pagora ecosystem. Cancel anytime.
          </p>
        </motion.div>

        {/* Order Summary Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full bg-[#FAFAFA] border border-[#EAEAEA] rounded-[24px] p-6 mb-8 shadow-[0_8px_20px_rgba(0,0,0,0.03)]"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-serif text-[24px] font-bold text-[#111111] leading-none tracking-tight mb-1">
                {plan.name} <span className="font-sans text-[14px] font-semibold text-[#888888] capitalize">({cycle})</span>
              </h3>
              <p className="text-[11px] font-bold text-[#1E6FEA] uppercase tracking-wider">{plan.badge || 'Subscription'}</p>
            </div>
            <div className="text-right">
              <div className="font-serif text-[28px] font-bold text-[#111111] leading-none">₹{planPrice}</div>
            </div>
          </div>

          <div className="w-full h-[1px] bg-[#EAEAEA] mb-5"></div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-[13px] font-medium text-[#888888]">
              <span>Subtotal</span>
              <span className="text-[#111111]">₹{planPrice}</span>
            </div>
            <div className="flex justify-between items-center text-[13px] font-medium text-[#888888]">
              <span>Taxes (GST 18%)</span>
              <span className="text-[#111111]">₹{gstAmount}</span>
            </div>
            
            <div className="w-full h-[1px] border-t border-dashed border-[#D5D6D0] my-2"></div>
            
            <div className="flex justify-between items-center">
              <span className="text-[15px] font-bold text-[#111111]">Total Amount</span>
              <span className="font-serif text-[26px] font-bold text-[#111111] tracking-tight">₹{totalAmount}</span>
            </div>
          </div>
        </motion.div>

        {/* Contact Details Form */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <h4 className="text-[12px] uppercase tracking-wider font-bold text-[#111111] mb-4">Billing Details</h4>
          
          <form onSubmit={handlePayment} className="flex flex-col gap-4">
            <div className="flex gap-4">
              <input type="text" placeholder="Full Name" required value={name} onChange={e => setName(e.target.value)}
                     className="w-full bg-[#F5F5F7] text-[#111111] px-4 py-4 rounded-xl outline-none font-medium placeholder:text-[#A1A1A1] transition-all focus:ring-2 focus:ring-[#111111]" />
            </div>
            <input type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)}
                   className="w-full bg-[#F5F5F7] text-[#111111] px-4 py-4 rounded-xl outline-none font-medium placeholder:text-[#A1A1A1] transition-all focus:ring-2 focus:ring-[#111111]" />
            <input type="tel" placeholder="Mobile Number" required minLength="10" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                   className="w-full bg-[#F5F5F7] text-[#111111] px-4 py-4 rounded-xl outline-none font-medium placeholder:text-[#A1A1A1] transition-all focus:ring-2 focus:ring-[#111111]" />

            <div className="mt-8 mb-2 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-[#34A853] bg-[#34A853]/10 px-4 py-2 rounded-full">
                <ShieldCheck size={16} strokeWidth={2.5} />
                <span className="text-[11px] font-bold uppercase tracking-wider">Secured by PayU</span>
              </div>
              <p className="text-[11px] text-[#888888] font-medium text-center">
                Your payment is encrypted and processed securely. We do not store your card details.
              </p>
            </div>

            <button 
              type="submit" 
              disabled={isProcessing} 
              className="w-full bg-[#111111] text-white py-[18px] rounded-full font-semibold text-[16px] active:scale-[0.98] transition-transform shadow-pill outline-none flex justify-center items-center gap-2 mt-2"
            >
              {isProcessing ? 'Processing Securely...' : <>Pay ₹{totalAmount} <Lock size={16} strokeWidth={2.5} /></>}
            </button>
          </form>
        </motion.div>

      </div>
    </div>
  );
}