import { Home, Search, PlusSquare, Heart, User } from 'lucide-react';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <>
      {/* Mobile Header */}
      <header className="sm:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 text-center font-extrabold text-2xl tracking-tighter z-10">
        Nexus
      </header>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center sm:top-0 sm:bottom-auto sm:border-t-0 sm:border-r sm:w-64 sm:h-screen sm:flex-col sm:items-start sm:p-6">
        <h1 className="hidden sm:block text-3xl font-extrabold mb-8 w-full text-center tracking-tighter">Nexus</h1>
        <div className="flex justify-between w-full sm:flex-col sm:gap-6">
          <NavItem icon={<Home className="w-6 h-6" />} label="Home" to="/" />
          <NavItem icon={<Search className="w-6 h-6" />} label="Search" to="/search" />
          <NavItem icon={<PlusSquare className="w-6 h-6" />} label="Create" to="/create" />
          <NavItem icon={<Heart className="w-6 h-6" />} label="Notifications" to="/notifications" />
          <NavItem icon={<User className="w-6 h-6" />} label="Profile" to="/profile/test-user-id" />
        </div>
      </nav>
    </>
  );
}

function NavItem({ icon, label, to }: { icon: ReactNode; label: string; to: string }) {
  return (
    <Link to={to} className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-full sm:rounded-lg w-full transition-colors duration-200">
      {icon}
      <span className="hidden sm:inline font-medium">{label}</span>
    </Link>
  );
}
