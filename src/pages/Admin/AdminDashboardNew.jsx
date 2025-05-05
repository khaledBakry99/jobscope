import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Briefcase, Calendar, FileText, Settings } from "lucide-react";
import useAdminStore from "../../store/adminStore";
import useThemeStore from "../../store/themeStore";
import Layout from "../../components/layout/Layout";

// استيراد المكونات الجديدة
import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import UsersSection from "../../components/admin/sections/UsersSection";
import CraftsmenSection from "../../components/admin/sections/CraftsmenSection";
import BookingsSection from "../../components/admin/sections/BookingsSection";
import ContentSection from "../../components/admin/sections/ContentSection";
import SettingsSection from "../../components/admin/sections/SettingsSection";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { admin, isAuthenticated, logoutAdmin } = useAdminStore();
  const darkMode = useThemeStore((state) => state.darkMode);
  const [activeTab, setActiveTab] = useState("users");

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  // أقسام لوحة التحكم
  const dashboardSections = [
    {
      id: "users",
      label: "إدارة المستخدمين",
      icon: <Users size={20} />,
    },
    {
      id: "craftsmen",
      label: "إدارة الحرفيين",
      icon: <Briefcase size={20} />,
    },
    {
      id: "bookings",
      label: "إدارة الحجوزات",
      icon: <Calendar size={20} />,
    },
    {
      id: "content",
      label: "إدارة المحتوى",
      icon: <FileText size={20} />,
    },
    {
      id: "settings",
      label: "إعدادات النظام",
      icon: <Settings size={20} />,
    },
  ];

  // تسجيل الخروج
  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  // محتوى القسم النشط
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "users":
        return <UsersSection />;
      case "craftsmen":
        return <CraftsmenSection />;
      case "bookings":
        return <BookingsSection />;
      case "content":
        return <ContentSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return null;
    }
  };

  if (!isAuthenticated || !admin) {
    return null; // سيتم توجيه المستخدم إلى صفحة تسجيل الدخول بواسطة useEffect
  }

  return (
    <Layout hideHeader>
      <div
        className={`min-h-screen ${
          darkMode
            ? "bg-gray-900 text-gray-100"
            : "bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800"
        } transition-colors duration-300`}
      >
        {/* شريط العنوان */}
        <AdminHeader admin={admin} onLogout={handleLogout} />

        {/* المحتوى الرئيسي */}
        <div className="container mx-auto py-6 px-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* القائمة الجانبية */}
            <AdminSidebar 
              dashboardSections={dashboardSections} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />

            {/* المحتوى الرئيسي */}
            <motion.div
              className={`flex-1 ${
                darkMode
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-indigo-100"
              } rounded-lg shadow-md transition-colors duration-300 p-6`}
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderActiveTabContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
