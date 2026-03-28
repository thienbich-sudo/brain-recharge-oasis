import { useState, useEffect, useRef } from 'react';
import { Activity, Play, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LangContext';

export default function BinauralGenerator() {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [targetHz, setTargetHz] = useState<number>(10); // Alpha waves default
  const ctxRef = useRef<AudioContext | null>(null);
  const oscL = useRef<OscillatorNode | null>(null);
  const oscR = useRef<OscillatorNode | null>(null);

  const toggleBinaural = () => {
     if (isPlaying) {
         if (ctxRef.current) ctxRef.current.close();
         setIsPlaying(false);
     } else {
         const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
         ctxRef.current = ctx;
         const merger = ctx.createChannelMerger(2);
         const gain = ctx.createGain();
         gain.gain.value = 0.5;

         const oL = ctx.createOscillator();
         const oR = ctx.createOscillator();

         // Base carrier frequency (soothing low pitch 200Hz)
         oL.frequency.value = 200; 
         // Offset frequency maps directly to Target Binaural Hz
         oR.frequency.value = 200 + targetHz; 

         oL.connect(merger, 0, 0); // Left channel specifically
         oR.connect(merger, 0, 1); // Right channel specifically

         merger.connect(gain);
         gain.connect(ctx.destination);

         oL.start(); oR.start();
         oscL.current = oL;
         oscR.current = oR;
         setIsPlaying(true);
     }
  };

  // Smoothly slide frequency without stopping the oscillators
  useEffect(() => {
     if (isPlaying && oscR.current && ctxRef.current) {
         oscR.current.frequency.setTargetAtTime(200 + targetHz, ctxRef.current.currentTime, 0.1);
     }
  }, [targetHz, isPlaying]);

  useEffect(() => {
     return () => { if (ctxRef.current && ctxRef.current.state !== 'closed') ctxRef.current.close(); };
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-6 max-w-sm mx-auto text-center shrink-0 overflow-y-auto">
       <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
          <Activity size={40} strokeWidth={1.5} />
       </div>
       <h2 className="text-2xl md:text-3xl font-display text-white/90 mb-2">Sóng Não Binaural</h2>
       <p className="text-[10px] md:text-xs font-sans text-indigo-200/50 uppercase tracking-widest mb-6">Bắt buộc đeo Tai Nghe Stereo</p>

       <p className="text-xs md:text-sm text-white/40 mb-8 leading-relaxed font-sans max-w-xs">
          Công nghệ Web Audio đẩy 200Hz vào Tai Trái và 200+X Hz vào Tai Phải. Bộ não sẽ tự động bù trừ vào tần số ảo X Hz.
       </p>

       <div className="w-full bg-white/5 p-6 rounded-3xl border border-white/10 mb-8 relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-indigo-500/10 rounded-3xl -z-10 mix-blend-screen blur-[20px]"
            animate={isPlaying ? { opacity: [0.1, 0.4, 0.1] } : { opacity: 0 }}
            transition={{ duration: targetHz > 0 ? 1 / targetHz : 1, repeat: Infinity, ease: 'linear' }}
          />

          <div className="flex justify-between items-center mb-4">
             <span className="text-xs md:text-sm font-sans text-white/60">Tần số X (Hz)</span>
             <span className="text-xl md:text-2xl font-display font-bold text-indigo-300">{targetHz} Hz</span>
          </div>
          <input 
             type="range" min="1" max="30" step="1" value={targetHz}
             onChange={e => setTargetHz(parseInt(e.target.value))}
             className="w-full accent-indigo-400 mb-4 h-1.5 md:h-2 bg-white/10 rounded-full appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full cursor-pointer hover:bg-white/20 transition-colors"
          />
          <div className="text-[10px] md:text-xs font-sans text-indigo-200/60 font-medium text-center mt-2 h-4">
             {targetHz <= 4 && t('bin.delta')}
             {targetHz > 4 && targetHz <= 8 && t('bin.theta')}
             {targetHz > 8 && targetHz <= 14 && t('bin.alpha')}
             {targetHz > 14 && t('bin.beta')}
          </div>
       </div>

       <button 
          onClick={toggleBinaural}
          className={`flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-full font-bold tracking-widest text-[10px] md:text-xs transition-all duration-300 shadow-xl
             ${isPlaying ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 hover:bg-rose-500/30' : 'bg-indigo-600 text-white hover:bg-indigo-500 border border-indigo-400/50'}`}
       >
          {isPlaying ? <Square size={16} fill="currentColor"/> : <Play size={16} fill="currentColor" />}
          {isPlaying ? t('bin.off') : t('bin.on')}
       </button>
    </div>
  );
}
