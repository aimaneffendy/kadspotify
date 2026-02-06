"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipForward, SkipBack, Heart, 
  MapPin, MoreHorizontal, Shuffle, Repeat, 
  ChevronDown 
} from 'lucide-react';

export default function SpotifyWeddingPro() {
  const [mounted, setMounted] = useState(false);
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activePage, setActivePage] = useState(0);
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // FIX: Menggunakan Type HTMLAudioElement untuk setelkan error 'never' di Vercel
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [wishes, setWishes] = useState<{name: string, message: string}[]>([]);
  const [newName, setNewName] = useState("");
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('wedding_wishes');
    if (saved) {
      try { setWishes(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (audio) setCurrentTime(audio.currentTime);
    };
    const updateDuration = () => {
      if (audio && audio.duration) setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    if (audio.readyState >= 1) setDuration(audio.duration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [opened]);

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
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
        audioRef.current.play().catch(err => console.log(err));
      }
    }, 300);
  };

  const togglePlay = () => {
    if (playing) audioRef.current?.pause();
    else audioRef.current?.play();
    setPlaying(!playing);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const page = Math.round(target.scrollTop / target.clientHeight);
    if (page !== activePage) setActivePage(page);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newMessage) return;
    const updated = [{ name: newName, message: newMessage }, ...wishes];
    setWishes(updated);
    localStorage.setItem('wedding_wishes', JSON.stringify(updated));
    setNewName(""); setNewMessage("");
  };

  if (!mounted) return null;

  return (
    <main className="h-screen w-full bg-[#121212] text-white overflow-hidden font-sans">
      <audio ref={audioRef} loop src="/marias.mp3" preload="auto" />

      {/* --- ENTRANCE --- */}
      <AnimatePresence>
        {!opened && (
          <motion.div exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-[#121212] flex flex-col items-center justify-center p-8 text-center">
            <div className="w-72 h-72 shadow-2xl mb-12">
              <img src="/dinda.jpg" className="w-full h-full object-cover rounded-md" alt="Cover" />
            </div>
            <div className="text-left w-full max-w-xs mb-10">
                <h1 className="text-4xl font-black tracking-tighter">Aiman & Adinda</h1>
                <p className="text-[#b3b3b3] text-sm font-bold uppercase tracking-[0.2em] mt-2">Single • 2026</p>
            </div>
            <button onClick={handleOpen} className="w-full max-w-xs py-4 bg-[#1DB954] text-black rounded-full font-black text-sm tracking-widest uppercase flex items-center justify-center gap-3 active:scale-95 transition-all">
              <Play fill="black" size={18} /> Play Invitation
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`h-screen flex flex-col transition-opacity duration-1000 ${!opened ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Story Progress Bars */}
        <div className="flex gap-1.5 px-4 pt-4 absolute top-0 w-full z-[150] bg-gradient-to-b from-black/80 to-transparent pb-10 pointer-events-none">
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
          
          {/* SLIDE 1: MUSIC PLAYER */}
          <section className="h-screen w-full snap-start flex flex-col p-8 pt-16 bg-gradient-to-b from-[#5a5a5a] via-[#121212] to-[#121212] relative">
            <div className="flex justify-between items-center mb-8 z-10 text-[#b3b3b3]">
                <ChevronDown size={32} />
                <div className="text-center">
                  <p className="text-[10px] font-black tracking-[0.2em] uppercase opacity-70">Playing from playlist</p>
                  <p className="text-white font-bold text-[12px]">OUR FOREVER HIT</p>
                </div>
                <MoreHorizontal size={28} />
            </div>
            
            <div className="flex-1 w-full flex items-center justify-center z-10">
              <div className="w-full aspect-square max-w-[340px] shadow-2xl rounded-md overflow-hidden">
                <img src="/dinda2.jpg" className="w-full h-full object-cover" alt="Main Photo" />
              </div>
            </div>

            <div className="flex justify-between items-center mt-8 mb-4 z-10">
              <div className="text-left">
                <h2 className="text-[28px] font-black tracking-tighter leading-tight">The Wedding Day</h2>
                <p className="text-[#b3b3b3] font-bold text-lg">Aiman, Adinda</p>
              </div>
              <button onClick={() => setIsLiked(!isLiked)} className="active:scale-150 transition-all">
                <Heart size={32} className={isLiked ? "text-[#1DB954]" : "text-white opacity-70"} fill={isLiked ? "#1DB954" : "none"} />
              </button>
            </div>

            <div className="w-full z-10 py-6 cursor-pointer" onClick={handleSeek}>
              <div className="w-full h-[4px] bg-white/20 rounded-full relative overflow-hidden">
                <div 
                  className="absolute h-full bg-white transition-all duration-100" 
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#b3b3b3] font-bold mt-3">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center px-2 z-10 mb-10">
              <Shuffle size={24} className="text-[#1DB954]" />
              <SkipBack fill="white" size={36} />
              <div onClick={togglePlay} className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-all">
                {playing ? <Pause fill="black" size={34} /> : <Play fill="black" size={34} className="ml-1" />}
              </div>
              <SkipForward fill="white" size={36} />
              <Repeat size={24} className="text-[#535353]" />
            </div>
          </section>

          {/* SLIDE 2: LYRICS (MAINTAIN ORIGINAL STYLE) */}
          <section className="h-screen w-full snap-start flex flex-col p-8 pt-24 bg-[#e91429] text-black">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-12 text-black/60">Lyrics</h2>
            <div className="space-y-6 font-black text-[38px] tracking-tighter leading-[1.05] text-left">
              <p>Save The Date.</p>
              <p>Sunday, 07 June.</p>
              <p>At Crazy Rich Asians, Ecohill Walk,</p>
              <p className="text-black/40 italic">Setia Ecohill, Semenyih.</p>
            </div>
            <div className="mt-auto pb-10">
               <button className="flex items-center gap-3 text-sm font-bold bg-black text-white px-8 py-4 rounded-full shadow-lg active:scale-95 transition-all">
                 <MapPin size={18} /> Open Location
               </button>
            </div>
          </section>

          {/* SLIDE 3: GUESTBOOK */}
          <section className="h-screen w-full snap-start flex flex-col p-8 pt-24 bg-[#121212]">
            <h2 className="text-2xl font-black mb-8 text-left">Your Dedications</h2>
            <form onSubmit={handleSubmit} className="mb-8 space-y-3">
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Display Name" className="w-full bg-[#282828] rounded-md p-4 text-sm font-bold outline-none" />
              <div className="flex gap-2">
                <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Add a comment..." className="flex-1 bg-[#282828] rounded-md p-4 text-sm font-medium outline-none" />
                <button type="submit" className="bg-[#1DB954] px-6 rounded-md text-black font-black uppercase text-[10px]">Send</button>
              </div>
            </form>
            <div className="flex-1 overflow-y-auto space-y-4 text-left hide-scrollbar pb-10">
              {wishes.map((w, i) => (
                <div key={i} className="flex items-start gap-4 p-2 rounded-md">
                   <div className="w-11 h-11 bg-[#535353] rounded-full flex-shrink-0 flex items-center justify-center font-black">{w.name[0]}</div>
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
             <div className="w-56 h-56 bg-[#181818] p-5 rounded-xl mb-12 shadow-2xl relative border border-white/5">
                <div className="absolute -top-3 -right-3 bg-white text-black px-3 py-1.5 rounded-full rotate-12 font-black text-[10px]">RSVP</div>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RSVP_Aiman_Adinda`} className="w-full h-full invert opacity-90" alt="QR" />
             </div>
             <h2 className="text-4xl font-black text-center mb-4 tracking-tighter italic leading-none">Are you joining the <br/> playlist?</h2>
             <button className="w-full max-w-xs py-5 bg-[#1DB954] text-black rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all mt-8">
                Confirm RSVP
             </button>
          </section>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;600;700;900&display=swap');
        body { font-family: 'Figtree', sans-serif; background-color: #121212; margin: 0; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
}