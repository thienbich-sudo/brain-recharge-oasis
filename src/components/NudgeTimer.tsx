import { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { useLanguage } from '../i18n/LangContext';

export default function NudgeTimer() {
  const { lang, t } = useLanguage();
  const [isActive, setIsActive] = useState(false);
  const [minutesLeft, setMinutesLeft] = useState(20);

  useEffect(() => {
    if (isActive && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    let interval: number;

    if (isActive) {
      interval = setInterval(() => {
        setMinutesLeft((prev) => {
          if (prev <= 1) {
            triggerNudge();
            return 20;
          }
          return prev - 1;
        });
      }, 60000); // 1 min
    }

    return () => clearInterval(interval);
  }, [isActive]);

  const triggerNudge = () => {
    const chime = new Audio('https://www.soundjay.com/buttons/beep-07a.mp3');
    chime.volume = 0.3;
    chime.play().catch(() => {});

    if (Notification.permission === 'granted') {
      const texts = {
         vi: 'Đã 20 phút. Trút mắt khỏi màn hình và nhìn ra xa 6 mét trong vòng 20 giây nhé.',
         en: '20 minutes passed. Look 20 feet away for 20 seconds.',
         zh: '20分钟到了。请看远处的屏幕外20秒。'
      };

      new Notification('Oasis: 20-20-20', {
        body: texts[lang],
        icon: 'https://cdn-icons-png.flaticon.com/512/3048/3048122.png',
        silent: true 
      });
    }
  };

  const toggleTimer = () => {
    if (!isActive) {
      setMinutesLeft(20);
      try {
        const chime = new Audio('https://www.soundjay.com/buttons/button-09.mp3');
        chime.volume = 0.2;
        chime.play();
      } catch(e){}
    }
    setIsActive(!isActive);
  };

  const getLabel = () => {
    if (!isActive) {
       return { vi: 'Nhắc Nhở: TẮT', en: 'NUDGE: OFF', zh: '提醒: 关闭' }[lang];
    }
    return `${minutesLeft} ` + { vi: 'phút nữa', en: 'min left', zh: '分钟后' }[lang];
  };

  return (
    <div className="absolute top-6 right-6 lg:top-8 lg:right-12 z-50">
      <button 
        onClick={toggleTimer}
        className={`flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full backdrop-blur-md transition-all border shadow-[0_0_20px_rgba(0,0,0,0.2)] group
          ${isActive ? 'bg-teal-500/20 border-teal-500/50 text-teal-200 shadow-[0_0_25px_rgba(20,184,166,0.2)]' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white/80'}`}
        title="20-20-20 Eye Rest Nudge"
      >
        {isActive ? (
          <>
            <Bell size={16} className="animate-pulse" strokeWidth={1.5} />
            <span className="text-[10px] md:text-xs font-sans font-bold tracking-widest uppercase">{getLabel()}</span>
          </>
        ) : (
          <>
            <BellOff size={16} className="opacity-50 group-hover:opacity-100" strokeWidth={1.5} />
            <span className="text-[10px] md:text-xs font-sans font-bold tracking-widest uppercase">{getLabel()}</span>
          </>
        )}
      </button>
    </div>
  );
}
