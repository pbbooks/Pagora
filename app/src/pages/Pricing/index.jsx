import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Check, Sparkles, Zap, Crown, BookOpen } from 'lucide-react';

// Real Pricing Strategy Data
const PLANS = [
  {
    id: 'free',
    name: 'Free',
    badge: null,
    price: { monthly: 0, yearly: 0 },
    features: ['Free books (limited)', 'Ads enabled', 'Limited AI usage', 'No offline downloads'],
    theme: { bg: '#F5F5F7', text: '#111111', button: '#EAEAEA', buttonText: '#111111' },
    icon: <BookOpen size={20} />
  },
  {
    id: 'basic',
    name: 'Basic',
    badge: 'Entry Killer',
    price: { monthly: 49, yearly: 399 },
    features: ['Ad-free reading', 'Offline downloads (limited)', 'Basic AI (limited usage)', 'Bookmark + notes'],
    theme: { bg: '#FFFFFF', text: '#111111', button: '#111111', buttonText: '#FFFFFF', border: '#EAEAEA' },
    icon: <Zap size={20} />
  },
  {
    id: 'standard',
    name: 'Standard',
    badge: 'Most Popular',
    price: { monthly: 99, yearly: 799 },
    features: ['Unlimited reading (selected catalog)', 'Full offline', 'AI summary + explanation', 'Audio (TTS)', 'No ads'],
    theme: { bg: '#1E6FEA', text: '#FFFFFF', button: '#FFFFFF', buttonText: '#1E6FEA', border: '#1E6FEA' },
    icon: <Sparkles size={20} />
  },
  {
    id: 'premium',
    name: 'Premium',
    badge: 'Power Users',
    price: { monthly: 149, yearly: 1199 },
    features: ['Everything in Standard', 'Advanced AI (ask book, deep explanation)', 'Scanner (OCR unlimited)', 'Audiobook features', 'Early access content'],
    theme: { bg: '#111111', text: '#FFFFFF', button: '#FFFFFF', buttonText: '#111111', border: '#111111' },
    icon: <Crown size={20} />
  },
  {
    id: 'pro',
    name: 'Pro+',
    badge: 'Ultimate',
    price: { monthly: 199, yearly: 1499 },
    features: ['Everything unlocked', 'Creator tools', 'Monetization access', 'Premium content', 'Future AI features'],
    theme: { bg: '#FF6536', text: '#FFFFFF', button: '#FFFFFF', buttonText: '#FF6536', border: '#FF6536' },
    icon: <Sparkles size={20} />
  }
];

