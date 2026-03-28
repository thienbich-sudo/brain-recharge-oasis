import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LangContext';
import { XCircle, Trophy, Heart, Zap, Medal } from 'lucide-react';

interface Props {
  mood: string;
  onExit: () => void;
}

const FLOWS: Record<string, any> = {
  stress: {
    music: '/audio/chopin.mp3', // Chopin Nocturne
    phases: [
      { time: 10, title: { vi: 'GĐ 1: Khởi động', en: 'PHASE 1: Booting', zh: '阶段 1: 启动' }, text: { vi: 'Hệ thống chẩn đoán: Căng thẳng thần kinh cao. Bắt đầu ép xung làm mát...', en: 'System diagnostic: High nervous tension. Initiating cooling protocol...', zh: '系统诊断：精神高度紧张。启动冷却协议...' }, audio: true },
      { time: 60, title: { vi: 'GĐ 2: Hạ nhịp (4-7-8)', en: 'PHASE 2: Slow Down (4-7-8)', zh: '阶段 2: 降速 (4-7-8)' }, text: { vi: 'Hít sâu 4 giây. Giữ 7 giây. Thở ra 8 giây. Cảm nhận nhịp đập chậm lại.', en: 'Inhale 4 seconds. Hold 7 seconds. Exhale 8 seconds. Feel the heartbeat slowing.', zh: '吸气4秒。屏住7秒。呼气8秒。感受心跳变慢。' }, audio: true },
      { time: 20, title: { vi: 'GĐ 3: Hoàn tất', en: 'PHASE 3: Complete', zh: '阶段 3: 完成' }, text: { vi: 'Trạng thái cân bằng được trung hòa. Mọi muộn phiền đã tan biến.', en: 'Equilibrium neutralized. All burdens have dissipated.', zh: '平衡已被中和。一切烦恼烟消云散。' }, audio: true }
    ]
  },
  focus: {
    music: '/audio/bach.mp3', // Bach Prelude
    phases: [
      { time: 10, title: { vi: 'GĐ 1: Quét nhiễu loạn', en: 'PHASE 1: Scan anomalies', zh: '阶段 1: 扫描异常' }, text: { vi: 'Phát hiện xao nhãng. Khởi động Giao thức Tập trung tuyệt đối.', en: 'Distractions detected. Booting Absolute Focus Protocol.', zh: '检测到分心。启动绝对专注协议。' }, audio: true },
      { time: 40, title: { vi: 'GĐ 2: Khoá Mục Tiêu', en: 'PHASE 2: Target Lock', zh: '阶段 2: 目标锁定' }, text: { vi: 'Nhìn chằm chằm vào chấm kim cương. Loại bỏ mọi suy nghĩ ngoài lề.', en: 'Stare directly at the diamond core. Eliminate all lateral thoughts.', zh: '死死盯住钻石核心。消除一切杂念。' }, audio: true },
      { time: 10, title: { vi: 'GĐ 3: Sẵn sàng', en: 'PHASE 3: Ready', zh: '阶段 3: 准备就绪' }, text: { vi: 'Hệ thống phòng thủ đã bật. Bắt đầu làm việc!', en: 'Defense systems ONLINE. Commence work!', zh: '防御系统已开启。开始工作！' }, audio: true }
    ]
  },
  burnout: {
    music: '/audio/moonlight.mp3', // Beethoven Moonlight
    phases: [
      { time: 10, title: { vi: 'GĐ 1: Đóng băng', en: 'PHASE 1: Freeze', zh: '阶段 1: 冻结' }, text: { vi: 'Cảnh báo cạn kiệt Năng lượng. Kích hoạt buồng ngủ đông Tâm trí.', en: 'Critical Energy Warning. Activating Deep Cognitive Cryosleep.', zh: '能量耗尽警告。激活深度认知冬眠舱。' }, audio: true },
      { time: 60, title: { vi: 'GĐ 2: Hư Không', en: 'PHASE 2: The Void', zh: '阶段 2: 虚空' }, text: { vi: 'Không cần cố gắng nữa. Thả rũ toàn bộ cơ bắp. Bạn an toàn.', en: 'Cease all effort. Release all muscular tension. You are safe here.', zh: '不要再勉强了。全身肌肉放松。你在这里很安全。' }, audio: true },
      { time: 20, title: { vi: 'GĐ 3: Tái tạo', en: 'PHASE 3: Regeneration', zh: '阶段 3: 再生' }, text: { vi: 'Dòng điện đã nạp lại. Hãy trở lại khi bạn thực sự sẵn sàng.', en: 'Current restored. Return only when you are truly ready.', zh: '电流已充满。请在你真正准备好时再回来。' }, audio: true }
    ]
  },
  sleepy: {
    music: 'https://ice1.somafm.com/defcon-128-mp3', // DEF CON
    phases: [
      { time: 10, title: { vi: 'GĐ 1: Kích điện', en: 'PHASE 1: Shock', zh: '阶段 1: 电击' }, text: { vi: 'Hệ thống báo ù lỳ. Bơm Adrenaline chu trình 1...', en: 'Lethargy detected. Pumping Adrenaline Cycle 1...', zh: '系统检测到迟钝。正在泵入肾上腺素循环 1...' }, audio: true },
      { time: 30, title: { vi: 'GĐ 2: Lửa Đánh Thức', en: 'PHASE 2: Awakening Fire', zh: '阶段 2: 觉醒之火' }, text: { vi: 'Thở gấp và dứt khoát qua mũi! Kích thích bơm máu lên màng não!', en: 'Breathe sharp and fast through the nose! Stimulate blood flow to the cortex!', zh: '通过鼻子急促而坚定地呼吸！刺激血液泵入脑膜！' }, audio: true },
      { time: 10, title: { vi: 'GĐ 3: Đánh lửa', en: 'PHASE 3: Ignition', zh: '阶段 3: 点火' }, text: { vi: '100% Cảnh giác. Chuẩn bị chiến đấu.', en: '100% Alert. Prepare for combat!', zh: '100% 警惕。准备战斗！' }, audio: true }
    ]
  }
};

