import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, FastForward, Rewind, Volume2, Music } from 'lucide-react';
import { useLanguage } from '../i18n/LangContext';

const playlist = [
  { id: 't1', title: 'Groove Salad (Lo-Fi / Beats)', desc: { vi: 'Nhịp điệu nền nhẹ nhàng', en: 'Light Background Groove', zh: '轻快的背景节奏' }, url: 'https://ice1.somafm.com/groovesalad-128-mp3', color: '#34d399' },
  { id: 't2', title: 'NASA Deep Space One', desc: { vi: 'Tách biệt trần gian (Deep Focus)', en: 'Zero Distraction Focus', zh: '零分心专注' }, url: 'https://ice1.somafm.com/deepspaceone-128-mp3', color: '#c084fc' },
  { id: 't3', title: 'DEF CON Radio', desc: { vi: 'Hack & Code Focus', en: 'Cyberpunk Focus', zh: '深度代码专注' }, url: 'https://ice1.somafm.com/defcon-128-mp3', color: '#14b8a6' },
  { id: 't4', title: 'Drone Zone', desc: { vi: 'Siêu Thư Giãn (Sleep)', en: 'Atmospheric Ambient', zh: '极度放松氛围' }, url: 'https://ice1.somafm.com/dronezone-128-mp3', color: '#f472b6' },
  { id: 't5', title: 'L.V. Beethoven - Moonlight Sonata', desc: { vi: 'Trạng thái tuôn trào (Piano)', en: 'Abstract Flow State', zh: '抽象心流状态' }, url: 'https://archive.org/download/MoonlightSonata_755/Beethoven-MoonlightSonata.mp3', color: '#60a5fa' },
  { id: 't6', title: 'J.S. Bach - Prelude No. 1', desc: { vi: 'Thiền định & Logic', en: 'Meditation & Logic', zh: '静心与逻辑' }, url: 'https://archive.org/download/BachPreludeAndFugueInCMajor/Bach-PreludeCmajor.mp3', color: '#facc15' },
  { id: 't7', title: 'F. Chopin - Nocturne Op.9', desc: { vi: 'Đồng bộ hai bán cầu não', en: 'Brain Sync & Clarity', zh: '左右脑同步' }, url: 'https://archive.org/download/chopin_nocturne_op_9_no_2/Chopin_Nocturne_Op_9_No_2.mp3', color: '#fb923c' },
];

