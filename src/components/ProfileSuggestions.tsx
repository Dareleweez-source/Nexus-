import { UserPlus, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const SUGGESTIONS = [
  { id: 's1', username: 'alex_travels', name: 'Alex Rivera', avatar: 'https://picsum.photos/seed/alex/100/100', reason: 'Followed by nature_lover' },
  { id: 's2', username: 'chef_marco', name: 'Marco Rossi', avatar: 'https://picsum.photos/seed/chef/100/100', reason: 'Suggested for you' },
  { id: 's3', username: 'tech_guru', name: 'Sarah Chen', avatar: 'https://picsum.photos/seed/tech/100/100', reason: 'Popular in your area' },
  { id: 's4', username: 'fitness_freak', name: 'Jake Miller', avatar: 'https://picsum.photos/seed/fitness/100/100', reason: 'New to Nexus' },
  { id: 's5', username: 'art_gallery', name: 'Elena Vance', avatar: 'https://picsum.photos/seed/art/100/100', reason: 'Followed by neon_dancer' },
];

export default function ProfileSuggestions() {
  const [suggestions, setSuggestions] = useState(SUGGESTIONS);

  const removeSuggestion = (id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  if (suggestions.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white py-8 my-4 overflow-hidden border-y border-gray-50"
    >
      <div className="px-6 flex justify-between items-end mb-6">
        <div>
          <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">Discovery</h3>
          <h2 className="text-2xl font-black text-gray-900 tracking-tighter">Suggested for you</h2>
        </div>
        <Link 
          to="/search" 
          className="group flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
        >
          See All
          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
      
      <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-4">
        <AnimatePresence mode="popLayout">
          {suggestions.map((user, index) => (
            <motion.div 
              key={user.id}
              layout
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              transition={{ delay: index * 0.05 }}
              className="min-w-[200px] bg-gray-50/50 rounded-[2rem] p-5 flex flex-col items-center text-center relative group border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500"
            >
              <button 
                onClick={() => removeSuggestion(user.id)}
                className="absolute top-3 right-3 p-1.5 text-gray-300 hover:text-gray-900 hover:bg-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              
              <Link to={`/profile/${user.id}`} className="mb-4 relative">
                <div className="w-20 h-20 rounded-[1.75rem] overflow-hidden border-4 border-white shadow-md group-hover:shadow-indigo-200/50 transition-all duration-500">
                  <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                  <UserPlus className="w-3 h-3 text-white" />
                </div>
              </Link>
              
              <Link to={`/profile/${user.id}`} className="block mb-1 w-full">
                <span className="text-sm font-black text-gray-900 block truncate tracking-tight">@{user.username}</span>
                <span className="text-[10px] font-bold text-gray-400 block truncate uppercase tracking-widest">{user.name}</span>
              </Link>
              
              <p className="text-[10px] text-gray-400 mb-5 h-8 line-clamp-2 leading-tight px-2">{user.reason}</p>
              
              <button className="w-full py-2.5 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-gray-200 hover:shadow-indigo-200">
                Follow
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