export default function PricingPage({ onNavigate }) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [selectedPlan, setSelectedPlan] = useState('standard');

  const handleContinue = () => {
    if (selectedPlan === 'free') {
      onNavigate('home');
    } else {
      const planDetails = PLANS.find(p => p.id === selectedPlan);
      onNavigate('payment', { plan: planDetails, cycle: billingCycle });
    }
  };

  // High-End Animated Editorial Background Illustration
  const PremiumBackground = () => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#FFFFFF]">
      {/* Soft Gradient Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[50%] bg-gradient-to-bl from-[#E2E8F0] to-transparent rounded-full blur-[100px] opacity-70"></div>
      <div className="absolute bottom-[10%] left-[-20%] w-[70%] h-[60%] bg-gradient-to-tr from-[#F1F5F9] to-transparent rounded-full blur-[120px] opacity-80"></div>
      
      {/* Flowing Architectural SVG Mesh */}
      <svg className="absolute w-[200%] h-[200%] opacity-[0.04] top-[-50%] left-[-50%] animate-[spin_120s_linear_infinite]" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid slice">
        <circle cx="250" cy="250" r="100" fill="none" stroke="#111111" strokeWidth="0.5" />
        <circle cx="250" cy="250" r="150" fill="none" stroke="#111111" strokeWidth="0.5" />
        <circle cx="250" cy="250" r="200" fill="none" stroke="#111111" strokeWidth="0.5" />
        <circle cx="250" cy="250" r="250" fill="none" stroke="#111111" strokeWidth="0.5" />
        <path d="M 250,0 L 250,500" stroke="#111111" strokeWidth="0.5" />
        <path d="M 0,250 L 500,250" stroke="#111111" strokeWidth="0.5" />
        <path d="M 73.2,73.2 L 426.8,426.8" stroke="#111111" strokeWidth="0.5" />
        <path d="M 73.2,426.8 L 426.8,73.2" stroke="#111111" strokeWidth="0.5" />
      </svg>
    </div>
  );

  return (
    <div className="fixed inset-0 w-full flex flex-col overflow-hidden bg-[#FFFFFF]">
      <PremiumBackground />

      {/* Fixed Top Header */}
      <div className="shrink-0 w-full px-6 pt-12 pb-4 flex justify-between items-center z-20">
        <button 
          onClick={() => onNavigate('auth')}
          className="p-2 -ml-2 rounded-full hover:bg-[#F5F5F7] transition-colors outline-none tap-highlight-transparent"
        >
          <ChevronLeft size={26} className="text-[#111111]" strokeWidth={2.5} />
        </button>
        <button onClick={() => onNavigate('home')} className="text-[14px] font-bold text-[#888888] hover:text-[#111111] transition-colors outline-none">
          Skip for now
        </button>
      </div>

      {/* Main Content Area (Scrollable) */}
      <div className="flex-1 w-full overflow-y-auto hide-scrollbar z-10 pb-32">
        <div className="px-6 flex flex-col items-center">
          
          {/* Editorial Typography Header */}
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-[40px] font-serif leading-[1.05] tracking-tight font-bold text-[#111111] text-center mb-3 mt-2"
          >
            Unlock your full<br/>reading potential
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-[14px] text-[#888888] font-sans text-center mb-8 px-4 max-w-[340px] leading-relaxed"
          >
            Join Pagora to access AI summaries, offline downloads, and an endless library.
          </motion.p>

          {/* Launch Offer Banner */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="w-full bg-[#111111] rounded-2xl p-4 flex items-center justify-between shadow-[0_8px_20px_rgba(0,0,0,0.1)] mb-8"
          >
            <div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-[#D5D6D0] mb-1">Launch Offer</div>
              <div className="text-white font-serif font-bold text-lg leading-none">First 3 months at ₹19/mo</div>
            </div>
            <div className="bg-white/10 p-2 rounded-full">
              <Sparkles size={18} className="text-[#FF6536]" />
            </div>
          </motion.div>

          {/* Billing Toggle */}
          <div className="bg-[#F5F5F7] p-1 rounded-full flex relative mb-8">
            <motion.div 
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#111111] rounded-full shadow-sm"
              animate={{ left: billingCycle === 'monthly' ? '4px' : 'calc(50%)' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`flex-1 py-2.5 px-6 text-[13px] font-bold rounded-full relative z-10 transition-colors outline-none ${billingCycle === 'monthly' ? 'text-white' : 'text-[#888888]'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingCycle('yearly')}
              className={`flex-1 py-2.5 px-6 text-[13px] font-bold rounded-full relative z-10 transition-colors outline-none flex items-center justify-center gap-2 ${billingCycle === 'yearly' ? 'text-white' : 'text-[#888888]'}`}
            >
              Yearly <span className="bg-[#FF3B30] text-white text-[9px] px-2 py-0.5 rounded-full tracking-wider">SAVE</span>
            </button>
          </div>

          {/* Pricing Cards (Horizontal Snap Scroll) */}
          <div className="w-full flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 px-6 -mx-6 pb-8 pt-2">
            {PLANS.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              const price = plan.price[billingCycle];
              
              return (
                <div 
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`shrink-0 w-[280px] snap-center rounded-[24px] p-6 flex flex-col transition-all duration-300 cursor-pointer relative overflow-hidden`}
                  style={{ 
                    backgroundColor: plan.theme.bg, 
                    color: plan.theme.text,
                    border: plan.theme.border ? `1px solid ${plan.theme.border}` : '1px solid transparent',
                    transform: isSelected ? 'scale(1)' : 'scale(0.95)',
                    opacity: isSelected ? 1 : 0.7,
                    boxShadow: isSelected ? '0 20px 40px -10px rgba(0,0,0,0.15)' : 'none'
                  }}
                >
                  {/* Background Accents for Premium Cards */}
                  {plan.id === 'standard' && <div className="absolute top-[-20%] right-[-20%] w-[150px] h-[150px] bg-white/10 rounded-full blur-2xl"></div>}
                  {plan.id === 'pro' && <div className="absolute bottom-[-10%] left-[-10%] w-[100px] h-[100px] bg-white/20 rounded-full blur-xl"></div>}

                  <div className="flex justify-between items-start mb-6 z-10">
                    <div>
                      {plan.badge && (
                        <div className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-80 mb-2">
                          {plan.badge}
                        </div>
                      )}
                      <div className="font-serif text-[28px] font-bold tracking-tight leading-none flex items-center gap-2">
                        {plan.icon} {plan.name}
                      </div>
                    </div>
                  </div>

                  <div className="mb-8 z-10">
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-[48px] font-bold tracking-tighter leading-none">₹{price}</span>
                      <span className="text-[12px] font-bold opacity-70">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                    </div>
                    {billingCycle === 'yearly' && plan.id !== 'free' && (
                      <div className="text-[11px] font-bold opacity-70 mt-2">
                        Billed annually (₹{price})
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-4 mt-auto z-10">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="mt-0.5 opacity-80"><Check size={16} strokeWidth={3} /></div>
                        <span className="text-[13px] font-medium leading-snug opacity-90">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Visual Selection Indicator */}
                  {isSelected && (
                    <motion.div 
                      layoutId="outline"
                      className="absolute inset-0 rounded-[24px] border-[3px] border-[#111111] pointer-events-none"
                      style={{ borderColor: plan.id === 'free' || plan.id === 'basic' ? '#111111' : 'white' }}
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Fixed Bottom Action Area */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-white via-white to-transparent z-20">
        <button
          onClick={handleContinue}
          className="w-full py-[18px] rounded-full font-sans font-semibold text-[16px] shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-[0.98] transition-transform outline-none"
          style={{ 
            backgroundColor: PLANS.find(p => p.id === selectedPlan).theme.button,
            color: PLANS.find(p => p.id === selectedPlan).theme.buttonText,
            border: selectedPlan === 'free' ? '1px solid #EAEAEA' : 'none'
          }}
        >
          {selectedPlan === 'free' ? 'Continue with Free' : `Start 7-Day Free Trial`}
        </button>
      </div>

    </div>
  );
}