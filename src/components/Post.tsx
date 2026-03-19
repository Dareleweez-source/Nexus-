import { Heart, MessageCircle, Send, Bookmark, Smile } from 'lucide-react';
import { useState, FormEvent, memo } from 'react';
import { useStore, Comment } from '../store/useStore';
import { motion } from 'motion/react';

interface PostProps {
  id: string;
  username: string;
  mediaUrl: string;
  type: 'image' | 'video';
  caption: string;
  hashtags?: string[];
  comments?: Comment[];
  key?: string;
}

const Post = memo(function Post(props: PostProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const addComment = useStore((state) => state.addComment);
  const toggleSavePost = useStore((state) => state.toggleSavePost);
  const isSaved = useStore((state) => state.savedPosts.includes(props.id));
  const currentUserId = 'test-user-id';

  const handleAddComment = (e: FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      authorUid: currentUserId,
      text: commentText.trim(),
      createdAt: new Date(),
    };

    addComment(props.id, newComment);
    setCommentText('');
    setShowComments(true);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl mb-8 overflow-hidden shadow-sm">
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-0.5">
          <div className="w-full h-full rounded-2xl bg-white p-0.5">
            <div className="w-full h-full rounded-2xl bg-gray-200 overflow-hidden">
              <img 
                src={`https://picsum.photos/seed/${props.username}/200/200`} 
                alt={props.username} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
        <span className="font-bold text-sm tracking-tight">{props.username}</span>
      </div>
      <div className="aspect-square relative overflow-hidden bg-gray-50">
        {props.type === 'video' ? (
          <video 
            src={props.mediaUrl} 
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setImageLoaded(true)}
          />
        ) : (
          <motion.img 
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoaded ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            src={props.mediaUrl} 
            alt="Post" 
            className="w-full h-full object-cover" 
            referrerPolicy="no-referrer" 
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.currentTarget.src = 'https://picsum.photos/seed/error/600/600';
              setImageLoaded(true);
            }}
          />
        )}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-50 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-5">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className="transition-transform active:scale-125"
            >
              <Heart className={`w-7 h-7 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
            </button>
            <button 
              onClick={() => setShowComments(!showComments)}
              className="hover:opacity-60 transition-opacity"
            >
              <MessageCircle className="w-7 h-7 text-gray-700" />
            </button>
            <button className="hover:opacity-60 transition-opacity">
              <Send className="w-7 h-7 text-gray-700" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => toggleSavePost(props.id)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all active:scale-95 ${
                isSaved 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              {isSaved ? 'Saved' : 'Save Post'}
            </button>
            <button 
              onClick={() => toggleSavePost(props.id)}
              className="hover:opacity-60 transition-opacity"
            >
              <Bookmark className={`w-7 h-7 ${isSaved ? 'fill-gray-900 text-gray-900' : 'text-gray-700'}`} />
            </button>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-sm leading-relaxed">
            <span className="font-bold mr-2">{props.username}</span>
            {props.caption}
          </p>
          {props.hashtags && props.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {props.hashtags.map((tag, index) => (
                <span key={index} className="text-indigo-600 text-xs font-bold hover:underline cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Comments Section */}
          {props.comments && props.comments.length > 0 && (
            <div className="pt-2 space-y-2">
              <button 
                onClick={() => setShowComments(!showComments)}
                className="text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors"
              >
                {showComments ? 'Hide comments' : `View all ${props.comments.length} comments`}
              </button>
              
              {showComments && (
                <div className="space-y-2 pt-2">
                  {props.comments.map((comment) => (
                    <p key={comment.id} className="text-sm">
                      <span className="font-bold mr-2">{comment.authorUid}</span>
                      <span className="text-gray-600">{comment.text}</span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Add Comment Input */}
          {showComments && (
            <form onSubmit={handleAddComment} className="pt-4 border-t border-gray-50 flex items-center gap-3">
              <Smile className="w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Add a comment..." 
                className="flex-1 text-sm outline-none bg-transparent placeholder:text-gray-300"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button 
                type="submit"
                disabled={!commentText.trim()}
                className="text-indigo-600 text-sm font-bold disabled:opacity-30 transition-opacity"
              >
                Post
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
});

export default Post;
