import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { Play } from 'lucide-react';

export default function HomePage({ onNavigate, user }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(db, 'books'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (data.length === 0) setBooks(mockSeeder()); // Fallback for empty db
      else setBooks(data);
    });
    return () => unsub();
  }, [user]);

  const mockSeeder = () => [
    { id: '1', title: 'Near to the Wild Heart', author: 'Clarice Lispector', coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800', progress: 45 },
    { id: '2', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800', progress: 0 }
  ];

  return (
    <div className="pt-12 px-6 pb-20 animate-fade-in">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-xl text-pagora-muted">Good morning,</h1>
          <h2 className="text-3xl font-bold text-pagora-text">Joseph 👋</h2>
        </div>
        <div className="w-12 h-12 rounded-full border-2 border-pagora-primary overflow-hidden">
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200" alt="Profile" />
        </div>
      </header>

      {/* Horizontal Scroll UI */}
      <section className="mb-10">
        <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-pagora-muted">Books picked for you</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
          <div className="min-w-[280px] p-6 rounded-3xl snap-center relative overflow-hidden bg-pagora-primary shadow-lg">
            <h4 className="text-white font-bold text-2xl mb-2">Quick Reads For<br/>Your Commute</h4>
            <div className="absolute -bottom-10 -right-4 flex gap-2 rotate-12 opacity-90">
              {books.slice(0,2).map(b => (
                <img key={b.id} src={b.coverUrl} className="w-20 h-28 rounded-md object-cover border border-white/20" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending UI */}
      <section>
        <h3 className="text-xl font-bold mb-4 text-pagora-text">Trending Now</h3>
        <div className="flex flex-col gap-4">
          {books.map(book => (
            <div key={book.id} onClick={() => onNavigate('reader', book)} className="flex items-center gap-4 p-4 rounded-2xl bg-pagora-card active:scale-95 transition-transform border border-pagora-accent">
              <img src={book.coverUrl} className="w-16 h-24 rounded-xl object-cover" />
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-1">{book.title}</h4>
                <p className="text-sm text-pagora-muted">{book.author}</p>
                {book.progress > 0 && (
                  <div className="w-full h-1.5 bg-pagora-accent rounded-full mt-4">
                    <div className="h-full bg-pagora-primary rounded-full" style={{ width: `${book.progress}%` }}></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
