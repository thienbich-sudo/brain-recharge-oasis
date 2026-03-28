import { useState, useRef, useEffect } from 'react';
import { CloudRain, Flame, Coffee, Wind, RefreshCcw, Speaker } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LangContext';

export default function AmbientMixer() {
  const { t } = useLanguage();

  const tracks = [
    { id: 'rain', name: t('mixer.rain'), icon: <CloudRain size={24} strokeWidth={1.5}/>, url: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg', color: 'text-blue-400', bg: 'bg-blue-400/20', border: 'border-blue-400/30', trackBg: 'bg-blue-400' },
    { id: 'fire', name: t('mixer.fire'), icon: <Flame size={24} strokeWidth={1.5}/>, url: 'https://actions.google.com/sounds/v1/foley/fire_burning.ogg', color: 'text-orange-400', bg: 'bg-orange-400/20', border: 'border-orange-400/30', trackBg: 'bg-orange-500' },
    { id: 'cafe', name: t('mixer.cafe'), icon: <Coffee size={24} strokeWidth={1.5}/>, url: 'https://actions.google.com/sounds/v1/crowds/restaurant_ambience.ogg', color: 'text-amber-500', bg: 'bg-amber-500/20', border: 'border-amber-500/30', trackBg: 'bg-amber-500' },
    { id: 'wind', name: t('mixer.wind'), icon: <Wind size={24} strokeWidth={1.5}/>, url: 'https://actions.google.com/sounds/v1/weather/wind_storm.ogg', color: 'text-teal-300', bg: 'bg-teal-300/20', border: 'border-teal-300/30', trackBg: 'bg-teal-400' },
  ];

  const [volumes, setVolumes] = useState<Record<string, number>>({ rain: 0, fire: 0, cafe: 0, wind: 0 });
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const outputs = devices.filter(d => d.kind === 'audiooutput');
        setAudioDevices(outputs);
        const defaultDevice = outputs.find(d => d.deviceId === 'default') || outputs[0];
        if (defaultDevice) setSelectedDevice(defaultDevice.deviceId);
      } catch (e) {
        console.error("No device access", e);
      }
    };
    getDevices();
    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    return () => {
        navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    };
  }, []);

  const changeOutputDevice = async (deviceId: string) => {
    setSelectedDevice(deviceId);
    Object.keys(audioRefs.current).forEach(key => {
        const audio = audioRefs.current[key];
        if (audio && (audio as any).setSinkId) {
            (audio as any).setSinkId(deviceId).catch(console.error);
        }
    });
  };

  useEffect(() => {
     Object.keys(volumes).forEach(key => {
        const audio = audioRefs.current[key];
        if (audio) {
           const vol = volumes[key] / 100;
           audio.volume = vol;
           if (vol > 0 && audio.paused) {
             audio.play().catch(() => {});
           } else if (vol === 0 && !audio.paused) {
             audio.pause();
           }
        }
     });
  }, [volumes]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-4 md:p-6 max-w-4xl mx-auto overflow-hidden">
      
      {tracks.map(t => (
         <audio key={t.id} ref={el => { audioRefs.current[t.id] = el; }} src={t.url} loop crossOrigin="anonymous"/>
      ))}

      {/* Header Compact */}
      <div className="text-center w-full shrink-0 mt-2">
        <h2 className="text-2xl md:text-3xl font-display font-light text-white/90 tracking-wide mb-1">{t('mixer.title')}</h2>
        <p className="text-[10px] md:text-xs font-sans uppercase tracking-widest text-white/40">{t('mixer.desc')}</p>
      </div>

      {/* 2x2 Mini Bento Grid - Vừa vặn hoàn hảo 1 màn hình */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 my-auto shrink">
        {tracks.map(t => {
          const isActive = volumes[t.id] > 0;
          return (
            <div 
               key={t.id} 
               className={`flex flex-col justify-between p-4 md:p-5 rounded-3xl transition-all duration-300 overflow-hidden relative group h-full
               ${isActive ? `bg-white/10 ${t.border} shadow-[0_0_20px_rgba(255,255,255,0.05)]` : 'bg-black/20 border border-white/5 hover:bg-white/5 shadow-inner'}`}
            >
               {isActive && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className={`absolute inset-0 ${t.bg} opacity-20 blur-[30px] pointer-events-none`} 
                  />
               )}
               
               <div className="flex justify-between items-center z-10 mb-4 md:mb-6">
                  <motion.div 
                    animate={isActive ? { scale: [1, 1.05, 1], y: [0, -2, 0] } : { scale: 1, y: 0 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className={`p-3 rounded-2xl transition-colors duration-500 ${isActive ? `${t.bg} ${t.color} shadow-lg` : 'bg-white/5 text-white/30'}`}
                  >
                     {t.icon}
                  </motion.div>
                  <span className={`text-3xl md:text-4xl font-display font-light tabular-nums transition-colors duration-300 ${isActive ? 'text-white/90' : 'text-white/20'}`}>
                    {volumes[t.id]}<span className="text-sm md:text-lg text-white/30">%</span>
                  </span>
               </div>
               
               <div className="flex flex-col gap-2 z-10 w-full mt-auto">
                  <span className={`text-sm md:text-base font-sans font-semibold tracking-wide transition-colors ${isActive ? 'text-white/90' : 'text-white/50'}`}>
                     {t.name}
                  </span>
                  
                  <div className="relative w-full h-8 flex items-center group cursor-pointer cursor-ew-resize">
                     <input 
                       type="range" min="0" max="100" step="5" value={volumes[t.id]} 
                       onChange={e => setVolumes(prev => ({...prev, [t.id]: parseInt(e.target.value)}))}
                       className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                     />
                     <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden shadow-inner border border-white/5">
                        <div 
                           className={`h-full transition-all duration-150 rounded-full ${isActive ? t.trackBg : 'bg-white/20'}`}
                           style={{ width: `${volumes[t.id]}%` }}
                        />
                     </div>
                     <div 
                        className={`absolute h-4 w-4 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] flex items-center justify-center transform -translate-x-1/2 pointer-events-none transition-transform ${isActive ? 'scale-100' : 'scale-0'}`}
                        style={{ left: `${volumes[t.id]}%` }}
                     >
                         <div className={`w-1.5 h-1.5 rounded-full ${isActive ? t.trackBg : ''}`} />
                     </div>
                  </div>
               </div>
            </div>
          );
        })}
      </div>
      
      {/* Output Settings Compact */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full shrink-0">
         <button 
            onClick={() => setVolumes({ rain: 0, fire: 0, cafe: 0, wind: 0 })}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white/50 rounded-full hover:bg-white/15 hover:text-white/90 transition-all text-[10px] md:text-xs font-sans font-bold tracking-widest uppercase shadow-sm border border-transparent hover:border-white/10 w-full sm:w-auto justify-center"
         >
            <RefreshCcw size={14} strokeWidth={2}/> {t('mixer.reset')}
         </button>

         {audioDevices.length > 0 && (
           <div className="relative group w-full sm:w-auto">
              <select 
                 value={selectedDevice}
                 onChange={(e) => changeOutputDevice(e.target.value)}
                 className="w-full sm:w-auto appearance-none bg-white/5 border border-white/10 text-white/70 text-[10px] md:text-xs font-sans py-3 pl-5 pr-10 rounded-full outline-none focus:border-white/30 cursor-pointer hover:bg-white/10 transition-colors tracking-wide max-w-[200px] truncate"
                 title="Select Output Speaker"
              >
                  {audioDevices.map(d => (
                     <option key={d.deviceId} value={d.deviceId} className="bg-[#0f172a] text-white my-2">
                        {d.label || `Speaker ${d.deviceId.slice(0,5)}`}
                     </option>
                  ))}
              </select>
              <Speaker className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none transition-colors group-hover:text-white/70" size={14} />
           </div>
         )}
      </div>

    </div>
  );
}
