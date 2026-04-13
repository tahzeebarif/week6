import React, { useState } from 'react';
import { Search, ShoppingCart, CircleUser, X, ChevronDown, LogOut, LayoutDashboard, Settings, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [showBanner, setShowBanner] = useState(true);
  const { user, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="w-full font-satoshi relative z-50">
      {/* Top Promotional Banner */}
      {showBanner && (
        <div className="bg-black text-white px-2 py-2 flex justify-center items-center relative text-[12px] sm:text-sm">
          <p className="m-0 text-center font-light leading-snug w-full">
            Sign up and get 20% off to your first order. 
            <Link to="/register" className="underline font-medium hover:text-gray-300 transition-colors ml-1 whitespace-nowrap">Sign Up Now</Link>
          </p>
          <button 
            className="absolute right-4 md:right-8 text-white hover:text-gray-300 transition-colors bg-transparent border-none cursor-pointer p-0 hidden md:flex items-center justify-center" 
            onClick={() => setShowBanner(false)}
            aria-label="Close banner"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between h-20 md:h-[96px] gap-6 lg:gap-10">
        
        {/* Left Section: Logo & Links */}
        <div className="flex items-center gap-4 lg:gap-10">
          <button className="lg:hidden text-black p-0 bg-transparent py-1 pe-1 border-none cursor-pointer flex items-center justify-center">
             <Menu size={24} strokeWidth={2} />
          </button>
          <Link to="/" className="font-integral font-black text-2xl md:text-[32px] tracking-tight text-black no-underline pb-1">
            SHOP.CO
          </Link>
          
          <ul className="hidden lg:flex items-center gap-6 m-0 p-0 list-none">
            <li>
              <Link to="/" className="text-black font-normal text-[16px] flex items-center gap-1 hover:text-gray-600 transition-colors no-underline">
                Shop <ChevronDown size={16} strokeWidth={2} />
              </Link>
            </li>
            <li>
              <Link to="/#on-sale" className="text-black font-normal text-[16px] hover:text-gray-600 transition-colors no-underline">
                On Sale
              </Link>
            </li>
            <li>
              <Link to="/#new-arrivals" className="text-black font-normal text-[16px] hover:text-gray-600 transition-colors no-underline">
                New Arrivals
              </Link>
            </li>
            <li>
              <Link to="/#brands" className="text-black font-normal text-[16px] hover:text-gray-600 transition-colors no-underline">
                Brands
              </Link>
            </li>

            {user && (
              <li>
                <Link to="/orders" className="text-black font-bold text-[16px] hover:text-gray-600 transition-colors no-underline uppercase tracking-tight">
                  My Orders
                </Link>
              </li>
            )}
            
            {/* Admin Links */}
            {(user?.role === 'admin' || user?.role === 'super-admin') && (
              <li>
                <Link to="/admin" className="text-indigo-600 font-bold text-[16px] flex items-center gap-1 hover:text-indigo-800 transition-colors no-underline uppercase">
                  <LayoutDashboard size={16} /> Admin
                </Link>
              </li>
            )}
            
            {/* Super Admin Links */}
            {user?.role === 'super-admin' && (
              <li>
                <Link to="/super-admin" className="text-red-600 font-bold text-[16px] flex items-center gap-1 hover:text-red-800 transition-colors no-underline uppercase">
                   <Settings size={16} /> Manage
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Middle Section: Search Bar */}
        <div className="hidden md:flex items-center bg-[#F0F0F0] rounded-[62px] px-4 py-3 flex-1 max-w-[577px]">
          <Search className="text-gray-500 min-w-max mr-2" size={20} strokeWidth={2} />
          <input 
            type="text" 
            placeholder="Search for products..." 
            className="bg-transparent border-none outline-none w-full text-[16px] text-black placeholder-gray-500 font-satoshi font-normal"
          />
        </div>

        {/* Right Section: Icons */}
        <div className="flex items-center gap-3.5 md:gap-4">
          {/* Mobile search icon */}
          <button aria-label="Search" className="md:hidden text-black hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer p-0 flex items-center justify-center">
             <Search size={24} strokeWidth={2} />
          </button>
          
          <Link to="/cart" aria-label="Cart" className="text-black hover:opacity-70 transition-opacity flex items-center justify-center relative">
            <ShoppingCart size={24} strokeWidth={2} />
            {totalItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {totalItemsCount}
              </span>
            )}
          </Link>
          
           {user ? (
            <div className="flex items-center gap-3 md:gap-4">

              <Link to="/profile" aria-label="Profile" className="text-black hover:opacity-70 transition-opacity flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-black/10" />
                ) : (
                  <CircleUser size={24} strokeWidth={2} />
                )}
              </Link>
              <button 
                onClick={handleLogout}
                aria-label="Logout" 
                className="text-black hover:text-red-600 transition-colors bg-transparent border-none cursor-pointer p-0 flex items-center justify-center"
              >
                <LogOut size={24} strokeWidth={2} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-black text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-black/90 transition-all">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
