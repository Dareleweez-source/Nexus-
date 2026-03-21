import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { MessageSquare, User } from 'lucide-react';

export default function MessagesPage() {
  const conversations = useStore((state) => state.conversations);
  const currentUserId = 'test-user-id';

  return (
    <div className="max-w-2xl mx-auto pt-8 pb-20 px-4 sm:pt-12 sm:pl-72">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black tracking-tight">Messages</h2>
        <button className="p-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors">
          <MessageSquare className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-2">
        {conversations.length > 0 ? (
          conversations.map((conv) => {
            const otherParticipant = conv.participants.find(p => p !== currentUserId) || 'Unknown';
            return (
              <Link 
                key={conv.id} 
                to={`/messages/${conv.id}`}
                className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all group"
              >
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img 
                    src={`https://picsum.photos/seed/${otherParticipant}/200/200`} 
                    alt={otherParticipant} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{otherParticipant}</h4>
                    {conv.lastMessage && (
                      <span className="text-xs text-gray-400">
                        {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {conv.lastMessage ? (
                      <>
                        {conv.lastMessage.senderId === currentUserId ? 'You: ' : ''}
                        {conv.lastMessage.text}
                      </>
                    ) : (
                      'No messages yet'
                    )}
                  </p>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">No messages yet.</p>
            <p className="text-gray-300 text-sm mt-1">Start a conversation with someone!</p>
          </div>
        )}
      </div>
    </div>
  );
}