const MOOD_QUOTES: Record<string, Array<{vi: string, en: string, zh: string, author: string}>> = {
  stress: [
    { vi: "Người chiến binh tĩnh lặng giữa tâm bão, bởi bão tồn tại bên ngoài, không phải bên trong.", en: "The warrior is still amidst the storm, for the storm is outside, not within.", zh: "战士在风暴中保持静止，因为风暴在外面，而不在心里。", author: "Antigravity Zen" },
    { vi: "Đừng cầu mong một gánh nặng nhẹ đi, hãy cầu mong một bờ vai mạnh mẽ hơn.", en: "Do not pray for an easy life, pray for the strength to endure a difficult one.", zh: "不要祈求轻松的生活，祈求有力量忍受艰难的生活。", author: "Bruce Lee" },
    { vi: "Nơi nào có sự tĩnh lặng tuyệt đối, nơi đó có sức mạnh hủy diệt.", en: "Where there is absolute silence, there is destructive power.", zh: "绝对寂静之处，蕴含着毁灭性的力量。", author: "Sun Tzu" },
    { vi: "Giữ tâm trí phẳng lặng như mặt hồ, để phản chiếu ánh chớp của gươm đao.", en: "Keep the mind still as a lake, to reflect the flash of the blade.", zh: "心静如水，映出剑的闪光。", author: "Miyamoto Musashi" },
    { vi: "Sự bình tĩnh của bạn là vũ khí trí mạng nhất đối phó với sự hỗn loạn.", en: "Your calm is the most lethal weapon against chaos.", zh: "你的冷静是对抗混乱最致命的武器。", author: "Stoic Core" }
  ],
  burnout: [
    { vi: "Người chiến binh thực thụ là người biết rũ bỏ mệt mỏi trong một cái chớp mắt.", en: "The true warrior sheds exhaustion in a single blink.", zh: "真正的战士在眨眼间褪去疲惫。", author: "Antigravity Zen" },
    { vi: "Đáy của sự cạn kiệt chính là điểm khởi đầu của nguồn sức mạnh mới.", en: "The bottom of exhaustion is the genesis of new power.", zh: "筋疲力尽的谷底，正是新力量的起点。", author: "Phoenix Code" },
    { vi: "Bạn không thể gục ngã, nếu bạn không cho phép tâm trí mình bỏ cuộc.", en: "You cannot fall, if you do not allow your mind to surrender.", zh: "如果你不让你的内心屈服，你就不会倒下。", author: "Stoic Core" },
    { vi: "Trở ngại trên đường đi, chính là con đường.", en: "The obstacle in the path becomes the path.", zh: "路上的障碍，本身就是路。", author: "Marcus Aurelius" },
    { vi: "Nghỉ ngơi không phải là lùi bước, mà là mài lại thanh gươm đang mẻ.", en: "Resting is not retreating, but sharpening the chipped blade.", zh: "休息不是退缩，而是磨砺崩口的刀刃。", author: "Zen M." }
  ],
  sleepy: [
    { vi: "Thức tỉnh đi. Trận chiến không chờ đợi đôi mắt nhắm nghiền.", en: "Awaken. The battle does not wait for closed eyes.", zh: "醒来吧。战斗不会等待紧闭的双眼。", author: "Antigravity Zen" },
    { vi: "Một tia lửa nhỏ cũng có thể thiêu rụi cả cánh rừng của sự trì trệ.", en: "A single spark can burn down the forest of lethargy.", zh: "星星之火可以烧毁迟钝的森林。", author: "Dojo Master" },
    { vi: "Con thú săn mồi không ngáp trước khi nhảy, nó nhe nanh.", en: "The predator does not yawn before pouncing, it bares its fangs.", zh: "猛兽在扑向猎物之前不会打哈欠，它只会露出獠牙。", author: "Predator Mindset" },
    { vi: "Gió gầm thét vĩ đại nhất khi cơn bão vừa bắt đầu. Hãy là cơn bão.", en: "The wind howls greatest when the storm begins. Be the storm.", zh: "风暴刚开始时风怒吼得最大。要做那阵风暴。", author: "Stoic Core" },
    { vi: "Nhìn thẳng vào thực tại. Bóp nát sự yếu đuối.", en: "Stare into reality. Crush the weakness.", zh: "直视现实。粉碎软弱。", author: "Warrior's Code" }
  ],
  focus: [
    { vi: "Mũi tên chỉ trúng đích khi thế giới xung quanh biến mất hoàn toàn.", en: "The arrow hits the mark only when the surroundings completely vanish.", zh: "只有当周围世界完全消失时，箭才能命中目标。", author: "Archer's Zen" },
    { vi: "Tia laser cắt đứt kim loại không nhờ bạo lực, mà nhờ tập trung tuyệt đối.", en: "A laser cuts metal not out of force, but absolute focus.", zh: "激光切割金属不是靠爆发力，而是靠绝对的专注。", author: "Antigravity Zen" },
    { vi: "Kẻ đuổi theo hai con thỏ cùng lúc sẽ luôn trắng tay.", en: "The man who chases two rabbits catches neither.", zh: "同时追逐两只兔子的人，将一无所获。", author: "Confucius" },
    { vi: "Sự xao nhãng là cái chết của thiên tài. Sự tĩnh tại là đặc quyền của chiến binh.", en: "Distraction is the death of genius. Stillness is the edge of the warrior.", zh: "分心是天才的坟墓。静心是战士的专利。", author: "Stoic Core" },
    { vi: "Chỉ một nhát chém. Chỉ một mục tiêu. Không hề đắn đo.", en: "One strike. One target. No hesitation.", zh: "一击。一个目标。绝不犹豫。", author: "Miyamoto Musashi" }
  ]
};

