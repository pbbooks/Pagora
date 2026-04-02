import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Showcase from './pages/Showcase';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';

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

  return (
    <div className="min-h-screen bg-white">
      {/* AnimatePresence maps to the current URL location. 
        This ensures seamless page transitions between the 10-section Showcase 
        and the Admin UI without any browser reloading or white screen flashing.
      */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          
          {/* EXACT PATH: Public Landing Showcase */}
          <Route path="/" element={<Showcase />} />

          {/* EXACT PATH: Secure Admin Layer */}
          <Route 
            path="/admin" 
            element={
              adminAuth 
                ? <AdminDashboard /> 
                : <AdminLogin onAuthSuccess={() => setAdminAuth(true)} />
            } 
          />

          {/* STRICT FALLBACK: Redirect all unknown URLs back to the Showcase */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AnimatePresence>
    </div>
  );
}