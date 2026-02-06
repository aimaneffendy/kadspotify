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
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // FIX: Tambah type <HTMLAudioElement>
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [wishes, setWishes] = useState<{name: string, message: string}[]>([]);
  const [newName, setNewName] = useState("");
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('wedding_wishes');
    if (saved) setWishes(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      if (audio.duration) setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    if (audio.readyState >= 1) {
      setDuration(audio.duration);
    }

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

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const height = e.currentTarget.clientHeight;
    const page = Math.round(scrollTop / height);
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

      <AnimatePresence>
        {!opened && (
          <motion.div 
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[200] bg-[#121212] flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="w-72 h-72 shadow-2xl mb-12">
              <img src="/dinda.jpg" className="w-full h-full object-cover rounded-md" alt="Cover" />
            </div>
            <div className="text-left w-full max-w-xs mb-10">
                <h1 className="text-4xl font-black tracking-tighter">Aiman & Adinda</h1>
                <p className="text-[#b3b3b3] text-sm font-bold uppercase tracking-[0.2em] mt-1">Single • 2026</p>
            </div>
            <button onClick={handleOpen} className="w-full max-w-xs py-4 bg-[#1DB954] text-black rounded-full font-bold flex items-center justify-center gap-3">
              <Play fill="black" size={18} /> Play Invitation
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`h-screen flex flex-col transition-opacity duration-1000 ${!opened ? 'opacity-0' : 'opacity-100'}`}>
        <div onScroll={handleScroll} className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar">
          
          <section className="h-screen w-full snap-start flex flex-col p-8 pt-16 bg-gradient-to-b from-[#5a5a5a] to-[#121212] relative">
            <div className="flex justify-between items-center mb-8 z-10 text-[#b3b3b3]">
                <ChevronDown size={32} />
                <div className="text-center font-black">
                  <p className="text-[10px] tracking-[0.2em] uppercase opacity-70">Playing from playlist</p>
                  <p className="text-white text-[12px]">OUR FOREVER HIT</p>
                </div>
                <MoreHorizontal size={28} />
            </div>
            
            <div className="flex-1 w-full flex items-center justify-center z-10">
              <div className="w-full aspect-square max-w-[340px] shadow-2xl rounded-md overflow-hidden">
                {/* CHECK NAMA FAIL GAMBAR KAT SINI */}
                <img src="/dinda2.jpg" className="w-full h-full object-cover" alt="Main Photo" />
              </div>
            </div>

            <div className="flex justify-between items-center mt-8 mb-4 z-10">
              <div className="text-left">
                <h2 className="text-[28px] font-black tracking-tighter leading-tight">The Wedding Day</h2>
                <p className="text-[#b3b3b3] font-bold text-lg">Aiman, Adinda</p>
              </div>
              <Heart size={32} className={isLiked ? "text-[#1DB954]" : "text-white opacity-70"} fill={isLiked ? "#1DB954" : "none"} onClick={() => setIsLiked(!isLiked)} />
            </div>

            <div className="w-full z-10 py-4 cursor-pointer" onClick={handleSeek}>
              <div className="w-full h-[4px] bg-white/20 rounded-full relative">
                <div className="absolute h-full bg-white rounded-full" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
              </div>
              <div className="flex justify-between text-[11px] text-[#b3b3b3] font-bold mt-3">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center px-2 z-10">
              <Shuffle size={24} className="text-[#1DB954]" />
              <SkipBack fill="white" size={36} />
              <div onClick={togglePlay} className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl">
                {playing ? <Pause fill="black" size={34} /> : <Play fill="black" size={34} className="ml-1" />}
              </div>
              <SkipForward fill="white" size={36} />
              <Repeat size={24} className="text-[#535353]" />
            </div>
          </section>

          {/* Slide lain maintain ... */}

        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
}