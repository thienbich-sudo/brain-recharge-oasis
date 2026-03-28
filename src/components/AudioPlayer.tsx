import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, FastForward, Rewind, Volume2, Music } from 'lucide-react';
import { useLanguage } from '../i18n/LangContext';

const playlist = [
  { id: 't1', title: 'J.S. Bach - Goldberg Variations', desc: { vi: 'Focus & Tư duy logic', en: 'Focus & Logic (Alpha)', zh: '深度专注与逻辑' }, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', color: '#60a5fa' },
  { id: 't2', title: 'F. Chopin - Nocturnes', desc: { vi: 'Giải tỏa cảm xúc', en: 'Emotional Release', zh: '情感释放' }, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', color: '#c084fc' },
  { id: 't3', title: 'C. Debussy - Clair de Lune', desc: { vi: 'Trạng thái tuôn trào', en: 'Abstract Flow State', zh: '抽象心流状态' }, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', color: '#34d399' },
  { id: 't4', title: 'W.A. Mozart - Sonata', desc: { vi: 'Đồng bộ hai bán cầu não', en: 'Brain Sync & Clarity', zh: '左右脑同步' }, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', color: '#facc15' },
  { id: 't5', title: 'Rain & Thunder', desc: { vi: 'Tiếng ồn trắng tự nhiên', en: 'Nature White Noise', zh: '自然白噪音' }, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', color: '#94a3b8' },
  { id: 't6', title: 'Deep Space Ambient', desc: { vi: 'Tách biệt trần gian', en: 'Zero Distraction Focus', zh: '零分心专注' }, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', color: '#f472b6' },
  { id: 't7', title: 'Lo-Fi Cafe Vibes', desc: { vi: 'Nhịp điệu nền nhẹ nhàng', en: 'Light Background Groove', zh: '轻快的背景节奏' }, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', color: '#fb923c' },
  { id: 't8', title: 'Himalayan Singing Bowls', desc: { vi: 'Thiền định & Sóng Theta', en: 'Meditation & Theta Waves', zh: '冥想与Theta脑波' }, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', color: '#14b8a6' },
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
    <div className="flex flex-col items-center justify-between h-full w-full max-w-2xl px-4 py-4 md:py-6">
      <audio ref={audioRef} src={activeTrack.url} onEnded={nextTrack} crossOrigin="anonymous"/>
      
      {/* Visualizer Mock */}
      <div className="flex items-center justify-center gap-1.5 h-20 md:h-32 w-full shrink-0 my-auto">
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1.5 rounded-full opacity-70"
            style={{ backgroundColor: activeTrack.color }}
            animate={{ 
              height: isPlaying ? [10, Math.random() * 60 + 20, 10] : 8,
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

      <div className="text-center mb-4 md:mb-6 shrink-0 z-10">
        <h2 className="text-xl md:text-3xl font-display font-light text-white/90">
          {activeTrack.title}
        </h2>
        <p className="text-xs md:text-sm font-sans text-white/50 mt-2 uppercase tracking-widest font-bold">
          {l(activeTrack.desc)}
        </p>
      </div>

      <div className="flex items-center gap-6 md:gap-10 mb-6 shrink-0 z-10">
        <button onClick={prevTrack} className="text-white/40 hover:text-white transition-colors p-4">
          <Rewind size={28} />
        </button>
        <button 
          onClick={togglePlay}
          className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
        >
          {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </button>
        <button onClick={nextTrack} className="text-white/40 hover:text-white transition-colors p-4">
          <FastForward size={28} />
        </button>
      </div>

      {devices.length > 0 && (
        <div className="flex items-center justify-center gap-2 text-white/50 text-xs px-3 py-2 md:px-4 md:py-2 bg-white/5 rounded-full border border-white/10 w-full max-w-[280px] mb-6 shrink-0">
          <Volume2 size={16} />
          <select 
            value={selectedDevice} 
            onChange={(e) => handleDeviceChange(e.target.value)}
            className="bg-transparent outline-none cursor-pointer w-full text-center appearance-none truncate text-[10px] md:text-xs"
          >
            <option value="" disabled>{lang === 'vi' ? '--- Chọn Loa ---' : lang === 'zh' ? '--- 选择扬声器 ---' : '--- Choose Speaker ---'}</option>
            {devices.map(d => (
              <option key={d.deviceId} value={d.deviceId} className="bg-[#0a0f1c] text-white/90 p-2">
                {d.label || `Speaker ${d.deviceId.substring(0, 4)}...`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Playlist Selector - Horizontal Scroll */}
      <div className="w-full flex gap-3 overflow-x-auto pb-4 pt-2 px-2 scrollbar-none snap-x pointer-events-auto shrink-0 mt-auto" 
           style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {playlist.map((item, idx) => (
          <button 
            key={item.id}
            onClick={() => switchTrack(idx)}
            className={`flex-shrink-0 flex items-center gap-3 px-3 md:px-4 py-3 rounded-2xl transition-all border snap-center min-w-[220px] md:min-w-[260px] h-20
              ${activeTrackIdx === idx ? 'bg-white/15 border-white/30 shadow-lg scale-105' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
          >
            <div className="w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center bg-black/30 shadow-inner" style={{ color: item.color }}>
              <Music size={18} />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-[11px] md:text-xs font-semibold text-white/90 truncate leading-tight mb-1">{item.title}</p>
              <p className="text-[9px] md:text-[10px] text-white/50 truncate uppercase tracking-widest">{l(item.desc)}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
