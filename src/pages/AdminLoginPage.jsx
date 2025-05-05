import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLoginForm from '../components/auth/AdminLoginForm';
import authService from '../services/authService';

const AdminLoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // التحقق مما إذا كان المدير مسجل الدخول بالفعل
    if (authService.isAdminLoggedIn()) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
      
        
        <AdminLoginForm />
      </div>
    </div>
  );
};

export default AdminLoginPage;
