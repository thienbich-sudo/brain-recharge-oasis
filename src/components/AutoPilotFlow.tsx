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
      { time: 10, title: 'PHASE 1: Khởi động', vi: 'Hệ thống chẩn đoán: Căng thẳng thần kinh cao. Bắt đầu ép xung làm mát...', audio: true },
      { time: 60, title: 'PHASE 2: Hạ nhịp tim (4-7-8)', vi: 'Hít sâu 4 giây. Giữ 7 giây. Thở ra 8 giây. Cảm nhận nhịp đập chậm lại.', audio: true },
      { time: 20, title: 'PHASE 3: Hoàn tất', vi: 'Trạng thái cân bằng được trung hòa. Mọi muộn phiền đã tan biến.', audio: true }
    ]
  },
  focus: {
    music: '/audio/bach.mp3', // Bach Prelude
    phases: [
      { time: 10, title: 'PHASE 1: Quét nhiễu loạn', vi: 'Phát hiện xao nhãng. Khởi động Giao thức Tập trung tuyệt đối.', audio: true },
      { time: 40, title: 'PHASE 2: Khoá Mục Tiêu', vi: 'Nhìn chằm chằm vào chấm tròn. Loại bỏ mọi suy nghĩ ngoài lề.', audio: true },
      { time: 10, title: 'PHASE 3: Sẵn sàng', vi: 'Hệ thống phòng thủ đã bật. Work hard!', audio: true }
    ]
  },
  burnout: {
    music: '/audio/moonlight.mp3', // Beethoven Moonlight
    phases: [
      { time: 10, title: 'PHASE 1: Đóng băng', vi: 'Cảnh báo cạn kiệt Năng lượng. Kích hoạt buồng ngủ đông Tâm trí.', audio: true },
      { time: 60, title: 'PHASE 2: Hư Không', vi: 'Không cần cố gắng nữa. Thả rũ toàn bộ cơ bắp. Bạn an toàn.', audio: true },
      { time: 20, title: 'PHASE 3: Tái tạo', vi: 'Dòng điện đã nạp lại. Hãy trở lại khi bạn thực sự sẵn sàng.', audio: true }
    ]
  },
  sleepy: {
    music: 'https://ice1.somafm.com/defcon-128-mp3', // DEF CON
    phases: [
      { time: 10, title: 'PHASE 1: Kích điện', vi: 'Hệ thống báo ù lỳ. Bơm Adrenaline chu trình 1...', audio: true },
      { time: 30, title: 'PHASE 2: Lửa Đánh Thức', vi: 'Thở gấp và dứt khoát qua mũi! Kích thích bơm máu lên màng não!', audio: true },
      { time: 10, title: 'PHASE 3: Đánh lửa', vi: '100% Cảnh giác. Bắt đầu chiến đấu.', audio: true }
    ]
  }
};

export default function AutoPilotFlow({ mood, onExit }: Props) {
  const { playTTS, stopTTS } = useLanguage();
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

  useEffect(() => {
    if (isFinished) return;

    // Speak initial instruction
    if (timeLeft === flow.phases[phaseIdx].time && flow.phases[phaseIdx].audio) {
       playTTS({ vi: flow.phases[phaseIdx].vi, en: flow.phases[phaseIdx].vi, zh: flow.phases[phaseIdx].vi }); // using vi for now since we only hardcoded vi text to save tokens
    }

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
             <h3 className="text-emerald-400 font-sans tracking-[0.2em] text-xs font-bold mb-4 uppercase">{flow.phases[phaseIdx].title}</h3>
             <h2 className="text-2xl md:text-3xl font-display font-light text-white leading-relaxed">
               {flow.phases[phaseIdx].vi}
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
                
                {/* Breathing Energy Petals (True Lotus Form) */}
                {[...Array(6)].map((_, i) => {
                   const rotation = i * 60;
                   return (
                     <motion.div
                        key={i}
                        className="absolute inset-0 m-auto w-12 h-32 rounded-full bg-gradient-to-t from-emerald-500/40 to-teal-300/10 mix-blend-screen blur-[2px] border border-emerald-400/30"
                        style={{ originY: 1 }}
                        initial={{ rotate: rotation, y: -32 }}
                        animate={{
                           scaleY: [1, 1.5, 1],
                           scaleX: [1, 1.2, 1],
                           opacity: [0.3, 0.8, 0.3],
                           rotate: [rotation, rotation + 15, rotation]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
                     />
                   );
                })}
                
                {/* Inner Beating Heart */}
                <motion.div 
                  className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-emerald-400/30 blur-2xl"
                  animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Crisp Center Diamond */}
                <motion.div 
                  className="absolute inset-0 m-auto w-5 h-5 bg-emerald-300 shadow-[0_0_30px_rgba(52,211,153,1)] z-20 rounded-sm"
                  initial={{ rotate: 45 }}
                  animate={{ 
                    scale: [1, 1.3, 1], 
                    opacity: [0.8, 1, 0.8], 
                    rotate: [45, 135, 45] 
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
             </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center z-10"
          >
             <CheckCircle2 size={64} className="text-emerald-400 mb-6" />
             <h2 className="text-3xl font-display text-white mb-2">Quy Trình Hoàn Tất</h2>
             <p className="text-white/50 mb-8">Hệ thống của bạn đã được khởi động lại thành công.</p>
             <button onClick={onExit} className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold tracking-wider text-sm transition-all border border-white/20">
               TRỞ VỀ ỐC ĐẢO CỐT LÕI
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
