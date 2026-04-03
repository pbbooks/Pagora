import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Master Components
import Showcase from './pages/Showcase';
import PricingPage from './pages/Pricing';
import PaymentPage from './pages/Payment';

// Admin Components
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminUsers from './pages/Admin/Dashboard/Users';

export default function App() {
  const [adminAuth, setAdminAuth] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // --- REAL-TIME LOGIC: Hidden Admin Route Listener (cmd+shift+a) ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Secure interception: Navigates strictly to the admin portal via URL
      if (e.metaKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        navigate('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Custom Intercept Handler for Commercial Routing (Pricing -> Payment)
  const handleNavigate = (path, state) => {
    if (path === 'home') navigate('/');
    else navigate(`/${path}`, { state });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* AnimatePresence maps to the current URL location. 
        This ensures seamless page transitions between the 10-section Showcase 
        and the Admin UI without any browser reloading or white screen flashing.
      */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          
          {/* EXACT PATH: Public Landing Showcase & Commercial Gateways */}
          <Route path="/" element={<Showcase />} />
          <Route path="/pricing" element={<PricingPage onNavigate={handleNavigate} />} />
          <Route path="/payment" element={<PaymentPage onNavigate={handleNavigate} />} />

          {/* EXACT PATH: Secure Admin Layer Authentication */}
          <Route 
            path="/admin" 
            element={
              adminAuth 
                ? <Navigate to="/admin/dashboard" replace /> 
                : <AdminLogin onAuthSuccess={() => setAdminAuth(true)} />
            } 
          />

          {/* PROTECTED NESTED ROUTES: 10-Feature Admin Dashboard */}
          {adminAuth && (
            <Route path="/admin/dashboard" element={<AdminDashboard />}>
              <Route index element={<div className="p-8 text-white font-sans text-2xl font-bold tracking-tight">Overview Analytics</div>} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="catalog" element={<div className="p-8 text-white font-sans text-2xl font-bold tracking-tight">Book Catalog</div>} />
              <Route path="transactions" element={<div className="p-8 text-white font-sans text-2xl font-bold tracking-tight">PayU Transactions</div>} />
              <Route path="ai-tokens" element={<div className="p-8 text-white font-sans text-2xl font-bold tracking-tight">AI Token Usage</div>} />
              <Route path="subscriptions" element={<div className="p-8 text-white font-sans text-2xl font-bold tracking-tight">Subscriptions</div>} />
              <Route path="notifications" element={<div className="p-8 text-white font-sans text-2xl font-bold tracking-tight">Push Notifications</div>} />
              <Route path="campaigns" element={<div className="p-8 text-white font-sans text-2xl font-bold tracking-tight">Ad Campaigns</div>} />
              <Route path="tickets" element={<div className="p-8 text-white font-sans text-2xl font-bold tracking-tight">Support Tickets</div>} />
              <Route path="settings" element={<div className="p-8 text-white font-sans text-2xl font-bold tracking-tight">Master Settings</div>} />
            </Route>
          )}

          {/* STRICT FALLBACK: Redirect all unknown URLs back to the Showcase */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AnimatePresence>
    </div>
  );
}