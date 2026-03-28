import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LangContext';
import { CheckCircle2, XCircle } from 'lucide-react';

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

export default function AutoPilotFlow({ mood, onExit }: Props) {
  const { lang, l, playTTS, stopTTS } = useLanguage();
  const flow = FLOWS[mood] || FLOWS['stress'];
  
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(flow.phases[0].time);
  const [isFinished, setIsFinished] = useState(false);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Mount background music
    bgAudioRef.current = new Audio(flow.music);
    bgAudioRef.current.volume = 0.4; // Soft background
    bgAudioRef.current.play().catch(e => console.error("AutoPilot BG Music failed:", e));

    return () => {
      if (bgAudioRef.current) bgAudioRef.current.pause();
      stopTTS();
    };
  }, []);

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

    const timer = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
           if (phaseIdx >= flow.phases.length - 1) {
              setIsFinished(true);
              return 0;
           }
           setPhaseIdx(p => p + 1);
           return flow.phases[phaseIdx + 1].time;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phaseIdx, isFinished]);

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
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center z-10"
          >
             <CheckCircle2 size={64} className="text-emerald-400 mb-6" />
             <h2 className="text-3xl font-display text-white mb-2">{l({vi: 'Quy Trình Hoàn Tất', en: 'Process Complete', zh: '流程完成'})}</h2>
             <p className="text-white/50 mb-8">{l({vi: 'Hệ thống của bạn đã được khởi động lại thành công.', en: 'Your system has successfully restarted.', zh: '您的系统已成功重启。'})}</p>
             <button onClick={onExit} className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold tracking-wider text-sm transition-all border border-white/20">
               {l({vi: 'TRỞ VỀ ỐC ĐẢO CỐT LÕI', en: 'RETURN TO CORE OASIS', zh: '返回核心绿洲'})}
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
