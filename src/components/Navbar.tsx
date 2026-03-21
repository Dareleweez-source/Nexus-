import { Home, Search, PlusSquare, Heart, User, ShoppingBag, Send, Play } from 'lucide-react';
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import StoriesBar from './StoriesBar';

export default function Navbar() {
  const location = useLocation();
  const isReelsPage = location.pathname.startsWith('/reels');
  const isMessagesPage = location.pathname.startsWith('/messages');
  const isChatPage = /^\/messages\/.+/.test(location.pathname);

  if (isReelsPage) return null;

  return (
    <>
      {/* Header */}
      {!isMessagesPage && (
        <header className={`fixed top-0 left-0 right-0 bg-white px-4 h-16 flex justify-between items-center z-20 sm:left-64 ${location.pathname !== '/' ? 'border-b border-gray-200' : ''}`}>
            <h1 className="sm:hidden text-2xl font-extrabold tracking-tighter">Nexus</h1>
            <div className="hidden sm:block"></div> {/* Spacer for desktop */}
            <div className="flex items-center gap-2">
              <Link to="/search" className="p-2 hover:bg-gray-100 rounded-2xl transition-colors flex items-center justify-center">
                <Search className="w-6 h-6 text-gray-700" />
              </Link>
              <Link to="/shop" className="p-2 hover:bg-gray-100 rounded-2xl transition-colors flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-gray-700" />
              </Link>
              <Link to="/profile/test-user-id" className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-2xl transition-colors group">
                <div className="w-8 h-8 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-200 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <span className="hidden sm:inline text-sm font-bold text-gray-700 pr-2">Profile</span>
              </Link>
            </div>
        </header>
      )}
      
      {location.pathname === '/' && !isMessagesPage && (
        <div className="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 z-20 sm:left-64 overflow-x-auto no-scrollbar">
          <StoriesBar />
        </div>
      )}

      <nav className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center sm:top-0 sm:bottom-auto sm:border-t-0 sm:border-r sm:w-64 sm:h-screen sm:flex-col sm:items-start sm:p-6 z-10 ${isChatPage ? 'hidden sm:flex' : 'flex'}`}>
        <h1 className="hidden sm:block text-3xl font-extrabold mb-8 w-full text-center tracking-tighter">Nexus</h1>
        <div className="flex justify-between w-full sm:flex-col sm:gap-6">
          <NavItem icon={<Home className="w-6 h-6" />} label="Home" to="/" />
          <NavItem icon={<Play className="w-6 h-6" />} label="Reels" to="/reels" />
          <NavItem icon={<PlusSquare className="w-6 h-6" />} label="Create" to="/create" />
          <NavItem icon={<Send className="w-6 h-6" />} label="Messages" to="/messages" />
          <NavItem icon={<Heart className="w-6 h-6" />} label="Notifications" to="/notifications" />
        </div>
      </nav>
    </>
  );
}

function NavItem({ icon, label, to }: { icon: ReactNode; label: string; to: string }) {
  return (
    <Link to={to} className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-2xl sm:rounded-lg w-full transition-colors duration-200">
      {icon}
      <span className="hidden sm:inline font-medium">{label}</span>
    </Link>
  );
}
