import React, { FormEvent, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Smile, Heart, Gift, Image as ImageIcon } from 'lucide-react';
import { Comment } from '../store/useStore';

interface CommentsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  onAddComment: (text: string) => void;
  username: string;
}

export default function CommentsSheet({ isOpen, onClose, comments, onAddComment, username }: CommentsSheetProps) {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(commentText);
    setCommentText('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white z-[70] rounded-t-[2.5rem] h-[85vh] flex flex-col overflow-hidden shadow-2xl border-t"
          >
            {/* Handle */}
            <div className="w-full flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-center relative">
              <h3 className="font-black text-lg tracking-tight">Comments</h3>
              <button 
                onClick={onClose}
                className="absolute right-6 p-2 hover:bg-gray-50 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0">
                      <img 
                        src={`https://picsum.photos/seed/${comment.authorUid}/100/100`} 
                        alt={comment.authorUid}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{comment.authorUid}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">10w</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {comment.text}
                      </p>
                      <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors">
                        Reply
                      </button>
                    </div>
                    <div className="flex flex-col items-center gap-1 pt-1">
                      <Heart className="w-4 h-4 text-gray-300 hover:text-red-500 cursor-pointer transition-colors" />
                      <span className="text-[10px] font-bold text-gray-400">4,341</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                  <Smile className="w-12 h-12 opacity-20" />
                  <p className="font-medium">No comments yet</p>
                  <p className="text-xs">Start the conversation</p>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-gray-50 bg-white">
              <div className="flex gap-4 mb-4 overflow-x-auto pb-2 no-scrollbar">
                {['❤️', '🙌', '🔥', '👏', '😢', '😍', '😮', '😂'].map(emoji => (
                  <button 
                    key={emoji}
                    onClick={() => setCommentText(prev => prev + emoji)}
                    className="text-2xl hover:scale-125 transition-transform active:scale-90"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              
              <form onSubmit={handleSubmit} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0">
                  <img 
                    src={`https://picsum.photos/seed/current-user/100/100`} 
                    alt="Me"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 relative">
                  <input 
                    type="text"
                    placeholder="Join the conversation..."
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-sm outline-none focus:border-indigo-500 transition-all pr-24"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button type="button" className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors">
                      <Gift className="w-4 h-4 text-gray-400" />
                    </button>
                    <button 
                      type="submit"
                      disabled={!commentText.trim()}
                      className="text-indigo-600 font-bold text-sm disabled:opacity-30 hover:opacity-80 transition-all"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
