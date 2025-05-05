import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import authService from "../../services/authService";

// مكون لحماية مسارات الأدمن
const AdminProtectedRoute = () => {
  // التحقق مما إذا كان المدير مسجل الدخول
  const isAuthenticated = authService.isAdminLoggedIn();

  // إذا لم يكن المدير مسجل دخوله، قم بتوجيهه إلى صفحة تسجيل دخول المدير
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // إذا كان المدير مسجل دخوله، اعرض المحتوى المحمي
  return <Outlet />;
};

export default AdminProtectedRoute;
