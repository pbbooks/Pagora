import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, ShieldCheck, Lock, 
  CreditCard, Zap, AlertCircle, Info, X 
} from 'lucide-react';

// --- SAFE ENVIRONMENT ACCESSOR ---
// Safely retrieves environment variables without triggering es2015 compiler warnings
const getEnvVar = (key) => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || '';
  }
  return '';
};

// --- SECTION 1: High-End Animated Secure Background ---
const SecureBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#FAFAFC]">
    {/* Deep Security Gradients */}
    <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[60%] bg-gradient-to-br from-[#1E6FEA]/10 to-transparent rounded-full blur-[120px] opacity-70"></div>
    <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[50%] bg-gradient-to-tl from-[#34C759]/10 to-transparent rounded-full blur-[100px] opacity-60"></div>
    
    {/* Cryptographic Grid Mesh */}
    <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
  </div>
);

export default function PaymentPage({ onNavigate }) {
  const location = useLocation();
  const navigate = useNavigate();
  const formRef = useRef(null);

  // Extract Plan Data from Router State
  const planDetails = location.state?.plan;
  const billingCycle = location.state?.cycle || 'monthly';

  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    firstname: '',
    email: '',
    phone: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [hash, setHash] = useState('');
  const [txnid, setTxnid] = useState('');
  
  // New State for Transparency Modal
  const [showTrustPrompt, setShowTrustPrompt] = useState(false);

  // Redirect if accessed directly without selecting a plan
  useEffect(() => {
    if (!planDetails && !onNavigate) {
      navigate('/pricing');
    }
  }, [planDetails, navigate, onNavigate]);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  // --- SECTION 2: REAL-TIME ORDER CALCULATION & BRANDING ---
  const basePrice = planDetails ? planDetails.price[billingCycle] : 0;
  const taxAmount = basePrice * 0.18; // Assuming 18% GST for digital goods
  const totalAmount = (basePrice + taxAmount).toFixed(2);
  
  // FIXED: Branded Payload for PayU internal receipts
  const productInfo = planDetails ? `Pagora By PB Books - ${planDetails.name} Subscription` : 'Pagora Subscription';

  // --- SECTION 3: WEB CRYPTO API NATIVE HASHING ENGINE ---
  const generatePayUHash = async (key, txnid, amount, productinfo, firstname, email, salt) => {
    // Exact PayU String Formula: key|txnid|amount|productinfo|firstname|email|||||||||||salt
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
    
    // Natively convert string to buffer and hash via browser's SubtleCrypto API (SHA-512)
    const msgUint8 = new TextEncoder().encode(hashString);
    const hashBuffer = await window.crypto.subtle.digest('SHA-512', msgUint8);
    
    // Convert buffer back to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  };

  // --- SECTION 4: FORM VALIDATION & MODAL INTERCEPTOR ---
  const handleInitialValidation = (e) => {
    e.preventDefault();
    setError('');

    // 1. Basic Validation before showing the prompt
    if (!formData.firstname || !formData.email || !formData.phone) {
      setError('Please complete all billing details to proceed.');
      return;
    }

    if (formData.phone.length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    // 2. Halt flow and show the mandatory transparency prompt
    setShowTrustPrompt(true);
  };

  // --- SECTION 5: SECURE PAYMENT SUBMISSION LOGIC (Moved to Modal) ---
  const handleAcknowledgeAndPay = async () => {
    setIsProcessing(true);
    setError('');

    // 1. Fetch Environment Variables Safely
    const PAYU_KEY = getEnvVar('VITE_PAYU_KEY');
    const PAYU_SALT = getEnvVar('VITE_PAYU_SALT');

    if (!PAYU_KEY || !PAYU_SALT) {
      setError('CRITICAL: PayU Environment Variables (VITE_PAYU_KEY, VITE_PAYU_SALT) are missing.');
      setIsProcessing(false);
      setShowTrustPrompt(false);
      return;
    }

    // 2. Generate Unique Transaction ID
    const generatedTxnid = 'txn_' + Date.now() + Math.random().toString(36).substring(2, 9);
    setTxnid(generatedTxnid);

    try {
      // 3. Cryptographically Hash the payload
      const secureHash = await generatePayUHash(
        PAYU_KEY,
        generatedTxnid,
        totalAmount,
        productInfo,
        formData.firstname,
        formData.email,
        PAYU_SALT
      );

      setHash(secureHash);

      // 4. Allow React state to update the hidden form, then auto-submit to PayU
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.submit();
        }
      }, 500);

    } catch (err) {
      console.error("Hashing Error:", err);
      setError('Cryptographic synchronization failed. Please try again.');
      setIsProcessing(false);
      setShowTrustPrompt(false);
    }
  };

  // Safe fallback if no plan is selected
  if (!planDetails) return null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden font-sans pb-10">
      <SecureBackground />

      {/* --- SECTION 6: MANDATORY TRANSPARENCY PROMPT MODAL --- */}
      <AnimatePresence>
        {showTrustPrompt && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/40 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-[500px] rounded-[32px] p-8 md:p-10 shadow-[0_24px_48px_rgba(0,0,0,0.2)] border border-[#EAEAEA] relative overflow-hidden"
            >
              {/* Decorative accent */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1E6FEA] to-[#34C759]"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-[#1E6FEA]/10 rounded-full flex items-center justify-center border border-[#1E6FEA]/20">
                  <Info size={24} className="text-[#1E6FEA]" />
                </div>
                <button 
                  onClick={() => !isProcessing && setShowTrustPrompt(false)}
                  disabled={isProcessing}
                  className="p-2 bg-[#F5F5F7] rounded-full text-[#888888] hover:text-[#111111] transition-colors outline-none disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>

              <h2 className="text-[24px] font-serif font-bold text-[#111111] leading-tight mb-4">
                Transparency & Identity Acknowledgment
              </h2>
              
              <div className="bg-[#F8FAFC] border border-[#EAEAEA] rounded-2xl p-5 mb-8">
                <p className="text-[14px] text-[#444444] leading-relaxed font-medium">
                  Payment will go to the respective developer and Co-Founder of Pagora By PB Books, <strong className="text-[#111111]">Arun Chandrashekhar Ammisetty</strong> (also founder of VyaparSetu Technologies). 
                  <br/><br/>
                  <span className="flex items-center gap-2 text-[13px] font-bold text-[#1E6FEA] bg-[#1E6FEA]/10 px-3 py-2 rounded-lg mt-2 w-fit border border-[#1E6FEA]/20">
                    UPI ID: Vercel1.payu@mairtel
                  </span>
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleAcknowledgeAndPay}
                  disabled={isProcessing} 
                  className="w-full bg-[#111111] hover:bg-[#1A1A1A] text-white py-4 rounded-xl font-bold text-[15px] transition-all outline-none flex items-center justify-center gap-3 shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Generating Secure Token...
                    </>
                  ) : (
                    <>Acknowledge & Pay ₹{totalAmount} <ShieldCheck size={18} /></>
                  )}
                </button>
                {!isProcessing && (
                  <button 
                    onClick={() => setShowTrustPrompt(false)}
                    className="w-full py-3 rounded-xl font-bold text-[14px] text-[#888888] hover:text-[#111111] transition-colors outline-none"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SECTION 7: Header Navigation --- */}
      <div className="absolute top-0 left-0 w-full px-6 pt-10 pb-4 flex justify-between items-center z-30">
        <button 
          onClick={() => onNavigate ? onNavigate('pricing') : navigate('/pricing')}
          className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors outline-none tap-highlight-transparent flex items-center gap-2 text-[#111111] font-bold text-[14px]"
        >
          <ChevronLeft size={24} strokeWidth={2.5} /> Back to Plans
        </button>
      </div>

      <div className="w-full max-w-[1000px] mx-auto px-6 z-20 mt-20 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        
        {/* LEFT COLUMN: Order Summary & Trust */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-[45%] flex flex-col gap-6"
        >
          <div>
            <h1 className="text-[32px] md:text-[40px] font-serif font-black tracking-tight text-[#111111] leading-none mb-3">
              Secure Checkout.
            </h1>
            <p className="text-[15px] text-[#888888] font-medium leading-relaxed">
              You are upgrading to the <span className="text-[#111111] font-bold">{planDetails.name}</span> architecture. Review your order details below.
            </p>
          </div>

          {/* Dynamic Order Summary Card */}
          <div className="w-full bg-white/80 backdrop-blur-xl border border-[#EAEAEA] rounded-[24px] p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#EAEAEA]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: planDetails.theme.bg, color: planDetails.theme.text, border: planDetails.theme.border ? `1px solid ${planDetails.theme.border}` : 'none' }}>
                  <Zap size={22} />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-[#111111] tracking-tight">{planDetails.name} Plan</h3>
                  <p className="text-[13px] text-[#888888] font-bold uppercase tracking-wider">{billingCycle} Billing</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-[15px]">
                <span className="text-[#888888] font-medium">Subtotal</span>
                <span className="font-bold text-[#111111]">₹{basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[15px]">
                <span className="text-[#888888] font-medium flex items-center gap-1">Taxes (GST 18%)</span>
                <span className="font-bold text-[#111111]">₹{taxAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-[#EAEAEA] flex justify-between items-end">
              <span className="text-[16px] font-bold text-[#111111]">Total Due</span>
              <div className="text-right">
                <div className="text-[32px] font-serif font-black tracking-tighter leading-none text-[#1E6FEA]">₹{totalAmount}</div>
                <div className="text-[11px] text-[#888888] font-bold uppercase tracking-widest mt-1">INR</div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center gap-6 px-2 opacity-70">
            <div className="flex items-center gap-2 text-[12px] font-bold text-[#111111]">
              <ShieldCheck size={16} className="text-[#34C759]" /> 256-bit Encryption
            </div>
            <div className="flex items-center gap-2 text-[12px] font-bold text-[#111111]">
              <Lock size={16} className="text-[#1E6FEA]" /> Secure Gateway
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Billing Form & Payment Engine */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="w-full lg:w-[55%] bg-white border border-[#EAEAEA] rounded-[32px] p-6 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] relative overflow-hidden"
        >
          {/* Internal Form UI */}
          <form onSubmit={handleInitialValidation} className="relative z-10 flex flex-col h-full">
            <h2 className="text-[20px] font-bold text-[#111111] mb-6 flex items-center gap-2">
              <CreditCard size={20} className="text-[#1E6FEA]" /> Billing Details
            </h2>

            <div className="space-y-5 flex-1">
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-[#888888] ml-1">Full Name</label>
                <input 
                  type="text" name="firstname" value={formData.firstname} onChange={handleChange} required disabled={isProcessing}
                  placeholder="Enter your legal name"
                  className="w-full bg-[#F5F5F7] px-5 py-4 rounded-xl outline-none text-[15px] text-[#111111] placeholder-[#111111]/30 border border-transparent focus:border-[#1E6FEA] focus:bg-white transition-all shadow-sm" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-[#888888] ml-1">Email Address</label>
                <input 
                  type="email" name="email" value={formData.email} onChange={handleChange} required disabled={isProcessing}
                  placeholder="receipts@example.com"
                  className="w-full bg-[#F5F5F7] px-5 py-4 rounded-xl outline-none text-[15px] text-[#111111] placeholder-[#111111]/30 border border-transparent focus:border-[#1E6FEA] focus:bg-white transition-all shadow-sm" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-[#888888] ml-1">Phone Number</label>
                <input 
                  type="tel" name="phone" value={formData.phone} onChange={handleChange} required disabled={isProcessing}
                  placeholder="10-digit mobile number" maxLength="10"
                  className="w-full bg-[#F5F5F7] px-5 py-4 rounded-xl outline-none text-[15px] text-[#111111] placeholder-[#111111]/30 border border-transparent focus:border-[#1E6FEA] focus:bg-white transition-all shadow-sm" 
                />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-[#FF3B30]/10 border border-[#FF3B30]/20 rounded-xl flex items-start gap-3">
                <AlertCircle size={18} className="text-[#FF3B30] shrink-0 mt-0.5" />
                <p className="text-[13px] font-bold text-[#FF3B30]">{error}</p>
              </motion.div>
            )}

            <div className="mt-8 pt-6 border-t border-[#EAEAEA]">
              <button 
                type="submit" 
                disabled={isProcessing} 
                className="w-full bg-[#111111] hover:bg-[#1A1A1A] text-white py-5 rounded-full font-bold text-[16px] transition-all outline-none flex items-center justify-center gap-3 shadow-[0_8px_24px_rgba(0,0,0,0.2)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <>Proceed to Pay ₹{totalAmount} <ChevronRight size={18} /></>
              </button>
              <p className="text-[12px] text-center font-medium text-[#888888] mt-4 flex items-center justify-center gap-1.5">
                <Lock size={12} /> Payments securely processed by PayU
              </p>
            </div>
          </form>

          {/* --- SECTION 8: HIDDEN PAYU AUTO-SUBMIT ENGINE --- */}
          {/* This hidden form physically constructs the payload and POSTs to the PayU servers once the hash is generated. */}
          <form ref={formRef} action="https://secure.payu.in/_payment" method="POST" className="hidden">
            <input type="hidden" name="key" value={getEnvVar('VITE_PAYU_KEY')} />
            <input type="hidden" name="txnid" value={txnid} />
            <input type="hidden" name="amount" value={totalAmount} />
            <input type="hidden" name="productinfo" value={productInfo} />
            <input type="hidden" name="firstname" value={formData.firstname} />
            <input type="hidden" name="email" value={formData.email} />
            <input type="hidden" name="phone" value={formData.phone} />
            {/* Success and Failure URLs route back to the app dynamically */}
            <input type="hidden" name="surl" value={window.location.origin + "/payment/success"} />
            <input type="hidden" name="furl" value={window.location.origin + "/payment/failure"} />
            {/* The Cryptographic Hash generated by the Web Crypto API */}
            <input type="hidden" name="hash" value={hash} />
          </form>

        </motion.div>
      </div>
    </div>
  );
}