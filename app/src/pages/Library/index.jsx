import React from 'react';
import { Search } from 'lucide-react';

export default function LibraryPage({ onNavigate, user }) {
  return (
    <div className="pt-16 px-6 pb-24">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-pagora-text mb-1">Your Library</h1>
          <p className="text-sm text-pagora-muted">5 Collections • 24 Books</p>
        </div>
        <button className="p-4 rounded-full bg-pagora-primary text-white"><Search size={20} /></button>
      </div>

      {/* Stacked Book Spine UI Design */}
      <div className="mb-8 p-6 rounded-3xl relative overflow-hidden bg-pagora-card border border-pagora-accent">
        <div className="flex justify-between items-end mb-8 relative z-10">
           <h2 className="text-xl font-bold">Novels</h2>
           <button className="text-sm font-semibold text-pagora-primary">View All</button>
        </div>
        <div className="flex items-end justify-center h-32 gap-1.5 relative z-10">
          <div className="w-5 h-24 rounded-sm bg-pagora-blue-deep -rotate-2"></div>
          <div className="w-8 h-32 rounded-sm bg-pagora-hover"></div>
          <div className="w-10 h-32 rounded-sm bg-pagora-muted flex items-center justify-center">
             <span className="text-[10px] text-black -rotate-90 font-bold tracking-widest">PAGORA</span>
          </div>
          <div className="w-7 h-30 rounded-sm bg-pagora-primary rotate-1"></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-pagora-card to-transparent z-20"></div>
      </div>
    </div>
  );
}
