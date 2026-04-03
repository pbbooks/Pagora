import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Check, Sparkles, Zap, Crown, BookOpen, 
  Minus, Plus, Star, ShieldCheck, Infinity as InfinityIcon, 
  Cpu, DownloadCloud, X
} from 'lucide-react';

// --- SECTION 1: Real Pricing Strategy Data (Preserved Exactly) ---
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

// --- EXTENDED DATA: Feature Matrix ---
const COMPARE_FEATURES = [
  { name: 'Ad-Free Experience', free: false, basic: true, standard: true, premium: true, pro: true },
  { name: 'Offline Reading', free: 'None', basic: '10 Books', standard: 'Unlimited', premium: 'Unlimited', pro: 'Unlimited' },
  { name: 'AI Summaries', free: 'Basic', basic: 'Basic', standard: 'Advanced', premium: 'Deep Explain', pro: 'Deep Explain' },
  { name: 'Audio Text-to-Speech', free: false, basic: false, standard: true, premium: true, pro: true },
  { name: 'OCR Book Scanner', free: false, basic: false, standard: false, premium: 'Unlimited', pro: 'Unlimited' },
  { name: 'Creator Monetization', free: false, basic: false, standard: false, premium: false, pro: true },
];

// --- EXTENDED DATA: FAQs ---
const FAQS = [
  { q: "How does the 7-day free trial work?", a: "When you select a paid plan, you won't be charged for the first 7 days. You can cancel anytime before the trial ends right from your dashboard without being billed." },
  { q: "Can I switch plans later?", a: "Absolutely. You can upgrade or downgrade your plan at any time. Prorated charges or credits will automatically be applied to your next billing cycle." },
  { q: "What happens to my offline books if I downgrade?", a: "If you downgrade to the Free plan, your offline downloads will be temporarily locked until you reconnect to the internet and they are removed from your local storage." },
  { q: "Is the OCR scanner completely unlimited?", a: "Yes, on Premium and Pro+ plans, you can scan as many physical pages as you want to digitize and store them in your personal cloud vault." }
];

