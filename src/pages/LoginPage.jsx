import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import authService from '../services/authService';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // التحقق مما إذا كان المستخدم مسجل الدخول بالفعل
    if (authService.isLoggedIn()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
      
        
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
