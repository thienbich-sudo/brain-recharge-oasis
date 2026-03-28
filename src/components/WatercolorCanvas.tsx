import { useRef, useEffect, useState } from 'react';
import { RefreshCcw } from 'lucide-react';

interface Splatter {
  x: number;
  y: number;
  r: number;
  color: string;
  maxR: number;
  speed: number;
}

export default function WatercolorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [splatters, setSplatters] = useState<Splatter[]>([]);

  const colors = [
    'rgba(59, 130, 246, 0.4)', // Blue
    'rgba(147, 51, 234, 0.4)', // Purple
    'rgba(236, 72, 153, 0.4)', // Pink
    'rgba(16, 185, 129, 0.4)', // Emerald
    'rgba(245, 158, 11, 0.4)'  // Amber
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to match parent
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let animationId: number;

    const render = () => {
      // Very slight fade for wet look, instead of completely clearing
      ctx.fillStyle = 'rgba(11, 17, 32, 0.05)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      splatters.forEach(s => {
        if (s.r < s.maxR) {
          s.r += s.speed;
        }
        
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        
        // Radial gradient for "wet-on-wet" watercolor bleed effect
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
        grad.addColorStop(0, s.color);
        grad.addColorStop(0.8, s.color.replace('0.4', '0.1'));
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.fillStyle = grad;
        ctx.fill();
        
        // Add some noise/texture rings to simulate dried edge
        if (Math.random() > 0.8) {
           ctx.strokeStyle = s.color.replace('0.4', '0.05');
           ctx.lineWidth = 1.5;
           ctx.beginPath();
           ctx.arc(s.x, s.y, s.r * (Math.random() * 0.5 + 0.5), 0, Math.PI * 2);
           ctx.stroke();
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [splatters]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Create 1-3 splatters slightly offset for a "brush" feel
    const numSplatters = Math.floor(Math.random() * 3) + 1;
    const newSplatters: Splatter[] = [];
    
    for (let i=0; i < numSplatters; i++) {
        newSplatters.push({
          x: x + (Math.random() * 20 - 10),
          y: y + (Math.random() * 20 - 10),
          r: 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          maxR: Math.random() * 120 + 80, // Expand to 80-200px
          speed: Math.random() * 0.4 + 0.1
        });
    }

    setSplatters(prev => [...prev, ...newSplatters]);
  };

  const clearCanvas = () => {
    setSplatters([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="relative w-full h-[500px] flex flex-col items-center overflow-hidden">
      {/* 
        The magic CSS for liquid bleed merging: 
        blur + contrast creates the gooey/fluid merge effect between distinct shapes 
      */}
      <canvas 
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        className="w-full h-full rounded-2xl cursor-crosshair touch-none absolute inset-0 z-0 bg-transparent"
        style={{ filter: 'blur(3px) contrast(1.1)' }} 
      />
      
      {/* Interactive Overlay Layer (No filter) */}
      <div className="absolute top-4 left-6 pointer-events-none z-10">
        <h2 className="text-xl font-display font-light text-white/80">Abstract Flow</h2>
        <p className="text-xs font-sans text-white/40 mt-1 uppercase tracking-wider">Click to drop watercolor</p>
      </div>

      <button 
        onClick={clearCanvas}
        className="absolute bottom-6 right-6 p-3 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white/90 hover:bg-white/10 transition-colors z-10 shadow-lg"
      >
        <RefreshCcw size={18} />
      </button>
    </div>
  );
}
