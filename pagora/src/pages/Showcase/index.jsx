import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Smartphone, CheckCircle2, Zap, ShieldCheck } from 'lucide-react';

// --- HIGH-END SVG BACKGROUND ILLUSTRATIONS ---
const EditorialBackground = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-[#1E6FEA] rounded-full blur-[180px] opacity-10"></div>
    <svg className="absolute w-full h-full opacity-[0.05]" viewBox="0 0 1000 1000" fill="none" preserveAspectRatio="xMidYMid slice">
      <motion.path 
        d="M-100 200 C 300 100 600 400 1100 200 M-100 220 C 300 120 600 420 1100 220 M-100 240 C 300 140 600 440 1100 240" 
        stroke="currentColor" strokeWidth="1.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 5, ease: "easeInOut" }}
      />
      <motion.path 
        d="M-100 800 C 400 900 500 600 1100 800 M-100 820 C 400 920 500 620 1100 820" 
        stroke="currentColor" strokeWidth="1.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 5, ease: "easeInOut", delay: 0.5 }}
      />
    </svg>
  </div>
);

// --- BESPOKE SVG GRAPHICS ---
const BookGraphic = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 mb-6" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 20 L45 30 L45 80 L20 70 Z" fill="currentColor" fillOpacity="0.05" />
    <path d="M80 20 L55 30 L55 80 L80 70 Z" fill="currentColor" fillOpacity="0.1" />
    <path d="M45 30 L55 30 L55 80 L45 80 Z" fill="currentColor" />
    <line x1="25" y1="35" x2="40" y2="40" strokeWidth="1" />
    <line x1="25" y1="45" x2="40" y2="50" strokeWidth="1" />
    <line x1="60" y1="40" x2="75" y2="35" strokeWidth="1" />
  </svg>
);

const AIGraphic = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 mb-6" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="50" cy="50" r="30" strokeDasharray="4 4" />
    <circle cx="50" cy="50" r="15" fill="#1E6FEA" stroke="none" opacity="0.2" />
    <path d="M50 20 L50 35 M50 65 L50 80 M20 50 L35 50 M65 50 L80 50" />
    <circle cx="50" cy="50" r="4" fill="currentColor" />
  </svg>
);

