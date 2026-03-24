import { UserPlus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

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
    <div className="bg-white rounded-2xl p-6 my-8 overflow-hidden transition-colors duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Suggested for you</h3>
        <Link to="/search" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">See All</Link>
      </div>
      
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {suggestions.map((user) => (
          <div key={user.id} className="min-w-[180px] bg-gray-50 rounded-2xl p-4 flex flex-col items-center text-center relative group transition-all">
            <button 
              onClick={() => removeSuggestion(user.id)}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
            
            <Link to={`/profile/${user.id}`} className="mb-3">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-sm ring-2 ring-indigo-50">
                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
              </div>
            </Link>
            
            <Link to={`/profile/${user.id}`} className="block mb-1">
              <span className="text-sm font-bold text-gray-900 block truncate w-full">{user.username}</span>
              <span className="text-[10px] text-gray-500 block truncate w-full">{user.name}</span>
            </Link>
            
            <p className="text-[10px] text-gray-400 mb-4 h-6 line-clamp-2 leading-tight">{user.reason}</p>
            
            <button className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-100">
              <UserPlus className="w-3.5 h-3.5" />
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
