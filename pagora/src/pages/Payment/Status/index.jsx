import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, XCircle, Clock, AlertCircle, 
  Home, RefreshCcw, ArrowRight, ShieldCheck, 
  Receipt, LifeBuoy, ChevronRight 
} from 'lucide-react';

export default function PaymentStatus() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // --- SECTION 1: REAL-TIME STATE & ROUTE PARSING LOGIC ---
  const [status, setStatus] = useState('pending');
  const [txnId, setTxnId] = useState('');
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    // 1. Determine State from URL Path
    const path = location.pathname.toLowerCase();
    if (path.includes('success')) setStatus('success');
    else if (path.includes('failure')) setStatus('failure');
    else setStatus('pending');

    // 2. Extract Transaction Details from URL Parameters (PayU typically sends POST, but we check GET params as fallback)
    const queryParams = new URLSearchParams(location.search);
    const extractedTxnId = queryParams.get('txnid') || queryParams.get('mihpayid') || `PAYU_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    setTxnId(extractedTxnId);

    // 3. Set Real-Time Timestamp
    const now = new Date();
    setTimestamp(now.toLocaleString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit', second: '2-digit' 
    }));
  }, [location]);

  // --- SECTION 2: DYNAMIC UI CONFIGURATION ENGINE ---
  const config = {
    success: {
      color: '#34C759',
      bgGlow: 'from-[#34C759]/20 via-[#34C759]/5',
      icon: (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
          <div className="relative w-24 h-24 rounded-full bg-[#34C759]/10 flex items-center justify-center border-4 border-[#34C759]/20 shadow-[0_0_40px_rgba(52,199,89,0.3)]">
            <CheckCircle2 size={48} className="text-[#34C759]" strokeWidth={2.5} />
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 rounded-full border-2 border-[#34C759]"></motion.div>
          </div>
        </motion.div>
      ),
      title: 'Payment Successful',
      message: 'Your transaction has been securely processed. Your premium architecture is now active and ready to use.',
      btnText: 'Go to Home',
      btnIcon: <Home size={18} />,
      btnAction: () => navigate('/'),
      btnClass: 'bg-[#111111] hover:bg-[#1A1A1A] text-white shadow-[0_8px_24px_rgba(0,0,0,0.2)]'
    },
    failure: {
      color: '#FF3B30',
      bgGlow: 'from-[#FF3B30]/20 via-[#FF3B30]/5',
      icon: (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
          <div className="relative w-24 h-24 rounded-full bg-[#FF3B30]/10 flex items-center justify-center border-4 border-[#FF3B30]/20 shadow-[0_0_40px_rgba(255,59,48,0.3)]">
            <XCircle size={48} className="text-[#FF3B30]" strokeWidth={2.5} />
            <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute inset-0 rounded-full bg-[#FF3B30]/20 blur-xl"></motion.div>
          </div>
        </motion.div>
      ),
      title: 'Transaction Declined',
      message: 'We could not process your payment. Your bank declined the transaction. Your account has not been charged.',
      btnText: 'Retry Payment',
      btnIcon: <RefreshCcw size={18} />,
      btnAction: () => navigate('/pricing'),
      btnClass: 'bg-[#FF3B30] hover:bg-[#E3342B] text-white shadow-[0_8px_24px_rgba(255,59,48,0.3)]'
    },
    pending: {
      color: '#FF9F0A',
      bgGlow: 'from-[#FF9F0A]/20 via-[#FF9F0A]/5',
      icon: (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="relative w-24 h-24 rounded-full bg-[#FF9F0A]/10 flex items-center justify-center border-4 border-[#FF9F0A]/20 shadow-[0_0_40px_rgba(255,159,10,0.2)]">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
              <Clock size={48} className="text-[#FF9F0A]" strokeWidth={2.5} />
            </motion.div>
          </div>
        </motion.div>
      ),
      title: 'Processing Payment',
      message: 'Your bank is taking longer than usual to respond. Please wait a moment or check your status.',
      btnText: 'Check Status',
      btnIcon: <ArrowRight size={18} />,
      btnAction: () => window.location.reload(),
      btnClass: 'bg-[#111111] hover:bg-[#1A1A1A] text-white shadow-[0_8px_24px_rgba(0,0,0,0.2)]'
    }
  };

  const current = config[status];

  // --- SECTION 3: DYNAMIC AMBIENT BACKGROUND ---
  const DynamicBackground = () => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#FAFAFC] transition-colors duration-1000">
      <div className={`absolute top-[-20%] left-[10%] w-[80%] h-[70%] bg-gradient-to-b ${current.bgGlow} to-transparent rounded-full blur-[120px] transition-all duration-1000`}></div>
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
    </div>
  );

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden font-sans p-6">
      <DynamicBackground />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="w-full max-w-[500px] relative z-10 flex flex-col items-center"
      >
        
        {/* --- SECTION 4: STATUS ICON & TYPOGRAPHY --- */}
        <div className="mb-8 flex flex-col items-center text-center">
          {current.icon}
          <h1 className="text-[32px] md:text-[40px] font-serif font-black tracking-tight text-[#111111] leading-none mt-8 mb-3">
            {current.title}
          </h1>
          <p className="text-[15px] text-[#888888] font-medium leading-relaxed max-w-[400px]">
            {current.message}
          </p>
        </div>

        {/* --- SECTION 5: REAL-TIME TRANSACTION RECEIPT CARD --- */}
        <div className="w-full bg-white/80 backdrop-blur-2xl border border-[#EAEAEA] rounded-[24px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#EAEAEA]">
            <Receipt size={18} className="text-[#111111]" />
            <h3 className="text-[14px] font-bold text-[#111111] tracking-wide uppercase">Transaction Details</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
              <span className="text-[13px] font-bold text-[#888888]">Transaction ID</span>
              <span className="text-[14px] font-bold text-[#111111] break-all">{txnId}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
              <span className="text-[13px] font-bold text-[#888888]">Date & Time</span>
              <span className="text-[14px] font-medium text-[#111111]">{timestamp}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
              <span className="text-[13px] font-bold text-[#888888]">Payment Gateway</span>
              <span className="text-[14px] font-bold text-[#111111] flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#34C759]" /> Secure PayU
              </span>
            </div>
          </div>
        </div>

        {/* --- SECTION 6: CONTEXTUAL ACTION ENGINE & SUPPORT --- */}
        <div className="w-full flex flex-col gap-4">
          <button 
            onClick={current.btnAction}
            className={`w-full py-[18px] rounded-full font-bold text-[16px] transition-all outline-none flex items-center justify-center gap-2 active:scale-[0.98] ${current.btnClass}`}
          >
            {current.btnText} {current.btnIcon}
          </button>

          {status !== 'success' && (
            <button 
              onClick={() => navigate('/')}
              className="w-full py-[18px] rounded-full font-bold text-[16px] text-[#111111] bg-white border border-[#EAEAEA] hover:bg-[#F5F5F7] transition-all outline-none flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              Cancel & Return Home
            </button>
          )}
        </div>

        {/* Support Footer */}
        <div className="mt-10 pt-6 border-t border-black/5 w-full flex flex-col items-center gap-2">
          <p className="text-[13px] text-[#888888] font-medium text-center">
            Need help with your transaction?
          </p>
          <button className="text-[13px] font-bold text-[#1E6FEA] flex items-center gap-1 hover:underline outline-none">
            <LifeBuoy size={14} /> Contact Support
          </button>
        </div>

      </motion.div>
    </div>
  );
}