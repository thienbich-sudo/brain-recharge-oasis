import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LangContext';
import { XCircle, Trophy, Heart, Zap, Medal, SkipForward, RotateCcw } from 'lucide-react';

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
    { vi: "Bức tranh đẹp nhất luôn có mảng tối. Hãy hít một hơi thật sâu và vẽ tiếp cuộc đời bạn.", en: "The most beautiful paintings have dark shades. Take a deep breath and keep painting your life.", zh: "最美的画总是伴有暗角。深吸一口气，继续描绘你的人生。", author: "Oasis Flow" },
    { vi: "Đừng cố gồng mình chống lại cơn bão, hãy mềm mại như cành trúc và để gió lướt qua.", en: "Don't fight the storm, be as supple as bamboo and let the wind pass over.", zh: "别硬扛风暴，像竹子一样柔软，让风轻轻拂过。", author: "Zen Whisper" },
    { vi: "Bầu trời vẫn luôn xanh ngắt phía trên những đám mây. Bạn chỉ cần chờ mây tan.", en: "The sky is always blue above the clouds. You just have to wait for them to part.", zh: "云层之上总是湛蓝的天空。你只需静候云散。", author: "Morning Light" },
    { vi: "Gạt bỏ mọi lo âu, thu mình lại một nhịp, để nhịp đập trái tim hòa cùng bản nhạc.", en: "Brush away the worries, step back a beat, and let your heartbeat sync with the melody.", zh: "抛开所有烦忧，退后一拍，让心跳与旋律共鸣。", author: "Therapy Core" },
    { vi: "Chỉ cần thay đổi góc nhìn, mây mù tăm tối sẽ hóa thành một buổi chiều mộng mơ.", en: "Change your perspective, and dark clouds will turn into a dreamy afternoon.", zh: "只需改变视角，乌云密布也会化作如梦的午后。", author: "Attitude Shift" }
  ],
  burnout: [
    { vi: "Mệt mỏi không có nghĩa bạn kém cỏi. Đó chỉ là lời nhắc nhở rằng cơ thể cũng cần được ôm ấp.", en: "Exhaustion doesn't mean you're weak. It's just a reminder that your body needs a hug too.", zh: "疲惫不代表你很差劲。这只是提醒你，身体也需要被拥抱。", author: "Oasis Flow" },
    { vi: "Hạt giống cần nằm sâu trong đất tối trước khi vươn mình đón nắng. Hãy nghỉ ngơi trọn vẹn nhé.", en: "A seed must lie in the dark earth before reaching for the sun. Rest fully.", zh: "种子在向着阳光生长前，必须深埋于黑暗的泥土。好好休息吧。", author: "Nature's Way" },
    { vi: "Chẳng sao cả nếu hôm nay bạn chỉ muốn nằm yên. Bạn đã làm rất tốt rồi.", en: "It's okay if today you just want to lie still. You did great.", zh: "如果今天你只想静静躺着也没关系。你已经做得很好了。", author: "Gentle Breeze" },
    { vi: "Mỗi lần bạn cho phép mình thư giãn, bạn đang dọn chỗ cho những điều kỳ diệu mới nở rộ.", en: "Every time you allow yourself to relax, you make room for new miracles to bloom.", zh: "每次你允许自己放松，都是在为新的奇迹绽放腾出空间。", author: "Mind Spa" },
    { vi: "Thái độ của bạn quyết định màu sắc của ngày hôm nay. Hãy tự tin chọn gam màu rực rỡ nhất!", en: "Your attitude determines the color of today. Confidently choose the brightest one!", zh: "你的态度决定了今天的色彩。自信地选择最耀眼的那一种吧！", author: "Mindset Shift" }
  ],
  sleepy: [
    { vi: "Một cái vươn vai thật đã, một nụ cười rạng rỡ và bạn đã sẵn sàng ôm trọn thế giới này!", en: "A deep stretch, a bright smile, and you are ready to embrace the whole world!", zh: "一个惬意的伸展，一个灿烂的微笑，你已经准备好拥抱整个世界了！", author: "Oasis Flow" },
    { vi: "Bật dậy nào! Cà phê đã sẵn sàng và những niềm vui của ngày hôm nay đang gọi tên bạn.", en: "Up you go! The coffee is brewing and today's joys are calling your name.", zh: "起来吧！咖啡已经泡好，今天的快乐正在呼唤你的名字。", author: "Morning Sun" },
    { vi: "Ánh nắng ngoài kia thật đẹp, đừng để những giấc mơ trưa làm mờ đi ánh sáng rực rỡ của bạn.", en: "The sunshine outside is beautiful, don't let mid-day dreams dim your brilliant light.", zh: "外面的阳光真美，别让午睡的梦境掩盖了你耀眼的光芒。", author: "Awake Spirit" },
    { vi: "Hít vào nguồn năng lượng tươi mới, thở ra cơn buồn ngủ lười biếng. Khởi động thôi!", en: "Breathe in fresh energy, breathe out the lazy sleepiness. Let's get started!", zh: "吸入新鲜能量，呼出慵懒的小瞌睡。让我们开始吧！", author: "Vital Flow" },
    { vi: "Chỉ cần chớp mắt một cái, dội một gáo nước mát lành và đón lấy nhịp điệu rộn ràng của công việc.", en: "Just blink once, splash some cool water, and welcome the lively rhythm of work.", zh: "只需眨个眼，泼点清凉的水，迎接工作那欢快的节奏吧。", author: "Active Mind" }
  ],
  focus: [
    { vi: "Tập trung không phải là ép buộc tâm trí, mà là uyển chuyển dẫn dắt nó trên một dòng chảy.", en: "Focus is not forcing the mind, but gracefully guiding it along a single flow.", zh: "专注不是强迫心智，而是优雅地引导它顺流而下。", author: "Oasis Flow" },
    { vi: "Khi bạn dồn cả trái tim vào việc mình làm, mọi tiếng ồn sẽ hóa thành bản nhạc êm dịu.", en: "When you put your whole heart into what you do, all noise turns into a soothing melody.", zh: "当你全心投入所做之事，所有的喧嚣都会化作舒缓的旋律。", author: "Deep Work" },
    { vi: "Gói ghém mọi lo toan sang một bên. Ngay lúc này, chỉ có bạn và tác phẩm tuyệt vời của riêng bạn.", en: "Put your worries aside. Right now, there is only you and your own beautiful creation.", zh: "把所有烦恼抛诸脑后。此时此刻，只有你和你那美妙的作品。", author: "Mind Artisan" },
    { vi: "Hãy làm việc thật thong dong nhưng chắc chắn. Điều vĩ đại luôn được xây từ sự chú tâm nho nhỏ.", en: "Work leisurely but steadily. Great things are built from small, attentive moments.", zh: "从容而坚决地工作。伟大的事物都是由微小而专注的时刻堆砌而成的。", author: "Zen Master" },
    { vi: "Bạn giống như một tia nắng xuyên qua lăng kính, hội tụ lại thành một điểm sáng lấp lánh.", en: "You are like a sunbeam passing through a prism, converging into a single, glittering point.", zh: "你就像穿过棱镜的阳光，汇聚成一个闪耀的光点。", author: "Focus Point" }
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

  const handleSkipPhase = () => {
    if (phaseIdx >= flow.phases.length - 1) {
       const quotes = MOOD_QUOTES[mood] || MOOD_QUOTES['stress'];
       setRewardQuote(quotes[Math.floor(Math.random() * quotes.length)]);
       setIsFinished(true);
    } else {
       const nextPhaseIdx = phaseIdx + 1;
       setPhaseIdx(nextPhaseIdx);
       setTimeLeft(flow.phases[nextPhaseIdx].time);
    }
  };

  useEffect(() => {
    if (isFinished) return;

    if (timeLeft <= 0) {
      handleSkipPhase();
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
             <div className="mt-12 flex items-center justify-center gap-6 z-20">
                <button 
                  onClick={() => setTimeLeft(flow.phases[phaseIdx].time)}
                  className="p-3 md:p-4 rounded-full bg-white/5 hover:bg-white/10 text-white/30 hover:text-white/80 transition-all border border-transparent hover:border-white/10 shadow-sm"
                  title={l({vi: 'Bắt đầu lại vòng này', en: 'Restart phase', zh: '重新开始此阶段'})}
                >
                   <RotateCcw size={20} />
                </button>
                <div className="text-6xl md:text-7xl font-display font-light text-white/20 tabular-nums">
                  00:{timeLeft.toString().padStart(2, '0')}
                </div>
                <button 
                  onClick={handleSkipPhase}
                  className="p-3 md:p-4 rounded-full bg-white/5 hover:bg-white/10 text-white/30 hover:text-white/80 transition-all border border-transparent hover:border-white/10 shadow-sm"
                  title={l({vi: 'Bỏ qua (Tiến tới)', en: 'Skip phase', zh: '跳过此阶段'})}
                >
                   <SkipForward size={20} />
                </button>
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
