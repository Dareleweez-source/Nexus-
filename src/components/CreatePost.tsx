import { useState, FormEvent, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Camera, X, Hash, Type, Upload, Film, Image as ImageIcon, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CreatePost() {
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addPost = useStore((state) => state.addPost);
  const navigate = useNavigate();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMediaFile(file);
    const isVideo = file.type.startsWith('video/');
    setMediaType(isVideo ? 'video' : 'image');

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!mediaPreview || !caption) return;

    setIsSubmitting(true);

    const hashtagArray = hashtags
      .split(' ')
      .map(h => h.replace('#', '').trim())
      .filter(h => h !== '');

    // In a real app, we would upload the file to a server here
    // For now, we use the base64 preview as the mediaUrl
    addPost({
      id: Date.now().toString(),
      authorUid: 'test-user-id',
      mediaUrl: mediaPreview,
      type: mediaType,
      caption,
      hashtags: hashtagArray,
      createdAt: new Date(),
      comments: [],
    });

    // Simulate a small delay for "uploading" feel
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/');
    }, 1000);
  };

  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-2xl mx-auto pt-24 pb-20 px-4 sm:pt-24 sm:pl-72">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-2xl font-black tracking-tight text-gray-900">New Post</h2>
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-2xl transition-all active:scale-90"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Media Upload Area */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
              <Camera className="w-3 h-3" />
              Media Content
            </label>
            
            <div 
              onClick={() => !mediaPreview && fileInputRef.current?.click()}
              className={`relative aspect-square rounded-[2rem] border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-4 group
                ${mediaPreview ? 'border-transparent' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-indigo-300'}
              `}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,video/*"
                className="hidden"
              />

              {mediaPreview ? (
                <>
                  {mediaType === 'image' ? (
                    <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <video src={mediaPreview} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                  )}
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); clearMedia(); }}
                    className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md text-white rounded-2xl hover:bg-black/70 transition-all active:scale-90"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/50 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-xl">
                    {mediaType}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-3xl bg-white shadow-sm flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-900">Click to upload</p>
                    <p className="text-xs text-gray-400 mt-1">Photos or Videos (up to 50MB)</p>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <ImageIcon className="w-3 h-3" /> Photo
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <Film className="w-3 h-3" /> Video
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Caption Area */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Type className="w-3 h-3" />
              Caption
            </label>
            <textarea
              placeholder="Write something engaging..."
              className="w-full p-6 bg-gray-50 border border-transparent rounded-[2rem] focus:bg-white focus:border-indigo-500 outline-none transition-all min-h-[140px] resize-none text-sm leading-relaxed"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              required
            />
          </div>

          {/* Hashtags Area */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Hash className="w-3 h-3" />
              Hashtags
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="nature nexus vibe"
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
              />
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-600 font-black text-lg">#</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!mediaPreview || !caption || isSubmitting}
            className={`w-full py-5 text-white font-black rounded-[2rem] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98]
              ${!mediaPreview || !caption || isSubmitting 
                ? 'bg-gray-200 cursor-not-allowed shadow-none' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 hover:shadow-indigo-300'}
            `}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Sharing...</span>
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                <span>Share Post</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
