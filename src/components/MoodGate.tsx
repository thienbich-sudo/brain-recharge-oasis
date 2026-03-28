import { motion } from 'framer-motion';
import { Brain, Coffee, BatteryWarning, Moon } from 'lucide-react';
import { useLanguage } from '../i18n/LangContext';

interface Props {
  onCheckIn: (mood: string) => void;
}

export default function MoodGate({ onCheckIn }: Props) {
  const { t } = useLanguage();

  const moods = [
    { id: 'focus', title: t('mood.focus'), desc: t('mood.focus.desc'), icon: <Brain size={28} strokeWidth={1.5}/>, color: 'from-blue-500/20 to-blue-600/5', border: 'hover:border-blue-400/50' },
    { id: 'stress', title: t('mood.stress'), desc: t('mood.stress.desc'), icon: <Coffee size={28} strokeWidth={1.5}/>, color: 'from-teal-500/20 to-teal-600/5', border: 'hover:border-teal-400/50' },
    { id: 'burnout', title: t('mood.burnout'), desc: t('mood.burnout.desc'), icon: <BatteryWarning size={28} strokeWidth={1.5}/>, color: 'from-rose-500/20 to-rose-600/5', border: 'hover:border-rose-400/50' },
    { id: 'sleepy', title: t('mood.sleepy'), desc: t('mood.sleepy.desc'), icon: <Moon size={28} strokeWidth={1.5}/>, color: 'from-amber-500/20 to-amber-600/5', border: 'hover:border-amber-400/50' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="absolute inset-0 z-[100] flex flex-col items-center justify-center p-4 md:p-6 bg-[#060a13] backdrop-blur-3xl"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-[#060a13] to-[#060a13] -z-10"></div>
      
      <div className="max-w-4xl w-full flex flex-col items-center">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-3xl md:text-5xl font-display font-light text-white/90 mb-4 text-center tracking-wide"
        >
          {t('mood.title')}
        </motion.h1>
        
        <motion.p 
          initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-xs md:text-sm font-sans text-white/40 mb-12 md:mb-16 text-center max-w-lg leading-relaxed px-4"
        >
          {t('mood.desc')}
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full px-4">
          {moods.map((m, i) => (
            <motion.button
              key={m.id}
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 + i * 0.1 }}
              whileHover={{ scale: 1.03, y: -4, transition: { type: "spring", stiffness: 400, damping: 10 } }}
              whileTap={{ scale: 0.95, transition: { type: "spring", stiffness: 400, damping: 10 } }}
              onClick={() => onCheckIn(m.id)}
              className={`p-6 md:p-8 rounded-3xl border border-white/5 bg-gradient-to-br ${m.color} text-left flex items-start gap-4 md:gap-6 ${m.border} transition-colors duration-300 group shadow-[0_10px_30px_rgba(0,0,0,0.5)]`}
            >
              <div className="p-3 md:p-4 rounded-full bg-white/10 backdrop-blur-md text-white/70 shrink-0 group-hover:text-white transition-colors shadow-inner">
                {m.icon}
              </div>
              <div className="flex flex-col justify-center h-full">
                <h3 className="text-lg md:text-xl font-display text-white/90 mb-1 group-hover:text-white">{m.title}</h3>
                <p className="text-[10px] md:text-xs font-sans text-white/40 group-hover:text-white/60">{m.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