export default function AudioPlayer() {
  const { lang } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrackIdx, setActiveTrackIdx] = useState(0);
  const activeTrack = playlist[activeTrackIdx];
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');

  const l = (obj: any): string => obj[lang] || obj.vi;

  useEffect(() => {
    if ('setSinkId' in HTMLAudioElement.prototype && navigator.mediaDevices) {
      navigator.mediaDevices.enumerateDevices()
        .then(devs => {
          const audioOuts = devs.filter(d => d.kind === 'audiooutput');
          setDevices(audioOuts);
          if (audioOuts.length > 0) setSelectedDevice(audioOuts[0].deviceId);
        })
        .catch(err => console.error('Device enum failed:', err));
    }
  }, []);

  const handleDeviceChange = async (deviceId: string) => {
    setSelectedDevice(deviceId);
    if (audioRef.current && 'setSinkId' in audioRef.current) {
      try {
        await (audioRef.current as any).setSinkId(deviceId);
      } catch (err) {}
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play().catch(e => console.error(e));
      setIsPlaying(!isPlaying);
    }
  };

  const switchTrack = (idx: number) => {
    setActiveTrackIdx(idx);
    setIsPlaying(false);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.error(e));
        setIsPlaying(true);
      }
    }, 100);
  };

  const nextTrack = () => switchTrack((activeTrackIdx + 1) % playlist.length);
  const prevTrack = () => switchTrack((activeTrackIdx - 1 + playlist.length) % playlist.length);

  return (
    <div className="flex flex-col items-center justify-start h-full w-full max-w-lg mx-auto px-4 py-8 overflow-hidden relative">
      <audio ref={audioRef} src={activeTrack.url} onEnded={nextTrack} />
      
      {/* Visualizer Mock */}
      <div className="flex items-center justify-center gap-1.5 h-16 md:h-24 w-full shrink-0 mb-6">
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1.5 rounded-full opacity-70"
            style={{ backgroundColor: activeTrack.color }}
            animate={{ 
              height: isPlaying ? [10, Math.random() * 50 + 15, 10] : 8,
            }}
            transition={{
              duration: isPlaying ? 0.6 + Math.random() * 0.4 : 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.05
            }}
          />
        ))}
      </div>

      <div className="text-center mb-6 shrink-0 z-10 w-full px-4">
        <h2 className="text-2xl md:text-3xl font-display font-light text-white/90 truncate">
          {activeTrack.title}
        </h2>
        <p className="text-[10px] md:text-xs font-sans text-white/50 mt-1 uppercase tracking-widest font-bold truncate">
          {l(activeTrack.desc)}
        </p>
      </div>

      {devices.length > 0 && (
        <div className="flex items-center justify-center gap-2 text-white/40 text-[10px] px-3 py-1 bg-white/5 rounded-full border border-white/5 w-auto mb-6 shrink-0 transition-all hover:bg-white/10 hover:text-white/70">
          <Volume2 size={12} />
          <select 
            value={selectedDevice} 
            onChange={(e) => handleDeviceChange(e.target.value)}
            className="bg-transparent outline-none cursor-pointer text-center appearance-none"
          >
            <option value="" disabled>{lang === 'vi' ? 'Chọn Loa' : lang === 'zh' ? '选择扬声器' : 'Choose Speaker'}</option>
            {devices.map(d => (
              <option key={d.deviceId} value={d.deviceId} className="bg-[#0a0f1c] text-white/90 p-2">
                {d.label || `Speaker ${d.deviceId.substring(0, 4)}...`}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex items-center gap-8 mb-8 shrink-0 z-10">
        <button onClick={prevTrack} className="text-white/30 hover:text-white transition-colors">
          <Rewind size={24} />
        </button>
        <button 
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10 shadow-lg"
        >
          {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </button>
        <button onClick={nextTrack} className="text-white/30 hover:text-white transition-colors">
          <FastForward size={24} />
        </button>
      </div>

      {/* Elegant Vertical Playlist */}
      <div className="w-full flex-1 flex flex-col gap-2 overflow-y-auto pb-24 pointer-events-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {playlist.map((item, idx) => (
          <button 
            key={item.id}
            onClick={() => switchTrack(idx)}
            className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all border
              ${activeTrackIdx === idx ? 'bg-white/10 border-white/20 shadow-md' : 'bg-transparent border-transparent hover:bg-white/5'}`}
          >
            <div className={`w-12 h-12 rounded-xl flex shrink-0 items-center justify-center transition-colors ${activeTrackIdx === idx ? 'bg-black/40' : 'bg-black/20'}`} style={{ color: item.color }}>
              {activeTrackIdx === idx && isPlaying ? (
                 <motion.div animate={{ scale: [1,1.1,1]}} transition={{repeat: Infinity, duration: 2}}><Music size={18} /></motion.div>
              ) : <Music size={18} />}
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className={`text-[13px] md:text-sm font-semibold truncate transition-colors ${activeTrackIdx === idx ? 'text-white' : 'text-white/60'}`}>{item.title}</p>
              <p className="text-[9px] md:text-[10px] text-white/40 truncate uppercase tracking-widest mt-0.5">{l(item.desc)}</p>
            </div>
            {activeTrackIdx === idx && isPlaying && (
               <div className="w-8 flex items-center justify-center text-white/60 shrink-0">
                  <div className="flex items-end gap-[3px] h-4">
                     <motion.div animate={{height:[4,10,4]}} transition={{repeat:Infinity,duration:0.6}} className="w-[3px] bg-current rounded-full"/>
                     <motion.div animate={{height:[4,14,4]}} transition={{repeat:Infinity,duration:0.8}} className="w-[3px] bg-current rounded-full"/>
                     <motion.div animate={{height:[4,8,4]}} transition={{repeat:Infinity,duration:0.5}} className="w-[3px] bg-current rounded-full"/>
                  </div>
               </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