export default function PricingPage({ onNavigate }) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [openFaq, setOpenFaq] = useState(null);

  // Core Routing Logic to Payment Gateway - SANITIZED TO PREVENT DATA CLONE ERROR
  const handleContinue = () => {
    if (selectedPlan === 'free') {
      onNavigate('home');
    } else {
      const planDetails = PLANS.find(p => p.id === selectedPlan);
      
      // FIX: Destructure out the unclonable React 'icon' element before routing state
      const { icon, ...sanitizedPlanDetails } = planDetails;
      
      onNavigate('payment', { plan: sanitizedPlanDetails, cycle: billingCycle });
    }
  };

  // --- SECTION 2: High-End Animated Editorial Background Illustration ---
  const PremiumBackground = () => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#FFFFFF]">
      {/* Soft Gradient Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[50%] bg-gradient-to-bl from-[#E2E8F0] to-transparent rounded-full blur-[100px] opacity-70"></div>
      <div className="absolute bottom-[10%] left-[-20%] w-[70%] h-[60%] bg-gradient-to-tr from-[#F1F5F9] to-transparent rounded-full blur-[120px] opacity-80"></div>
      
      {/* Flowing Architectural SVG Mesh */}
      <svg className="absolute w-[200%] h-[200%] opacity-[0.03] top-[-50%] left-[-50%] animate-[spin_120s_linear_infinite]" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid slice">
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

      {/* --- SECTION 3: Fixed Top Header --- */}
      <div className="shrink-0 w-full px-6 pt-12 pb-4 flex justify-between items-center z-20 bg-white/80 backdrop-blur-md border-b border-black/5">
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

      {/* --- Main Content Area (Scrollable) --- */}
      <div className="flex-1 w-full overflow-y-auto hide-scrollbar z-10 pb-32 scroll-smooth">
        <div className="px-0 sm:px-6 flex flex-col items-center w-full max-w-[1200px] mx-auto">
          
          {/* --- SECTION 4: Hero Header & Offer --- */}
          <div className="px-6 w-full flex flex-col items-center mt-8">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="text-[40px] md:text-[56px] font-serif leading-[1.05] tracking-tight font-black text-[#111111] text-center mb-4 mt-2"
            >
              Unlock your full<br/>reading potential
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-[15px] md:text-[18px] text-[#888888] font-sans text-center mb-8 px-4 max-w-[440px] md:max-w-[600px] leading-relaxed"
            >
              Join over 100,000+ readers accessing advanced AI summaries, unlimited offline downloads, and an endless library.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="w-full max-w-md bg-[#111111] rounded-2xl p-4 md:p-5 flex items-center justify-between shadow-[0_8px_20px_rgba(0,0,0,0.1)] mb-10"
            >
              <div>
                <div className="text-[10px] md:text-[11px] uppercase tracking-widest font-bold text-[#D5D6D0] mb-1">Launch Offer</div>
                <div className="text-white font-serif font-bold text-lg md:text-xl leading-none">First 3 months at ₹19/mo</div>
              </div>
              <div className="bg-white/10 p-2 md:p-3 rounded-full">
                <Sparkles size={20} className="text-[#FF6536]" />
              </div>
            </motion.div>

            {/* Billing Toggle */}
            <div className="bg-[#F5F5F7] p-1.5 rounded-full flex relative mb-10 w-full max-w-[320px]">
              <motion.div 
                className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#111111] rounded-full shadow-sm"
                animate={{ left: billingCycle === 'monthly' ? '6px' : 'calc(50%)' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`flex-1 py-3 px-6 text-[14px] font-bold rounded-full relative z-10 transition-colors outline-none ${billingCycle === 'monthly' ? 'text-white' : 'text-[#888888]'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingCycle('yearly')}
                className={`flex-1 py-3 px-6 text-[14px] font-bold rounded-full relative z-10 transition-colors outline-none flex items-center justify-center gap-2 ${billingCycle === 'yearly' ? 'text-white' : 'text-[#888888]'}`}
              >
                Yearly <span className="bg-[#FF3B30] text-white text-[10px] px-2.5 py-0.5 rounded-full tracking-wider">SAVE 30%</span>
              </button>
            </div>
          </div>

          {/* --- SECTION 5: Core Pricing Cards (Horizontal Snap) --- */}
          <div className="w-full flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 px-6 md:px-2 md:justify-center md:flex-wrap pb-12 pt-2">
            {PLANS.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              const price = plan.price[billingCycle];
              
              return (
                <div 
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`shrink-0 w-[290px] md:w-[300px] snap-center rounded-[28px] p-7 flex flex-col transition-all duration-300 cursor-pointer relative overflow-hidden`}
                  style={{ 
                    backgroundColor: plan.theme.bg, 
                    color: plan.theme.text,
                    border: plan.theme.border ? `1px solid ${plan.theme.border}` : '1px solid transparent',
                    transform: isSelected ? 'scale(1)' : 'scale(0.96)',
                    opacity: isSelected ? 1 : 0.6,
                    boxShadow: isSelected ? '0 24px 48px -12px rgba(0,0,0,0.15)' : 'none'
                  }}
                >
                  {/* Premium Accents */}
                  {plan.id === 'standard' && <div className="absolute top-[-20%] right-[-20%] w-[150px] h-[150px] bg-white/10 rounded-full blur-2xl"></div>}
                  {plan.id === 'pro' && <div className="absolute bottom-[-10%] left-[-10%] w-[100px] h-[100px] bg-white/20 rounded-full blur-xl"></div>}

                  <div className="flex justify-between items-start mb-6 z-10">
                    <div>
                      {plan.badge && (
                        <div className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-80 mb-2.5">
                          {plan.badge}
                        </div>
                      )}
                      <div className="font-serif text-[32px] font-bold tracking-tight leading-none flex items-center gap-2">
                        {plan.icon} {plan.name}
                      </div>
                    </div>
                  </div>

                  <div className="mb-8 z-10">
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-[52px] font-black tracking-tighter leading-none">₹{price}</span>
                      <span className="text-[13px] font-bold opacity-70">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                    </div>
                    {billingCycle === 'yearly' && plan.id !== 'free' && (
                      <div className="text-[12px] font-bold opacity-70 mt-2">
                        Billed annually (₹{price})
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-4 mt-auto z-10">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="mt-0.5 opacity-80"><Check size={18} strokeWidth={3} /></div>
                        <span className="text-[14px] font-medium leading-snug opacity-90">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Visual Selection Indicator */}
                  {isSelected && (
                    <motion.div 
                      layoutId="outline"
                      className="absolute inset-0 rounded-[28px] border-[3px] pointer-events-none"
                      style={{ borderColor: plan.id === 'free' || plan.id === 'basic' ? '#111111' : 'white' }}
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* --- SECTION 6: Value Proposition Grid --- */}
          <div className="w-full px-6 py-16 bg-[#F5F5F7]/50 mt-4 rounded-3xl max-w-[1150px] mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-[28px] md:text-[36px] font-serif font-bold text-[#111111] mb-3 tracking-tight">Why upgrade to Premium?</h2>
              <p className="text-[15px] text-[#888888] font-medium">Experience reading without limits.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white p-8 rounded-2xl shadow-sm border border-black/5">
                <div className="w-12 h-12 bg-[#1E6FEA]/10 rounded-xl flex items-center justify-center mb-6">
                  <InfinityIcon size={24} className="text-[#1E6FEA]" />
                </div>
                <h3 className="text-[18px] font-bold text-[#111111] mb-2">Unlimited Offline</h3>
                <p className="text-[14px] text-[#888888] leading-relaxed">Download thousands of books and audiobooks directly to your device for completely internet-free reading on flights or commutes.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-2xl shadow-sm border border-black/5">
                <div className="w-12 h-12 bg-[#FF6536]/10 rounded-xl flex items-center justify-center mb-6">
                  <Cpu size={24} className="text-[#FF6536]" />
                </div>
                <h3 className="text-[18px] font-bold text-[#111111] mb-2">Advanced AI Engine</h3>
                <p className="text-[14px] text-[#888888] leading-relaxed">Chat directly with any book. Ask questions, get chapter summaries, and translate complex paragraphs into simple terms instantly.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-2xl shadow-sm border border-black/5">
                <div className="w-12 h-12 bg-[#111111]/5 rounded-xl flex items-center justify-center mb-6">
                  <ShieldCheck size={24} className="text-[#111111]" />
                </div>
                <h3 className="text-[18px] font-bold text-[#111111] mb-2">Zero Interruptions</h3>
                <p className="text-[14px] text-[#888888] leading-relaxed">Completely remove all banner ads, popups, and sponsored content for a pure, distraction-free reading sanctuary.</p>
              </motion.div>
            </div>
          </div>

          {/* --- SECTION 7: Feature Comparison Matrix (Desktop focus, responsive scroll) --- */}
          <div className="w-full px-6 py-20 max-w-[1150px] mx-auto">
            <h2 className="text-[28px] md:text-[36px] font-serif font-bold text-[#111111] mb-10 tracking-tight text-center">Compare all features</h2>
            <div className="w-full overflow-x-auto hide-scrollbar border border-black/10 rounded-2xl bg-white shadow-sm">
              <table className="w-full min-w-[800px] text-left border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F7] border-b border-black/10">
                    <th className="p-5 text-[13px] uppercase tracking-widest text-[#888888] font-bold w-[30%]">Feature</th>
                    {PLANS.map(p => (
                      <th key={p.id} className="p-5 text-[15px] font-bold text-[#111111] text-center w-[14%]">
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_FEATURES.map((feat, idx) => (
                    <tr key={idx} className="border-b border-black/5 hover:bg-[#F9F9FB] transition-colors">
                      <td className="p-5 text-[15px] font-bold text-[#111111]">{feat.name}</td>
                      {PLANS.map(p => {
                        const val = feat[p.id === 'pro' ? 'pro' : p.id];
                        return (
                          <td key={p.id} className="p-5 text-center text-[14px] font-medium text-[#888888]">
                            {typeof val === 'boolean' ? (
                              val ? <Check size={20} className="text-[#1E6FEA] mx-auto" strokeWidth={3} /> : <Minus size={20} className="text-[#CCCCCC] mx-auto" />
                            ) : (
                              val
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* --- SECTION 8: Interactive FAQ Accordion --- */}
          <div className="w-full px-6 py-16 max-w-[800px] mx-auto">
            <h2 className="text-[28px] md:text-[36px] font-serif font-bold text-[#111111] mb-10 tracking-tight text-center">Frequently asked questions</h2>
            <div className="space-y-4">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="border border-black/10 rounded-2xl overflow-hidden bg-white">
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-6 text-left flex justify-between items-center outline-none"
                  >
                    <span className="text-[16px] font-bold text-[#111111]">{faq.q}</span>
                    <motion.div animate={{ rotate: openFaq === idx ? 45 : 0 }}>
                      <Plus size={20} className="text-[#888888]" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: 'auto', opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-6 text-[15px] text-[#888888] leading-relaxed"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Spacer for Fixed Bottom CTA */}
          <div className="h-24 w-full"></div>

        </div>
      </div>

      {/* --- SECTION 9: Fixed Bottom Action Area (Checkout Trigger) --- */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-white via-white to-transparent z-20 pointer-events-none">
        <div className="max-w-[800px] mx-auto pointer-events-auto">
          <button
            onClick={handleContinue}
            className="w-full py-[20px] rounded-full font-sans font-bold text-[16px] md:text-[18px] shadow-[0_12px_30px_rgba(0,0,0,0.15)] active:scale-[0.98] transition-transform outline-none flex justify-center items-center gap-3"
            style={{ 
              backgroundColor: PLANS.find(p => p.id === selectedPlan).theme.button,
              color: PLANS.find(p => p.id === selectedPlan).theme.buttonText,
              border: selectedPlan === 'free' ? '1px solid #CCCCCC' : 'none'
            }}
          >
            {selectedPlan === 'free' ? 'Continue with Free' : `Start 7-Day Free Trial`}
          </button>
        </div>
      </div>

    </div>
  );
}