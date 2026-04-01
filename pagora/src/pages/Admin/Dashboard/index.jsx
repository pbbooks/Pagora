import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Users, BarChart3, LogOut, Plus, Trash2, FileUp, CheckCircle2 } from 'lucide-react';
// Corrected relative path to reach src/pocketbase.js
import { pb } from '../../../pocketbase';

// High-End Editorial SVG Illustration (Book & Fountain Pen)
const EditorialBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.03]">
    <svg width="100%" height="100%" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.path 
        d="M150 600C250 630 350 550 400 500M400 500C450 450 550 370 650 400" 
        stroke="#111111" strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, ease: "easeInOut" }}
      />
      <motion.path 
        d="M400 500L600 150L630 180L430 530L400 500Z" 
        fill="#111111"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1 }}
      />
      <motion.circle 
        cx="400" cy="500" r="10" fill="#1E6FEA"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2, type: "spring" }}
      />
      <path d="M100 200H300V500H100V200Z" stroke="#111111" strokeWidth="1" strokeDasharray="4 4" />
      <path d="M500 300H700V600H500V300Z" stroke="#111111" strokeWidth="1" strokeDasharray="4 4" />
    </svg>
  </div>
);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('inventory');

  const SidebarBtn = ({ id, icon: Icon, label }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 outline-none tap-highlight-transparent ${
        activeTab === id 
        ? 'bg-[#111111] text-white shadow-lg scale-[1.02]' 
        : 'text-[#888888] hover:bg-gray-100 hover:text-[#111111]'
      }`}
    >
      <Icon size={20} strokeWidth={activeTab === id ? 2.5 : 2} />
      <span className="font-bold text-[14px] tracking-tight">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#FFFFFF] font-sans text-[#111111] overflow-hidden relative">
      <EditorialBackground />
      
      {/* Sidebar */}
      <aside className="w-80 bg-[#FFFFFF] border-r border-[#EAEAEA] p-8 flex flex-col z-10">
        <div className="font-serif text-[32px] font-bold tracking-tighter mb-12 px-2">Pagora. <span className="text-[12px] font-sans tracking-widest uppercase text-[#888888] block mt-[-4px]">Admin Portal</span></div>
        
        <div className="flex-1 space-y-3">
          <SidebarBtn id="inventory" icon={Package} label="Inventory" />
          <SidebarBtn id="users" icon={Users} label="User Base" />
          <SidebarBtn id="analytics" icon={BarChart3} label="Analytics" />
        </div>

        <button 
          onClick={() => window.location.reload()} 
          className="flex items-center gap-4 px-6 py-4 text-[#FF3B30] font-bold text-sm hover:bg-red-50 rounded-2xl transition-colors mt-auto"
        >
          <LogOut size={20} /> Exit System
        </button>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 overflow-y-auto p-16 z-10 relative">
        <AnimatePresence mode="wait">
          {activeTab === 'inventory' && <InventoryView key="inventory" />}
          {activeTab === 'users' && <UsersView key="users" />}
          {activeTab === 'analytics' && <AnalyticsView key="analytics" />}
        </AnimatePresence>
      </main>
    </div>
  );
}

function InventoryView() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setSuccess(false);
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    
    try {
      // Impact reflects directly on Pagora main app via PocketBase
      await pb.collection('books').create(formData);
      setSuccess(true);
      setTitle('');
      setFile(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      className="max-w-5xl w-full"
    >
      <header className="mb-12">
        <h2 className="font-serif text-[48px] leading-[1.1] font-bold tracking-tighter mb-4">Manage Inventory</h2>
        <p className="text-[#888888] max-w-xl text-[16px] leading-relaxed">Add new literature to the Pagora ecosystem. Files are strictly processed and served via PocketBase storage.</p>
      </header>

      <div className="bg-[#FFFFFF] rounded-[32px] p-10 border border-[#EAEAEA] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-6 right-10 flex items-center gap-2 text-[#34A853] font-bold text-sm bg-[#34A853]/10 px-4 py-2 rounded-full">
            <CheckCircle2 size={16} /> Published to Main App
          </motion.div>
        )}

        <form onSubmit={handleUpload} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#888888] ml-1">Book Title</label>
              <input 
                type="text" value={title} onChange={e => setTitle(e.target.value)} required 
                placeholder="e.g. The Art of Typography"
                className="w-full bg-[#F5F5F7] px-6 py-5 rounded-2xl outline-none focus:ring-2 ring-[#111111] transition-all font-medium" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#888888] ml-1">EPUB/PDF Source</label>
              <div className="relative">
                <input 
                  type="file" onChange={e => setFile(e.target.files[0])} required 
                  className="hidden" id="book-file" 
                />
                <label 
                  htmlFor="book-file" 
                  className="w-full bg-[#F5F5F7] px-6 py-5 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-[#EAEAEA] transition-colors"
                >
                  <span className="text-[#888888] font-medium truncate max-w-[200px]">
                    {file ? file.name : "Choose file..."}
                  </span>
                  <FileUp size={20} className="text-[#111111]" />
                </label>
              </div>
            </div>
          </div>
          
          <button 
            disabled={isUploading}
            className="bg-[#111111] text-white px-10 py-5 rounded-full font-bold text-[15px] flex items-center gap-3 active:scale-95 transition-transform disabled:opacity-50 shadow-xl"
          >
            {isUploading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : <Plus size={20} />}
            Publish to Pagora
          </button>
        </form>
      </div>
    </motion.div>
  );
}

function UsersView() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      className="max-w-6xl w-full"
    >
      <header className="mb-12">
        <h2 className="font-serif text-[48px] leading-[1.1] font-bold tracking-tighter mb-4">User Base</h2>
        <p className="text-[#888888] text-[16px]">Manage account status and subscription tiers for the global reader community.</p>
      </header>

      <div className="bg-[#FFFFFF] rounded-[32px] overflow-hidden border border-[#EAEAEA] shadow-sm">
        <table className="w-full">
          <thead className="bg-[#FAFAFA] border-b border-[#EAEAEA]">
            <tr className="text-left">
              <th className="px-10 py-6 text-[11px] uppercase tracking-widest font-bold text-[#888888]">Reader Identity</th>
              <th className="px-10 py-6 text-[11px] uppercase tracking-widest font-bold text-[#888888]">Subscription Tier</th>
              <th className="px-10 py-6 text-[11px] uppercase tracking-widest font-bold text-[#888888]">Status</th>
              <th className="px-10 py-6 text-[11px] uppercase tracking-widest font-bold text-[#888888] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAEAEA]">
            {[
              { email: 'alex.vance@gmail.com', tier: 'PRO+', status: 'Active' },
              { email: 'm.keller@outlook.com', tier: 'BASIC', status: 'Active' },
              { email: 'sarah_j@pagora.ai', tier: 'STANDARD', status: 'Banned' }
            ].map((u, i) => (
              <tr key={i} className="hover:bg-[#F5F5F7]/30 transition-colors">
                <td className="px-10 py-8 font-bold text-[15px]">{u.email}</td>
                <td className="px-10 py-8">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest ${
                    u.tier === 'PRO+' ? 'bg-orange-100 text-orange-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {u.tier}
                  </span>
                </td>
                <td className="px-10 py-8">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${u.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-[13px] font-semibold text-[#888888]">{u.status}</span>
                  </div>
                </td>
                <td className="px-10 py-8 text-right">
                  <button className="text-[#888888] hover:text-[#FF3B30] transition-colors p-2 rounded-full hover:bg-red-50">
                    <Trash2 size={18}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function AnalyticsView() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      className="max-w-6xl w-full"
    >
      <header className="mb-12">
        <h2 className="font-serif text-[48px] leading-[1.1] font-bold tracking-tighter mb-4">Ecosystem Insights</h2>
        <p className="text-[#888888] text-[16px]">Real-time monitoring of Pagora app performance and reader engagement.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Monthly Readers', val: '24.8k', change: '+12%', color: '#1E6FEA' },
          { label: 'System Revenue', val: '₹8.42L', change: '+8.4%', color: '#111111' },
          { label: 'AI Summaries', val: '142k', change: '+24%', color: '#FF6536' }
        ].map((s, i) => (
          <div key={i} className="bg-white p-10 rounded-[32px] border border-[#EAEAEA] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#F5F5F7] rounded-bl-[100px] z-0 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <p className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#888888] mb-4">{s.label}</p>
              <div className="flex items-end gap-3">
                <p className="text-[42px] font-serif font-bold leading-none">{s.val}</p>
                <span className="text-[13px] font-bold text-green-500 mb-1">{s.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-[#111111] rounded-[32px] p-10 text-white relative overflow-hidden h-[300px] flex flex-col justify-end">
        <div className="absolute top-10 left-10">
          <p className="text-[11px] uppercase tracking-widest font-bold text-white/40 mb-2">Reading Velocity</p>
          <h3 className="font-serif text-3xl">Peak Engagement</h3>
        </div>
        {/* Abstract Sparkline SVG */}
        <svg className="w-full h-[120px] opacity-40" viewBox="0 0 1000 100" preserveAspectRatio="none">
          <motion.path 
            d="M0,80 Q100,20 200,60 T400,40 T600,80 T800,20 T1000,50" 
            fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 4, repeat: Infinity }}
          />
        </svg>
      </div>
    </motion.div>
  );
}