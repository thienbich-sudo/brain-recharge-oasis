import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Activity, PersonStanding, Flame, Ear, EarOff, Play, Pause, Trophy, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
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
  const [cycleCount, setCycleCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [speed, setSpeed] = useState<number>(1);

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
    setCycleCount(0);
    setIsCompleted(false);
    setTimeLeft(modes[mode].steps[0].time);
  }, [mode]);

  useEffect(() => {
    if (isPaused || isCompleted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
         if (prev <= 1) {
            let nextCycleFound = false;
            setStepIdx(curr => {
                const nextIdx = curr + 1;
                if (nextIdx >= modes[mode].steps.length) {
                    nextCycleFound = true;
                    return 0;
                }
                return nextIdx;
            });
            if (nextCycleFound) {
                setCycleCount(c => c + 1);
            }
            return -1; 
         }
         return prev - 1;
      });
    }, 1000 / speed);
    return () => clearInterval(timer);
  }, [mode, isPaused, isCompleted, speed]);

  useEffect(() => {
     const maxCycles = modes[mode].cycles || (modes[mode].cat === 'breath' ? 4 : 3);
     if (cycleCount >= maxCycles && !isCompleted) {
         setIsCompleted(true);
         stopTTS();
         setTimeLeft(0);
         // Speak completion
         if (isVoiceOn) {
            playTTS({
               vi: 'Thật tuyệt vời. Bạn đã hoàn tất bài tập này.',
               en: 'Excellent. You have completed this exercise.',
               zh: '太棒了。你已完成此练习。'
            });
         }
     }
  }, [cycleCount, mode, isCompleted]);

  const speak = (textObj: any) => {
     if (!isVoiceOn || isPaused) return stopTTS();
     playTTS(textObj);
  };

  useEffect(() => {
    if (timeLeft === -1 && !isCompleted) {
        setTimeLeft(modes[mode].steps[stepIdx].time);
        
        let textObj = { ...modes[mode].steps[stepIdx].text };
        const maxC = modes[mode].cycles || (modes[mode].cat === 'breath' ? 4 : 3);
        
        if (stepIdx === 0 && cycleCount > 0 && cycleCount < maxC) {
             textObj = {
                 vi: `Chuyển vòng ${cycleCount + 1}. ` + textObj.vi,
                 en: `Set ${cycleCount + 1}. ` + textObj.en,
                 zh: `第 ${cycleCount + 1} 循环. ` + textObj.zh
             };
        }
        
        if (!isPaused) speak(textObj);
    }
  }, [stepIdx, timeLeft, mode, lang, isVoiceOn, isPaused, isCompleted, cycleCount]);

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

  const handlePrev = () => {
      if (isCompleted) {
         setIsCompleted(false);
         setCycleCount((modes[mode].cycles || (modes[mode].cat === 'breath' ? 4 : 3)) - 1);
         setStepIdx(modes[mode].steps.length - 1);
         setTimeLeft(-1);
         return;
      }
      setStepIdx(curr => {
          if (curr === 0) {
              if (cycleCount > 0) {
                  setCycleCount(c => c - 1);
                  return modes[mode].steps.length - 1;
              }
              return 0; 
          }
          return curr - 1;
      });
      setTimeLeft(-1);
  };

  const handleNext = () => {
      if (isCompleted) return;
      let nextCycleFound = false;
      setStepIdx(curr => {
          const nextIdx = curr + 1;
          if (nextIdx >= modes[mode].steps.length) {
              nextCycleFound = true;
              return 0;
          }
          return nextIdx;
      });
      if (nextCycleFound) {
          setCycleCount(c => c + 1);
      }
      setTimeLeft(-1);
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
  const maxCycles = modes[mode].cycles || (modes[mode].cat === 'breath' ? 4 : 3);

  return (
    <div className="flex flex-col items-center justify-between p-4 md:p-8 w-full max-w-xl mx-auto h-full relative overflow-hidden">
      
      {/* Sleek Top Controls */}
      <div className="flex items-center justify-center w-full mb-4 md:mb-6 z-50">
        <div className="flex bg-white/5 rounded-full p-1 border border-white/10 backdrop-blur-md">
           {['breath', 'upper', 'full'].map((cat) => (
               <button 
                 key={cat}
                 onClick={() => {
                     setActiveCategory(cat as any); 
                     setMode(Object.keys(modes).find(k => modes[k].cat === cat)!);
                 }} 
                 className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-white/15 text-white shadow-md' : 'text-transparent text-white/40 hover:text-white/70'}`}
               >
                   {getCatLabel(cat)}
               </button>
           ))}
        </div>
      </div>

      <div className="text-center w-full z-20 shrink-0 mt-4 md:mt-6 mb-2">
        <h2 className={`text-2xl md:text-4xl font-display font-light mb-2 transition-colors duration-500 max-w-sm mx-auto ${c.text}`}>
          {isCompleted ? l({vi: 'Tuyệt Vời', en: 'Excellent', zh: '太棒了'}) : phaseText}
        </h2>
        
        {/* CYCLE TRACKER */}
        {!isCompleted ? (
           <div className="flex flex-col items-center mt-2 gap-2">
              <div className="flex gap-2">
                 {[...Array(maxCycles)].map((_, i) => (
                    <motion.div 
                      key={i} 
                      animate={{ 
                         width: i === cycleCount ? 16 : 8, 
                         height: 6,
                         backgroundColor: i < cycleCount ? "rgba(255,255,255,0.4)" : i === cycleCount ? c.glow : "rgba(255,255,255,0.1)",
                         boxShadow: i === cycleCount ? `0 0 10px ${c.glow}` : "none"
                      }}
                      className="rounded-full"
                    />
                 ))}
              </div>
              <p className="text-[10px] md:text-xs font-sans text-white/40 uppercase tracking-widest mt-1 px-4">
                 — {l(modes[mode].desc)} —
              </p>
           </div>
        ) : (
           <p className="text-[10px] md:text-xs font-sans text-white/40 uppercase tracking-widest mt-2 px-4">
              — {l({vi: `Đã hoàn thành ${cycleCount} vòng bài tập`, en: `Completed ${cycleCount} cycles`, zh: `已完成 ${cycleCount} 个循环`})} —
           </p>
        )}
      </div>

      {/* Hero Visualizer - The Orbital Breathing Core */}
      <div className="relative w-56 h-56 md:w-72 md:h-72 flex items-center justify-center my-auto shrink-0 z-10">
        
        {/* Orbital Rings */}
        <motion.div className="absolute inset-0 rounded-full border border-white/5 border-t-white/20 border-b-white/20"
          animate={{ rotate: 360, ...animProps }} transition={{ duration: phaseDur, ease: "easeInOut" }}
        />
        <motion.div className="absolute inset-4 rounded-full border border-white/5 border-l-white/20 border-r-white/20"
          animate={{ rotate: -360, ...animProps }} transition={{ duration: phaseDur, ease: "easeInOut" }}
        />
        
        {/* Deep Glow Aura */}
        <motion.div className="absolute inset-8 rounded-full blur-[40px] opacity-30 mix-blend-screen"
          style={{ backgroundColor: c.glow }}
          animate={animProps}
          transition={{ duration: phaseDur, ease: "easeInOut" }}
        />

        {/* Central Glass Core */}
        <motion.div className="absolute inset-8 rounded-full border-[2px] flex flex-col items-center justify-center backdrop-blur-xl z-20 shadow-2xl overflow-hidden"
          style={{ borderColor: c.ringBorder, backgroundColor: c.ringBg, boxShadow: `0 0 40px ${c.shadow}, inset 0 0 20px ${c.shadow}` }}
          animate={animProps}
          transition={{ duration: phaseDur, ease: "easeInOut" }}
        >
          {/* Avatar / Iconography */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-2 opacity-80 pointer-events-none">
             {isCompleted ? (
                 <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="flex flex-col items-center mt-[-10px]">
                     <Trophy size={48} strokeWidth={1.5} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                 </motion.div>
             ) : (
                 <ZenAvatar anim={currentStep.anim} mode={mode} />
             )}
          </div>

          <div className="absolute bottom-6 w-full flex justify-center pointer-events-none">
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.span 
                    key={isCompleted ? 'done' : `${stepIdx}-${timeLeft === -1 ? '0' : timeLeft}`}
                    initial={{ opacity: 0, y: 5, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -5, filter: "blur(4px)" }}
                    transition={{ duration: 0.2 }}
                    className={`font-display font-light text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.7)] ${isCompleted ? 'text-lg md:text-xl tracking-widest font-bold uppercase' : 'text-2xl md:text-3xl'}`}
                >
                    {isCompleted ? l({vi: 'HOÀN TẤT', en: 'COMPLETED', zh: '已完成'}) : (timeLeft === -1 ? '' : timeLeft)}
                </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* FLOAT MEDIA CONTROLS BAR */}
      <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 my-5 md:my-6 z-50 backdrop-blur-xl shadow-xl shrink-0">
          <button onClick={() => setSpeed(s => s === 1 ? 1.5 : s === 1.5 ? 2 : 1)} className="text-[10px] md:text-sm font-bold text-white/50 hover:text-white w-8 shrink-0 flex justify-center transition-colors">
             {speed}x
          </button>

          <button onClick={handlePrev} className="p-2 text-white/50 hover:text-white transition-colors"><SkipBack size={18} fill="currentColor" /></button>

          <button onClick={() => {
             if (isCompleted) {
                setStepIdx(0);
                setCycleCount(0);
                setIsCompleted(false);
                setTimeLeft(modes[mode].steps[0].time);
             } else {
                setIsPaused(!isPaused);
             }
          }} className={`p-3 rounded-full transition-all shadow-lg ${isCompleted ? 'bg-emerald-500/30 text-emerald-200' : isPaused ? 'bg-orange-500/30 text-orange-200' : 'bg-white/20 text-white hover:bg-white/30'}`}>
             {isCompleted ? <RotateCcw size={20}/> : isPaused ? <Play size={20} fill="currentColor" className="ml-0.5" /> : <Pause size={20} fill="currentColor"/>}
          </button>

          <button onClick={handleNext} className="p-2 text-white/50 hover:text-white transition-colors"><SkipForward size={18} fill="currentColor" /></button>

          <button onClick={() => setIsVoiceOn(!isVoiceOn)} className={`w-8 flex justify-center shrink-0 transition-colors ${isVoiceOn ? 'text-white' : 'text-white/30'}`}>
             {isVoiceOn ? <Ear size={18} /> : <EarOff size={18} />}
          </button>
      </div>

      {/* Routine Grid - Perfect Centering & Anti-Layout-Shift */}
      <div className="w-full grid grid-cols-2 gap-3 mt-auto shrink-0 pb-20 pointer-events-auto">
        {currentCategoryModes.map(k => (
          <button 
            key={k}
            onClick={() => setMode(k)}
            className={`flex items-center gap-3 p-3 md:p-4 rounded-2xl transition-all border h-16 md:h-20
              ${mode === k ? 'bg-white/10 border-white/30 shadow-lg scale-105 z-10' : 'bg-transparent border-white/5 hover:bg-white/5'}`}
          >
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex shrink-0 items-center justify-center transition-colors ${mode === k ? 'bg-black/40' : 'bg-black/20'}`} style={{ color: c.glow }}>
              {modes[k].icon}
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className={`text-xs md:text-sm font-semibold truncate transition-colors ${mode === k ? 'text-white' : 'text-white/60'}`}>{l(modes[k].name)}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
