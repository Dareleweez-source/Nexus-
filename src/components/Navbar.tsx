import { Home, Search, PlusSquare, Heart, User, ShoppingBag, Send, Play } from 'lucide-react';
import { ReactNode, useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import StoriesBar from './StoriesBar';
import MenuSheet from './MenuSheet';

export default function Navbar() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  
  const triggerRefresh = useStore((state) => state.triggerRefresh);
  
  const isReelsPage = location.pathname.startsWith('/reels');
  const isMessagesPage = location.pathname.startsWith('/messages');
  const isChatPage = /^\/messages\/.+/.test(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Hide header when scrolling down
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsVisible(false);
      }
      // We don't automatically show it when scrolling up anymore
      // as per user request: "can only be seen when a user tap home icon"
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isReelsPage) return null;

  return (
    <>
      {/* Header */}
      {!isMessagesPage && (
        <header 
          className={`fixed top-0 left-0 right-0 bg-white px-4 h-16 flex justify-between items-center z-20 sm:left-64 transition-transform duration-300 ${
            isVisible ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
            <h1 className="sm:hidden text-2xl font-extrabold tracking-tighter">Nexus</h1>
            <div className="hidden sm:block"></div> {/* Spacer for desktop */}
            <div className="flex items-center gap-2">
              <Link to="/search" className="p-2 hover:bg-gray-100 rounded-2xl transition-colors flex items-center justify-center">
                <Search className="w-6 h-6 text-gray-700" />
              </Link>
              <Link to="/shop" className="p-2 hover:bg-gray-100 rounded-2xl transition-colors flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-gray-700" />
              </Link>
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-2xl transition-colors group"
              >
                <div className="w-8 h-8 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-200 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <span className="hidden sm:inline text-sm font-bold text-gray-700 pr-2">Profile</span>
              </button>
            </div>
        </header>
      )}
      
      {location.pathname === '/' && !isMessagesPage && (
        <div 
          className={`fixed top-16 left-0 right-0 bg-white z-20 sm:left-64 overflow-x-auto no-scrollbar transition-transform duration-300 ${
            isVisible ? 'translate-y-0' : '-translate-y-[150%]'
          }`}
        >
          <StoriesBar />
        </div>
      )}

      <nav className={`fixed bottom-0 left-0 right-0 bg-white p-4 flex justify-between items-center sm:top-0 sm:bottom-auto sm:border-t-0 sm:border-r sm:border-gray-100 sm:w-64 sm:h-screen sm:flex-col sm:items-start sm:p-6 z-10 ${isChatPage ? 'hidden sm:flex' : 'flex'}`}>
        <h1 className="hidden sm:block text-3xl font-extrabold mb-8 w-full text-center tracking-tighter">Nexus</h1>
        <div className="flex justify-between w-full sm:flex-1 sm:flex sm:flex-col sm:gap-6">
          <NavItem 
            icon={<Home className="w-6 h-6" />} 
            label="Home" 
            to="/" 
            onClick={() => {
              setIsVisible(true);
              triggerRefresh();
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          />
          <NavItem icon={<Play className="w-6 h-6" />} label="Reels" to="/reels" />
          <NavItem icon={<PlusSquare className="w-6 h-6" />} label="Create" to="/create" />
          <NavItem icon={<Send className="w-6 h-6" />} label="Messages" to="/messages" />
          <NavItem icon={<Heart className="w-6 h-6" />} label="Notifications" to="/notifications" />
        </div>
      </nav>

      <MenuSheet isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}

function NavItem({ icon, label, to, onClick }: { icon: ReactNode; label: string; to: string; onClick?: (e: any) => void }) {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-2xl sm:rounded-lg w-full transition-colors duration-200"
    >
      {icon}
      <span className="hidden sm:inline font-medium">{label}</span>
    </Link>
  );
}
