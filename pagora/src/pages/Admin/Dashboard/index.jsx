
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
