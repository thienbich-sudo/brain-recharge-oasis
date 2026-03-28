import { createContext, useContext, useState, type ReactNode, useEffect, useRef } from 'react';

export type Lang = 'vi' | 'en' | 'zh';

export const translations = {
  vi: {
    'app.seeds': 'mầm cây',
    'nav.audio': 'Nhạc Ambient Dài Cảm Xúc',
    'nav.mixer': 'Trạm Mix Tiếng Ồn Trắng',
    'nav.binaural': 'Máy Phát Sóng Não Binaural',
    'nav.breathe': 'Trung Tâm Luyện Tập Thể Chất',
    'nav.canvas': 'Loang Sơn Thủy Họa',
    'nav.dump': 'Lò Sưởi Đốt Rác Tâm Trí',
    
    'mood.title': 'Trạng thái hiện tại của não bộ?',
    'mood.desc': 'Hãy thành thực. Ốc đảo sẽ tự động tinh chỉnh Không gian âm nhạc, Tiếng ồn trắng và Bài tập trị liệu phù hợp nhất để Reset trạng thái của bạn.',
    'mood.focus': 'Mất Tập Trung', 'mood.focus.desc': 'Bị xao nhãng, cần Deep Focus',
    'mood.stress': 'Căng Thẳng / Cáu Kỉnh', 'mood.stress.desc': 'Tim đập nhanh, lo âu',
    'mood.burnout': 'Kiệt Sức Trí Óc', 'mood.burnout.desc': 'Burnout, không muốn suy nghĩ thêm',
    'mood.sleepy': 'Lờ Đờ Buồn Ngủ', 'mood.sleepy.desc': 'Mắt sụp, cần năng lượng thức tỉnh',

    'mixer.title': 'Trạm Mix Không Gian',
    'mixer.desc': 'Pha trộn bản Giao hưởng White-Noise của riêng bạn',
    'mixer.rain': 'Mưa Rào Bão Táp',
    'mixer.fire': 'Lò Sưởi Lửa Trại',
    'mixer.cafe': 'Khách Quán Cafe',
    'mixer.wind': 'Gió Thổi Bãi Biển',
    'mixer.reset': 'Im lặng tuyệt đối',

    'bin.title': 'Sóng Não Binaural',
    'bin.warning': 'Bắt buộc đeo Tai Nghe Stereo',
    'bin.desc': 'Công nghệ Web Audio đẩy 200Hz vào Tai Trái và 200+X Hz vào Tai Phải. Bộ não sẽ tự động bù trừ vào tần số ảo X Hz.',
    'bin.target': 'Tần số X (Hz)',
    'bin.delta': 'Delta 1-4Hz: Ngủ sâu, Hồi phục',
    'bin.theta': 'Theta 4-8Hz: Thư giãn cực sâu, Thiền định',
    'bin.alpha': 'Alpha 8-14Hz: Focus luồng suy nghĩ, Học tập',
    'bin.beta': 'Beta >14Hz: Trạng thái Alert, Logic cao độ',
    'bin.on': 'KÍCH HOẠT SÓNG NÃO',
    'bin.off': 'TẮT PHÁT SÓNG',

    'dump.title': 'Lò Sưởi Tâm Trí',
    'dump.desc': 'Vứt bỏ suy nghĩ xao nhãng vào đây để thiêu rụi nó',
    'dump.placeholder': 'Tôi đang lo lắng về...'
  },
  en: {
    'app.seeds': 'seeds',
    'nav.audio': 'Emotional Ambient Music',
    'nav.mixer': 'White Noise Mix Station',
    'nav.binaural': 'Binaural Beats Generator',
    'nav.breathe': 'Physical Therapy Hub',
    'nav.canvas': 'Watercolor Canvas',
    'nav.dump': 'Brain Dump Fireplace',
    
    'mood.title': 'Current brain state?',
    'mood.desc': 'Be honest. The Oasis will automatically adjust the ambient music, white noise, and therapy exercises to reset your state.',
    'mood.focus': 'Distracted', 'mood.focus.desc': 'Need deep focus',
    'mood.stress': 'Stressed / Irritable', 'mood.stress.desc': 'Fast heartbeat, anxious',
    'mood.burnout': 'Mental Burnout', 'mood.burnout.desc': 'Exhausted, cannot think',
    'mood.sleepy': 'Sleepy / Sluggish', 'mood.sleepy.desc': 'Heavy eyes, need energy',

    'mixer.title': 'Ambient Mix Station',
    'mixer.desc': 'Blend your own White-Noise Symphony',
    'mixer.rain': 'Heavy Rainstorm',
    'mixer.fire': 'Campfire',
    'mixer.cafe': 'Coffee Shop',
    'mixer.wind': 'Beach Wind',
    'mixer.reset': 'Absolute Silence',

    'bin.title': 'Binaural Beats',
    'bin.warning': 'Stereo Headphones Required',
    'bin.desc': 'Web Audio injects 200Hz into Left Ear and 200+X Hz into Right. Your brain compensates with a phantom X Hz wave.',
    'bin.target': 'Target X (Hz)',
    'bin.delta': 'Delta 1-4Hz: Deep Sleep',
    'bin.theta': 'Theta 4-8Hz: Deep Relaxation',
    'bin.alpha': 'Alpha 8-14Hz: Focus, Learning',
    'bin.beta': 'Beta >14Hz: Alert, Logic',
    'bin.on': 'ACTIVATE WAVES',
    'bin.off': 'DEACTIVATE',

    'dump.title': 'Mind Fireplace',
    'dump.desc': 'Throw distracting thoughts here to burn them away',
    'dump.placeholder': 'I am worried about...'
  },
  zh: {
    'app.seeds': '种子',
    'nav.audio': '情感氛围音乐',
    'nav.mixer': '白噪音混合站',
    'nav.binaural': '双脑共振发生器',
    'nav.breathe': '身体理疗中心',
    'nav.canvas': '水彩画布',
    'nav.dump': '精神壁炉',
    
    'mood.title': '当前大脑状态？',
    'mood.desc': '请诚实回答。绿洲将自动调整氛围音乐、白噪音和理疗练习来重置您的状态。',
    'mood.focus': '注意力分散', 'mood.focus.desc': '容易分心，需要深度专注',
    'mood.stress': '压力 / 烦躁', 'mood.stress.desc': '心跳加快，焦虑',
    'mood.burnout': '脑力耗尽', 'mood.burnout.desc': '筋疲力尽，不想思考',
    'mood.sleepy': '昏昏欲睡', 'mood.sleepy.desc': '眼皮沉重，需要唤醒能量',

    'mixer.title': '环境混合站',
    'mixer.desc': '混合您自己的白噪音交响乐',
    'mixer.rain': '暴风雨',
    'mixer.fire': '营火',
    'mixer.cafe': '咖啡馆',
    'mixer.wind': '海滩微风',
    'mixer.reset': '绝对宁静',

    'bin.title': '双脑共振脑波',
    'bin.warning': '必须佩戴立体声耳机',
    'bin.desc': 'Web Audio将200Hz输入左耳，200+X Hz输入右耳。您的大脑会补偿为X Hz的幻觉脑波。',
    'bin.target': '目标 X (Hz)',
    'bin.delta': 'Delta 1-4Hz: 深度睡眠',
    'bin.theta': 'Theta 4-8Hz: 深度放松，冥想',
    'bin.alpha': 'Alpha 8-14Hz: 专注，学习',
    'bin.beta': 'Beta >14Hz: 警觉，深度逻辑',
    'bin.on': '激活脑波',
    'bin.off': '关闭脑波',

    'dump.title': '思维壁炉',
    'dump.desc': '把干扰思绪扔到这里烧掉',
    'dump.placeholder': '我正在担心...'
  }
};

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  l: (obj: { vi: string, en: string, zh: string }) => string;
  playTTS: (textObj: { vi: string, en: string, zh: string }) => void;
  stopTTS: () => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  lang: 'vi',
  setLang: () => {},
  t: (key) => key,
  l: (obj) => obj.vi,
  playTTS: () => {},
  stopTTS: () => {}
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>('vi');
  const globalAudioRef = useRef<HTMLAudioElement | null>(null);

  // Load from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem('oasis_lang');
    if (saved && ['vi', 'en', 'zh'].includes(saved)) {
      setLang(saved as Lang);
    }
    
    globalAudioRef.current = new Audio();
    return () => {
       if (globalAudioRef.current) {
          globalAudioRef.current.pause();
          globalAudioRef.current = null;
       }
    }
  }, []);

  const changeLang = (lMode: Lang) => {
    setLang(lMode);
    localStorage.setItem('oasis_lang', lMode);
  };

  const t = (key: string): string => {
    return (translations as any)[lang][key] || key;
  };

  const l = (obj: { vi: string, en: string, zh: string }) => obj[lang] || obj.vi;

  const stopTTS = () => {
     if (globalAudioRef.current) {
        globalAudioRef.current.pause();
        globalAudioRef.current.currentTime = 0;
     }
  };

  const playTTS = (textObj: { vi: string, en: string, zh: string }) => {
     stopTTS();
     const textToSpeak = l(textObj);
     const voiceModel = lang === 'vi' ? 'vi-VN-HoaiMyNeural' : lang === 'zh' ? 'zh-CN-XiaoxiaoNeural' : 'en-US-AriaNeural';
     const audioUrl = `https://ocean-books.vercel.app/api/tts?text=${encodeURIComponent(textToSpeak)}&voice=${voiceModel}`;
     
     if (globalAudioRef.current) {
         globalAudioRef.current.src = audioUrl;
         globalAudioRef.current.volume = 0.8;
         globalAudioRef.current.play().catch(e => {
            if (e.name !== 'AbortError') console.error("Neural TTS failed:", e);
         });
     }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t, l, playTTS, stopTTS }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
