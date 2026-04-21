import React from 'react';
import { Search, Bell, Mail, ChevronDown, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminHeader = ({ title, onMenuToggle }) => {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white border-b border-black/5 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3 md:gap-8 flex-1">
        <button 
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-gray-50 rounded-xl transition-all"
        >
          <Menu size={24} className="text-black" />
        </button>
        <h2 className="font-integral font-black text-lg md:text-xl uppercase tracking-tight text-black flex-shrink-0">
          {title}
        </h2>

        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-gray-50 border border-black/5 rounded-2xl px-4 py-2.5 max-w-md w-full group focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
          <Search size={18} className="text-black/30 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search for orders, products, or users..." 
            className="bg-transparent border-none outline-none w-full px-3 text-sm font-medium placeholder:text-black/30"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Actions */}
        <div className="hidden sm:flex items-center gap-1 border-r border-black/5 pr-4 mr-1">
            <button className="p-2.5 text-black/40 hover:text-black hover:bg-gray-100 rounded-xl transition-all relative">
                <Mail size={20} />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <button className="p-2.5 text-black/40 hover:text-black hover:bg-gray-100 rounded-xl transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-black border-2 border-white rounded-full"></span>
            </button>
        </div>

        {/* User Profile */}
        <button className="flex items-center gap-3 p-1.5 hover:bg-gray-50 rounded-2xl transition-all group">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-black font-black shadow-sm overflow-hidden border border-black/5">
            {user?.avatar ? (
                <img src={user.avatar} alt="Admin" className="w-full h-full object-cover" />
            ) : (
                user?.name?.charAt(0) || 'A'
            )}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-black uppercase text-black m-0 leading-none">{user?.name || 'Admin User'}</p>
            <p className="text-[10px] font-bold text-black/40 uppercase mt-1 leading-none">Super Administrator</p>
          </div>
          <ChevronDown size={14} className="text-black/30 group-hover:text-black transition-colors" />
        </button>

      </div>
    </header>
  );
};

export default AdminHeader;
