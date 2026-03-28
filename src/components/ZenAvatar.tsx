import { motion } from 'framer-motion';

interface Props {
  anim: string;
  mode: string;
}

export default function ZenAvatar({ anim, mode }: Props) {
  // Trị liệu Nhãn Cầu (Mắt)
  if (mode === 'eye') {
    const getPupilAnim = () => {
       switch(anim) {
          case 'up': return { y: -8, scaleY: 1.1 };
          case 'down': return { y: 8, scaleY: 1.1 };
          case 'left': return { x: -12, scaleX: 1.1 };
          case 'right': return { x: 12, scaleX: 1.1 };
          case 'contract': return { scale: 0.1 }; // Squeeze shut
          case 'expand': return { scale: 1.5 }; // Stare far
          default: return { x: 0, y: 0, scale: 1 };
       }
    };
    return (
      <div className="relative w-16 h-16 flex items-center justify-center">
         <motion.div className="w-16 h-8 md:w-20 md:h-10 border-[3px] border-white/60 rounded-[50%] flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            animate={anim === 'contract' ? { height: 4, borderWidth: 4, opacity: 0.5 } : { height: 40, borderWidth: 3, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
         >
            <motion.div className="w-5 h-5 md:w-6 md:h-6 bg-white/90 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              animate={getPupilAnim()}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
         </motion.div>
      </div>
    );
  }

  // Giải cứu Cổ tay (Wrist)
  if (mode === 'wrist') {
    return (
      <div className="relative w-16 h-16 flex items-center justify-center">
        <motion.div className="w-14 h-16 flex items-end justify-center gap-1.5 origin-bottom"
           animate={
               anim === 'up' ? { rotateX: 60, y: -10 } : 
               anim === 'down' ? { rotateX: -60, y: 10 } : 
               anim === 'contract' ? { scale: 0.7, gap: 0 } : 
               anim === 'expand' ? { scale: 1.2, gap: 6 } : {}
           }
           transition={{ duration: 0.8, ease: "easeInOut" }}
        >
           {/* Lòng bàn tay ảo */}
           <div className="absolute bottom-0 w-12 h-6 bg-white/30 rounded-full blur-[2px]" />
           
           {/* 5 ngón tay ảo */}
           {[...Array(5)].map((_, i) => (
              <motion.div key={i} className="w-1.5 md:w-2 bg-white/80 rounded-full z-10" 
                 animate={{ height: anim === 'contract' ? 12 : i === 2 ? 32 : (i === 0 || i === 4) ? 18 : 26 }} 
                 transition={{ duration: 0.8, ease: "easeInOut" }}
              />
           ))}
        </motion.div>
      </div>
    );
  }

  // Minimalist Human Avatar (Phục vụ Cổ, Vặn hông, Hít thở, Chân)
  const getHeadAnim = () => {
    switch(anim) {
      case 'up': return { y: -12, scale: 1.1 };
      case 'down': return { y: 12, scale: 0.9 };
      case 'left': return { x: -14, rotate: -25 };
      case 'right': return { x: 14, rotate: 25 };
      case 'expand': case 'hold-expand': return { y: -6, scale: 1.1 };
      case 'contract': case 'hold-contract': return { y: 6, scale: 0.9 };
      default: return { x: 0, y: 0, scale: 1, rotate: 0 };
    }
  }

  const getBodyAnim = () => {
    switch(anim) {
      case 'left': return { x: -6, rotate: -15, skewX: -10 };
      case 'right': return { x: 6, rotate: 15, skewX: 10 };
      case 'expand': case 'hold-expand': return { scale: 1.25, y: -4 };
      case 'contract': case 'hold-contract': return { scale: 0.85, y: 4 };
      case 'down': return { scaleY: 0.7, y: 12, scaleX: 1.1 };
      case 'up': return { scaleY: 1.15, y: -6, scaleX: 0.9 };
      default: return { x: 0, y: 0, scale: 1, rotate: 0, skewX: 0 };
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-20 md:h-24 gap-1.5">
       <motion.div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.8)] z-20"
         animate={getHeadAnim()}
         transition={{ duration: 0.8, ease: "easeInOut" }}
       />
       <motion.div className="w-10 h-8 md:w-12 md:h-10 bg-white/30 rounded-t-full rounded-b-2xl backdrop-blur-md z-10 border border-white/20"
         animate={getBodyAnim()}
         transition={{ duration: 0.8, ease: "easeInOut" }}
       />
    </div>
  );
}
