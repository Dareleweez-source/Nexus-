import { Play, Pause, Heart, MessageCircle, Share2, Music, Volume2, VolumeX, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState, useRef, useEffect, ChangeEvent, MouseEvent } from 'react';
import { Link } from 'react-router-dom';

const MOCK_REELS = [
  {
    id: 'r1',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-dancing-alone-34887-large.mp4',
    user: 'neon_dancer',
    caption: 'Late night vibes ✨ #dance #neon',
    music: 'Original Audio - neon_dancer',
    likes: '12.4K',
    comments: '450'
  },
  {
    id: 'r2',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-leaves-low-angle-shot-1479-large.mp4',
    user: 'nature_lover',
    caption: 'Autumn is here 🍂 #nature #autumn',
    music: 'Nature Sounds - nature_lover',
    likes: '8.2K',
    comments: '120'
  }
];

interface ReelItemProps {
  reel: typeof MOCK_REELS[0];
}

const ReelItem: React.FC<ReelItemProps> = ({ reel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  return (
    <div className="h-screen w-full snap-start relative flex items-center justify-center bg-gray-900 group/reel">
      <video 
        ref={videoRef}
        src={reel.videoUrl} 
        className="h-full w-full object-cover sm:max-w-md sm:mx-auto cursor-pointer" 
        autoPlay 
        loop 
        muted={isMuted}
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
      />
      
      {/* Overlay UI */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:max-w-md sm:mx-auto pointer-events-none">
        <div className="flex justify-between items-end mb-12 pointer-events-auto">
          <div className="text-white space-y-4 flex-1 pr-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                <img src={`https://picsum.photos/seed/${reel.user}/100/100`} alt={reel.user} className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-sm tracking-tight">{reel.user}</span>
              <button className="px-3 py-1 border border-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">Follow</button>
            </div>
            <p className="text-sm line-clamp-2">{reel.caption}</p>
            <div className="flex items-center gap-2 text-xs opacity-80">
              <Music className="w-3 h-3 animate-pulse" />
              <span className="truncate">{reel.music}</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col gap-6 text-white items-center">
            <button onClick={toggleMute} className="p-3 bg-white/10 rounded-full backdrop-blur-md hover:bg-white/20 transition-all">
              {isMuted ? <VolumeX className="w-7 h-7" /> : <Volume2 className="w-7 h-7" />}
            </button>
            <button className="flex flex-col items-center gap-1 group">
              <div className="p-3 bg-white/10 rounded-full backdrop-blur-md group-hover:bg-white/20 transition-all">
                <Heart className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold">{reel.likes}</span>
            </button>
            <button className="flex flex-col items-center gap-1 group">
              <div className="p-3 bg-white/10 rounded-full backdrop-blur-md group-hover:bg-white/20 transition-all">
                <MessageCircle className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold">{reel.comments}</span>
            </button>
            <button className="flex flex-col items-center gap-1 group">
              <div className="p-3 bg-white/10 rounded-full backdrop-blur-md group-hover:bg-white/20 transition-all">
                <Share2 className="w-7 h-7" />
              </div>
            </button>
            <div className="w-8 h-8 rounded-lg border-2 border-white/50 overflow-hidden animate-spin-slow">
              <img src={`https://picsum.photos/seed/${reel.music}/100/100`} alt="Music" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Seek Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-1 pointer-events-auto sm:max-w-md sm:mx-auto">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={progress} 
            onChange={handleSeek}
            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white hover:h-2 transition-all"
          />
        </div>
      </div>
      
      {/* Play/Pause Indicator */}
      <motion.div 
        initial={false}
        animate={{ opacity: isPlaying ? 0 : 1, scale: isPlaying ? 0.8 : 1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      >
        <div className="p-6 bg-black/40 rounded-full backdrop-blur-sm">
          <Pause className="w-12 h-12 text-white fill-white" />
        </div>
      </motion.div>
    </div>
  );
}

export default function ReelsPage() {
  return (
    <div className="h-screen w-full bg-black overflow-y-scroll snap-y snap-mandatory no-scrollbar">
      {/* Create Reel Button */}
      <Link 
        to="/reels/create"
        className="fixed top-6 right-6 z-30 p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all shadow-xl border border-white/10"
      >
        <Plus className="w-7 h-7" />
      </Link>

      {MOCK_REELS.map((reel) => (
        <ReelItem key={reel.id} reel={reel} />
      ))}
    </div>
  );
}
