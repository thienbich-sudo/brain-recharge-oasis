import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Activity, PersonStanding, Flame, Ear, EarOff, Play, Pause } from 'lucide-react';
import ZenAvatar from './ZenAvatar';
import { useLanguage } from '../i18n/LangContext';

export default function BreathingRing() {
  const { lang, l, playTTS, stopTTS } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<'breath' | 'upper' | 'full'>('upper');
  const [mode, setMode] = useState<string>('neck');
  
  const [stepIdx, setStepIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isVoiceOn, setIsVoiceOn] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const modes: Record<string, any> = {
    // 1. BREATHWORK
    box: { 
        cat: 'breath', icon: <Wind size={14}/>, 
        name: { vi: 'Thở Hộp', en: 'Box Breathing', zh: '箱式呼吸' }, 
        desc: { vi: 'Cân bằng tâm trí nhanh', en: 'Quick mind balance', zh: '快速平衡心态' },
        steps: [
            { text: { vi: 'Hít vào chậm', en: 'Inhale slowly', zh: '慢慢吸气' }, time: 4, anim: 'expand' },
            { text: { vi: 'Giữ hơi nén', en: 'Hold breath', zh: '屏住呼吸' }, time: 4, anim: 'hold-expand' },
            { text: { vi: 'Thở ra từ từ', en: 'Exhale slowly', zh: '慢慢呼气' }, time: 4, anim: 'contract' },
            { text: { vi: 'Giữ phổi rỗng', en: 'Hold empty', zh: '保持呼空' }, time: 4, anim: 'hold-contract' }
        ],
        color: 'teal' 
    },
    relax: { 
        cat: 'breath', icon: <Wind size={14}/>, 
        name: { vi: '4-7-8 Thư giãn', en: '4-7-8 Relax', zh: '4-7-8 放松' }, 
        desc: { vi: 'Hạ tĩnh mạch & Dễ ngủ', en: 'Lower BP & Sleep aid', zh: '降血压助眠' },
        steps: [
             { text: { vi: 'Hít bằng mũi', en: 'Inhale through nose', zh: '通过鼻子吸气' }, time: 4, anim: 'expand' },
             { text: { vi: 'Nín thở nén hơi', en: 'Hold breath', zh: '屏住呼吸' }, time: 7, anim: 'hold-expand' },
             { text: { vi: 'Thở miệng mạnh', en: 'Exhale via mouth', zh: '通过嘴巴呼气' }, time: 8, anim: 'contract' }
        ],
        color: 'indigo' 
    },
    wimhof: { 
        cat: 'breath', icon: <Flame size={14}/>, 
        name: { vi: 'Lửa (Awake)', en: 'Fire (Awake)', zh: '火焰呼吸' }, 
        desc: { vi: 'Bơm Oxy lên não tức thì', en: 'Instant Oxygen boost', zh: '瞬间补氧' },
        steps: [
            { text: { vi: 'Hít thật sâu !', en: 'Deep breath in', zh: '深吸气！' }, time: 2, anim: 'expand' },
            { text: { vi: 'Thở hắt ra ngay', en: 'Let it go', zh: '立刻呼出' }, time: 1, anim: 'contract' },
            { text: { vi: 'Hít sâu (lặp lại)', en: 'Deep breath in', zh: '深吸气（重复）' }, time: 2, anim: 'expand' },
            { text: { vi: 'Thở hắt ra ngay', en: 'Let it go', zh: '立刻呼出' }, time: 1, anim: 'contract' },
            { text: { vi: 'Giữ hơi (Nín thở)', en: 'Hold breath', zh: '屏住呼吸' }, time: 3, anim: 'hold-contract' }
        ],
        color: 'rose' 
    },
    nadi: {
        cat: 'breath', icon: <Wind size={14}/>, 
        name: { vi: 'Luân Phiên', en: 'Alternate Nostril', zh: '交替鼻孔呼吸' }, 
        desc: { vi: 'Cân bằng Não bộ', en: 'Brain Hemisphere balance', zh: '平衡左右脑' },
        steps: [
            { text: { vi: 'Bịt mũi PHẢI, Hít TRÁI', en: 'Close Right, Inhale Left', zh: '闭右吸左' }, time: 4, anim: 'left' },
            { text: { vi: 'Giữ hơi cân bằng', en: 'Hold breath', zh: '屏住呼吸' }, time: 4, anim: 'center' },
            { text: { vi: 'Bịt mũi TRÁI, Thở PHẢI', en: 'Close Left, Exhale Right', zh: '闭左呼右' }, time: 4, anim: 'right' },
            { text: { vi: 'Hít sâu mũi PHẢI', en: 'Inhale Right', zh: '右鼻孔吸气' }, time: 4, anim: 'right' },
            { text: { vi: 'Giữ hơi cân bằng', en: 'Hold breath', zh: '屏住呼吸' }, time: 4, anim: 'center' },
            { text: { vi: 'Bịt mũi PHẢI, Thở TRÁI', en: 'Close Right, Exhale Left', zh: '闭右呼左' }, time: 4, anim: 'left' }
        ],
        color: 'teal'
    },

    // 2. UPPER BODY / DESK WARRIOR
    neck: { 
        cat: 'upper', icon: <Activity size={14}/>, 
        name: { vi: 'Cổ Vai Gáy', en: 'Neck & Shoulders', zh: '颈肩舒缓' }, 
        desc: { vi: 'Symmetrical Neck Stretch', en: 'Symmetrical Stretch', zh: '对称颈部拉伸' },
        steps: [
            { text: { vi: 'Ngửa cổ lên trần tối đa', en: 'Look up to ceiling', zh: '抬头看天花板' }, time: 5, anim: 'up' },
            { text: { vi: 'Trở về trung tâm', en: 'Return to center', zh: '回到正中' }, time: 2, anim: 'center' },
            { text: { vi: 'Gập cằm sát vào ngực', en: 'Look down to chest', zh: '低头看胸口' }, time: 5, anim: 'down' },
            { text: { vi: 'Trở về trung tâm', en: 'Return to center', zh: '回到正中' }, time: 2, anim: 'center' },
            { text: { vi: 'Ép chặt mang tai TRÁI', en: 'Stretch Left ear down', zh: '左耳贴肩' }, time: 5, anim: 'left' },
            { text: { vi: 'Trở về trung tâm', en: 'Return to center', zh: '回到正中' }, time: 2, anim: 'center' },
            { text: { vi: 'Ép chặt mang tai PHẢI', en: 'Stretch Right ear down', zh: '右耳贴肩' }, time: 5, anim: 'right' },
            { text: { vi: 'Trở về trung tâm', en: 'Return to center', zh: '回到正中' }, time: 2, anim: 'center' }
        ],
        color: 'orange' 
    },
    chest: { 
        cat: 'upper', icon: <Activity size={14}/>, 
        name: { vi: 'Mở Lồng Ngực', en: 'Chest Opener', zh: '扩胸运动' }, 
        desc: { vi: 'Khắc phục Gù lưng', en: 'Fix rounded posture', zh: '改善圆肩驼背' },
        steps: [
            { text: { vi: 'Đan tay gáy, Ưỡn ngực', en: 'Hands behind head, open', zh: '双手抱头，挺胸' }, time: 5, anim: 'expand' },
            { text: { vi: 'Giữ căng lồng ngực', en: 'Hold stretch', zh: '保持拉伸' }, time: 4, anim: 'hold-expand' },
            { text: { vi: 'Thu cùi chỏ, Cuộn lưng', en: 'Elbows together, curve', zh: '收合手肘，拱背' }, time: 5, anim: 'contract' },
            { text: { vi: 'Nhả lỏng cơ', en: 'Relax muscles', zh: '放松肌肉' }, time: 3, anim: 'hold-contract' }
        ],
        color: 'orange' 
    },
    wrist: { 
        cat: 'upper', icon: <Activity size={14}/>, 
        name: { vi: 'Giải cứu Cổ Tay', en: 'Wrist Rescue', zh: '手腕拯救' }, 
        desc: { vi: 'Phục vụ Typist', en: 'For heavy typists', zh: '为打字员准备' },
        steps: [
            { text: { vi: 'Nắm thật chặt 2 tay', en: 'Clench fists', zh: '紧握双拳' }, time: 4, anim: 'contract' },
            { text: { vi: 'Xòe bung 10 ngón tay', en: 'Stretch fingers wide', zh: '十指张开' }, time: 4, anim: 'expand' },
            { text: { vi: 'Bẻ ngược cổ tay LÊN', en: 'Bend wrists UP', zh: '手腕向上翻' }, time: 4, anim: 'up' },
            { text: { vi: 'Bẻ quặp cổ tay XUỐNG', en: 'Bend wrists DOWN', zh: '手腕向下压' }, time: 4, anim: 'down' }
        ],
        color: 'teal' 
    },
    eye: { 
        cat: 'upper', icon: <Activity size={14}/>, 
        name: { vi: 'Trị Liệu Kích Mắt', en: 'Eye Therapy', zh: '眼部抗疲劳' }, 
        desc: { vi: 'Bơm Oxy Mắt 4 chiều', en: '4-way Eye stretch', zh: '全方位眼部运动' },
        steps: [
            { text: { vi: 'Liếc mắt sang TRÁI', en: 'Look far LEFT', zh: '向左看' }, time: 3, anim: 'left' },
            { text: { vi: 'Trở về', en: 'Center', zh: '居中' }, time: 1, anim: 'center' },
            { text: { vi: 'Liếc mắt sang PHẢI', en: 'Look far RIGHT', zh: '向右看' }, time: 3, anim: 'right' },
            { text: { vi: 'Trở về', en: 'Center', zh: '居中' }, time: 1, anim: 'center' },
            { text: { vi: 'Nhìn LÊN trần', en: 'Look UP', zh: '向上看' }, time: 3, anim: 'up' },
            { text: { vi: 'Nhìn XUỐNG dưới', en: 'Look DOWN', zh: '向下看' }, time: 3, anim: 'down' },
            { text: { vi: 'Nhắm mắt nhăn trán sâu', en: 'Squeeze eyes shut', zh: '紧闭双眼' }, time: 3, anim: 'contract' },
            { text: { vi: 'Mở to, nhìn xa xăm', en: 'Open wide, stare far', zh: '睁大眼睛看远方' }, time: 4, anim: 'expand' }
        ],
        color: 'indigo' 
    },

    // 3. FULL BODY
    twist: {
        cat: 'full', icon: <PersonStanding size={14}/>, 
        name: { vi: 'Đứng Xoay Vặn Thân', en: 'Standing Torso Twist', zh: '站立扭转躯干' }, 
        desc: { vi: 'Cột sống Symmetrical', en: 'Spinal Symmetry', zh: '对称调整脊柱' },
        steps: [
            { text: { vi: 'ĐỨNG DẬY vươn tay LÊN', en: 'Stand up, reach HIGH', zh: '起立，双手伸高' }, time: 5, anim: 'up' },
            { text: { vi: 'Xoay vặn thân TRÁI', en: 'Twist torso LEFT', zh: '向左扭转躯干' }, time: 5, anim: 'left' },
            { text: { vi: 'Về lại trung tâm', en: 'Return Center', zh: '回到正中' }, time: 2, anim: 'center' },
            { text: { vi: 'Xoay vặn thân PHẢI', en: 'Twist torso RIGHT', zh: '向右扭转躯干' }, time: 5, anim: 'right' },
            { text: { vi: 'Gập người chạm ngón chân', en: 'Bend to toes', zh: '弯腰摸脚趾' }, time: 5, anim: 'down' },
            { text: { vi: 'Trở về tư thế đứng thẳng', en: 'Stand up straight', zh: '恢复直立姿势' }, time: 3, anim: 'expand' }
        ],
        color: 'rose'
    },
    leg: {
        cat: 'full', icon: <PersonStanding size={14}/>, 
        name: { vi: 'Bơm Máu Chân', en: 'Leg Blood Pump', zh: '腿部泵血' }, 
        desc: { vi: 'Ngồi lâu tê nhức', en: 'Relieve leg numbness', zh: '缓解久坐腿麻' },
        steps: [
            { text: { vi: 'Nhón gót đứng mũi chân', en: 'Stand on toes', zh: '踮起脚尖' }, time: 4, anim: 'up' },
            { text: { vi: 'Giữ bắp chân thật căng', en: 'Hold calf stretch', zh: '保持小腿紧绷' }, time: 4, anim: 'hold-expand' },
            { text: { vi: 'Đập gót mạnh xuống sàn', en: 'Drop heels hard', zh: '脚跟重重落地' }, time: 3, anim: 'down' },
            { text: { vi: 'Bấm chặt 10 ngón chân', en: 'Curl toes hard', zh: '脚趾用力抓地' }, time: 3, anim: 'contract' }
        ],
        color: 'indigo'
    }
  };

  const getCatLabel = (c: string) => {
    if (c === 'breath') return { vi: 'Hít Thở', en: 'Breathing', zh: '呼吸' }[lang];
    if (c === 'upper') return { vi: 'Thân Trên/Mắt', en: 'Upper Body', zh: '上半身/眼部' }[lang];
    if (c === 'full') return { vi: 'Toàn Thân', en: 'Full Body', zh: '全身' }[lang];
    return c;
  };

  useEffect(() => {
    setStepIdx(0);
    setTimeLeft(modes[mode].steps[0].time);
  }, [mode]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
         if (prev <= 1) {
            setStepIdx(curr => (curr + 1) % modes[mode].steps.length);
            return -1; 
         }
         return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [mode, isPaused]);

  const speak = (textObj: any) => {
     if (!isVoiceOn || isPaused) return stopTTS();
     playTTS(textObj);
  };

  useEffect(() => {
    if (timeLeft === -1) {
        setTimeLeft(modes[mode].steps[stepIdx].time);
        if (!isPaused) speak(modes[mode].steps[stepIdx].text);
    }
  }, [stepIdx, timeLeft, mode, lang, isVoiceOn, isPaused]);

  useEffect(() => {
     if (!isPaused) speak(modes[mode].steps[0].text);
  }, [mode, lang, isVoiceOn]);

  // Global Audio Cleanup and Pause handling
  useEffect(() => {
      // Force stop when component unmounts entirely
      return () => stopTTS();
  }, []);

  useEffect(() => {
     if (isPaused || !isVoiceOn) {
        stopTTS();
     }
  }, [isPaused, isVoiceOn]);

  const safeIdx = Math.min(stepIdx, modes[mode].steps.length - 1);
  const currentStep = modes[mode].steps[safeIdx];
  const phaseDur = currentStep.time;
  const phaseText = l(currentStep.text);

  const getAnimProps = () => {
    switch (currentStep.anim) {
       case 'expand': return { scale: 1.4, x: 0, y: 0 };
       case 'contract': return { scale: 1, x: 0, y: 0 };
       case 'hold-expand': return { scale: 1.4, x: 0, y: 0 };
       case 'hold-contract': return { scale: 1, x: 0, y: 0 };
       case 'left': return { scale: 1.2, x: -35, y: 0 };
       case 'right': return { scale: 1.2, x: 35, y: 0 };
       case 'up': return { scale: 1.2, x: 0, y: -35 };
       case 'down': return { scale: 1.2, x: 1, y: 35 }; 
       case 'center': default: return { scale: 1.2, x: 0, y: 0 };
    }
  };

  const colors = {
      teal: { glow: '#14b8a6', ringBorder: 'rgba(20, 184, 166, 0.5)', ringBg: 'rgba(13, 148, 136, 0.2)', shadow: 'rgba(45,212,191,0.3)', text: 'text-teal-200' },
      indigo: { glow: '#6366f1', ringBorder: 'rgba(99, 102, 241, 0.5)', ringBg: 'rgba(67, 56, 202, 0.2)', shadow: 'rgba(129,140,248,0.3)', text: 'text-indigo-200' },
      orange: { glow: '#f97316', ringBorder: 'rgba(249, 115, 22, 0.5)', ringBg: 'rgba(194, 65, 12, 0.2)', shadow: 'rgba(251,146,60,0.3)', text: 'text-orange-200' },
      rose: { glow: '#f43f5e', ringBorder: 'rgba(244, 63, 94, 0.5)', ringBg: 'rgba(159, 18, 57, 0.2)', shadow: 'rgba(225,29,72,0.3)', text: 'text-rose-200' }
  };
  
  const c = colors[modes[mode].color as keyof typeof colors];
  const currentCategoryModes = Object.keys(modes).filter(k => modes[k].cat === activeCategory);
  const animProps = getAnimProps();

  return (
    <div className="flex flex-col items-center justify-between p-2 md:p-6 w-full max-w-2xl h-full relative">
      
      {/* Controls Toggle */}
      <div className="absolute top-2 right-2 flex flex-col gap-2 z-50">
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className={`flex items-center gap-2 px-3 py-1.5 md:py-2 rounded-full transition-all border shadow-lg
            ${isPaused ? 'bg-orange-500/20 border-orange-500/50 text-orange-200' : 'bg-white/10 border-white/30 text-white hover:bg-white/20'}`}
        >
          {isPaused ? <Play size={14} /> : <Pause size={14} />}
          <span className="text-[10px] md:text-xs font-sans tracking-wide uppercase font-bold">
            {isPaused ? {vi: 'TIẾP TỤC', en: 'RESUME', zh: '继续'}[lang] : {vi: 'TẠM DỪNG', en: 'PAUSE', zh: '暂停'}[lang]}
          </span>
        </button>
        <button 
          onClick={() => setIsVoiceOn(!isVoiceOn)}
          className={`flex items-center gap-2 px-3 py-1.5 md:py-2 rounded-full transition-all border shadow-lg
            ${isVoiceOn ? 'bg-white/10 border-white/30 text-white' : 'bg-transparent border-white/10 text-white/30 hover:bg-white/5'}`}
        >
          {isVoiceOn ? <Ear size={14} /> : <EarOff size={14} />}
          <span className="text-[10px] md:text-xs font-sans tracking-wide uppercase font-bold">
            {isVoiceOn ? {vi: 'CÓ TIẾNG', en: 'VOICE ON', zh: '语音开启'}[lang] : {vi: 'TẮT TIẾNG', en: 'VOICE OFF', zh: '静音模式'}[lang]}
          </span>
        </button>
      </div>

      {/* Top Filter */}
      <div className="flex items-center gap-2 md:gap-4 mt-2 w-full justify-center">
         {['breath', 'upper', 'full'].map((cat) => (
             <button 
               key={cat}
               onClick={() => {
                   setActiveCategory(cat as any); 
                   setMode(Object.keys(modes).find(k => modes[k].cat === cat)!);
               }} 
               className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all border ${activeCategory === cat ? 'bg-white/20 border-white/40 text-white shadow-md' : 'border-transparent text-white/30 hover:text-white/60'}`}
             >
                 {getCatLabel(cat)}
             </button>
         ))}
      </div>

      {/* Main Animation Ring */}
      <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center my-6 shrink-0 z-10">
        <motion.div className="absolute inset-0 rounded-full blur-[40px] opacity-40 mix-blend-screen"
          style={{ backgroundColor: c.glow }}
          animate={animProps}
          transition={{ duration: phaseDur, ease: "linear" }}
        />
        <motion.div className="absolute w-36 h-36 md:w-48 md:h-48 rounded-full border-[3px] flex items-center justify-center backdrop-blur-md z-20 overflow-hidden"
          style={{ borderColor: c.ringBorder, backgroundColor: c.ringBg, boxShadow: `0 0 35px ${c.shadow}` }}
          animate={animProps}
          transition={{ duration: phaseDur, ease: "linear" }}
        >
          {/* Avatar Hướng Dẫn */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-1 md:pt-2 opacity-90 pointer-events-none">
             <ZenAvatar anim={currentStep.anim} mode={mode} />
          </div>

          <div className="absolute bottom-3 md:bottom-4 w-full flex justify-center pointer-events-none">
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.span 
                    key={`${stepIdx}-${timeLeft === -1 ? '0' : timeLeft}`}
                    initial={{ opacity: 0, y: 5, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 1.2 }}
                    transition={{ duration: 0.2 }}
                    className="text-lg md:text-xl font-display font-bold text-white/80 drop-shadow-md bg-black/40 px-4 py-1 rounded-full backdrop-blur-md border border-white/10"
                >
                    {timeLeft === -1 ? '' : timeLeft}s
                </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <div className="text-center h-20 w-full px-2 z-20 shrink-0">
        <h2 className={`text-xl md:text-3xl font-display font-light mb-1 transition-colors duration-500 max-w-sm mx-auto ${c.text}`}>
          {phaseText}
        </h2>
        <p className="text-[10px] md:text-xs font-sans text-white/50 uppercase tracking-widest mt-2 px-4">
          — {l(modes[mode].desc)} —
        </p>
      </div>

      {/* Routine Selector - Horizontal Scroll */}
      <div className="w-full flex gap-3 overflow-x-auto pb-4 pt-2 px-4 scrollbar-hide snap-x pointer-events-auto h-20 shrink-0 mt-auto" 
           style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {currentCategoryModes.map(k => (
          <button 
            key={k}
            onClick={() => setMode(k)}
            className={`flex-shrink-0 flex items-center gap-3 px-3 py-2 rounded-xl transition-all border snap-center min-w-[170px] h-14
              ${mode === k ? 'bg-white/15 border-white/30 shadow-md scale-105' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
          >
            <div className="w-7 h-7 rounded-full flex flex-shrink-0 items-center justify-center bg-black/40 shadow-inner" style={{ color: c.glow }}>
              {modes[k].icon}
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-xs font-semibold text-white/90 truncate leading-tight w-full whitespace-nowrap">{l(modes[k].name)}</p>
            </div>
          </button>
        ))}
      </div>

    </div>
  );
}
