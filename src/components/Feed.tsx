import { useState, useEffect, useRef } from 'react';
import Post from './Post';
import { useStore } from '../store/useStore';
import ProfileSuggestions from './ProfileSuggestions';
import { Loader2 } from 'lucide-react';

const POSTS_PER_PAGE = 3;

export default function Feed() {
  const allPosts = useStore((state) => state.posts);
  const [visiblePostsCount, setVisiblePostsCount] = useState(POSTS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const visiblePosts = allPosts.slice(0, visiblePostsCount);
  const hasMore = visiblePostsCount < allPosts.length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, isLoadingMore]);

  const loadMorePosts = () => {
    setIsLoadingMore(true);
    // Simulate network delay
    setTimeout(() => {
      setVisiblePostsCount((prev) => prev + POSTS_PER_PAGE);
      setIsLoadingMore(false);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto pt-48 pb-20 px-4 sm:pt-48 sm:pl-72">
      <div className="space-y-8">
        {visiblePosts.map((post, index) => (
          <div key={post.id}>
            <Post 
              id={post.id}
              username={post.authorUid}
              mediaUrl={post.mediaUrl} 
              type={post.type}
              caption={post.caption} 
              hashtags={post.hashtags}
              comments={post.comments}
            />
            {index === 0 && <ProfileSuggestions />}
          </div>
        ))}
        
        {/* Infinite Scroll Loader */}
        <div ref={loaderRef} className="py-8 flex justify-center">
          {hasMore ? (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs font-bold uppercase tracking-widest">Loading more posts...</span>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-300 text-sm font-medium">You've reached the end of the feed ✨</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
