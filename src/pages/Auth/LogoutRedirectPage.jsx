import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../../components/layout/Layout";
import Button from "../../components/common/Button";
import useThemeStore from "../../store/themeStore";
import useUserStore from "../../store/userStore";
import authService from "../../services/authService";

const LogoutRedirectPage = () => {
  const navigate = useNavigate();
  const darkMode = useThemeStore((state) => state.darkMode);
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // التأكد من تسجيل الخروج بشكل كامل
    if (user) {
      logout();
      console.log("تم تسجيل الخروج من المتجر في صفحة تسجيل الخروج");
    }

    // التأكد من حذف البيانات من localStorage
    if (authService.isLoggedIn()) {
      authService.logout();
      console.log("تم تسجيل الخروج من authService");
    }

    // تنظيف إضافي للبيانات المخزنة محليًا
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("tokenExpiry");

    // تنظيف أي بيانات أخرى قد تكون مخزنة
    sessionStorage.clear();

    // إعادة تعيين حالة المتصفح لضمان تحديث جميع المكونات
    setTimeout(() => {
      console.log("تم تنظيف البيانات بنجاح");
    }, 100);
  }, [user, logout]);

  return (
    <Layout user={null} onLogout={() => {}}>
      <div
        className={`min-h-screen ${
          darkMode
            ? "bg-gray-900"
            : "bg-gradient-to-br from-blue-50 to-indigo-100"
        } py-20 transition-colors duration-300`}
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
            className={`max-w-xl mx-auto rounded-lg shadow-xl overflow-hidden border-2 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-indigo-200"
            } transition-colors duration-300`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="p-8">
              <h2
                className={`text-3xl font-bold text-center mb-8 ${
                  darkMode ? "text-indigo-300" : "text-indigo-800"
                } relative transition-colors duration-300`}
              >
                <span className="relative z-10">يرجى تسجيل الدخول</span>
                <span
                  className={`absolute bottom-0 left-0 right-0 h-2 ${
                    darkMode ? "bg-indigo-500" : "bg-indigo-300"
                  } opacity-40 transform -rotate-1 z-0`}
                ></span>
              </h2>
              <p
                className={`text-center mb-8 text-lg ${
                  darkMode ? "text-indigo-400" : "text-indigo-600"
                } transition-colors duration-300`}
              >
                يرجى تسجيل الدخول للوصول إلى هذه الصفحة
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  variant="primary"
                  onClick={() => navigate("/login")}
                  className={`text-white transition-all duration-200 shadow-md hover:shadow-lg w-full text-lg py-3 relative overflow-hidden group ${
                    darkMode
                      ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                      : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                  }`}
                  style={{ animation: "pulse 2s infinite" }}
                >
                  <span className="relative z-10 font-bold text-white">
                    تسجيل الدخول
                  </span>
                  <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className={`transition-all duration-200 shadow-sm hover:shadow-md w-full text-lg py-3 relative overflow-hidden group ${
                    darkMode
                      ? "border-gray-700 text-indigo-300 hover:bg-gray-700"
                      : "border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                  }`}
                >
                  <span className="relative z-10 font-bold">
                    العودة إلى الصفحة الرئيسية
                  </span>
                  <span
                    className={`absolute inset-0 ${
                      darkMode ? "bg-gray-600" : "bg-indigo-50"
                    } opacity-0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full group-hover:opacity-100 transition-all duration-700`}
                  ></span>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default LogoutRedirectPage;