const REWARD_CONFIGS: Record<string, any> = {
  stress: {
    textColor: 'text-pink-400',
    iconColor: 'text-pink-500',
    bgClass: 'from-pink-500/30 to-rose-400/20',
    borderClass: 'border-pink-500/50',
    shadowClass: 'shadow-[0_0_80px_rgba(236,72,153,0.4)]',
    iconShadow: 'drop-shadow-[0_0_20px_rgba(236,72,153,1)]',
    Icon: Heart,
    rewardMusic: '/audio/reward-stress.mp3',
    badgeText: { vi: 'Trái Tim Kiên Cường', en: 'Resilient Heart', zh: '坚韧之心' },
    titleText: { vi: 'Bạn Đã Làm Rất Tốt!', en: 'You Did Great!', zh: '你做得很好!' }
  },
  burnout: {
    textColor: 'text-amber-400',
    iconColor: 'text-amber-500',
    bgClass: 'from-amber-400/30 to-yellow-400/20',
    borderClass: 'border-amber-400/50',
    shadowClass: 'shadow-[0_0_80px_rgba(251,191,36,0.4)]',
    iconShadow: 'drop-shadow-[0_0_30px_rgba(251,191,36,1)]',
    Icon: Trophy,
    rewardMusic: '/audio/reward-burnout.mp3',
    badgeText: { vi: 'Chiếc Cúp Bất Khuất', en: 'Trophy of Defiance', zh: '不屈奖杯' },
    titleText: { vi: 'Sự Vượt Trội Bắt Đầu', en: 'Transcendence Begins', zh: '超越开始' }
  },
  sleepy: {
    textColor: 'text-orange-400',
    iconColor: 'text-orange-500',
    bgClass: 'from-orange-500/30 to-red-400/20',
    borderClass: 'border-orange-500/50',
    shadowClass: 'shadow-[0_0_80px_rgba(249,115,22,0.4)]',
    iconShadow: 'drop-shadow-[0_0_20px_rgba(249,115,22,1)]',
    Icon: Zap,
    rewardMusic: '/audio/reward-burnout.mp3',
    badgeText: { vi: 'Nguồn Điện Thức Tỉnh', en: 'Awakening Power', zh: '觉醒之源' },
    titleText: { vi: 'Động Cơ Kích Hoạt', en: 'Ignition Engaged', zh: '引擎启动' }
  },
  focus: {
    textColor: 'text-cyan-400',
    iconColor: 'text-cyan-500',
    bgClass: 'from-cyan-500/30 to-blue-500/20',
    borderClass: 'border-cyan-500/50',
    shadowClass: 'shadow-[0_0_80px_rgba(6,182,212,0.4)]',
    iconShadow: 'drop-shadow-[0_0_20px_rgba(6,182,212,1)]',
    Icon: Medal,
    rewardMusic: '/audio/reward-focus.mp3',
    badgeText: { vi: 'Huy Chương Chuyên Gia', en: 'Mastery Medal', zh: '大师勋章' },
    titleText: { vi: 'Sẵn Sàng Bứt Phá', en: 'Ready to Breakout', zh: '准备突破' }
  }
};

