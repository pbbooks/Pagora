import os

def create_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"CREATED: {path}")

# --- FILE CONTENT DEFINITIONS ---

VITE_CONFIG = """
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
"""

TAILWIND_CONFIG = """
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        pagora: {
          text: '#111111',
          muted: '#888888',
          accent: '#1E6FEA',
          border: '#EAEAEA',
          bg: '#FFFFFF'
        }
      }
    },
  },
  plugins: [],
}
"""

INDEX_HTML = """
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pagora | The Future of Literature</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
  </head>
  <body class="bg-white text-[#111111] antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
"""

FIREBASE_JS = """
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
"""

POCKETBASE_JS = """
import PocketBase from 'pocketbase';
export const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090');
"""

APP_JSX = """
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
"""

SHOWCASE_PAGE = """
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Smartphone, Zap, ShieldCheck } from 'lucide-react';

const EditorialBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none opacity-5">
    <svg className="w-full h-full" viewBox="0 0 100 100">
      <path d="M10,10 Q50,90 90,10" fill="none" stroke="currentColor" strokeWidth="0.1" />
      <path d="M0,50 Q50,0 100,50" fill="none" stroke="currentColor" strokeWidth="0.1" />
    </svg>
  </div>
);

export default function Showcase() {
  return (
    <div className="relative bg-white min-h-screen overflow-hidden">
      <EditorialBackground />
      <nav className="flex justify-between items-center px-12 py-8 relative z-10">
        <div className="font-serif text-3xl font-bold tracking-tighter">Pagora.</div>
        <div className="flex gap-8 font-sans font-semibold text-sm uppercase tracking-widest text-[#888888]">
          <a href="#" className="hover:text-black">Features</a>
          <a href="#" className="hover:text-black">Pricing</a>
          <a href="#" className="hover:text-black">Community</a>
        </div>
      </nav>

      <main className="px-12 pt-20 relative z-10">
        <div className="max-w-4xl">
          <motion.h1 
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="font-serif text-[120px] leading-[0.9] tracking-tighter font-bold mb-12"
          >
            Read. <br/> Beyond. <br/> Limits.
          </motion.h1>
          
          <p className="font-sans text-xl text-[#888888] max-w-xl leading-relaxed mb-12">
            The world's most advanced editorial reading ecosystem. AI-powered summaries, 
            pixel-perfect typography, and a library that understands you.
          </p>

          <div className="flex gap-4">
            <button className="bg-black text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform">
              Get the App <Smartphone size={20}/>
            </button>
            <button className="border border-[#EAEAEA] px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition-colors">
              Watch Preview
            </button>
          </div>
        </div>
      </main>

      <footer className="absolute bottom-12 left-12 right-12 flex justify-between items-end border-t border-[#EAEAEA] pt-12">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#888888]">
          © 2026 Pagora Inc. / Established in Literature
        </div>
      </footer>
    </div>
  );
}
"""

ADMIN_LOGIN = """
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, CheckCircle2, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import * as otplib from 'otplib';

export default function AdminLogin({ onAuthSuccess }) {
  const [step, setStep] = useState(1); // 1: Email, 2: TOTP
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [error, setError] = useState('');

  // The secret used for TOTP (Should match your .env)
  const secret = import.meta.env.VITE_ADMIN_TOTP_SECRET || 'PAGORASECRET12345';
  const otpauth = `otpauth://totp/PagoraAdmin:admin@pagora.ai?secret=${secret}&issuer=Pagora`;

  const handleInitialAuth = (e) => {
    e.preventDefault();
    // Simulate standard Firebase Auth check
    if (email === 'admin@pagora.ai' && password === 'Pagora@2026') {
      setStep(2);
    } else {
      setError('Invalid system credentials.');
    }
  };

  const verifyTOTP = (e) => {
    e.preventDefault();
    const isValid = otplib.authenticator.check(totpCode, secret);
    if (isValid) {
      onAuthSuccess();
    } else {
      setError('Invalid or expired time-based code.');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#FAFAFA] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[32px] p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-[#EAEAEA]">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
            <Shield className="text-white" size={32} />
          </div>
        </div>

        <h2 className="font-serif text-3xl font-bold text-center mb-2">Internal Access</h2>
        <p className="text-center text-[#888888] text-sm mb-10">Verification required for administrative privileges.</p>

        {step === 1 ? (
          <form onSubmit={handleInitialAuth} className="space-y-4">
            <input type="email" placeholder="System ID" required value={email} onChange={e => setEmail(e.target.value)}
                   className="w-full bg-[#F5F5F7] px-6 py-4 rounded-xl outline-none focus:ring-2 ring-black transition-all" />
            <input type="password" placeholder="Key Phrase" required value={password} onChange={e => setPassword(e.target.value)}
                   className="w-full bg-[#F5F5F7] px-6 py-4 rounded-xl outline-none focus:ring-2 ring-black transition-all" />
            {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
            <button className="w-full bg-black text-white py-4 rounded-xl font-bold hover:opacity-90 transition-opacity">Request OTP</button>
          </form>
        ) : (
          <form onSubmit={verifyTOTP} className="space-y-8 flex flex-col items-center">
            <div className="p-4 bg-white border border-[#EAEAEA] rounded-2xl">
              <QRCodeSVG value={otpauth} size={160} />
            </div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#888888]">Scan with Google Authenticator</p>
            
            <input type="text" placeholder="000000" maxLength="6" required value={totpCode} onChange={e => setTotpCode(e.target.value)}
                   className="w-full bg-[#F5F5F7] text-center text-3xl tracking-[0.5em] font-bold px-6 py-4 rounded-xl outline-none border-2 border-black" />
            
            {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
            <button className="w-full bg-black text-white py-4 rounded-xl font-bold hover:opacity-90 transition-opacity">Verify & Enter</button>
          </form>
        )}
      </div>
    </div>
  );
}
"""

