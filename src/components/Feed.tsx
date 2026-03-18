import Post from './Post';
import { useStore } from '../store/useStore';

export default function Feed() {
  const posts = useStore((state) => state.posts);

  return (
    <div className="max-w-md mx-auto pt-20 pb-20 sm:pt-10 sm:pl-72">
      {posts.map((post) => (
        <Post 
          key={post.id} 
          username={post.authorUid}
          imageUrl={post.imageUrl} 
          caption={post.caption} 
        />
      ))}
    </div>
  );
}
