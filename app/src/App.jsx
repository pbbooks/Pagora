import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { Home, Search, BookOpen, Save, User } from 'lucide-react';

import AuthPage from './pages/Auth';
import HomePage from './pages/Home';
import LibraryPage from './pages/Library';
import ReaderPage from './pages/Reader';
import ScannerPage from './pages/Scanner';
import AIPage from './pages/AI';
import OnboardingPage from './pages/Onboarding';

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

  if (isAuthChecking) return <div className="min-h-[100dvh] flex items-center justify-center font-serif font-bold text-3xl bg-pagora-base text-pagora-text">Pagora.</div>;
  
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

  const showBottomNav = !['reader', 'auth', 'onboarding'].includes(currentRoute);

  return (
    // Dynamic bottom padding and exact viewport height applied here
    <div className={`w-full min-h-[100dvh] transition-all duration-300 ${showBottomNav ? 'pb-24' : ''} bg-pagora-base`}>
      {renderRoute()}

      {/* Pristine Light Editorial Bottom Navigation */}
      {showBottomNav && (
        <div className="fixed bottom-0 left-0 right-0 h-20 px-8 flex justify-between items-center z-50 bg-pagora-base border-t border-pagora-border safe-area-pb">
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
      <div className={`transition-all duration-300 ${active ? 'text-pagora-text scale-110' : 'text-pagora-muted hover:text-pagora-text'}`}>
        {React.cloneElement(icon, { size: 26, strokeWidth: active ? 2 : 1.5 })}
      </div>
    </button>
  );
}