import React, { useEffect, useRef, useState } from 'react';
import ePub from 'epubjs';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { ChevronLeft, Sun, Moon, AlignLeft, Type, X } from 'lucide-react';

export default function ReaderPage({ onNavigate, bookData, user }) {
  const viewerRef = useRef(null);
  const renditionRef = useRef(null);
  const [showUI, setShowUI] = useState(false);
  const [fontSize, setFontSize] = useState(100); // percentage
  const [theme, setTheme] = useState('dark');

  // Strict UI Colors mapping
  const bgColors = { dark: '#0C1016', sepia: '#F4ECD8', light: '#EFF0E6' };
  const textColors = { dark: '#EFF0E6', sepia: '#4A3E2D', light: '#0C1016' };

  useEffect(() => {
    if (!bookData || !viewerRef.current) return;
    
    // EPUB Engine Initialization
    // If bookData.fileUrl exists, use it. Otherwise fallback to demo epub.
    const url = bookData.fileUrl || "https://s3.amazonaws.com/moby-dick/moby-dick.epub";
    const book = ePub(url);
    
    const rendition = book.renderTo(viewerRef.current, {
      width: '100%',
      height: '100%',
      spread: 'none',
      manager: 'continuous',
      flow: 'scrolled'
    });

    renditionRef.current = rendition;
    rendition.display();

    // Interaction hooks
    rendition.on('click', () => setShowUI(prev => !prev));
    rendition.on('relocated', (location) => {
      // Save real progress to Firestore
      if (user && bookData.id) {
        updateDoc(doc(db, 'books', bookData.id), { progressCfi: location.start.cfi });
      }
    });

    return () => book.destroy();
  }, [bookData]);

  // Handle Theme and Typography dynamically
  useEffect(() => {
    if (renditionRef.current) {
      renditionRef.current.themes.fontSize(`${fontSize}%`);
      renditionRef.current.themes.register(theme, {
        body: { background: bgColors[theme], color: textColors[theme] }
      });
      renditionRef.current.themes.select(theme);
    }
  }, [fontSize, theme]);

  return (
    <div className="h-screen flex flex-col relative transition-colors duration-300" style={{ backgroundColor: bgColors[theme] }}>
      
      {/* Top Nav */}
      <div className={`absolute top-0 w-full p-6 flex justify-between z-50 transition-transform ${showUI ? 'translate-y-0' : '-translate-y-full'}`}>
        <button onClick={() => onNavigate('home')} className="p-3 rounded-full bg-pagora-card text-pagora-text shadow-lg"><ChevronLeft size={20}/></button>
      </div>

      {/* EPUB Render Target */}
      <div ref={viewerRef} className="flex-1 w-full h-full pt-20 pb-32 px-4 z-0"></div>

      {/* Advanced Reading UI (Matching screenshot 4) */}
      <div className={`absolute bottom-0 w-full p-4 z-50 transition-transform ${showUI ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="rounded-[2.5rem] p-6 shadow-2xl bg-[#1C1C1E] text-white">
          <div className="flex justify-between items-center mb-8">
            <div className="flex bg-[#2C2C2E] rounded-full p-1">
              <button onClick={() => setTheme('light')} className={`p-3 rounded-full ${theme==='light' ? 'bg-[#D4AF37] text-black' : 'text-gray-400'}`}><Sun size={20}/></button>
              <button onClick={() => setTheme('sepia')} className={`p-3 px-6 rounded-full font-bold ${theme==='sepia' ? 'bg-[#D4AF37] text-black' : 'text-gray-400'}`}>Sepia</button>
              <button onClick={() => setTheme('dark')} className={`p-3 rounded-full ${theme==='dark' ? 'bg-[#D4AF37] text-black' : 'text-gray-400'}`}><Moon size={20}/></button>
            </div>
            <button onClick={() => setShowUI(false)} className="p-4 rounded-full bg-[#2C2C2E]"><X size={20}/></button>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-3 font-semibold"><span>Font size</span><span>{fontSize}%</span></div>
            <input type="range" min="80" max="200" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="w-full accent-[#D4AF37]" />
          </div>
        </div>
      </div>
    </div>
  );
}
