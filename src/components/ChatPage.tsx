import { useState, useEffect, useRef, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore, Message } from '../store/useStore';
import { ArrowLeft, Send, User, MoreVertical, Phone, Video } from 'lucide-react';

export default function ChatPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const conversations = useStore((state) => state.conversations);
  const addMessage = useStore((state) => state.addMessage);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = 'test-user-id';

  const conversation = conversations.find(c => c.id === conversationId);
  const otherParticipant = conversation?.participants.find(p => p !== currentUserId) || 'Unknown';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !conversationId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      text: inputText.trim(),
      createdAt: new Date(),
    };

    addMessage(conversationId, newMessage);
    setInputText('');
  };

  if (!conversation) {
    return (
      <div className="pt-24 sm:pt-24 sm:pl-72 text-center text-gray-500 font-medium">
        Conversation not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen pt-24 pb-20 sm:pt-16 sm:pb-0 sm:pl-64 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shadow-sm z-10 bg-white/80 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/messages')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors sm:hidden"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
            <img 
              src={`https://picsum.photos/seed/${otherParticipant}/200/200`} 
              alt={otherParticipant} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 leading-tight">{otherParticipant}</h3>
            <span className="text-xs text-emerald-500 font-medium">Online</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
        {conversation.messages.map((msg, index) => {
          const isMe = msg.senderId === currentUserId;
          const showAvatar = index === 0 || conversation.messages[index - 1].senderId !== msg.senderId;

          return (
            <div 
              key={msg.id} 
              className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {!isMe && (
                <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 mb-1">
                  {showAvatar && (
                    <img 
                      src={`https://picsum.photos/seed/${otherParticipant}/200/200`} 
                      alt={otherParticipant} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
              )}
              <div className={`max-w-[75%] sm:max-w-[60%] space-y-1`}>
                <div 
                  className={`px-4 py-3 rounded-2xl text-sm shadow-sm ${
                    isMe 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-900 border border-gray-100 rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
                <span className={`text-[10px] text-gray-400 block px-1 ${isMe ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 sticky bottom-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-5 py-3 bg-gray-50 border border-transparent rounded-full focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:hover:bg-indigo-600 shadow-md shadow-indigo-100 active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
