import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useLanguage } from '../i18n/LangContext';

interface Props {
  onBurn?: () => void;
}

export default function BrainDump({ onBurn }: Props) {
  const { t } = useLanguage();
  const [thoughts, setThoughts] = useState<{id: number, text: string}[]>([]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleBurn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newThought = { id: Date.now(), text: input };
    setThoughts([{id: -1, text: ''}]); // trigger reactivity safely
    setThoughts(prev => [newThought, ...prev]);
    setInput('');
    if (onBurn) onBurn();
    
    // Auto burn after 1.5 seconds removing it from screen
    setTimeout(() => {
      setThoughts(prev => prev.filter(t => t.id !== newThought.id));
    }, 1800);
  };

  return (
     <div className="w-full h-full flex flex-col items-center justify-center p-8 max-w-xl mx-auto relative overflow-hidden">
        
        {/* Background Ambient Fire Simulation */}
        <motion.div 
           className="absolute bottom-[-20%] w-full h-[50%] blur-[60px] opacity-20 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse at center, #f97316 0%, #ea580c 40%, transparent 70%)' }}
           animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }}
           transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="flex flex-col items-center mb-8 z-20">
          <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 mb-4 border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.2)]">
            <Flame size={32} />
          </div>
          <h2 className="text-3xl font-display text-white/90 font-light mb-2">{t('dump.title')}</h2>
          <p className="text-sm font-sans text-orange-200/50 text-center max-w-sm leading-relaxed uppercase tracking-widest">
            {t('dump.desc')}
          </p>
        </div>
        
        <form onSubmit={handleBurn} className="w-full relative z-20">
           <input 
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={t('dump.placeholder')} 
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white/90 outline-none focus:border-orange-500/50 focus:bg-white/5 transition-all font-sans shadow-inner placeholder:text-white/20"
           />
           <motion.button 
             whileHover={{ scale: 1.1, transition: { type: "spring", stiffness: 400, damping: 10 } }}
             whileTap={{ scale: 0.8, transition: { type: "spring", stiffness: 400, damping: 10 } }}
             type="submit" 
             disabled={!input.trim()}
             className={`absolute right-4 top-1/2 -mt-3 transition-colors ${input.trim() ? 'text-orange-400 hover:text-orange-300 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'text-white/10'}`}
           >
               <Flame size={24} />
           </motion.button>
        </form>

        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
           <AnimatePresence>
             {thoughts.map(t => t.id !== -1 && (
               <motion.div 
                  key={t.id}
                  initial={{ opacity: 1, scale: 1, y: 30, filter: 'blur(0px)', color: '#fff' }}
                  animate={{ opacity: 0, scale: 1.5, y: -200, filter: 'blur(10px)', color: '#ea580c' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.8, ease: "easeOut" }}
                  className="absolute text-2xl font-bold font-sans text-center drop-shadow-[0_0_20px_rgba(249,115,22,0.8)]"
               >
                  {t.text}
               </motion.div>
             ))}
           </AnimatePresence>
        </div>
     </div>
  )
}
