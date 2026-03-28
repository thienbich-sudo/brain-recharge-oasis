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
    music: 'https://archive.org/download/chopin_nocturne_op_9_no_2/Chopin_Nocturne_Op_9_No_2.mp3', // Chopin Nocturne
    phases: [
      { time: 10, title: 'PHASE 1: Khởi động', vi: 'Hệ thống chẩn đoán: Căng thẳng thần kinh cao. Bắt đầu ép xung làm mát...', audio: true },
      { time: 60, title: 'PHASE 2: Hạ nhịp tim (4-7-8)', vi: 'Hít sâu 4s. Giữ 7s. Thở ra 8s. Cảm nhận nhịp đập chậm lại.', audio: true },
      { time: 20, title: 'PHASE 3: Hoàn tất', vi: 'Trạng thái cân bằng được trung hòa. Mọi muộn phiền đã tan biến.', audio: true }
    ]
  },
  focus: {
    music: 'https://archive.org/download/BachPreludeAndFugueInCMajor/Bach-PreludeCmajor.mp3', // Bach Prelude
    phases: [
      { time: 10, title: 'PHASE 1: Quét nhiễu loạn', vi: 'Phát hiện xao nhãng. Khởi động Giao thức Tập trung tuyệt đối.', audio: true },
      { time: 40, title: 'PHASE 2: Khoá Mục Tiêu', vi: 'Nhìn chằm chằm vào chấm tròn. Loại bỏ mọi suy nghĩ ngoài lề.', audio: true },
      { time: 10, title: 'PHASE 3: Sẵn sàng', vi: 'Hệ thống phòng thủ đã bật. Work hard!', audio: true }
    ]
  },
  burnout: {
    music: 'https://archive.org/download/MoonlightSonata_755/Beethoven-MoonlightSonata.mp3', // Beethoven Moonlight
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
             
             {/* Dynamic Visualizer based on Phase */}
             <motion.div 
                className="mt-12 w-32 h-32 rounded-full border border-white/10 flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             >
                <div className="w-16 h-16 rounded-full bg-white/10 blur-xl"></div>
             </motion.div>
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
