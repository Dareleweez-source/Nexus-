import { motion, AnimatePresence } from 'motion/react';
import { Settings, Bookmark, Activity, QrCode, LogOut, Moon, Sun, Info, X, ChevronRight, Shield, UserCircle } from 'lucide-react';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

interface MenuSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuSheet({ isOpen, onClose }: MenuSheetProps) {
  const navigate = useNavigate();

  const menuItems = [
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', description: 'Privacy, security, account', path: '/settings' },
    { icon: <Bookmark className="w-5 h-5" />, label: 'Saved', description: 'Posts you\'ve bookmarked', path: '/profile/test-user-id?tab=saved' },
    { icon: <Activity className="w-5 h-5" />, label: 'Your Activity', description: 'Time spent, interactions', path: '/activity' },
    { icon: <QrCode className="w-5 h-5" />, label: 'QR Code', description: 'Share your profile', path: '/qr' },
    { icon: <Shield className="w-5 h-5" />, label: 'Privacy Center', description: 'Manage your data', path: '/privacy' },
    { icon: <Info className="w-5 h-5" />, label: 'About', description: 'Version, terms, help', path: '/about' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-[70] max-h-[85vh] overflow-hidden flex flex-col shadow-2xl sm:max-w-md sm:left-auto sm:right-6 sm:bottom-6 sm:rounded-3xl sm:h-auto border-t"
          >
            {/* Handle */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 mb-2 sm:hidden" />

            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-50">
              <h2 className="text-xl font-black tracking-tighter">Menu</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
              {/* Profile Shortcut */}
              <button 
                onClick={() => { navigate('/profile/test-user-id'); onClose(); }}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
                  <UserCircle className="w-7 h-7" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">Nexus User</p>
                  <p className="text-xs text-gray-500">View and edit profile</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 ml-auto" />
              </button>

              <div className="h-px bg-gray-50 mx-4 my-2" />

              {/* Menu List */}
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => { navigate(item.path); onClose(); }}
                  className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-white group-hover:shadow-md transition-all">
                    {item.icon}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm text-gray-900">{item.label}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">{item.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:translate-x-1 transition-transform" />
                </button>
              ))}

              <div className="h-px bg-gray-50 mx-4 my-2" />

              {/* Logout */}
              <button className="w-full flex items-center gap-4 p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-colors mt-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <LogOut className="w-5 h-5" />
                </div>
                <p className="font-bold text-sm">Log Out</p>
              </button>
            </div>

            {/* Footer */}
            <div className="p-6 text-center border-t border-gray-50">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Nexus v1.0.4 • Beta</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
