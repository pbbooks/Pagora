import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { Home, Search, BookOpen, Save, User } from 'lucide-react';
import { motion } from 'framer-motion';

import AuthPage from './pages/Auth';
import HomePage from './pages/Home';
import LibraryPage from './pages/Library';
import ReaderPage from './pages/Reader';
import ScannerPage from './pages/Scanner';
import AIPage from './pages/AI';
import OnboardingPage from './pages/Onboarding';
import PricingPage from './pages/Pricing';
import PaymentPage from './pages/Payment';

// High-End Global SVG Illustration Background
const PremiumGlobalBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#FFFFFF]">
    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-bl from-[#F8FAFC] to-transparent rounded-full blur-[100px] opacity-60"></div>
    <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-tr from-[#F1F5F9] to-transparent rounded-full blur-[120px] opacity-70"></div>
    <svg className="absolute w-[200%] h-[200%] opacity-[0.03] top-[-50%] left-[-50%] animate-[spin_180s_linear_infinite]" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid slice">
      <circle cx="250" cy="250" r="100" fill="none" stroke="#111111" strokeWidth="0.5" />
      <circle cx="250" cy="250" r="150" fill="none" stroke="#111111" strokeWidth="0.5" />
      <circle cx="250" cy="250" r="200" fill="none" stroke="#111111" strokeWidth="0.5" />
      <circle cx="250" cy="250" r="250" fill="none" stroke="#111111" strokeWidth="0.5" />
      <path d="M 250,0 L 250,500" stroke="#111111" strokeWidth="0.5" />
      <path d="M 0,250 L 500,250" stroke="#111111" strokeWidth="0.5" />
    </svg>
  </div>
);

export default function App() {
  const [user, setUser] = useState(null);
  
  // Intercept first-time users strictly via localStorage
  const [currentRoute, setCurrentRoute] = useState(() => {
    return localStorage.getItem('pagora_onboarded') === 'true' ? 'home' : 'onboarding';
  });
  
  const [routeData, setRouteData] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    // Strict authentication listener.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  const navigate = (route, data = null) => {
    setRouteData(data);
    setCurrentRoute(route);
    window.scrollTo(0, 0);
  };

  // High-End Animated Launch Screen matching the editorial typography
  if (isAuthChecking) {
    return (
      <div className="fixed inset-0 w-full bg-[#FFFFFF] flex flex-col items-center justify-center z-50">
        <PremiumGlobalBackground />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-[#111111] font-serif font-bold text-[56px] tracking-tight leading-none z-10"
        >
          Pagora.
        </motion.div>
      </div>
    );
  }
  
  // Strict Route Guard: Ensure we don't block the onboarding flow, but force Auth if not logged in
  if (!user && currentRoute !== 'auth' && currentRoute !== 'onboarding') {
    // Sync state so rendering catches up to the forced block
    setTimeout(() => setCurrentRoute('auth'), 0);
    return <AuthPage onNavigate={navigate} />;
  }

  const renderRoute = () => {
    switch (currentRoute) {
      case 'onboarding': return <OnboardingPage onComplete={() => navigate(!user ? 'auth' : 'home')} />;
      case 'auth': return <AuthPage onNavigate={navigate} />;
      case 'pricing': return <PricingPage onNavigate={navigate} />;
      case 'payment': return <PaymentPage onNavigate={navigate} routeData={routeData} />;
      case 'home': return <HomePage onNavigate={navigate} user={user} />;
      case 'search': return <AIPage onNavigate={navigate} user={user} />; // Routing Search to the AI logic engine
      case 'library': return <LibraryPage onNavigate={navigate} user={user} />;
      case 'saved': return <LibraryPage onNavigate={navigate} user={user} />; // Route for saved Favourites
      case 'profile': return <HomePage onNavigate={navigate} user={user} />; // Route for user settings
      case 'reader': return <ReaderPage onNavigate={navigate} bookData={routeData} user={user} />;
      case 'scanner': return <ScannerPage onNavigate={navigate} user={user} />;
      default: return <HomePage onNavigate={navigate} user={user} />;
    }
  };

  // Strictly hide bottom navigation on reading, auth, onboarding, pricing, and payment screens
  const showBottomNav = !['reader', 'auth', 'onboarding', 'pricing', 'payment'].includes(currentRoute);

  return (
    <div className={`w-full min-h-[100dvh] transition-all duration-300 ${showBottomNav ? 'pb-24' : ''} bg-transparent relative`}>
      <PremiumGlobalBackground />

      {/* Primary View Router */}
      <div className="relative z-10 w-full h-full">
        {renderRoute()}
      </div>

      {/* Pristine Light Editorial Bottom Navigation */}
      {showBottomNav && (
        <div className="fixed bottom-0 left-0 right-0 h-20 px-8 flex justify-between items-center z-50 bg-[#FFFFFF]/90 backdrop-blur-md border-t border-[#EAEAEA] safe-area-pb">
          <NavBtn icon={<Home/>} active={currentRoute === 'home'} onClick={() => navigate('home')} />
          <NavBtn icon={<Search/>} active={currentRoute === 'search'} onClick={() => navigate('search')} />
          <NavBtn icon={<BookOpen/>} active={currentRoute === 'library'} onClick={() => navigate('library')} />
          <NavBtn icon={<Save/>} active={currentRoute === 'saved'} onClick={() => navigate('saved')} />
          <NavBtn icon={<User/>} active={currentRoute === 'profile'} onClick={() => navigate('profile')} />
        </div>
      )}
    </div>
  );
}

// Minimalist Icon Navigation Button (No Text Labels)
function NavBtn({ icon, active, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center p-2 transition-all outline-none tap-highlight-transparent">
      <div className={`transition-all duration-300 ${active ? 'text-[#111111] scale-110' : 'text-[#888888] hover:text-[#111111]'}`}>
        {React.cloneElement(icon, { size: 26, strokeWidth: active ? 2.5 : 1.5 })}
      </div>
    </button>
  );
}