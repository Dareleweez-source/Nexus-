import { useState, useEffect, useRef } from 'react';
import Post from './Post';
import { useStore } from '../store/useStore';
import ProfileSuggestions from './ProfileSuggestions';
import { Loader2 } from 'lucide-react';

const POSTS_PER_PAGE = 3;

export default function Feed() {
  const allPosts = useStore((state) => state.posts);
  const refreshKey = useStore((state) => state.refreshKey);
  const [visiblePostsCount, setVisiblePostsCount] = useState(POSTS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (refreshKey > 0) {
      setVisiblePostsCount(POSTS_PER_PAGE);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [refreshKey]);

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
    <div className="pt-24 pb-20 sm:pl-64 bg-white min-h-screen transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        {visiblePosts.map((post, index) => (
          <div key={post.id} className="py-0 first:pt-0 last:pb-0">
            <Post 
              id={post.id}
              username={post.authorUid}
              mediaUrl={post.mediaUrl} 
              type={post.type}
              caption={post.caption} 
              hashtags={post.hashtags}
              comments={post.comments}
              repostedFrom={post.repostedFrom}
            />
            {index === 0 && (
              <div className="my-12">
                <ProfileSuggestions />
              </div>
            )}
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
