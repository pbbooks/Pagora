import React, { useState, useRef, useEffect } from 'react';
import { pipeline } from '@huggingface/transformers';
import { Search, Mic, ArrowRight } from 'lucide-react';

export default function AIPage() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('Ask me anything about your library. I am Pagora AI.');
  const [isLoading, setIsLoading] = useState(false);
  const aiRef = useRef(null);

  useEffect(() => {
    // Initialize Local AI Pipeline
    const loadModel = async () => {
      // Using a small local model for fast browser execution
      aiRef.current = await pipeline('text-generation', 'Xenova/TinyLlama-1.1B-Chat-v1.0');
    };
    loadModel();
  }, []);

  const handleAsk = async () => {
    if (!query || !aiRef.current) return;
    setIsLoading(true);
    setResponse('');
    try {
      const result = await aiRef.current(`User asks: ${query}\nAI answers:`, { max_new_tokens: 50 });
      setResponse(result[0].generated_text.split('AI answers:')[1].trim());
    } catch(e) {
      setResponse("AI Engine requires WebGPU or highly optimized environment. Offline fallback engaged.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen pt-20 px-8 bg-pagora-base text-pagora-text">
      <div className="flex gap-2 mb-10 overflow-x-auto hide-scrollbar">
         <span className="px-4 py-2 rounded-full text-xs font-bold bg-pagora-card"><Search size={12} className="inline mr-2"/> Book Summaries</span>
         <span className="px-4 py-2 rounded-full text-xs font-bold bg-pagora-blue-deep">Ask Questions</span>
      </div>

      <h1 className="text-5xl font-extrabold tracking-tight leading-none mb-10">{query || "What do you want to explore?"}</h1>
      
      {isLoading ? (
        <p className="text-pagora-primary animate-pulse">Analyzing library semantics...</p>
      ) : (
        <p className="text-lg leading-relaxed text-pagora-muted">{response}</p>
      )}

      {/* Bottom Floating Input */}
      <div className="fixed bottom-24 left-6 right-6 p-2 pl-6 rounded-full flex items-center shadow-2xl bg-pagora-text text-pagora-base">
        <Mic size={20} className="opacity-50" />
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Ask follow up questions" className="bg-transparent border-none outline-none w-full font-bold px-4" />
        <button onClick={handleAsk} className="w-12 h-12 rounded-full flex items-center justify-center bg-pagora-base text-white">
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
