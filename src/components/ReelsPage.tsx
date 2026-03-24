import { Play, Pause, Heart, MessageCircle, Share2, Music, Volume2, VolumeX, Plus, X, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useRef, useEffect, ChangeEvent, MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPlayIndicator, setShowPlayIndicator] = useState(false);
  const [showMusicDetail, setShowMusicDetail] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        // Flash play icon
        setShowPlayIndicator(true);
        setTimeout(() => setShowPlayIndicator(false), 500);
      }
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

  const handleMusicClick = (e: MouseEvent) => {
    e.stopPropagation();
    setShowMusicDetail(true);
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
            <button 
              onClick={handleMusicClick}
              className="flex items-center gap-2 text-xs opacity-80 hover:opacity-100 transition-opacity"
            >
              <Music className="w-3 h-3 animate-pulse" />
              <span className="truncate">{reel.music}</span>
            </button>
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
            <button 
              onClick={handleMusicClick}
              className="w-8 h-8 rounded-lg border-2 border-white/50 overflow-hidden animate-spin-slow hover:scale-110 transition-transform"
            >
              <img src={`https://picsum.photos/seed/${reel.music}/100/100`} alt="Music" className="w-full h-full object-cover" />
            </button>
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
      
      {/* Music Detail Modal */}
      <AnimatePresence>
        {showMusicDetail && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMusicDetail(false)} />
            <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-8 overflow-hidden">
              <button 
                onClick={() => setShowMusicDetail(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>

              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-32 h-32 rounded-3xl shadow-2xl overflow-hidden relative group">
                  <img src={`https://picsum.photos/seed/${reel.music}/300/300`} alt={reel.music} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Disc className="w-12 h-12 text-white animate-spin-slow" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight text-gray-900">{reel.music}</h3>
                  <p className="text-gray-500 font-medium">Used in 1.2M Nexus Reels</p>
                </div>

                <div className="grid grid-cols-3 gap-2 w-full">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-[9/16] bg-gray-100 rounded-xl overflow-hidden relative">
                      <img src={`https://picsum.photos/seed/reel-${i}/200/350`} alt="" className="w-full h-full object-cover" />
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] text-white font-bold">
                        <Play className="w-2 h-2 fill-white" />
                        <span>{Math.floor(Math.random() * 100)}K</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => navigate('/reels/create')}
                  className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  <Music className="w-5 h-5" />
                  Use this Audio
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Play/Pause Indicator */}
      <AnimatePresence>
        {(!isPlaying || showPlayIndicator) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
          >
            <div className="p-8 bg-black/40 rounded-full backdrop-blur-md border border-white/20 shadow-2xl">
              <Play className="w-16 h-16 text-white fill-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
