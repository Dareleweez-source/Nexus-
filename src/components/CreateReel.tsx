import { Camera, X, Sparkles, Wand2, Circle, StopCircle, Check, Trash2, Smile, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useRef, useEffect, useCallback, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const FILTERS = [
  { name: 'Normal', filter: 'none' },
  { name: 'Grayscale', filter: 'grayscale(100%)' },
  { name: 'Sepia', filter: 'sepia(100%)' },
  { name: 'Invert', filter: 'invert(100%)' },
  { name: 'Blur', filter: 'blur(4px)' },
  { name: 'Warm', filter: 'brightness(1.1) sepia(0.3) saturate(1.2)' },
  { name: 'Cool', filter: 'brightness(0.9) hue-rotate(180deg) saturate(1.1)' },
  { name: 'Vibrant', filter: 'saturate(2) contrast(1.1)' },
];

const AR_EFFECTS = [
  { id: 'none', name: 'None', icon: <X className="w-5 h-5" /> },
  { id: 'sparkles', name: 'Sparkles', icon: <Sparkles className="w-5 h-5" /> },
  { id: 'vignette', name: 'Vignette', icon: <Circle className="w-5 h-5" /> },
  { id: 'neon', name: 'Neon Glow', icon: <Wand2 className="w-5 h-5" /> },
  { id: 'emoji', name: 'Emoji', icon: <Smile className="w-5 h-5" /> },
];

export default function CreateReel() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);
  const [selectedEffect, setSelectedEffect] = useState(AR_EFFECTS[0]);
  const [showFilters, setShowFilters] = useState(false);
  const [showEffects, setShowEffects] = useState(false);

  // AR Effect Animation State
  const sparklesRef = useRef<{ x: number; y: number; size: number; opacity: number }[]>([]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', aspectRatio: 9/16 }, 
        audio: true 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Please allow camera and microphone access to create a Reel.");
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  // AR Effect Rendering Loop
  const renderAREffects = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !videoRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (selectedEffect.id === 'sparkles') {
      // Add new sparkle
      if (Math.random() > 0.8) {
        sparklesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 10 + 5,
          opacity: 1
        });
      }
      // Update and draw sparkles
      sparklesRef.current = sparklesRef.current.filter(s => s.opacity > 0);
      sparklesRef.current.forEach(s => {
        ctx.globalAlpha = s.opacity;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size / 2, 0, Math.PI * 2);
        ctx.fill();
        // Draw cross for sparkle effect
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(s.x - s.size, s.y);
        ctx.lineTo(s.x + s.size, s.y);
        ctx.moveTo(s.x, s.y - s.size);
        ctx.lineTo(s.x, s.y + s.size);
        ctx.stroke();
        s.opacity -= 0.02;
      });
      ctx.globalAlpha = 1;
    } else if (selectedEffect.id === 'vignette') {
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.width / 4,
        canvas.width / 2, canvas.height / 2, canvas.width / 1.2
      );
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.8)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (selectedEffect.id === 'neon') {
      ctx.strokeStyle = '#00f2ff';
      ctx.lineWidth = 10;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#00f2ff';
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
      ctx.shadowBlur = 0;
    } else if (selectedEffect.id === 'emoji') {
      ctx.font = '80px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🔥', canvas.width / 2, canvas.height - 100);
      ctx.fillText('✨', 100, 150);
      ctx.fillText('📸', canvas.width - 100, 150);
    }

    requestAnimationFrame(renderAREffects);
  }, [selectedEffect]);

  useEffect(() => {
    if (stream) {
      renderAREffects();
    }
  }, [stream, renderAREffects]);

  const startRecording = () => {
    if (!stream) return;
    setRecordedChunks([]);
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    mediaRecorderRef.current = mediaRecorder;
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data]);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setRecordedVideoUrl(url);
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleDiscard = () => {
    setRecordedVideoUrl(null);
    setRecordedChunks([]);
  };

  const handleUpload = () => {
    // In a real app, we would upload the blob to a server
    alert("Reel uploaded successfully! (Simulated)");
    navigate('/reels');
  };

  const handleGalleryUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video')) {
      const url = URL.createObjectURL(file);
      setRecordedVideoUrl(url);
    } else {
      alert("Please select a video file.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
        <button onClick={() => navigate('/reels')} className="p-2 bg-black/20 rounded-full backdrop-blur-md text-white">
          <X className="w-6 h-6" />
        </button>
        <div className="flex gap-4">
          <label className="p-2 bg-black/20 rounded-full backdrop-blur-md text-white cursor-pointer hover:bg-white/20 transition-all">
            <Film className="w-6 h-6" />
            <input 
              type="file" 
              className="hidden" 
              accept="video/*"
              onChange={handleGalleryUpload}
            />
          </label>
          <button 
            onClick={() => { setShowFilters(!showFilters); setShowEffects(false); }}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${showFilters ? 'bg-white text-black' : 'bg-black/20 text-white'}`}
          >
            <Wand2 className="w-6 h-6" />
          </button>
          <button 
            onClick={() => { setShowEffects(!showEffects); setShowFilters(false); }}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${showEffects ? 'bg-white text-black' : 'bg-black/20 text-white'}`}
          >
            <Sparkles className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 relative overflow-hidden bg-gray-900 flex items-center justify-center">
        {!recordedVideoUrl ? (
          <>
            <video 
              ref={videoRef}
              autoPlay 
              muted 
              playsInline
              className="h-full w-full object-cover sm:max-w-md sm:mx-auto"
              style={{ filter: selectedFilter.filter }}
            />
            <canvas 
              ref={canvasRef}
              width={1080}
              height={1920}
              className="absolute inset-0 h-full w-full object-cover sm:max-w-md sm:mx-auto pointer-events-none"
            />
          </>
        ) : (
          <video 
            src={recordedVideoUrl}
            autoPlay 
            loop 
            className="h-full w-full object-cover sm:max-w-md sm:mx-auto"
            style={{ filter: selectedFilter.filter }}
          />
        )}

        {/* Recording Controls */}
        <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-8 z-10">
          {!recordedVideoUrl ? (
            <button 
              onClick={isRecording ? stopRecording : startRecording}
              className="relative group"
            >
              <div className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all ${isRecording ? 'scale-110' : ''}`}>
                {isRecording ? (
                  <StopCircle className="w-12 h-12 text-red-500 fill-red-500" />
                ) : (
                  <div className="w-16 h-16 bg-white rounded-full group-hover:scale-90 transition-transform" />
                )}
              </div>
              {isRecording && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                  REC
                </div>
              )}
            </button>
          ) : (
            <div className="flex gap-6">
              <button 
                onClick={handleDiscard}
                className="p-4 bg-white/10 rounded-full backdrop-blur-md text-white hover:bg-white/20 transition-all"
              >
                <Trash2 className="w-7 h-7" />
              </button>
              <button 
                onClick={handleUpload}
                className="px-8 py-4 bg-white rounded-full text-black font-bold flex items-center gap-2 hover:bg-gray-100 transition-all"
              >
                <Check className="w-6 h-6" />
                Share Reel
              </button>
            </div>
          )}
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-32 left-0 right-0 px-6"
            >
              <div className="bg-black/60 backdrop-blur-xl rounded-3xl p-4 flex gap-4 overflow-x-auto no-scrollbar border border-white/10">
                {FILTERS.map((f) => (
                  <button 
                    key={f.name}
                    onClick={() => setSelectedFilter(f)}
                    className={`flex flex-col items-center gap-2 min-w-[70px] transition-all ${selectedFilter.name === f.name ? 'scale-110' : 'opacity-60'}`}
                  >
                    <div 
                      className="w-12 h-12 rounded-xl border-2 border-white/20 bg-gray-800 overflow-hidden"
                      style={{ filter: f.filter }}
                    >
                      <img src="https://picsum.photos/seed/filter/100/100" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">{f.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Effects Panel */}
        <AnimatePresence>
          {showEffects && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-32 left-0 right-0 px-6"
            >
              <div className="bg-black/60 backdrop-blur-xl rounded-3xl p-4 flex gap-4 overflow-x-auto no-scrollbar border border-white/10">
                {AR_EFFECTS.map((e) => (
                  <button 
                    key={e.id}
                    onClick={() => setSelectedEffect(e)}
                    className={`flex flex-col items-center gap-2 min-w-[70px] transition-all ${selectedEffect.id === e.id ? 'scale-110' : 'opacity-60'}`}
                  >
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${selectedEffect.id === e.id ? 'border-white bg-white/20' : 'border-white/20 bg-gray-800'}`}>
                      {React.cloneElement(e.icon as React.ReactElement, { className: 'w-6 h-6 text-white' })}
                    </div>
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">{e.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar Info (Desktop) */}
      <div className="hidden sm:flex absolute right-0 top-0 bottom-0 w-80 bg-black border-l border-white/10 p-8 flex-col gap-8 text-white">
        <h2 className="text-2xl font-bold tracking-tight">Create Reel</h2>
        <div className="space-y-4">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Selected Filter</label>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gray-800" style={{ filter: selectedFilter.filter }}></div>
            <span className="font-bold">{selectedFilter.name}</span>
          </div>
        </div>
        <div className="space-y-4">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">AR Effect</label>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              {React.cloneElement(selectedEffect.icon as React.ReactElement, { className: 'w-6 h-6' })}
            </div>
            <span className="font-bold">{selectedEffect.name}</span>
          </div>
        </div>
        <div className="mt-auto p-6 bg-indigo-600/20 rounded-3xl border border-indigo-500/30">
          <p className="text-sm text-indigo-200 leading-relaxed">
            Record your reel and apply effects in real-time. Share your creativity with the Nexus community.
          </p>
        </div>
      </div>
    </div>
  );
}