export default function AutoPilotFlow({ mood, onExit }: Props) {
  const { lang, l, playTTS, stopTTS } = useLanguage();
  const flow = FLOWS[mood] || FLOWS['stress'];
  const rewardConfig = REWARD_CONFIGS[mood] || REWARD_CONFIGS['stress'];
  const RewardIcon = rewardConfig.Icon;
  
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(flow.phases[0].time);
  const [isFinished, setIsFinished] = useState(false);
  const currentQuotes = MOOD_QUOTES[mood] || MOOD_QUOTES['stress'];
  const [rewardQuote, setRewardQuote] = useState(currentQuotes[0]);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const rewardAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Mount background music
    bgAudioRef.current = new Audio(flow.music);
    bgAudioRef.current.volume = 0.4; // Soft background
    bgAudioRef.current.play().catch(e => console.error("AutoPilot BG Music failed:", e));

    return () => {
      if (bgAudioRef.current) bgAudioRef.current.pause();
      if (rewardAudioRef.current) rewardAudioRef.current.pause();
      stopTTS();
    };
  }, []);

  // Play reward music when finished
  useEffect(() => {
    if (isFinished) {
      if (bgAudioRef.current) bgAudioRef.current.pause();
      stopTTS();
      
      rewardAudioRef.current = new Audio(rewardConfig.rewardMusic);
      rewardAudioRef.current.volume = 0.6;
      rewardAudioRef.current.play().catch(e => console.error("Reward Music failed:", e));
    }
  }, [isFinished, rewardConfig.rewardMusic]);

  // React to Phase Changes OR Language Selection (Instantly re-read current instruction)
  useEffect(() => {
    if (isFinished) return;
    if (flow.phases[phaseIdx].audio) {
       stopTTS(); // Interrupt any ongoing TTS
       playTTS(flow.phases[phaseIdx].text); // Speak natively in selected language
    }
  }, [phaseIdx, lang, isFinished]);

  useEffect(() => {
    if (isFinished) return;

    if (timeLeft <= 0) {
      if (phaseIdx >= flow.phases.length - 1) {
         const quotes = MOOD_QUOTES[mood] || MOOD_QUOTES['stress'];
         setRewardQuote(quotes[Math.floor(Math.random() * quotes.length)]);
         setIsFinished(true);
      } else {
         const nextPhaseIdx = phaseIdx + 1;
         setPhaseIdx(nextPhaseIdx);
         setTimeLeft(flow.phases[nextPhaseIdx].time);
      }
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev: number) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, phaseIdx, isFinished, flow]);

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full h-full relative overflow-hidden bg-black/40 backdrop-blur-3xl rounded-3xl border border-white/5">
      <button onClick={onExit} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors z-50">
        <XCircle size={28} />
      </button>
      <AnimatePresence mode="wait">
        {!isFinished ? (
          <motion.div 
            key={phaseIdx}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center text-center max-w-lg z-10"
          >
             <h3 className="text-emerald-400 font-sans tracking-[0.2em] text-xs font-bold mb-4 uppercase">{l(flow.phases[phaseIdx].title)}</h3>
             <h2 className="text-2xl md:text-3xl font-display font-light text-white leading-relaxed">
               {l(flow.phases[phaseIdx].text)}
             </h2>
             <div className="mt-12 text-6xl font-display font-light text-white/20">
               00:{timeLeft.toString().padStart(2, '0')}
             </div>
             
             {/* Dynamic Visualizer - Premium Lotus Core */}
             <div className="mt-16 w-64 h-64 relative flex items-center justify-center shrink-0">
                {/* Outer Ring */}
                <motion.div 
                   className="absolute inset-0 m-auto w-full h-full rounded-full border border-emerald-500/20"
                   animate={{ scale: [1, 1.4, 1], rotate: [0, 90, 0] }}
                   transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                   className="absolute inset-0 m-auto w-56 h-56 rounded-full border border-teal-500/10"
                   animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }}
                   transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Breathing Energy Petals (True Mathematical Flower of Life) */}
                <motion.div 
                   className="absolute inset-0 m-auto w-32 h-32"
                   animate={{ rotate: 360 }}
                   transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                >
                   {[...Array(6)].map((_, i) => {
                      const angle = (i * 60 * Math.PI) / 180;
                      const r = 30; // Radius shift of petals
                      const tx = Math.cos(angle) * r;
                      const ty = Math.sin(angle) * r;
                      
                      return (
                        <motion.div
                           key={i}
                           className="absolute inset-0 m-auto w-24 h-24 rounded-full border-[1.5px] border-emerald-400/40 bg-gradient-to-tr from-emerald-500/10 to-teal-200/5 mix-blend-screen shadow-[inset_0_0_15px_rgba(52,211,153,0.2)]"
                           initial={{ x: tx, y: ty }}
                           animate={{
                              x: [tx, tx * 1.6, tx],
                              y: [ty, ty * 1.6, ty],
                              scale: [1, 1.1, 1],
                              opacity: [0.5, 0.9, 0.5]
                           }}
                           transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                        />
                      );
                   })}
                </motion.div>
                
                {/* Inner Glowing Core */}
                <motion.div 
                  className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-emerald-400/20 blur-xl"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Crisp Center Diamond */}
                <motion.div 
                  className="absolute inset-0 m-auto w-4 h-4 rounded-sm bg-white shadow-[0_0_20px_#34d399,0_0_40px_#10b981] z-20"
                  style={{ rotate: 45 }}
                  animate={{ 
                    scale: [1, 1.4, 1], 
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                />
             </div>
          </motion.div>
        ) : (
           <motion.div 
             key="reward"
             initial={{ opacity: 0, scale: 0.8, y: 50 }} 
             animate={{ opacity: 1, scale: 1, y: 0 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className="flex flex-col items-center justify-center text-center w-full h-full absolute inset-0 z-50 bg-black/60 backdrop-blur-3xl rounded-3xl"
           >
              {/* Grand Reward Badge */}
              <motion.div 
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: [1.2, 1, 1.05, 1] }}
                transition={{ type: "spring", bounce: 0.6, duration: 1.5, delay: 0.2 }}
                className={`w-40 h-40 md:w-56 md:h-56 mb-8 rounded-full bg-gradient-to-tr ${rewardConfig.bgClass} border-4 ${rewardConfig.borderClass} flex items-center justify-center ${rewardConfig.shadowClass}`}
              >
                 <motion.div 
                    animate={{ scale: [1, 1.1, 1] }} 
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className={rewardConfig.iconColor}
                 >
                   <RewardIcon size={80} className={`md:w-32 md:h-32 ${rewardConfig.iconShadow}`} strokeWidth={1.5} />
                 </motion.div>
              </motion.div>

              <motion.h2 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.6 }}
                 className={`text-lg md:text-2xl font-sans tracking-[0.4em] font-black ${rewardConfig.textColor} mb-4 uppercase drop-shadow-[0_0_15px_currentColor]`}
              >
                 {l(rewardConfig.badgeText)}
              </motion.h2>
              <motion.h1 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.8 }}
                 className="text-3xl md:text-5xl font-display text-white mb-12 uppercase tracking-widest font-bold drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]"
              >
                {l(rewardConfig.titleText)}
              </motion.h1>

             {/* Stoic Quote Area */}
             <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 1 }}
                 className="relative py-6 px-10 mb-12 w-11/12 max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm"
             >
                 <h1 className="text-xl md:text-2xl font-display font-light text-white italic leading-relaxed mb-4 relative z-10 drop-shadow-md">
                   "{l(rewardQuote)}"
                 </h1>
                 <p className="text-xs font-sans tracking-[0.2em] font-bold text-white/50 uppercase relative z-10">
                   — {rewardQuote.author} —
                 </p>
             </motion.div>

             <motion.button 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 1.5 }}
               whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
               whileTap={{ scale: 0.95 }}
               onClick={onExit} 
               className="px-10 py-5 bg-white/10 text-white rounded-full font-bold tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-sm transition-all border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] whitespace-nowrap"
             >
               {l({vi: 'NHẬN THƯỞNG & VỀ ỐC ĐẢO', en: 'CLAIM & RETURN TO OASIS', zh: '领取并返回绿洲'})}
             </motion.button>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