ADMIN_DASHBOARD = """
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Users, BarChart3, LogOut, Plus, Trash2, FileUp } from 'lucide-react';
import { pb } from '../../pocketbase';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('inventory');

  const SidebarBtn = ({ id, icon: Icon, label }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all ${activeTab === id ? 'bg-black text-white' : 'text-[#888888] hover:bg-gray-100'}`}
    >
      <Icon size={20} />
      <span className="font-bold text-sm">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#F5F5F7]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-[#EAEAEA] p-6 flex flex-col">
        <div className="font-serif text-2xl font-bold mb-12 px-2">Pagora Admin</div>
        <div className="flex-1 space-y-2">
          <SidebarBtn id="inventory" icon={Package} label="Inventory" />
          <SidebarBtn id="users" icon={Users} label="User Base" />
          <SidebarBtn id="analytics" icon={BarChart3} label="Insights" />
        </div>
        <button onClick={() => window.location.reload()} className="flex items-center gap-4 px-6 py-4 text-red-500 font-bold text-sm">
          <LogOut size={20} /> Exit System
        </button>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 overflow-y-auto p-12">
        <AnimatePresence mode="wait">
          {activeTab === 'inventory' && <InventoryView />}
          {activeTab === 'users' && <UsersView />}
          {activeTab === 'analytics' && <AnalyticsView />}
        </AnimatePresence>
      </main>
    </div>
  );
}

function InventoryView() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    try {
      await pb.collection('books').create(formData);
      alert('Book strictly uploaded to PocketBase.');
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
      <h2 className="font-serif text-4xl font-bold mb-8">Manage Inventory</h2>
      <div className="bg-white rounded-3xl p-8 border border-[#EAEAEA] shadow-sm">
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-[#888888]">Book Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required 
                     className="w-full bg-[#F5F5F7] px-6 py-4 rounded-xl outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-[#888888]">EPUB/PDF File</label>
              <input type="file" onChange={e => setFile(e.target.files[0])} required 
                     className="w-full bg-[#F5F5F7] px-6 py-4 rounded-xl outline-none" />
            </div>
          </div>
          <button className="bg-black text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3">
            <Plus size={20} /> Publish to Main App
          </button>
        </form>
      </div>
    </motion.div>
  );
}

function UsersView() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="font-serif text-4xl font-bold mb-8">User Management</h2>
      <table className="w-full bg-white rounded-3xl overflow-hidden border border-[#EAEAEA]">
        <thead className="bg-[#FAFAFA] border-b border-[#EAEAEA]">
          <tr className="text-left">
            <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-[#888888]">User</th>
            <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-[#888888]">Tier</th>
            <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-[#888888]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EAEAEA]">
          <tr>
            <td className="px-8 py-6 font-bold">test_user@gmail.com</td>
            <td className="px-8 py-6"><span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold">PREMIUM</span></td>
            <td className="px-8 py-6"><button className="text-red-500 hover:opacity-70"><Trash2 size={18}/></button></td>
          </tr>
        </tbody>
      </table>
    </motion.div>
  );
}

function AnalyticsView() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="font-serif text-4xl font-bold mb-8">Ecosystem Insights</h2>
      <div className="grid grid-cols-3 gap-6">
        {[ { l: 'Total Readers', v: '12,840' }, { l: 'Revenue (MTD)', v: '₹4,20,500' }, { l: 'AI Interactions', v: '89.2k' }].map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-[#EAEAEA]">
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#888888] mb-2">{s.l}</p>
            <p className="text-3xl font-serif font-bold">{s.v}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
import { AnimatePresence } from 'framer-motion';
"""

MAIN_JSX = """
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
"""

INDEX_CSS = """
@import "tailwindcss";
@layer base {
  html, body {
    @apply bg-white text-[#111111] font-sans antialiased;
  }
}
.hide-scrollbar::-webkit-scrollbar { display: none; }
"""

# --- EXECUTION ---

print("--- Starting Pagora Landing Build ---")

# Core Config Files
create_file("landing/vite.config.js", VITE_CONFIG)
create_file("landing/tailwind.config.js", TAILWIND_CONFIG)
create_file("landing/index.html", INDEX_HTML)

# Source Files
create_file("landing/src/main.jsx", MAIN_JSX)
create_file("landing/src/index.css", INDEX_CSS)
create_file("landing/src/App.jsx", APP_JSX)
create_file("landing/src/firebase.js", FIREBASE_JS)
create_file("landing/src/pocketbase.js", POCKETBASE_JS)

# Pages
create_file("landing/src/pages/Showcase/index.jsx", SHOWCASE_PAGE)
create_file("landing/src/pages/Admin/Login/index.jsx", ADMIN_LOGIN)
create_file("landing/src/pages/Admin/Dashboard/index.jsx", ADMIN_DASHBOARD)

print("\\n--- BUILD COMPLETE ---")
print("1. cd landing")
print("2. Create .env with Firebase/PocketBase keys")
print("3. npm install")
print("4. npm run dev")
print("5. Use CMD+SHIFT+A to find the hidden Admin Door.")