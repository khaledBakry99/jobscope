import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Layout from "../../components/layout/Layout";
import useAdminStore from "../../store/adminStore";
import useThemeStore from "../../store/themeStore";
import authService from "../../services/authService";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { error, resetError } = useAdminStore();
  const darkMode = useThemeStore((state) => state.darkMode);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});

  // إذا كان الأدمن مسجل دخوله بالفعل، انتقل إلى لوحة التحكم
  useEffect(() => {
    // التحقق من حالة تسجيل الدخول باستخدام خدمة المصادقة
    if (authService.isAdminLoggedIn()) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  // إعادة تعيين رسالة الخطأ عند تحميل الصفحة
  useEffect(() => {
    resetError();
  }, [resetError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // مسح الخطأ عندما يكتب المستخدم
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // التحقق من اسم المستخدم
    if (!formData.username) {
      newErrors.username = "اسم المستخدم مطلوب";
      isValid = false;
    }

    // التحقق من كلمة المرور
    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // استخدام خدمة المصادقة للاتصال بالواجهة الخلفية
        await authService.adminLogin({
          username: formData.username,
          password: formData.password,
          rememberMe
        });
        navigate("/admin/dashboard");
      } catch (error) {
        // عرض رسالة الخطأ
        setErrors({ general: error.message || "حدث خطأ أثناء تسجيل الدخول" });
      }
    }
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  return (
    <Layout hideFooter hideHeader>
      <div
        className={`min-h-screen py-12 ${
          darkMode
            ? "bg-gray-900"
            : "bg-gradient-to-br from-blue-50 to-indigo-100"
        } transition-colors duration-300`}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
            }
          }
        ` }} />
        <div className="container mx-auto px-4">
          <motion.div
            className={`max-w-lg mx-auto rounded-lg shadow-xl overflow-hidden border-2 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-indigo-200"
            } transition-colors duration-300`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="p-6">
              <h2
                className={`text-2xl font-bold text-center mb-4 ${
                  darkMode ? "text-indigo-300" : "text-indigo-800"
                } relative transition-colors duration-300`}
              >
                <span className="relative z-10">لوحة إدارة JobScope</span>
                <span
                  className={`absolute bottom-0 left-0 right-0 h-3 ${
                    darkMode ? "bg-indigo-500" : "bg-indigo-300"
                  } opacity-40 transform -rotate-1 z-0`}
                ></span>
              </h2>
              <p
                className={`text-center mb-6 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                تسجيل الدخول إلى لوحة التحكم
              </p>

              {(error || errors.general) && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error || errors.general}
                </div>
              )}

              <form onSubmit={handleLogin}>
                <Input
                  label="اسم المستخدم"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="أدخل اسم المستخدم"
                  error={errors.username}
                  required
                  className="text-base py-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mb-3"
                />

                <Input
                  label="كلمة المرور"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="أدخل كلمة المرور"
                  error={errors.password}
                  required
                  className="text-base py-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />

                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                    className={`h-4 w-4 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-indigo-500"
                        : "bg-white border-indigo-300 text-indigo-600"
                    } rounded focus:ring-indigo-500 focus:ring-offset-0`}
                  />
                  <label
                    htmlFor="rememberMe"
                    className={`mr-2 text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    تذكرني
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  className={`mt-4 ${
                    darkMode
                      ? "bg-gradient-to-r from-[#3730A3] to-[#4238C8] hover:from-[#322e92] hover:to-[#3b32b4]"
                      : "bg-gradient-to-r from-[#4238C8] to-[#3730A3] hover:from-[#3b32b4] hover:to-[#322e92]"
                  } text-white transition-all duration-200 shadow-md hover:shadow-lg text-base py-2 relative overflow-hidden group`}
                  style={{ animation: "pulse 2s infinite" }}
                >
                  <span className="relative z-10">تسجيل الدخول</span>
                  <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  هذه الصفحة مخصصة لمديري النظام فقط
                </p>
                <Link
                  to="/"
                  className={`mt-2 inline-block text-sm ${
                    darkMode ? "text-indigo-400" : "text-indigo-600"
                  } hover:underline`}
                >
                  العودة إلى الصفحة الرئيسية
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLogin;
