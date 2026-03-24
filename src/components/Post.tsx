import { Heart, MessageCircle, Send, Bookmark, Smile, Repeat2, User, VolumeX } from 'lucide-react';
import { useState, FormEvent, memo, useEffect } from 'react';
import { useStore, Comment, PostData } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import CommentsSheet from './CommentsSheet';

interface PostProps {
  id: string;
  username: string;
  mediaUrl: string;
  type: 'image' | 'video';
  caption: string;
  hashtags?: string[];
  comments?: Comment[];
  repostedFrom?: PostData;
  key?: string;
}

const Post = memo(function Post(props: PostProps) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 10000) + 5000);
  const postComments = useStore((state) => state.posts.find(p => p.id === props.id)?.comments || props.comments || []);
  const [commentsCount, setCommentsCount] = useState(postComments.length);

  useEffect(() => {
    setCommentsCount(postComments.length);
  }, [postComments.length]);
  const [repostsCount, setRepostsCount] = useState(Math.floor(Math.random() * 300) + 50);
  const [sharesCount, setSharesCount] = useState(Math.floor(Math.random() * 1000) + 200);
  const [commentText, setCommentText] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const addComment = useStore((state) => state.addComment);
  const toggleSavePost = useStore((state) => state.toggleSavePost);
  const repostPost = useStore((state) => state.repostPost);
  const following = useStore((state) => state.following);
  const toggleFollow = useStore((state) => state.toggleFollow);
  
  const isSaved = useStore((state) => state.savedPosts.includes(props.id));
  const isFollowing = following.includes(props.username);
  const currentUserId = 'test-user-id';

  const handleAddComment = (text: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      authorUid: currentUserId,
      text: text.trim(),
      createdAt: new Date(),
    };

    addComment(props.id, newComment);
    setCommentsCount(postComments.length + 1);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleRepost = () => {
    repostPost(props.id);
    setRepostsCount(prev => prev + 1);
  };

  const handleShare = () => {
    setSharesCount(prev => prev + 1);
    // In a real app, this would open a share dialog
  };

  const formatCount = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="bg-white overflow-hidden transition-all duration-300">
      {props.repostedFrom && (
        <div className="px-8 py-4 bg-gray-50/80 backdrop-blur-sm flex items-center gap-3">
          <Repeat2 className="w-5 h-5 text-indigo-500" />
          <span className="text-sm font-bold text-gray-600 tracking-tight">
            {props.username} reposted
          </span>
        </div>
      )}
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            onClick={() => navigate(`/profile/${props.username}`)}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-fuchsia-600 to-indigo-600 p-0.5 shadow-lg cursor-pointer transition-transform active:scale-90"
          >
            <div className="w-full h-full rounded-full bg-white p-0.5">
              <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/${props.username}/200/200`} 
                  alt={props.username} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span 
                onClick={() => navigate(`/profile/${props.username}`)}
                className="font-bold text-base tracking-tight block cursor-pointer hover:text-indigo-600 transition-colors"
              >
                {props.username}
              </span>
              {props.username !== currentUserId && (
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleFollow(props.username); }}
                  className={`text-[10px] font-black uppercase tracking-widest px-1 py-1 transition-all duration-300 active:scale-95 ${
                    isFollowing 
                      ? 'text-gray-400' 
                      : 'text-indigo-600 hover:text-indigo-700'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="relative overflow-hidden bg-gray-100 group aspect-[9/16]">
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
        
        {/* Media Overlays */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 transition-transform duration-500">
        </div>

        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-50 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        )}
      </div>
      <div className="px-5 py-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-1.5 group cursor-pointer">
              <button 
                onClick={handleLike}
                className="transition-all duration-200 active:scale-125 hover:scale-110"
              >
                <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-800'}`} />
              </button>
              <span className="text-xs font-bold text-gray-800">{formatCount(likes)}</span>
            </div>

            <div className="flex items-center gap-1.5 group cursor-pointer">
              <button 
                onClick={() => setShowComments(true)}
                className="hover:scale-110 transition-transform"
              >
                <MessageCircle className="w-6 h-6 text-gray-800" />
              </button>
              <span className="text-xs font-bold text-gray-800">{formatCount(commentsCount)}</span>
            </div>

            <div className="flex items-center gap-1.5 group cursor-pointer">
              <button 
                onClick={handleRepost}
                className="hover:text-indigo-600 transition-all duration-200 active:rotate-180 hover:scale-110"
                title="Repost"
              >
                <Repeat2 className={`w-6 h-6 ${props.repostedFrom ? 'text-indigo-600' : 'text-gray-800'}`} />
              </button>
              <span className="text-xs font-bold text-gray-800">{formatCount(repostsCount)}</span>
            </div>

            <div className="flex items-center gap-1.5 group cursor-pointer">
              <button 
                onClick={handleShare}
                className="hover:scale-110 transition-transform"
              >
                <Send className="w-6 h-6 text-gray-800" />
              </button>
              <span className="text-xs font-bold text-gray-800">{formatCount(sharesCount)}</span>
            </div>
          </div>

          <button 
            onClick={() => toggleSavePost(props.id)}
            className="hover:scale-110 transition-transform active:scale-90"
          >
            <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-black text-black' : 'text-gray-800'}`} />
          </button>
        </div>
        <div className="mt-4 space-y-3">
          <p className="text-base leading-relaxed text-gray-800">
            <span className="font-black mr-3 text-black">@{props.username}</span>
            {props.caption}
          </p>
          {props.hashtags && props.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {props.hashtags.map((tag, index) => (
                <span 
                  key={index} 
                  onClick={() => navigate(`/search?q=%23${tag}`)}
                  className="text-indigo-600 text-xs font-bold hover:underline cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Comments Preview */}
          {postComments.length > 0 && (
            <div className="mt-4 space-y-2 pt-4">
              {postComments.slice(0, 2).map((comment) => (
                <div key={comment.id} className="text-sm flex items-start gap-2">
                  <span className="font-bold text-gray-900 whitespace-nowrap">@{comment.authorUid}</span>
                  <span className="text-gray-600 line-clamp-2">{comment.text}</span>
                </div>
              ))}
              {postComments.length > 2 && (
                <button 
                  onClick={() => setShowComments(true)}
                  className="text-sm text-indigo-600 font-bold hover:text-indigo-700 transition-colors mt-1 flex items-center gap-1 group"
                >
                  View all {postComments.length} comments
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Comments Sheet */}
      <CommentsSheet 
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        comments={postComments}
        onAddComment={handleAddComment}
        username={props.username}
      />
    </div>
  );
});

export default Post;
