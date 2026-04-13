import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      // We use window.location.href to home to force a full context reload 
      // which will trigger AuthProvider to fetch the new user data.
      window.location.href = '/';
    } else {
      navigate('/login');
    }
  }, [location, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] font-satoshi">
      <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
      <h2 className="text-2xl font-integral font-bold uppercase tracking-tight">Authenticating...</h2>
      <p className="text-black/60 mt-2">Please wait while we complete your secure login.</p>
    </div>
  );
};

export default LoginSuccess;
