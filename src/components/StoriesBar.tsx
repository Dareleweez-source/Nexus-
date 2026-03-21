import React, { useState, useEffect, FormEvent, useRef, MouseEvent, ChangeEvent } from 'react';
import { Plus, X, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';

export default function StoriesBar() {
  const stories = useStore((state) => state.stories);
  const addStory = useStore((state) => state.addStory);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    });

    setMediaFile(null);
    setMediaPreview(null);
    setMediaType('image');
    setIsUploading(false);
    setIsSubmitting(false);
  };

  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
  };

  return (
    <div className="bg-white p-2 overflow-x-auto no-scrollbar flex gap-4 items-center">
      {/* Add Story Button */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <button 
          onClick={() => setIsUploading(true)}
          className="w-16 h-16 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-400 transition-all"
        >
          <Plus className="w-6 h-6" />
        </button>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Story</span>
      </div>

      {/* User Stories */}
      {userIds.map((uid, index) => (
        <div key={uid} className="flex flex-col items-center gap-1 flex-shrink-0">
          <button 
            onClick={() => setSelectedStoryIndex(index)}
            className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-0.5 transition-transform active:scale-90"
          >
            <div className="w-full h-full rounded-2xl bg-white p-0.5">
              <img 
                src={`https://picsum.photos/seed/${uid}/200/200`} 
                alt={uid} 
                className="w-full h-full rounded-2xl object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </button>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate w-16 text-center">
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
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
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
                      <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                          {mediaType}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <button 
                  type="submit"
                  disabled={!mediaPreview || isSubmitting}
                  className={`w-full py-4 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                    !mediaPreview || isSubmitting 
                      ? 'bg-gray-200 cursor-not-allowed shadow-none' 
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
  const [activeReactions, setActiveReactions] = useState<{ id: number, emoji: string }[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const currentUser = userIds[currentUserIndex];
  const userStories = storiesByUser[currentUser];
  const currentStory = userStories[currentStoryIndex];

  const REACTION_EMOJIS = ['❤️', '🔥', '🙌', '👏', '😢', '😍', '😮', '😂'];

  const handleReaction = (emoji: string) => {
    const id = Date.now();
    setActiveReactions(prev => [...prev, { id, emoji }]);
    // Remove reaction after animation
    setTimeout(() => {
      setActiveReactions(prev => prev.filter(r => r.id !== id));
    }, 2000);
  };

  const nextStory = () => {
    if (currentStoryIndex < userStories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setProgress(0);
    } else if (currentUserIndex < userIds.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
      setCurrentStoryIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setProgress(0);
    } else if (currentUserIndex > 0) {
      setCurrentUserIndex(currentUserIndex - 1);
      setCurrentStoryIndex(storiesByUser[userIds[currentUserIndex - 1]].length - 1);
      setProgress(0);
    }
  };

  const togglePlay = () => {
    if (currentStory.type === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
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
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
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
              <p className="text-[10px] opacity-60">
                {new Date(currentStory.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
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
        <div className="w-full h-full flex items-center justify-center" onClick={togglePlay}>
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
        </div>

        {/* Floating Reactions */}
        <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
          <AnimatePresence>
            {activeReactions.map((reaction) => (
              <motion.div
                key={reaction.id}
                initial={{ opacity: 0, y: 100, x: Math.random() * 100 - 50 }}
                animate={{ opacity: 1, y: -500, x: Math.random() * 200 - 100 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute bottom-20 left-1/2 text-4xl"
              >
                {reaction.emoji}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Play/Pause Indicator */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
            >
              <div className="p-6 bg-black/40 rounded-full backdrop-blur-sm">
                <Pause className="w-12 h-12 text-white fill-white" />
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
