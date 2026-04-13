import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CircleUser, Award, LogOut, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-20 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 font-integral">Please Log In</h2>
        <button onClick={() => navigate('/login')} className="bg-black text-white px-8 py-3 rounded-full font-bold">
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-20 lg:py-24">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Sidebar/Info Section */}
        <div className="w-full md:w-1/3 bg-[#F0F0F0] rounded-[20px] p-6 lg:p-10 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center pb-6 border-b border-black/10">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-black/20 shadow-sm border border-black/5">
              <CircleUser size={48} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold font-satoshi mt-2">{user.name}</h2>
            <p className="text-black/60 font-satoshi text-sm">{user.email}</p>
          </div>

          <div className="bg-white rounded-[16px] p-6 flex items-center justify-between shadow-sm border border-black/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <Award className="text-indigo-600" size={20} strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-black/60 uppercase tracking-tight">Loyalty Points</span>
                <span className="text-2xl font-black font-integral text-indigo-600 leading-none mt-1">
                  {user.loyaltyPoints || 0}
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/orders')}
            className="w-full flex items-center justify-center gap-2 bg-black text-white py-4 rounded-full font-bold hover:bg-black/90 transition-all shadow-lg shadow-black/10"
          >
            <ShoppingBag size={18} strokeWidth={2} /> My Order History
          </button>

          <button 
            onClick={handleLogout}
            className="mt-2 w-full flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 py-3 rounded-full font-bold hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} strokeWidth={2} /> Sign Out
          </button>
        </div>

        {/* Details Section */}
        <div className="w-full md:w-2/3 flex flex-col gap-8">
          <div className="bg-white border border-black/10 rounded-[20px] p-6 lg:p-10">
            <h3 className="text-2xl font-bold font-integral uppercase mb-6">Account Details</h3>
            
            <div className="space-y-4 font-satoshi">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-black/50 font-medium uppercase">Full Name</span>
                <span className="text-lg font-bold text-black">{user.name}</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-sm text-black/50 font-medium uppercase">Email Address</span>
                <span className="text-lg font-bold text-black">{user.email}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm text-black/50 font-medium uppercase">Role</span>
                <span className="text-lg font-bold text-black capitalize">{user.role || 'User'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
