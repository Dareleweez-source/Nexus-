import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { useState } from 'react';

interface PostProps {
  username: string;
  imageUrl: string;
  caption: string;
}

export default function Post(props: PostProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg mb-6">
      <div className="p-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-300" />
        <span className="font-semibold">{props.username}</span>
      </div>
      <img src={props.imageUrl} alt="Post" className="w-full aspect-square object-cover" referrerPolicy="no-referrer" />
      <div className="p-4">
        <div className="flex justify-between mb-2">
          <div className="flex gap-4">
            <button onClick={() => setIsLiked(!isLiked)}>
              <Heart className={isLiked ? 'fill-red-500 text-red-500' : ''} />
            </button>
            <MessageCircle />
            <Send />
          </div>
          <Bookmark />
        </div>
        <p>
          <span className="font-semibold mr-2">{props.username}</span>
          {props.caption}
        </p>
      </div>
    </div>
  );
}
