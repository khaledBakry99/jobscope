import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";
import authService from "../services/authService";

const RegisterPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // التحقق مما إذا كان المستخدم مسجل الدخول بالفعل
    if (authService.isLoggedIn()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
