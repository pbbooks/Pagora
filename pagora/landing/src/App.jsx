
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Showcase from './pages/Showcase';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('showcase');
  const [adminAuth, setAdminAuth] = useState(false);

  // Hidden Route Listener (cmd+shift+a)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.metaKey && e.shiftKey && e.key === 'A') {
        setCurrentRoute('admin-login');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderRoute = () => {
    switch(currentRoute) {
      case 'admin-login': 
        return <AdminLogin onAuthSuccess={() => { setAdminAuth(true); setCurrentRoute('admin-dash'); }} />;
      case 'admin-dash': 
        return adminAuth ? <AdminDashboard /> : <AdminLogin onAuthSuccess={() => setAdminAuth(true)} />;
      default: 
        return <Showcase />;
    }
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {renderRoute()}
      </AnimatePresence>
    </div>
  );
}