const SyncGraphic = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 mb-6" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="20" y="30" w="60" h="40" rx="4" />
    <path d="M30 70 L70 70 L60 85 L40 85 Z" fill="currentColor" fillOpacity="0.05" />
    <circle cx="50" cy="50" r="6" fill="currentColor" />
    <path d="M65 40 A 10 10 0 0 0 80 30" stroke="#1E6FEA" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function Showcase() {
  // --- REAL-TIME LOGIC ---
  const [currentTime, setCurrentTime] = useState(new Date());
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState('idle');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setSubStatus('error');
      return;
    }
    setSubStatus('loading');
    setTimeout(() => {
      setSubStatus('success');
      setEmail('');
    }, 1200);
  };

  // --- SCROLL COLOR MORPHING HOOKS ---
  const { scrollYProgress } = useScroll();
  const bg = useTransform(scrollYProgress, [0, 0.3, 0.6, 0.8, 1], ["#FFFFFF", "#F8FAFC", "#FFFFFF", "#111111", "#050505"]);
  const text = useTransform(scrollYProgress, [0, 0.6, 0.8, 1], ["#111111", "#111111", "#FFFFFF", "#FFFFFF"]);
  const border = useTransform(scrollYProgress, [0, 0.6, 0.8, 1], ["rgba(17, 17, 17, 0.1)", "rgba(17, 17, 17, 0.1)", "rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.1)"]);
  const invertBg = useTransform(scrollYProgress, [0, 0.6, 0.8, 1], ["#111111", "#111111", "#FFFFFF", "#FFFFFF"]);
  const invertText = useTransform(scrollYProgress, [0, 0.6, 0.8, 1], ["#FFFFFF", "#FFFFFF", "#111111", "#111111"]);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div 
      style={{ backgroundColor: bg, color: text }} 
      className="relative min-h-screen overflow-x-hidden selection:bg-[#1E6FEA] selection:text-white transition-colors duration-300"
    >
      <EditorialBackground />

      {/* SECTION 1: Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
        style={{ borderColor: border }}
        className="fixed top-0 left-0 right-0 px-8 md:px-16 py-6 flex justify-between items-center z-50 backdrop-blur-md border-b"
      >
        <div className="font-serif text-2xl font-bold tracking-tighter">Pagora.</div>
        <div className="hidden md:flex gap-10 font-sans font-bold text-[11px] uppercase tracking-[0.2em]">
          <a href="#philosophy" className="hover:opacity-50 transition-opacity">Philosophy</a>
          <a href="#engine" className="hover:opacity-50 transition-opacity">The Engine</a>
          <a href="#access" className="hover:opacity-50 transition-opacity">Access</a>
        </div>
      </motion.nav>

      {/* SECTION 2: Hero */}
      <section className="relative pt-[30vh] pb-[15vh] px-8 md:px-16 z-10 flex flex-col items-center text-center">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-5xl">
          <h1 className="font-serif text-[80px] md:text-[150px] leading-[0.9] tracking-tighter font-bold mb-8">
            Literature,<br /> <span className="italic font-light opacity-50">Elevated.</span>
          </h1>
          <p className="font-sans text-lg md:text-2xl opacity-60 font-medium max-w-2xl mx-auto leading-relaxed mb-12">
            The world's most pristine reading ecosystem. Native EPUB rendering, intelligent AI synthesis, and flawless typography.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button 
              style={{ backgroundColor: invertBg, color: invertText }}
              className="px-10 py-5 rounded-full font-bold text-[14px] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl"
            >
              Download for iOS <Smartphone size={18} />
            </motion.button>
            <motion.button 
              style={{ borderColor: border }}
              className="bg-transparent border px-10 py-5 rounded-full font-bold text-[14px] hover:opacity-50 transition-colors"
            >
              Explore Architecture
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* SECTION 3: The Philosophy */}
      <motion.section style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: border }} id="philosophy" className="py-32 px-8 md:px-16 z-10 relative">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="max-w-4xl mx-auto text-center">
          <h2 className="font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-[#1E6FEA] mb-8">The Manifesto</h2>
          <p className="font-serif text-3xl md:text-5xl leading-[1.2] tracking-tight font-medium">
            We believe reading should be an <span className="italic">immersive</span> experience. No distractions, no clutter. Just you, the author's words, and an engine that understands context.
          </p>
        </motion.div>
      </motion.section>

      {/* SECTION 4: Feature Grid */}
      <section id="engine" className="py-32 px-8 md:px-16 z-10 relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex flex-col">
            <BookGraphic />
            <h3 className="font-serif text-3xl font-bold mb-4 tracking-tight">Native EPUB</h3>
            <p className="font-sans opacity-60 leading-relaxed text-[15px]">
              A bespoke rendering engine built from the ground up. Supports complex CSS, flawless pagination, and instant chapter loading without browser-wrapper lag.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }} className="flex flex-col">
            <AIGraphic />
            <h3 className="font-serif text-3xl font-bold mb-4 tracking-tight">Contextual AI</h3>
            <p className="font-sans opacity-60 leading-relaxed text-[15px]">
              Highlight any paragraph to instantly generate summaries, define archaic terminology, or cross-reference historical contexts in real-time.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.4 }} className="flex flex-col">
            <SyncGraphic />
            <h3 className="font-serif text-3xl font-bold mb-4 tracking-tight">Database Sync</h3>
            <p className="font-sans opacity-60 leading-relaxed text-[15px]">
              Your library, highlights, and exact reading positions are synchronized across all devices in milliseconds using our private cloud infrastructure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 5: Cross-Platform Execution */}
      <motion.section style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: border }} className="py-24 px-8 md:px-16 z-10 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-sans text-[11px] font-bold uppercase tracking-[0.3em] opacity-50 mb-6">Cross-Platform</h2>
          <p className="font-serif text-3xl md:text-5xl leading-[1.2] tracking-tight font-medium mb-8">
            Read on iOS. Resume on Desktop.
          </p>
          <p className="font-sans text-lg opacity-60 leading-relaxed max-w-2xl mx-auto">
            Our real-time PocketBase integration ensures your reading position and annotations are perpetually synchronized across all your native applications in under 50 milliseconds.
          </p>
        </div>
      </motion.section>

      {/* SECTION 6: Immersive Typography Showcase */}
      <section className="py-32 px-8 md:px-16 z-10 relative overflow-hidden">
        <div className="absolute right-[-5%] top-0 opacity-[0.03] pointer-events-none">
          <h1 className="font-serif text-[400px] leading-none tracking-tighter">A</h1>
        </div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-4xl relative z-10">
          <h2 className="font-sans text-[11px] font-bold uppercase tracking-[0.3em] opacity-50 mb-6">Design Engineering</h2>
          <h3 className="font-serif text-5xl md:text-7xl font-bold tracking-tighter mb-8">Pixel-Perfect<br />Typography.</h3>
          <p className="font-sans text-xl opacity-60 max-w-2xl leading-relaxed">
            Every margin, line-height, and kerning value is mathematically calculated. We paired <strong>Playfair Display</strong> with <strong>Inter</strong> to create a reading environment that reduces eye strain and mimics the physical page.
          </p>
        </motion.div>
      </section>

      {/* SECTION 7: The AI Engine Detail */}
      <section className="py-32 px-8 md:px-16 z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex-1">
            <motion.div style={{ backgroundColor: "rgba(128,128,128,0.05)", borderColor: border }} className="border rounded-[40px] p-10 md:p-16 shadow-2xl relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#1E6FEA] to-transparent opacity-50"></div>
              <p className="font-serif text-2xl leading-relaxed mb-6">
                "The ship tore through the hyper-lane, engines screaming a frequency only the navigator could feel in his teeth."
              </p>
              <motion.div style={{ backgroundColor: bg, borderColor: border }} className="p-6 rounded-2xl border shadow-sm">
                <p className="font-sans text-[13px] font-bold text-[#1E6FEA] uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Zap size={14} /> AI Analysis
                </p>
                <p className="font-sans text-[14px] leading-relaxed">
                  The author uses synesthesia (feeling sound in teeth) to convey the intense, almost physical pressure of faster-than-light travel.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex-1">
            <h2 className="font-serif text-5xl font-bold tracking-tighter mb-6">Ask your books.</h2>
            <p className="font-sans text-lg opacity-60 leading-relaxed mb-8">
              Stop switching apps to look up definitions or context. Pagora's integrated neural engine processes your current chapter in real-time, providing immediate clarity on complex plots, historical references, and vocabulary.
            </p>
            <ul className="space-y-4">
              {['Real-time chapter summarization', 'Character arc tracking', 'Historical context generation'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-sans font-semibold">
                  <CheckCircle2 className="text-[#1E6FEA]" size={20} /> {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* SECTION 8: Security & Storage */}
      <motion.section style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: border }} className="py-24 px-8 md:px-16 z-10 relative text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-3xl mx-auto">
          <motion.div style={{ backgroundColor: invertBg, color: invertText }} className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
            <ShieldCheck size={32} />
          </motion.div>
          <h2 className="font-serif text-4xl font-bold tracking-tighter mb-4">Your Library, Secured.</h2>
          <p className="font-sans text-lg opacity-60 leading-relaxed">
            Powered by modern Authentication and PocketBase Object Storage. Your personal EPUBs and PDFs are encrypted and private. We do not read, scan, or sell your personal literature.
          </p>
        </motion.div>
      </motion.section>

      {/* SECTION 9: Access CTA & Newsletter */}
      <section id="access" className="py-32 px-8 md:px-16 z-10 relative max-w-4xl mx-auto text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tighter mb-8">Begin Reading.</h2>
          <p className="font-sans text-xl opacity-60 mb-12">Join the beta waitlist for early access to the Pagora iOS Application.</p>
          
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
            <motion.input 
              style={{ backgroundColor: "rgba(128,128,128,0.1)", borderColor: border }}
              type="email" 
              placeholder="Enter your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={subStatus === 'loading' || subStatus === 'success'}
              className="flex-1 px-6 py-5 rounded-full outline-none font-medium transition-all border focus:border-[#1E6FEA]"
            />
            <motion.button 
              type="submit"
              disabled={subStatus === 'loading' || subStatus === 'success'}
              style={subStatus === 'success' ? { backgroundColor: '#1E6FEA', color: '#FFF' } : { backgroundColor: invertBg, color: invertText }}
              className="px-10 py-5 rounded-full font-bold text-[14px] flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              {subStatus === 'loading' ? 'Joining...' : 
               subStatus === 'success' ? 'Added to List ✓' : 
               <>Request Access <ArrowRight size={18}/></>}
            </motion.button>
          </form>
          {subStatus === 'error' && <p className="text-red-500 font-bold text-sm mt-4">Please enter a valid email address.</p>}
        </motion.div>
      </section>

      {/* SECTION 10: 5-Column Mega Footer */}
      <motion.footer style={{ borderTopWidth: 1, borderColor: border }} className="px-8 md:px-16 py-16 z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 max-w-7xl mx-auto">
          
          {/* Column 1: Brand & Manifesto */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            <div className="font-serif text-3xl font-bold tracking-tighter">Pagora.</div>
            <p className="text-[12px] opacity-60 leading-relaxed font-sans">
              Literature, elevated. A pristine reading ecosystem designed for maximum immersion and seamless synchronization.
            </p>
          </div>

          {/* Column 2: Ecosystem Links */}
          <div className="flex flex-col gap-3 font-sans text-[11px] font-bold uppercase tracking-[0.2em]">
            <span className="opacity-40 mb-2">Ecosystem</span>
            <a href="#engine" className="hover:text-[#1E6FEA] transition-colors">The Engine</a>
            <a href="#access" className="hover:text-[#1E6FEA] transition-colors">Request Access</a>
            <a href="/admin" className="hover:text-[#1E6FEA] transition-colors">System Admin</a>
          </div>

          {/* Column 3: Legal & Privacy */}
          <div className="flex flex-col gap-3 font-sans text-[11px] font-bold uppercase tracking-[0.2em]">
            <span className="opacity-40 mb-2">Legal</span>
            <a href="#" className="hover:opacity-60 transition-opacity">Privacy Policy</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Terms of Service</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Security Metrics</a>
          </div>

          {/* Column 4: Social SVG Icons (Hardcoded inline SVGs to fix Lucide deprecation) */}
          <div className="flex flex-col gap-3 font-sans text-[11px] font-bold uppercase tracking-[0.2em]">
            <span className="opacity-40 mb-2">Social Connect</span>
            <div className="flex gap-5 mt-1">
              <a href="#" aria-label="Twitter" className="hover:text-[#1E6FEA] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5 0.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
              <a href="#" aria-label="GitHub" className="hover:text-[#1E6FEA] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                  <path d="M9 18c-4.51 2-5-2-7-2"/>
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-[#1E6FEA] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-[#1E6FEA] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 5: Real-Time Clock & Status */}
          <div className="flex flex-col gap-3 font-sans text-[11px] font-bold uppercase tracking-[0.2em]">
            <span className="opacity-40 mb-2">System Status</span>
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-current/10 w-fit">
              <div className="w-2 h-2 rounded-full bg-[#1E6FEA] animate-pulse shadow-[0_0_8px_#1E6FEA]"></div>
              <span>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} UTC</span>
            </div>
            <span className="text-[9px] opacity-40 mt-1">All Systems Operational</span>
          </div>

        </div>
      </motion.footer>
    </motion.div>
  );
}