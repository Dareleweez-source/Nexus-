import { useState } from 'react';
import { useParams } from 'react-router-dom';

interface UserData {
  displayName: string;
  photoURL?: string;
}

interface PostData {
  id: string;
  authorUid: string;
  imageUrl: string;
  caption: string;
  createdAt: any;
}

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<UserData | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(false);

  if (loading) return <div className="pt-20 text-center">Loading...</div>;
  if (!user) return <div className="pt-20 text-center">User not found.</div>;

  return (
    <div className="max-w-md mx-auto pt-20 pb-20 sm:pt-10 sm:pl-72">
      <div className="flex items-center gap-4 mb-8 p-4 border-b border-gray-200">
        <div className="w-20 h-20 rounded-full bg-gray-300 overflow-hidden">
          {user.photoURL && <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
        </div>
        <h1 className="text-2xl font-bold">{user.displayName}</h1>
      </div>

      <div className="grid grid-cols-3 gap-1">
        {posts.map((post) => (
          <img key={post.id} src={post.imageUrl} alt={post.caption} className="w-full aspect-square object-cover" referrerPolicy="no-referrer" />
        ))}
      </div>
    </div>
  );
}
