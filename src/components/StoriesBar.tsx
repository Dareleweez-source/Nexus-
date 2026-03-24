import React, { useState, useEffect, FormEvent, useRef, MouseEvent, ChangeEvent } from 'react';
import { Plus, X, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import { Music, Disc } from 'lucide-react';

const MOCK_MUSIC = [
  { id: 'm1', name: 'Summer Vibes', artist: 'Nexus Beats', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 'm2', name: 'Lo-fi Chill', artist: 'Urban Echo', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 'm3', name: 'Electric Dreams', artist: 'Neon Pulse', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 'm4', name: 'Acoustic Soul', artist: 'Morning Dew', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
];

export default function StoriesBar() {
  const stories = useStore((state) => state.stories);
  const addStory = useStore((state) => state.addStory);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMusicId, setSelectedMusicId] = useState<string | null>(null);
  const [previewingMusicId, setPreviewingMusicId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentUserId = 'test-user-id';

  // Filter stories older than 24 hours
  const activeStories = stories.filter(s => {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return new Date(s.createdAt) > twentyFourHoursAgo;
  });

  // Group stories by user
  const storiesByUser = activeStories.reduce((acc, story) => {
    if (!acc[story.userUid]) acc[story.userUid] = [];
    acc[story.userUid].push(story);
    return acc;
  }, {} as Record<string, typeof activeStories>);

  const userIds = Object.keys(storiesByUser);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const type = file.type.startsWith('video') ? 'video' : 'image';
      setMediaType(type);

      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddStory = async (e: FormEvent) => {
    e.preventDefault();
    if (!mediaPreview) return;

    setIsSubmitting(true);

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    addStory({
      id: `st${Date.now()}`,
      userUid: currentUserId,
      mediaUrl: mediaPreview,
      type: mediaType,
      createdAt: new Date(),
      music: selectedMusicId ? MOCK_MUSIC.find(m => m.id === selectedMusicId)?.name : undefined,
    });

    setMediaFile(null);
    setMediaPreview(null);
    setMediaType('image');
    setSelectedMusicId(null);
    setPreviewingMusicId(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsUploading(false);
    setIsSubmitting(false);
  };

  const toggleMusicPreview = (music: typeof MOCK_MUSIC[0]) => {
    if (previewingMusicId === music.id) {
      audioRef.current?.pause();
      setPreviewingMusicId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(music.url);
      audioRef.current.play();
      setPreviewingMusicId(music.id);
      audioRef.current.onended = () => setPreviewingMusicId(null);
    }
  };

  const selectMusic = (musicId: string) => {
    setSelectedMusicId(selectedMusicId === musicId ? null : musicId);
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
  };

  return (
    <div className="bg-white p-2 overflow-x-auto no-scrollbar flex gap-4 items-center">
      {/* Add Story Button */}
      <div className="flex flex-col items-center gap-2 flex-shrink-0">
        <button 
          onClick={() => setIsUploading(true)}
          className="w-20 h-20 rounded-[2rem] bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-400 transition-all"
        >
          <Plus className="w-8 h-8" />
        </button>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Story</span>
      </div>

      {/* User Stories */}
      {userIds.map((uid, index) => (
        <div key={uid} className="flex flex-col items-center gap-2 flex-shrink-0">
          <button 
            onClick={() => setSelectedStoryIndex(index)}
            className="w-20 h-20 rounded-[2rem] bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-0.5 transition-transform active:scale-90"
          >
            <div className="w-full h-full rounded-[1.85rem] bg-white p-0.5">
              <img 
                src={`https://picsum.photos/seed/${uid}/200/200`} 
                alt={uid} 
                className="w-full h-full rounded-[1.75rem] object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </button>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate w-20 text-center">
            {uid === currentUserId ? 'You' : uid}
          </span>
        </div>
      ))}

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black tracking-tight">Add to Story</h3>
                <button onClick={() => setIsUploading(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleAddStory} className="space-y-6">
                {!mediaPreview ? (
                  <div className="space-y-4">
                    <label className="flex flex-col items-center justify-center w-full aspect-[9/16] border-2 border-dashed border-gray-200 rounded-[2rem] cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className="p-4 bg-indigo-50 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                          <Plus className="w-8 h-8 text-indigo-600" />
                        </div>
                        <p className="mb-2 text-sm font-bold text-gray-700">Click to upload story</p>
                        <p className="text-xs text-gray-400 uppercase tracking-widest">Photos or Videos</p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        required
                      />
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative aspect-[9/16] rounded-[2rem] overflow-hidden bg-gray-100 border border-gray-100 shadow-xl">
                      {mediaType === 'image' ? (
                        <img 
                          src={mediaPreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video 
                          src={mediaPreview} 
                          className="w-full h-full object-cover"
                          autoPlay
                          muted
                          loop
                        />
                      )}
                      <button 
                        type="button"
                        onClick={clearMedia}
                        className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md text-white rounded-full hover:bg-black/70 transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-4 left-4 flex flex-col gap-2">
                        <span className="w-fit px-3 py-1 bg-white/90 backdrop-blur-md text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                          {mediaType}
                        </span>
                        {selectedMusicId && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-bold rounded-full shadow-sm animate-pulse">
                            <Music className="w-3 h-3" />
                            <span>{MOCK_MUSIC.find(m => m.id === selectedMusicId)?.name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Music Selection */}
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Add Background Music</p>
                      <div className="grid grid-cols-2 gap-2">
                        {MOCK_MUSIC.map(music => (
                          <div 
                            key={music.id}
                            className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-1 ${
                              selectedMusicId === music.id 
                                ? 'border-indigo-600 bg-indigo-50' 
                                : 'border-gray-100 hover:border-indigo-200'
                            }`}
                            onClick={() => selectMusic(music.id)}
                          >
                            <div className="flex justify-between items-start">
                              <span className="text-xs font-bold truncate pr-6">{music.name}</span>
                              <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); toggleMusicPreview(music); }}
                                className={`p-1.5 rounded-full transition-colors ${
                                  previewingMusicId === music.id 
                                    ? 'bg-indigo-600 text-white' 
                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                }`}
                              >
                                {previewingMusicId === music.id ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                              </button>
                            </div>
                            <span className="text-[10px] text-gray-400 truncate">{music.artist}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <button 
                  type="submit"
                  disabled={!mediaPreview || isSubmitting}
                  className={`w-full py-4 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                    !mediaPreview || isSubmitting 
                      ? 'bg-gray-200 cursor-not-allowed shadow-none text-gray-400' 
                      : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sharing...</span>
                    </>
                  ) : (
                    'Share to Story'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Story Viewer Modal */}
      <AnimatePresence>
        {selectedStoryIndex !== null && (
          <StoryViewer 
            userIds={userIds} 
            storiesByUser={storiesByUser} 
            initialUserIndex={selectedStoryIndex} 
            onClose={() => setSelectedStoryIndex(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StoryViewer({ userIds, storiesByUser, initialUserIndex, onClose }: { 
  userIds: string[], 
  storiesByUser: Record<string, any[]>, 
  initialUserIndex: number, 
  onClose: () => void 
}) {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showReactions, setShowReactions] = useState(false);
  const [activeReactions, setActiveReactions] = useState<{ id: number, emoji: string, x: number }[]>([]);
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({});
  const [showPlayIndicator, setShowPlayIndicator] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const currentUser = userIds[currentUserIndex];
  const userStories = storiesByUser[currentUser];
  const currentStory = userStories[currentStoryIndex];

  // Swipe threshold
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isRightSwipe) {
      // User swiped right -> Next Story (as requested)
      nextStory();
    } else if (isLeftSwipe) {
      // User swiped left -> Previous Story (as requested)
      prevStory();
    }
  };

  const REACTION_EMOJIS = ['❤️', '🔥', '🙌', '👏', '😢', '😍', '😮', '😂'];

  const handleReaction = (emoji: string) => {
    // Increment count
    setReactionCounts(prev => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1
    }));

    // Create a burst of emojis
    const burstSize = 6;
    for (let i = 0; i < burstSize; i++) {
      const id = Date.now() + Math.random();
      const xOffset = Math.random() * 160 - 80; // Random horizontal spread
      setActiveReactions(prev => [...prev, { id, emoji, x: xOffset }]);
      
      setTimeout(() => {
        setActiveReactions(prev => prev.filter(r => r.id !== id));
      }, 2000);
    }
  };

  const nextStory = () => {
    if (currentStoryIndex < userStories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setProgress(0);
      setIsPlaying(true);
    } else if (currentUserIndex < userIds.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
      setCurrentStoryIndex(0);
      setProgress(0);
      setIsPlaying(true);
    } else {
      onClose();
    }
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setProgress(0);
      setIsPlaying(true);
    } else if (currentUserIndex > 0) {
      setCurrentUserIndex(currentUserIndex - 1);
      setCurrentStoryIndex(storiesByUser[userIds[currentUserIndex - 1]].length - 1);
      setProgress(0);
      setIsPlaying(true);
    }
  };

  const togglePlay = (e: MouseEvent) => {
    e.stopPropagation();
    if (currentStory.type === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowPlayIndicator(true);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        setShowPlayIndicator(true);
        setTimeout(() => setShowPlayIndicator(false), 500);
      }
    } else {
      setIsPlaying(!isPlaying);
      setShowPlayIndicator(true);
      if (!isPlaying === false) { // if it was paused and now playing
         setTimeout(() => setShowPlayIndicator(false), 500);
      }
    }
  };

  const toggleMute = (e: MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const seekTime = (parseFloat(e.target.value) / 100) * (videoRef.current?.duration || 5);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
    setProgress(parseFloat(e.target.value));
  };

  // Auto-advance story for images
  useEffect(() => {
    if (currentStory.type === 'image' && isPlaying) {
      const timer = setTimeout(nextStory, 5000);
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + (100 / 50), 100));
      }, 100);
      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [currentUserIndex, currentStoryIndex, isPlaying, currentStory.type]);

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative w-full max-w-lg aspect-[9/16] bg-gray-900 overflow-hidden sm:rounded-3xl shadow-2xl">
        {/* Progress Bars */}
        <div className="absolute top-4 left-4 right-4 z-20 flex gap-1">
          {userStories.map((_, i) => (
            <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{ width: i === currentStoryIndex ? `${progress}%` : (i < currentStoryIndex ? '100%' : '0%') }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-8 left-4 right-4 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl border-2 border-white p-0.5">
              <img 
                src={`https://picsum.photos/seed/${currentUser}/200/200`} 
                alt={currentUser} 
                className="w-full h-full rounded-xl object-cover"
              />
            </div>
            <div className="text-white">
              <p className="text-sm font-bold">{currentUser}</p>
              <div className="flex items-center gap-2">
                <p className="text-[10px] opacity-60">
                  {new Date(currentStory.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                {currentStory.music && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                    <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-300">
                      <Music className="w-2 h-2" />
                      <span className="truncate max-w-[80px]">{currentStory.music}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button onClick={onClose} className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Story Content */}
        <div className="w-full h-full flex items-center justify-center relative">
          {currentStory.type === 'video' ? (
            <video 
              ref={videoRef}
              key={currentStory.id}
              src={currentStory.mediaUrl} 
              className="w-full h-full object-cover"
              autoPlay={isPlaying}
              muted={isMuted}
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onEnded={nextStory}
              referrerPolicy="no-referrer"
            />
          ) : (
            <img 
              key={currentStory.id}
              src={currentStory.mediaUrl} 
              alt="Story" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          )}

          {/* Center Tap Area for Play/Pause */}
          <div 
            className="absolute inset-y-20 inset-x-20 z-30 cursor-pointer" 
            onClick={togglePlay}
          />
        </div>

        {/* Floating Reactions */}
        <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
          <AnimatePresence>
            {activeReactions.map((reaction) => (
              <motion.div
                key={reaction.id}
                initial={{ opacity: 0, y: 0, x: reaction.x, scale: 0.5 }}
                animate={{ 
                  opacity: [0, 1, 1, 0], 
                  y: -600, 
                  x: reaction.x + (Math.random() * 100 - 50),
                  scale: [0.5, 1.2, 1, 0.8],
                  rotate: Math.random() * 40 - 20
                }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute bottom-20 left-1/2 text-4xl"
              >
                {reaction.emoji}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Reaction Counts Overlay */}
        <div className="absolute top-24 left-4 z-30 flex flex-wrap gap-2 max-w-[200px] pointer-events-none">
          <AnimatePresence>
            {Object.entries(reactionCounts).map(([emoji, count]) => (
              <motion.div
                key={emoji}
                initial={{ opacity: 0, scale: 0.5, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2 py-1 rounded-full border border-white/10"
              >
                <span className="text-sm">{emoji}</span>
                <span className="text-[10px] text-white font-black">{count}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Play/Pause Indicator */}
        <AnimatePresence>
          {(!isPlaying || showPlayIndicator) && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
            >
              <div className="p-8 bg-black/40 rounded-full backdrop-blur-md border border-white/20 shadow-2xl">
                {isPlaying ? (
                  <Play className="w-16 h-16 text-white fill-white" />
                ) : (
                  <Pause className="w-16 h-16 text-white fill-white" />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Controls (Reaction & Input) */}
        <div className="absolute bottom-6 left-4 right-4 z-50 flex items-center gap-3">
          <div className="flex-1 relative">
            <input 
              type="text"
              placeholder="Send message..."
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/60 outline-none focus:bg-white/20 transition-all"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowReactions(!showReactions); }}
              className="p-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white/20 transition-all"
            >
              <Smile className="w-6 h-6" />
            </button>
            
            <AnimatePresence>
              {showReactions && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: -10, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  className="absolute bottom-full right-0 mb-4 p-2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl flex gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {REACTION_EMOJIS.map(emoji => (
                    <button 
                      key={emoji}
                      onClick={() => { handleReaction(emoji); setShowReactions(false); }}
                      className="text-2xl hover:scale-125 transition-transform active:scale-90 p-1"
                    >
                      {emoji}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Seek Bar (Visible on Hover/Touch) */}
        <div className="absolute bottom-20 left-4 right-4 z-30 opacity-0 hover:opacity-100 transition-opacity">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={progress} 
            onChange={handleSeek}
            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>

        {/* Navigation Controls */}
        <div className="absolute inset-0 z-10 flex">
          <div className="flex-1 cursor-pointer" onClick={(e) => { e.stopPropagation(); prevStory(); }} />
          <div className="flex-1 cursor-pointer" onClick={(e) => { e.stopPropagation(); nextStory(); }} />
        </div>

        {/* Desktop Navigation Buttons */}
        <button 
          onClick={(e) => { e.stopPropagation(); prevStory(); }}
          className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); nextStory(); }}
          className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
