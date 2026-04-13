import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F2F0F1] px-4 font-satoshi">
      <div className="w-full max-w-md bg-white rounded-[20px] shadow-sm p-8 md:p-10">
        <h2 className="font-integral font-extrabold text-[32px] text-center mb-8 uppercase tracking-tight">
          JOIN SHOP.CO
        </h2>
        
        {error && (
          <p className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-black/60 text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#F0F0F0] rounded-full px-5 py-3.5 border-none outline-none focus:ring-2 focus:ring-black/5 transition-all"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-black/60 text-sm font-medium">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#F0F0F0] rounded-full px-5 py-3.5 border-none outline-none focus:ring-2 focus:ring-black/5 transition-all"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-black/60 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-[#F0F0F0] rounded-full px-5 py-3.5 border-none outline-none focus:ring-2 focus:ring-black/5 transition-all"
              placeholder="Create a password"
              required
            />
          </div>



          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-medium py-4 rounded-full mt-4 hover:bg-black/90 transition-all active:scale-95 shadow-lg shadow-black/10 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-8 text-black/60 text-sm">
          Already have an account? <Link to="/login" className="text-black font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
