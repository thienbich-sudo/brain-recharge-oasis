import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Droplets, Wind, Flame, Radio, SlidersHorizontal, Trees } from 'lucide-react';

import AudioPlayer from './components/AudioPlayer';
import WatercolorCanvas from './components/WatercolorCanvas';
import BreathingRing from './components/BreathingRing';
import NudgeTimer from './components/NudgeTimer';
import BrainDump from './components/BrainDump';
import MoodGate from './components/MoodGate';
import AmbientMixer from './components/AmbientMixer';
import BinauralGenerator from './components/BinauralGenerator';
import AutoPilotFlow from './components/AutoPilotFlow';
import { useLanguage } from './i18n/LangContext';

export default function App() {
  const { t, lang, setLang } = useLanguage();

  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [activeModule, setActiveModule] = useState<string>('audio');
  
  // Gamification State (The Zen Garden Tracker)
  const [seeds, setSeeds] = useState(0);

  // PWA Native Back Navigation Support
  useEffect(() => {
    // Replace initial state so popstate has a target
    window.history.replaceState({ module: 'audio' }, '');
    
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.module) {
        setActiveModule(e.state.module);
      } else {
        setActiveModule('audio'); // Fallback
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (moduleId: string) => {
    if (activeModule === moduleId) return;
    window.history.pushState({ module: moduleId }, '');
    setActiveModule(moduleId);
  };

  const handleCheckIn = (mood: string) => {
     setHasCheckedIn(true);
     navigateTo(`autopilot_${mood}`);
  };

  const navItems = [
    { id: 'audio', icon: <Headphones size={20} strokeWidth={1.5} />, label: t('nav.audio') },
    { id: 'mixer', icon: <SlidersHorizontal size={20} strokeWidth={1.5} />, label: t('nav.mixer') },
    { id: 'binaural', icon: <Radio size={20} strokeWidth={1.5} />, label: t('nav.binaural') },
    { id: 'breathe', icon: <Wind size={20} strokeWidth={1.5} />, label: t('nav.breathe') },
    { id: 'canvas', icon: <Droplets size={20} strokeWidth={1.5} />, label: t('nav.canvas') },
    { id: 'dump', icon: <Flame size={20} strokeWidth={1.5} />, label: t('nav.dump') },
  ];

  return (
    <div className="relative w-screen h-[100dvh] overflow-hidden flex flex-col items-center bg-[#0a0f1c] font-sans">
      
      {/* Cổng đăng nhập cảm xúc - Flow Routing */}
      <AnimatePresence>
        {!hasCheckedIn && <MoodGate onCheckIn={handleCheckIn} />}
      </AnimatePresence>

      {/* Hiệu ứng Phông nền Chiều sâu Ảo (Ambient depth lighting)*/}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1c] via-[#111a2f] to-[#0a0f1c] z-[-2]"></div>
      <motion.div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] z-[-1]" animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }} transition={{ duration: 20, repeat: Infinity }} />
      <motion.div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] z-[-1]" animate={{ scale: [1, 1.5, 1], x: [0, -40, 0] }} transition={{ duration: 25, repeat: Infinity, delay: 2 }} />

      {/* Bộ phận Đếm nhịp nhắc tập 20-20-20 ngầm */}
      <NudgeTimer />

      {/* Game hóa: Hồ sơ thu thập chồi xanh */}
      <motion.div 
         initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }}
         className="absolute top-4 left-4 md:top-8 md:left-12 flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-black/40 border border-emerald-500/30 rounded-full shadow-lg text-emerald-400 z-50 backdrop-blur-xl"
      >
         <Trees size={16} className="shrink-0" />
         <span className="text-[10px] md:text-xs font-sans font-bold tracking-wider">{seeds} {t('app.seeds')}</span>
      </motion.div>

      {/* Thiết bị lõi hiển thị Modules */}
      <motion.main 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
        className="w-full h-full md:w-11/12 max-w-5xl md:h-[85vh] md:mt-[4vh] bg-transparent md:glass-panel flex flex-col items-center z-10 md:shadow-2xl relative md:rounded-3xl md:border-white/10"
      >
        <div className="w-full flex-1 flex items-center justify-center overflow-hidden relative md:rounded-2xl pb-24 md:pb-0 z-10 md:bg-black/20 md:border md:border-white/5">
          {/* BACKGROUND PERSISTENT AUDIO MODULES */}
          <div className={`absolute inset-0 transition-opacity duration-700 ${activeModule === 'audio' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
            <AudioPlayer />
          </div>
          <div className={`absolute inset-0 transition-opacity duration-700 ${activeModule === 'mixer' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
            <AmbientMixer />
          </div>
          <div className={`absolute inset-0 transition-opacity duration-700 ${activeModule === 'binaural' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
            <BinauralGenerator />
          </div>

          {/* DYNAMIC UNMOUNTABLE MODULES */}
          {activeModule === 'canvas' && <div className="absolute inset-0 z-10"><WatercolorCanvas /></div>}
          {activeModule === 'breathe' && <div className="absolute inset-0 z-10"><BreathingRing /></div>}
          {activeModule === 'dump' && <div className="absolute inset-0 z-10"><BrainDump onBurn={() => setSeeds(s => s + 1)} /></div>}
          {activeModule.startsWith('autopilot_') && (
             <div className="absolute inset-0 z-50">
               <AutoPilotFlow mood={activeModule.split('_')[1]} onExit={() => navigateTo('audio')} />
             </div>
          )}
        </div>
      </motion.main>

      {/* Thanh Dock Điều Hướng Nổi Cố Định - Desktop & Mobile Safe Area */}
      <div className="absolute bottom-4 md:bottom-8 z-50 w-full px-2 flex justify-center pointer-events-none drop-shadow-2xl">
         <nav className="glass-panel border border-white/15 bg-[#0a0f1c]/60 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center justify-start sm:justify-center gap-1 sm:gap-2 lg:gap-3 p-1.5 sm:p-2 rounded-full overflow-x-auto max-w-full pointer-events-auto snap-x scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
           {navItems.map(item => (
             <motion.button 
               whileHover={{ scale: 1.1, y: -2, transition: { type: "spring", stiffness: 400, damping: 10 } }}
               whileTap={{ scale: 0.9, transition: { type: "spring", stiffness: 400, damping: 10 } }}
               key={item.id} onClick={() => navigateTo(item.id)} title={item.label}
               className={`p-3 sm:p-4 rounded-full transition-colors duration-300 flex-shrink-0 snap-center
                 ${activeModule === item.id ? 'bg-white/20 text-white shadow-[0_0_20px_rgba(255,255,255,0.15)] border border-white/30' : 'bg-transparent text-white/40 hover:text-white/80 hover:bg-white/10 shrink-0'}`}
             >
               {item.icon}
             </motion.button>
           ))}
           <div className="w-px h-6 sm:h-8 bg-white/15 mx-1 sm:mx-2 shrink-0"></div>
           <motion.button 
              whileHover={{ scale: 1.1, transition: { type: "spring", stiffness: 400, damping: 10 } }}
              whileTap={{ scale: 0.9, transition: { type: "spring", stiffness: 400, damping: 10 } }}
              onClick={() => setLang(lang === 'vi' ? 'en' : lang === 'en' ? 'zh' : 'vi')}
              className="p-3 sm:p-4 rounded-full text-white/50 hover:text-white/90 bg-white/5 hover:bg-white/15 transition-colors font-bold tracking-widest text-[9px] sm:text-[10px] md:text-xs flex items-center justify-center shrink-0 uppercase border border-white/10 shadow-inner snap-center min-w-[40px] sm:min-w-[48px]"
              title="Change Language"
           >
              {lang}
           </motion.button>
         </nav>
      </div>

    </div>
  )
}
