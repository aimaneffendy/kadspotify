"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipForward, SkipBack, Heart, 
  MapPin, Calendar, MessageCircle, Send, 
  MoreHorizontal, Shuffle, Repeat, ChevronDown, Share2
} from 'lucide-react';

export default function SpotifyWeddingPro() {
  const [mounted, setMounted] = useState(false);
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [wishes, setWishes] = useState<{name: string, message: string}[]>([]);
  const [newName, setNewName] = useState("");
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('wedding_wishes');
    if (saved) setWishes(JSON.parse(saved));
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const height = e.currentTarget.clientHeight;
    const page = Math.round(scrollTop / height);
    if (page !== activePage) setActivePage(page);
  };

  if (!mounted) return null;

  const handleOpen = () => {
    setOpened(true);
    setPlaying(true);
    audioRef.current?.play().catch(() => {});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newMessage) return;
    const updated = [{ name: newName, message: newMessage }, ...wishes];
    setWishes(updated);
    localStorage.setItem('wedding_wishes', JSON.stringify(updated));
    setNewName(""); setNewMessage("");
  };

  return (
    <main className="h-screen w-full bg-[#121212] text-white overflow-hidden font-sans selection:bg-[#1DB954]/30">
      <audio ref={audioRef} loop src="/marias.mp3" />

      {/* --- 1. THE COVER (SPOTIFY UI) --- */}
      <AnimatePresence>
        {!opened && (
          <motion.div 
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-[200] bg-[#121212] flex flex-col items-center justify-center p-8"
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="w-72 h-72 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] mb-12"
            >
              <img src="/dinda.jpg?auto=format&fit=crop&q=80" className="w-full h-full object-cover rounded-md" alt="Album Art" />
            </motion.div>
            <div className="text-left w-full max-w-xs mb-10 space-y-1">
                <h1 className="text-3xl font-black tracking-tighter">Aiman & Adinda</h1>
                <p className="text-[#b3b3b3] text-sm font-bold uppercase tracking-widest">Single • 2026</p>
            </div>
            <button 
              onClick={handleOpen}
              className="w-full max-w-xs py-4 bg-[#1DB954] text-black rounded-full font-bold text-sm tracking-widest uppercase hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg"
            >
              <Play fill="black" size={18} /> Play Invitation
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 2. THE PLAYER CONTENT --- */}
      <div className={`h-screen flex flex-col transition-opacity duration-1000 ${!opened ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Story Progress Bar (Instagram/Spotify Wrapped Style) */}
        <div className="flex gap-1.5 px-4 pt-4 absolute top-0 w-full z-[100] bg-gradient-to-b from-black/60 to-transparent pb-8">
           {[0, 1, 2, 3].map((index) => (
             <div key={index} className="h-[2px] flex-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ width: activePage === index ? "100%" : activePage > index ? "100%" : "0%" }}
                  transition={{ duration: activePage === index ? 5 : 0.4, ease: "linear" }}
                  className="h-full bg-white" 
                />
             </div>
           ))}
        </div>

        <div onScroll={handleScroll} className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar">
          
          {/* SLIDE 1: PLAYER VIEW */}
          <section className="h-screen w-full snap-start flex flex-col p-8 pt-16 bg-gradient-to-b from-[#404040] to-[#121212]">
            <div className="flex justify-between items-center mb-8 text-[#b3b3b3]">
               <ChevronDown size={28} />
               <p className="text-[10px] font-black tracking-[0.15em] uppercase text-center leading-tight">Playing from playlist<br/><span className="text-white font-bold tracking-normal text-[11px]">OUR FOREVER HIT</span></p>
               <MoreHorizontal size={28} />
            </div>
            
            <motion.div className="flex-1 w-full overflow-hidden flex items-center justify-center">
  <img 
    src="/dinda2.jpeg?auto=format&fit=crop&q=100" 
    className="w-full aspect-square object-cover rounded-md shadow-lg" 
    alt="Main" 
  />
</motion.div>

            <div className="flex justify-between items-center mb-6">
              <div className="text-left">
                <h2 className="text-2xl font-black tracking-tight leading-tight">The Wedding Day</h2>
                <p className="text-[#b3b3b3] font-bold text-sm">Aiman, Adinda</p>
              </div>
              <button onClick={() => setIsLiked(!isLiked)} className="active:scale-125 transition-transform duration-200">
                <Heart size={28} className={isLiked ? "text-[#1DB954]" : "text-white"} fill={isLiked ? "#1DB954" : "none"} strokeWidth={2.5} />
              </button>
            </div>

            {/* Spotify-accurate Seekbar */}
            <div className="w-full h-[3px] bg-white/20 rounded-full mb-2 relative group">
              <div className="w-[15%] h-full bg-white rounded-full group-hover:bg-[#1DB954] transition-colors" />
            </div>
            <div className="flex justify-between text-[10px] text-[#b3b3b3] font-bold mb-8">
              <span>0:07</span>
              <span>06:26</span>
            </div>

            <div className="flex justify-between items-center px-4">
              <Shuffle size={22} className="text-[#1DB954]" />
              <SkipBack fill="white" size={32} />
              <div onClick={() => { playing ? audioRef.current?.pause() : audioRef.current?.play(); setPlaying(!playing); }} className="w-16 h-16 bg-white rounded-full flex items-center justify-center active:scale-95 transition-all cursor-pointer shadow-xl">
                {playing ? <Pause fill="black" size={30} /> : <Play fill="black" size={30} className="ml-1" />}
              </div>
              <SkipForward fill="white" size={32} />
              <Repeat size={22} className="text-[#535353]" />
            </div>
          </section>

          {/* SLIDE 2: LYRICS VIEW (The Dates) */}
          <section className="h-screen w-full snap-start flex flex-col p-8 pt-24 bg-[#e91429] text-black overflow-hidden relative">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-12 text-black/60">Lyrics</h2>
            <div className="space-y-6 font-black text-[38px] tracking-tighter leading-[1.05] text-left">
              <motion.p initial={{ opacity: 0.3 }} whileInView={{ opacity: 1 }}>SAVE THE DATE.</motion.p>
              <motion.p initial={{ opacity: 0.3 }} whileInView={{ opacity: 1 }}>SUNDAY, 07 JUNE.</motion.p>
              <motion.p initial={{ opacity: 0.3 }} whileInView={{ opacity: 1 }}>AT ECOHILL WALK.</motion.p>
              <motion.p initial={{ opacity: 0.3 }} whileInView={{ opacity: 1 }} className="text-black/40 italic">SEMENYIH SELANGOR.</motion.p>
              <motion.p initial={{ opacity: 0.3 }} whileInView={{ opacity: 1 }} className="text-xl pt-6 text-black/80 font-bold uppercase tracking-widest leading-relaxed">
                "And we will write our own story, tonight."
              </motion.p>
            </div>
            <div className="mt-auto pb-10">
               <button className="flex items-center gap-3 text-sm font-bold bg-black text-white px-8 py-4 rounded-full shadow-lg active:scale-95 transition-all">
                 <MapPin size={18} /> Open Location
               </button>
            </div>
          </section>

          {/* SLIDE 3: GUESTBOOK (Top Fans) */}
          <section className="h-screen w-full snap-start flex flex-col p-8 pt-24 bg-[#121212]">
            <h2 className="text-2xl font-black mb-1 tracking-tighter text-left">Your Dedications</h2>
            <p className="text-[#b3b3b3] text-sm font-bold mb-8 text-left uppercase tracking-tighter">Messages from the fans</p>
            
            <form onSubmit={handleSubmit} className="mb-8 space-y-3">
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Display Name" className="w-full bg-[#282828] rounded-md p-4 text-sm font-bold outline-none border border-transparent focus:border-[#535353] transition-all" />
              <div className="flex gap-2">
                <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Add a comment..." className="flex-1 bg-[#282828] rounded-md p-4 text-sm font-medium outline-none" />
                <button type="submit" className="bg-[#1DB954] px-6 rounded-md text-black font-black active:scale-90 transition-all uppercase text-[10px] tracking-widest">Send</button>
              </div>
            </form>

            <div className="flex-1 overflow-y-auto space-y-4 text-left pr-2 hide-scrollbar">
              {wishes.map((w, i) => (
                <div key={i} className="flex items-start gap-4 hover:bg-white/5 p-2 rounded-md transition-colors">
                   <div className="w-11 h-11 bg-[#535353] rounded-full flex-shrink-0 flex items-center justify-center font-black text-stone-200 text-lg uppercase shadow-inner">{w.name[0]}</div>
                   <div className="flex-1 pt-1 border-b border-white/5 pb-3">
                      <p className="text-sm font-black">{w.name}</p>
                      <p className="text-sm text-[#b3b3b3] font-medium leading-snug">"{w.message}"</p>
                   </div>
                </div>
              ))}
            </div>
          </section>

          {/* SLIDE 4: RSVP (The Final Track) */}
          <section className="h-screen w-full snap-start flex flex-col items-center justify-center p-8 bg-gradient-to-t from-[#1DB954]/40 to-[#121212]">
             <div className="w-56 h-56 bg-[#181818] p-5 rounded-xl mb-12 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.8)] relative border border-white/5 group">
                <div className="absolute -top-3 -right-3 bg-white text-black px-3 py-1.5 rounded-full transform rotate-12 font-black text-[10px] tracking-widest shadow-xl">RSVP</div>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RSVP" className="w-full h-full invert opacity-90 group-hover:scale-105 transition-transform duration-500" alt="QR" />
             </div>
             <h2 className="text-4xl font-black text-center mb-4 tracking-tighter leading-none italic italic">Are you joining the <br/> playlist?</h2>
             <p className="text-[#b3b3b3] text-center text-sm font-bold mb-12 max-w-[220px] leading-relaxed">Confirm your attendance and celebrate this track with us.</p>
             
             <button className="w-full max-w-xs py-5 bg-[#1DB954] text-black rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
               <Share2 size={18} /> Confirm RSVP
             </button>
             <p className="mt-8 text-[10px] font-black text-[#535353] uppercase tracking-[0.5em]">Spotify Wrapped • 2026 Edition</p>
          </section>

        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;600;700;900&display=swap');
        body { font-family: 'Figtree', sans-serif; background-color: #121212; margin: 0; -webkit-font-smoothing: antialiased; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
}