import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Users, BarChart3, LogOut, Plus, Trash2, FileUp, Activity, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { pb } from '../../../pocketbase';

// --- SECTION 1: High-End Editorial SVG Background ---
const CinematicBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#FAFAFA]">
    <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-gradient-to-bl from-[#EAEAEA] to-transparent rounded-full blur-[120px] opacity-40"></div>
    <svg className="absolute w-full h-full opacity-[0.03]" viewBox="0 0 1000 1000" fill="none" preserveAspectRatio="xMidYMid slice">
      <motion.path 
        d="M-100 200 C 300 100 600 400 1100 200 M-100 220 C 300 120 600 420 1100 220" 
        stroke="#111111" strokeWidth="1.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 10, ease: "linear", repeat: Infinity }}
      />
      {/* Abstract geometric pages floating */}
      <motion.rect x="800" y="700" width="100" height="140" rx="4" transform="rotate(-15 800 700)" stroke="#111111" strokeWidth="2" fill="none" 
        animate={{ y: [0, -20, 0], rotate: [-15, -10, -15] }} transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.rect x="780" y="720" width="100" height="140" rx="4" transform="rotate(-5 780 720)" stroke="#111111" strokeWidth="2" fill="none" 
        animate={{ y: [0, -15, 0], rotate: [-5, -8, -5] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      />
    </svg>
  </div>
);

// --- SECTION 2: Brand Architecture (Recreated from Tote Bag Image) ---
const PagoraBrand = () => (
  <div className="flex flex-col items-center justify-center mb-12 group cursor-default">
    <div className="w-20 h-20 bg-[#111111] rounded-[20px] flex items-center justify-center mb-4 shadow-[0_16px_32px_rgba(0,0,0,0.2)] group-hover:scale-105 transition-transform">
      <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 75V25C25 25 35 15 50 25V75C35 65 25 75 25 75Z" fill="#FFFFFF"/>
        <path d="M75 75V25C75 25 65 15 50 25V75C65 65 75 75 75 75Z" fill="#F0F0F0"/>
        <path d="M40 85L50 75L60 85" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
    <h1 className="font-serif text-[28px] font-bold tracking-tighter text-[#111111] leading-none mb-1">Pagora.</h1>
    <p className="text-[9px] font-sans font-bold tracking-[0.3em] text-[#888888] uppercase">Publishing Engine</p>
  </div>
);

// --- SECTION 3: Real-Time Telemetry Header ---
const TelemetryHeader = ({ title, subtitle }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const timer = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(timer); }, []);

  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 relative z-10">
      <div>
        <h2 className="font-serif text-[42px] leading-[1.1] font-bold tracking-tighter text-[#111111] mb-2">{title}</h2>
        <p className="text-[#666666] text-[15px] font-medium max-w-xl">{subtitle}</p>
      </div>
      <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl border border-[#EAEAEA] shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#34A853] rounded-full animate-pulse"></div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#888888]">DB Sync Live</span>
        </div>
        <div className="w-[1px] h-4 bg-[#EAEAEA]"></div>
        <span className="text-[13px] font-mono font-bold text-[#111111]">{time.toISOString().split('T')[1].split('.')[0]} UTC</span>
      </div>
    </header>
  );
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('inventory');
  
  // Real-time Database State (No Mock Data)
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  // Initial Real-Time Payload Fetch
  useEffect(() => {
    fetchDatabaseState();
  }, []);

  const fetchDatabaseState = async () => {
    setIsFetching(true);
    try {
      const booksRecord = await pb.collection('books').getList(1, 50, { sort: '-created' });
      setBooks(booksRecord.items);
      
      const usersRecord = await pb.collection('users').getList(1, 50, { sort: '-created' });
      setUsers(usersRecord.items);
    } catch (error) {
      console.error("PocketBase Synchronization Error:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const SidebarBtn = ({ id, icon: Icon, label }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 outline-none ${
        activeTab === id 
        ? 'bg-[#111111] text-white shadow-xl scale-[1.02]' 
        : 'text-[#888888] hover:bg-[#F5F5F7] hover:text-[#111111]'
      }`}
    >
      <Icon size={20} strokeWidth={activeTab === id ? 2.5 : 2} />
      <span className="font-bold text-[14px] tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#FAFAFA] font-sans text-[#111111] overflow-hidden relative selection:bg-[#111111] selection:text-white">
      <CinematicBackground />
      
      {/* SECTION 4: Master Sidebar */}
      <aside className="w-[320px] bg-white border-r border-[#EAEAEA] p-8 flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <PagoraBrand />
        
        <div className="flex-1 space-y-2 mt-8">
          <SidebarBtn id="inventory" icon={BookOpen} label="Literature Library" />
          <SidebarBtn id="users" icon={Users} label="Reader Registry" />
          <SidebarBtn id="analytics" icon={BarChart3} label="Ecosystem Insights" />
        </div>

        <button 
          onClick={() => { pb.authStore.clear(); window.location.reload(); }} 
          className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-[#FFF0F0] text-[#FF3B30] font-bold text-[13px] hover:bg-[#FFE5E5] rounded-2xl transition-colors mt-auto"
        >
          <LogOut size={18} strokeWidth={2.5} /> Terminate Session
        </button>
      </aside>

      {/* Main Execution Panel */}
      <main className="flex-1 overflow-y-auto p-10 md:p-16 z-10 relative">
        <AnimatePresence mode="wait">
          {activeTab === 'inventory' && <InventoryView key="inventory" books={books} refreshData={fetchDatabaseState} isFetching={isFetching} />}
          {activeTab === 'users' && <UsersView key="users" users={users} refreshData={fetchDatabaseState} isFetching={isFetching} />}
          {activeTab === 'analytics' && <AnalyticsView key="analytics" booksCount={books.length} usersCount={users.length} />}
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- SECTION 5 & 6: Literature Upload Engine & Live Grid ---
function InventoryView({ books, refreshData, isFetching }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [notice, setNotice] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setNotice(null);
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author || 'Unknown Author');
    if (file) formData.append('file', file);
    
    try {
      // Real PocketBase Create Protocol
      await pb.collection('books').create(formData);
      setNotice({ type: 'success', msg: 'Manuscript published to global library.' });
      setTitle('');
      setAuthor('');
      setFile(null);
      refreshData(); // Sync grid immediately
    } catch (err) {
      setNotice({ type: 'error', msg: 'Upload rejected by storage engine.' });
    } finally {
      setIsUploading(false);
      setTimeout(() => setNotice(null), 4000);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Permanently purge this manuscript from the ecosystem?")) return;
    try {
      await pb.collection('books').delete(id);
      refreshData();
    } catch (err) {
      alert("Failed to purge record.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-6xl w-full mx-auto">
      <TelemetryHeader title="Literature Library" subtitle="Upload, manage, and curate the digital manuscripts available to the global Pagora reader application." />

      {/* Upload Engine */}
      <div className="bg-white rounded-[32px] p-8 md:p-10 border border-[#EAEAEA] shadow-[0_16px_40px_rgba(0,0,0,0.04)] mb-12 relative overflow-hidden">
        {notice && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`absolute top-0 left-0 right-0 py-3 px-10 flex items-center justify-center gap-2 text-[12px] font-bold uppercase tracking-widest text-white ${notice.type === 'success' ? 'bg-[#111111]' : 'bg-[#FF3B30]'}`}>
            {notice.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />} {notice.msg}
          </motion.div>
        )}

        <form onSubmit={handleUpload} className={`space-y-8 ${notice ? 'mt-8' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#888888] ml-1">Manuscript Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. The Art of Typography"
                className="w-full bg-[#F8FAFC] border border-[#EAEAEA] px-5 py-4 rounded-xl outline-none focus:border-[#111111] transition-all font-medium text-[14px]" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#888888] ml-1">Author / Creator</label>
              <input type="text" value={author} onChange={e => setAuthor(e.target.value)} placeholder="e.g. Debbie Berne"
                className="w-full bg-[#F8FAFC] border border-[#EAEAEA] px-5 py-4 rounded-xl outline-none focus:border-[#111111] transition-all font-medium text-[14px]" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#888888] ml-1">Digital Asset (EPUB/PDF)</label>
              <div className="relative">
                <input type="file" onChange={e => setFile(e.target.files[0])} className="hidden" id="book-file" />
                <label htmlFor="book-file" className="w-full bg-[#F8FAFC] border border-[#EAEAEA] px-5 py-4 rounded-xl flex items-center justify-between cursor-pointer hover:border-[#111111] transition-colors">
                  <span className="text-[#888888] font-medium text-[14px] truncate max-w-[150px]">{file ? file.name : "Attach File..."}</span>
                  <FileUp size={18} className="text-[#111111]" />
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end border-t border-[#EAEAEA] pt-6">
            <button disabled={isUploading} className="bg-[#111111] hover:bg-[#222222] text-white px-8 py-4 rounded-xl font-bold text-[13px] uppercase tracking-wide flex items-center gap-3 transition-colors disabled:opacity-50">
              {isUploading ? <RefreshCw size={18} className="animate-spin" /> : <Plus size={18} />} Publish to Ecosystem
            </button>
          </div>
        </form>
      </div>

      {/* Live Database Grid */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-[24px] font-bold text-[#111111]">Active Repository</h3>
        <button onClick={refreshData} className="text-[#888888] hover:text-[#111111] flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider transition-colors">
          <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} /> Sync
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.length === 0 && !isFetching ? (
          <div className="col-span-full bg-white border border-[#EAEAEA] border-dashed rounded-3xl p-16 flex flex-col items-center justify-center text-center">
            <BookOpen size={48} className="text-[#CCCCCC] mb-4" strokeWidth={1} />
            <p className="text-[16px] font-bold text-[#111111] mb-2">Repository is Empty</p>
            <p className="text-[#888888] text-[14px]">Upload your first manuscript using the engine above.</p>
          </div>
        ) : (
          books.map((book) => (
            <motion.div key={book.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-[#EAEAEA] rounded-[24px] p-6 shadow-sm group hover:shadow-xl hover:border-[#111111] transition-all">
              <div className="w-12 h-12 bg-[#F8FAFC] rounded-xl flex items-center justify-center mb-6 border border-[#EAEAEA]">
                <BookOpen size={20} className="text-[#111111]" />
              </div>
              <h4 className="font-serif text-[20px] font-bold text-[#111111] leading-tight mb-2 line-clamp-1">{book.title}</h4>
              <p className="text-[#666666] text-[13px] font-medium mb-6">By {book.author || 'Unknown'}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-[#EAEAEA]">
                <span className="text-[10px] font-mono text-[#888888] bg-[#F8FAFC] px-2 py-1 rounded-md">{book.id.substring(0,8)}</span>
                <button onClick={() => handleDelete(book.id)} className="text-[#888888] hover:text-[#FF3B30] p-2 hover:bg-[#FFF0F0] rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

// --- SECTION 7: Reader Management System ---
function UsersView({ users, refreshData, isFetching }) {
  const handleDelete = async (id) => {
    if(!window.confirm("CRITICAL: Erase this reader's identity from the database?")) return;
    try {
      await pb.collection('users').delete(id);
      refreshData();
    } catch (err) {
      alert("Failed to erase record.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-6xl w-full mx-auto">
      <TelemetryHeader title="Reader Registry" subtitle="Manage global identities, oversee reader access, and enforce security protocols across the application." />

      <div className="bg-white rounded-[32px] overflow-hidden border border-[#EAEAEA] shadow-[0_16px_40px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between p-8 border-b border-[#EAEAEA] bg-[#FAFAFA]">
          <h3 className="font-serif text-[20px] font-bold text-[#111111]">Authenticated Identities</h3>
          <button onClick={refreshData} className="text-[#888888] hover:text-[#111111] flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider transition-colors">
            <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} /> Sync
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-[#888888] border-b border-[#EAEAEA]">Account ID</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-[#888888] border-b border-[#EAEAEA]">Email Identity</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-[#888888] border-b border-[#EAEAEA]">Registration Date</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-[#888888] border-b border-[#EAEAEA] text-right">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA]">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-12 text-center text-[#888888] font-medium text-[14px]">No registered readers found in the database.</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#FAFAFA] transition-colors group">
                    <td className="px-8 py-6 font-mono text-[12px] text-[#666666]">{u.id}</td>
                    <td className="px-8 py-6 font-bold text-[14px] text-[#111111]">{u.email}</td>
                    <td className="px-8 py-6 text-[13px] text-[#666666]">{new Date(u.created).toLocaleDateString()}</td>
                    <td className="px-8 py-6 text-right">
                      <button onClick={() => handleDelete(u.id)} className="text-[#888888] hover:text-[#FF3B30] p-2 hover:bg-[#FFF0F0] rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 size={16}/>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

// --- SECTION 8: Ecosystem Analytics (Real Data Calculations) ---
function AnalyticsView({ booksCount, usersCount }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-6xl w-full mx-auto">
      <TelemetryHeader title="Ecosystem Insights" subtitle="Real-time macroscopic view of database limits, content saturation, and reader acquisition." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-[#111111] p-10 rounded-[32px] text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#1E6FEA] rounded-bl-[100px] opacity-20"></div>
          <p className="text-[11px] uppercase font-bold tracking-[0.2em] text-white/50 mb-4 flex items-center gap-2"><BookOpen size={14}/> Total Manuscripts</p>
          <div className="flex items-end gap-4">
            <p className="text-[64px] font-serif font-bold leading-none">{booksCount}</p>
            <span className="text-[13px] font-medium text-[#34A853] mb-2 px-3 py-1 bg-[#34A853]/10 rounded-full">Active</span>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[32px] border border-[#EAEAEA] relative overflow-hidden shadow-sm">
          <p className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#888888] mb-4 flex items-center gap-2"><Users size={14}/> Registered Readers</p>
          <div className="flex items-end gap-4">
            <p className="text-[64px] font-serif font-bold leading-none text-[#111111]">{usersCount}</p>
            <span className="text-[13px] font-medium text-[#1E6FEA] mb-2 px-3 py-1 bg-[#1E6FEA]/10 rounded-full">Identities</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] p-10 border border-[#EAEAEA] relative overflow-hidden h-[300px] flex flex-col justify-end shadow-sm">
        <div className="absolute top-10 left-10">
          <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#888888] mb-2 flex items-center gap-2"><Activity size={14}/> Database Operations</p>
          <h3 className="font-serif text-[32px] font-bold text-[#111111]">Real-Time Health</h3>
        </div>
        
        {/* Animated SVG Data Stream Illustration */}
        <svg className="w-full h-[120px]" viewBox="0 0 1000 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E6FEA" stopOpacity="0" />
              <stop offset="50%" stopColor="#1E6FEA" stopOpacity="1" />
              <stop offset="100%" stopColor="#1E6FEA" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path 
            d="M0,80 C150,20 250,90 400,40 C550,-10 700,90 850,30 C950,-10 1000,50 1000,50" 
            fill="none" stroke="url(#lineGradient)" strokeWidth="4" strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 3, ease: "easeInOut" }}
          />
        </svg>
      </div>
    </motion.div>
  );
}