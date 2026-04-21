import React from 'react';
import { 
  BarChart3, 
  ShoppingBag, 
  ShoppingCart, 
  Users, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  LogOut,
  HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminSidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={20} /> },
    { id: 'products', label: 'All Products', icon: <ShoppingBag size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart size={20} /> },
    { id: 'customers', label: 'Customers', icon: <Users size={20} /> },
  ];

  const bottomItems = [
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
    { id: 'help', label: 'Help Center', icon: <HelpCircle size={20} /> },
  ];

  const handleTabClick = (id) => {
    setActiveTab(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden transition-all duration-300 ${sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />

      <div 
        className={`fixed top-0 left-0 h-screen bg-white text-black border-r border-black/5 transition-all duration-300 z-[70] flex flex-col shadow-2xl lg:shadow-none ${
          sidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-black/5 overflow-hidden flex-shrink-0">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'lg:hidden'}`}>
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-black/30">
              S
            </div>
            <span className="font-integral font-black text-xl tracking-tighter uppercase">SHOP.CO</span>
          </div>
          {!sidebarOpen && (
            <div className="hidden lg:flex w-8 h-8 bg-black rounded-lg items-center justify-center font-bold text-white shadow-lg shadow-black/30 mx-auto">
              S
            </div>
          )}
          {/* Close button for mobile */}
          <button onClick={onClose} className="lg:hidden p-1 hover:bg-gray-50 rounded-lg">
             <ChevronLeft size={20} />
          </button>
        </div>

        {/* Toggle Button (Desktop only) */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:block absolute -right-3 top-24 bg-white text-black border border-black/5 p-1 rounded-full shadow-md hover:bg-gray-50 transition-colors z-[80]"
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Navigation */}
        <div className="flex-1 py-10 px-4 space-y-2 overflow-y-auto no-scrollbar">
          <p className={`text-[10px] font-black text-black/30 uppercase tracking-[0.2em] px-2 mb-4 whitespace-nowrap ${!sidebarOpen && 'lg:opacity-0'}`}>
            Main Menu
          </p>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group ${
                activeTab === item.id 
                ? 'bg-black text-white shadow-xl shadow-black/10' 
                : 'text-black/40 hover:bg-gray-100/50 hover:text-black'
              }`}
            >
              <span className={`${activeTab === item.id ? 'text-white' : 'group-hover:text-black'}`}>
                {item.icon}
              </span>
              <span className={`font-black text-[11px] uppercase tracking-widest transition-opacity whitespace-nowrap ${!sidebarOpen ? 'lg:opacity-0 lg:w-0' : 'opacity-100'}`}>
                {item.label}
              </span>
              {activeTab === item.id && sidebarOpen && (
                  <div className="ml-auto w-1 h-1 bg-white/50 rounded-full"></div>
              )}
            </button>
          ))}

          <div className="pt-10">
            <p className={`text-[10px] font-black text-black/30 uppercase tracking-[0.2em] px-2 mb-4 whitespace-nowrap ${!sidebarOpen && 'lg:opacity-0'}`}>
              Configuration
            </p>
            {bottomItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group ${
                  activeTab === item.id 
                  ? 'bg-black text-white' 
                  : 'text-black/40 hover:bg-gray-100/50 hover:text-black'
                }`}
              >
                <span className={`${activeTab === item.id ? 'text-white' : 'group-hover:text-black'}`}>
                  {item.icon}
                </span>
                <span className={`font-black text-[11px] uppercase tracking-widest transition-opacity whitespace-nowrap ${!sidebarOpen ? 'lg:opacity-0 lg:w-0' : 'opacity-100'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-black/5 flex-shrink-0">
          <button className="w-full flex items-center gap-3 px-2 py-3 rounded-2xl hover:bg-red-50 text-black/40 hover:text-red-500 transition-all group font-black text-[11px] uppercase tracking-widest">
            <LogOut size={20} />
            <span className={`transition-opacity whitespace-nowrap ${!sidebarOpen ? 'lg:opacity-0 lg:w-0' : 'opacity-100'}`}>
              Sign Out
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
