"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipForward, SkipBack, Heart, 
  MapPin, MoreHorizontal, Shuffle, Repeat, 
  ChevronDown, Share2, ListMusic 
} from 'lucide-react';

export default function SpotifyWeddingPro() {
  const [mounted, setMounted] = useState(false);
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activePage, setActivePage] = useState(0);
  
  // Audio States
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  
  const [wishes, setWishes] = useState([]);
  const [newName, setNewName] = useState("");
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('wedding_wishes');
    if (saved) setWishes(JSON.parse(saved));
  }, []);

  // Update logic bila audio dah sedia
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      if (audio.duration) setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    // Backup kalau metadata dah load awal
    if (audio.readyState >= 1) {
      setDuration(audio.duration);
    }

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [opened]);

  const formatTime = (time) => {
    if (isNaN(time) || time === 0) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (x / width) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleOpen = () => {
    setOpened(true);
    setPlaying(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(err => console.error("Playback error:", err));
      }
    }, 300);
  };

  const togglePlay = () => {
    if (playing) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setPlaying(!playing);
  };

  const handleScroll = (e) => {
    const scrollTop = e.currentTarget.scrollTop;
    const height = e.currentTarget.clientHeight;
    const page = Math.round(scrollTop / height);
    if (page !== activePage) setActivePage(page);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newName || !newMessage) return;
    const updated = [{ name: newName, message: newMessage }, ...wishes];
    setWishes(updated);
    localStorage.setItem('wedding_wishes', JSON.stringify(updated));
    setNewName(""); setNewMessage("");
  };

  if (!mounted) return null;

  return (
    <main className="h-screen w-full bg-[#121212] text-white overflow-hidden font-sans selection:bg-[#1DB954]/30">
      <audio ref={audioRef} loop src="/marias.mp3" preload="auto" />

      {/* --- 1. THE ENTRANCE --- */}
      <AnimatePresence>
        {!opened && (
          <motion.div 
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[200] bg-[#121212] flex flex-col items-center justify-center p-8 text-center"
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              className="w-72 h-72 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.8)] mb-12"
            >
              <img src="/dinda.jpg" className="w-full h-full object-cover rounded-md" alt="Cover" />
            </motion.div>
            <div className="text-left w-full max-w-xs mb-10">
                <h1 className="text-4xl font-black tracking-tighter">Aiman & Adinda</h1>
                <p className="text-[#b3b3b3] text-sm font-bold uppercase tracking-[0.2em] mt-1">Single • 2026</p>
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

      {/* --- 2. PLAYER CONTENT --- */}
      <div className={`h-screen flex flex-col transition-opacity duration-1000 ${!opened ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Story Bar */}
        <div className="flex gap-1.5 px-4 pt-4 absolute top-0 w-full z-[100] bg-gradient-to-b from-black/80 to-transparent pb-10">
           {[0, 1, 2, 3].map((index) => (
             <div key={index} className="h-[2px] flex-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ width: activePage === index ? "100%" : activePage > index ? "100%" : "0%" }}
                  transition={{ duration: activePage === index ? 15 : 0.4, ease: "linear" }}
                  className="h-full bg-white" 
                />
             </div>
           ))}
        </div>

        <div onScroll={handleScroll} className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar">
          
          {/* SLIDE 1: PLAYER */}
          <section className="h-screen w-full snap-start flex flex-col p-8 pt-16 bg-gradient-to-b from-[#5a5a5a] via-[#121212] to-[#121212] relative">
            <div className="absolute top-0 left-0 w-full h-[40%] bg-[#1DB954]/5 blur-[100px] pointer-events-none" />
            
            <div className="flex justify-between items-center mb-8 text-[#b3b3b3] z-10">
                <ChevronDown size={32} />
                <div className="text-center font-black">
                  <p className="text-[10px] tracking-[0.2em] uppercase leading-tight opacity-70">Playing from playlist</p>
                  <p className="text-white text-[12px]">OUR FOREVER HIT</p>
                </div>
                <MoreHorizontal size={28} />
            </div>
            
            <div className="flex-1 w-full flex items-center justify-center z-10">
              <div className="w-full aspect-square max-w-[340px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-md overflow-hidden">
                <img src="/dinda2.jpg" className="w-full h-full object-cover" alt="Dinda Player" />
              </div>
            </div>

            <div className="flex justify-between items-center mt-8 mb-4 z-10">
              <div className="text-left">
                <h2 className="text-[28px] font-black tracking-tighter leading-tight">The Wedding Day</h2>
                <p className="text-[#b3b3b3] font-bold text-lg">Aiman, Adinda</p>
              </div>
              <button onClick={() => setIsLiked(!isLiked)} className="active:scale-150 transition-transform duration-300">
                <Heart size={32} className={isLiked ? "text-[#1DB954]" : "text-white opacity-70"} fill={isLiked ? "#1DB954" : "none"} strokeWidth={2} />
              </button>
            </div>

            {/* PROGRESS BAR DYNAMIC */}
            <div className="w-full group cursor-pointer z-10 py-4" onClick={handleSeek}>
              <div className="w-full h-[4px] bg-white/20 rounded-full relative">
                <div 
                  className="absolute h-full bg-white group-hover:bg-[#1DB954] transition-colors rounded-full" 
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
                <div 
                  className="absolute h-3 w-3 bg-white rounded-full -top-[4px] opacity-0 group-hover:opacity-100 shadow-md transition-opacity"
                  style={{ left: `calc(${duration ? (currentTime / duration) * 100 : 0}% - 6px)` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#b3b3b3] font-bold mt-3">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center px-2 z-10">
              <Shuffle size={24} className="text-[#1DB954]" />
              <SkipBack fill="white" size={36} className="cursor-pointer" />
              <div 
                onClick={togglePlay} 
                className="w-20 h-20 bg-white rounded-full flex items-center justify-center active:scale-95 transition-all cursor-pointer shadow-2xl"
              >
                {playing ? <Pause fill="black" size={34} /> : <Play fill="black" size={34} className="ml-1" />}
              </div>
              <SkipForward fill="white" size={36} className="cursor-pointer" />
              <Repeat size={24} className="text-[#535353]" />
            </div>

            <div className="flex justify-between items-center mt-10 text-[#b3b3b3] px-1 z-10">
              <Share2 size={20} className="hover:text-white cursor-pointer" />
              <div className="flex items-center gap-6">
                 <p className="text-[10px] font-black tracking-widest uppercase">Lyrics</p>
                 <ListMusic size={22} className="hover:text-white cursor-pointer" />
              </div>
            </div>
          </section>

          {/* SLIDE 2: LYRICS */}
          <section className="h-screen w-full snap-start flex flex-col p-8 pt-24 bg-[#e91429] text-black">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-12 text-black/60">Lyrics</h2>
            <div className="space-y-6 font-black text-[38px] tracking-tighter leading-[1.05] text-left">
              <p>Save The Date.</p>
              <p>Sunday, 07 June.</p>
              <p>At Crazy Rich Asians, Ecohill Walk,</p>
              <p className="text-black/40 italic">Setia Ecohill, Semenyih.</p>
              <p className="text-xl pt-6 text-black/80 font-bold uppercase tracking-widest">
                "And we will write our own story, tonight."
              </p>
            </div>
            <div className="mt-auto pb-10">
               <button className="flex items-center gap-3 text-sm font-bold bg-black text-white px-8 py-4 rounded-full shadow-lg active:scale-95">
                 <MapPin size={18} /> Open Location
               </button>
            </div>
          </section>

          {/* SLIDE 3: GUESTBOOK */}
          <section className="h-screen w-full snap-start flex flex-col p-8 pt-24 bg-[#121212]">
            <h2 className="text-2xl font-black mb-1 tracking-tighter text-left">Your Dedications</h2>
            <p className="text-[#b3b3b3] text-sm font-bold mb-8 uppercase">Messages from the fans</p>
            
            <form onSubmit={handleSubmit} className="mb-8 space-y-3">
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Display Name" className="w-full bg-[#282828] rounded-md p-4 text-sm font-bold outline-none focus:border-[#535353] border border-transparent transition-all" />
              <div className="flex gap-2">
                <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Add a comment..." className="flex-1 bg-[#282828] rounded-md p-4 text-sm font-medium outline-none" />
                <button type="submit" className="bg-[#1DB954] px-6 rounded-md text-black font-black active:scale-90 transition-all uppercase text-[10px] tracking-widest">Send</button>
              </div>
            </form>

            <div className="flex-1 overflow-y-auto space-y-4 text-left pr-2 hide-scrollbar">
              {wishes.map((w, i) => (
                <div key={i} className="flex items-start gap-4 hover:bg-white/5 p-2 rounded-md">
                   <div className="w-11 h-11 bg-[#535353] rounded-full flex-shrink-0 flex items-center justify-center font-black text-stone-200">{w.name[0]}</div>
                   <div className="flex-1 border-b border-white/5 pb-3 pt-1">
                      <p className="text-sm font-black">{w.name}</p>
                      <p className="text-sm text-[#b3b3b3] font-medium leading-snug">"{w.message}"</p>
                   </div>
                </div>
              ))}
            </div>
          </section>

          {/* SLIDE 4: RSVP */}
          <section className="h-screen w-full snap-start flex flex-col items-center justify-center p-8 bg-gradient-to-t from-[#1DB954]/40 to-[#121212]">
             <div className="w-56 h-56 bg-[#181818] p-5 rounded-xl mb-12 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.8)] relative border border-white/5">
                <div className="absolute -top-3 -right-3 bg-white text-black px-3 py-1.5 rounded-full rotate-12 font-black text-[10px] tracking-widest">RSVP</div>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RSVP_Aiman_Adinda`} className="w-full h-full invert opacity-90" alt="QR" />
             </div>
             <h2 className="text-4xl font-black text-center mb-4 tracking-tighter italic italic leading-none">Are you joining the <br/> playlist?</h2>
             <button className="w-full max-w-xs py-5 bg-[#1DB954] text-black rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all mt-8">
                Confirm RSVP
             </button>
             <p className="mt-8 text-[10px] font-black text-[#535353] uppercase tracking-[0.5em]">AimanXAdinda • 2026 </p>
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