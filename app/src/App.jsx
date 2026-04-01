import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from './firebase';
import { Home, Library, Search, User, Camera, BrainCircuit } from 'lucide-react';

import AuthPage from './pages/Auth';
import HomePage from './pages/Home';
import LibraryPage from './pages/Library';
import ReaderPage from './pages/Reader';
import ScannerPage from './pages/Scanner';
import AIPage from './pages/AI';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentRoute, setCurrentRoute] = useState('home');
  const [routeData, setRouteData] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth); // Fallback real auth per strict rules
      } catch (e) {
        console.error("Auth init failed", e);
      }
    };
    initAuth();

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

  if (isAuthChecking) return <div className="min-h-screen flex items-center justify-center font-bold text-3xl">Pagora.</div>;
  if (!user && currentRoute !== 'auth') return <AuthPage onNavigate={navigate} />;

  const renderRoute = () => {
    switch (currentRoute) {
      case 'home': return <HomePage onNavigate={navigate} user={user} />;
      case 'library': return <LibraryPage onNavigate={navigate} user={user} />;
      case 'reader': return <ReaderPage onNavigate={navigate} bookData={routeData} user={user} />;
      case 'scanner': return <ScannerPage onNavigate={navigate} user={user} />;
      case 'ai': return <AIPage onNavigate={navigate} user={user} />;
      default: return <HomePage onNavigate={navigate} user={user} />;
    }
  };

  const showBottomNav = !['reader', 'auth'].includes(currentRoute);

  return (
    <div className="w-full min-h-screen pb-24">
      {renderRoute()}

      {showBottomNav && (
        <div className="fixed bottom-0 left-0 right-0 h-20 px-6 flex justify-between items-center z-50 backdrop-blur-xl border-t border-pagora-accent bg-pagora-elevated/90">
          <NavBtn icon={<Home/>} label="Home" active={currentRoute === 'home'} onClick={() => navigate('home')} />
          <NavBtn icon={<Library/>} label="Library" active={currentRoute === 'library'} onClick={() => navigate('library')} />
          <NavBtn icon={<Camera/>} label="Scan" active={currentRoute === 'scanner'} onClick={() => navigate('scanner')} />
          <NavBtn icon={<BrainCircuit/>} label="AI" active={currentRoute === 'ai'} onClick={() => navigate('ai')} />
        </div>
      )}
    </div>
  );
}

function NavBtn({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center w-16 gap-1 transition-all">
      <div className={`transition-transform duration-300 ${active ? '-translate-y-1 text-pagora-primary' : 'text-pagora-muted'}`}>
        {React.cloneElement(icon, { size: 24, strokeWidth: active ? 2.5 : 2 })}
      </div>
      <span className={`text-[10px] font-bold ${active ? 'text-pagora-primary' : 'text-pagora-muted'}`}>{label}</span>
    </button>
  );
}
