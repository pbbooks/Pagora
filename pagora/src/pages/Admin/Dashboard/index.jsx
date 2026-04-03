import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, BookOpen, CreditCard, 
  Cpu, Repeat, Bell, Megaphone, Ticket, 
  Settings, LogOut 
} from 'lucide-react';

// Native Firebase Authentication - FIXED PATH (3 levels deep)
import { auth } from '../../../firebase';
import { signOut } from 'firebase/auth';

// --- SECTION 1: Real-Time Telemetry (Matched exactly to image_db33e4.png bottom-right) ---
const SystemStatus = () => {
  const [time, setTime] = useState('');
  
  useEffect(() => { 
    const updateClock = () => {
      const now = new Date();
      // Format to match: 12:59:03 PM UTC
      const timeString = now.toLocaleTimeString('en-US', { 
        timeZone: 'UTC',
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
      });
      setTime(`${timeString} UTC`);
    };
    
    updateClock();
    const timer = setInterval(updateClock, 1000); 
    return () => clearInterval(timer); 
  }, []);

  return (
    <div className="mt-auto w-full">
      <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#888888] mb-3 ml-2">
        System Status
      </div>
      <div className="flex items-center gap-3 bg-[#111111] border border-white/5 px-4 py-3.5 rounded-2xl w-full shadow-md">
        <div className="w-2 h-2 bg-[#1E6FEA] rounded-full animate-pulse shadow-[0_0_10px_#1E6FEA]"></div>
        <span className="text-[11px] font-bold tracking-[0.15em] text-white uppercase font-sans">
          {time}
        </span>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // --- SECTION 2: Firebase Security Session Termination ---
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin');
    } catch (error) {
      console.error('Session termination failed:', error);
    }
  };

  // --- SECTION 3: 10-Feature Routing Matrix ---
  const navLinks = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview Analytics', exact: true },
    { path: '/admin/dashboard/users', icon: Users, label: 'Reader Registry' },
    { path: '/admin/dashboard/catalog', icon: BookOpen, label: 'Book Catalog' },
    { path: '/admin/dashboard/transactions', icon: CreditCard, label: 'Transactions' },
    { path: '/admin/dashboard/ai-tokens', icon: Cpu, label: 'AI Token Usage' },
    { path: '/admin/dashboard/subscriptions', icon: Repeat, label: 'Subscriptions' },
    { path: '/admin/dashboard/notifications', icon: Bell, label: 'Push Notifications' },
    { path: '/admin/dashboard/campaigns', icon: Megaphone, label: 'Ad Campaigns' },
    { path: '/admin/dashboard/tickets', icon: Ticket, label: 'Support Tickets' },
    { path: '/admin/dashboard/settings', icon: Settings, label: 'Master Settings' },
  ];

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden selection:bg-[#1E6FEA] selection:text-white">
      
      {/* --- SECTION 4: Dark Theme Master Sidebar (Matched to Image Aesthetic) --- */}
      <aside className="w-[300px] bg-[#0A0A0A] border-r border-white/5 flex flex-col z-20 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
        
        {/* Brand Architecture */}
        <div className="p-8 pb-8">
          <h1 className="font-serif text-[32px] font-black tracking-tighter text-white leading-none">Pagora.</h1>
          <p className="text-[9px] font-sans font-bold tracking-[0.3em] text-[#888888] uppercase mt-3">Master Admin</p>
        </div>

        {/* Dynamic Navigation Engine */}
        <nav className="flex-1 overflow-y-auto hide-scrollbar px-4 py-2 space-y-1.5">
          {navLinks.map((link) => {
            const isActive = link.exact 
              ? location.pathname === link.path 
              : location.pathname.startsWith(link.path);

            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 outline-none ${
                  isActive 
                    ? 'bg-[#1E6FEA] text-white font-bold shadow-[0_4px_14px_rgba(30,111,234,0.3)]' 
                    : 'text-[#888888] font-medium hover:bg-white/5 hover:text-white'
                }`}
              >
                <link.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-white" : "opacity-70"} />
                <span className="text-[13px] tracking-wide">{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Security & Status Area */}
        <div className="p-6 flex flex-col gap-5 bg-[#0A0A0A]">
          <SystemStatus />
          
          <button 
            onClick={handleLogout} 
            className="flex items-center justify-center gap-3 w-full px-4 py-3.5 bg-transparent text-[#888888] font-bold text-[13px] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-xl transition-colors outline-none border border-transparent hover:border-[#FF3B30]/20"
          >
            <LogOut size={16} strokeWidth={2.5} /> Terminate Session
          </button>
        </div>
      </aside>

      {/* --- SECTION 5: Dynamic Content Injection Area (<Outlet />) --- */}
      {/* Background set to very dark off-black #050505 to match the image depth */}
      <main className="flex-1 overflow-y-auto relative bg-[#050505] hide-scrollbar">
        {/* Subtle radial gradients to give the background depth without breaking the dark theme */}
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-bl from-[#1E6FEA]/5 to-transparent rounded-full blur-[140px] pointer-events-none z-0"></div>
        <div className="absolute bottom-[-10%] left-[-20%] w-[50%] h-[50%] bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-[120px] pointer-events-none z-0"></div>
        
        {/* Sub-Route Rendering Engine */}
        <div className="relative z-10 w-full h-full min-h-full">
           <Outlet />
        </div>
      </main>

    </div>
  );
}