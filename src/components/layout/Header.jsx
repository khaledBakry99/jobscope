import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  Settings,
  Search,
  Home,
  BookUser,
  Moon,
  Sun,
  Globe,
} from "lucide-react";
import useThemeStore from "../../store/themeStore";
import useTranslation from "../../hooks/useTranslation";
import NotificationBell from "../notifications/NotificationBell";
import NotificationDropdown from "../notifications/NotificationDropdown";

const Header = ({ user, onLogout }) => {
  const darkMode = useThemeStore((state) => state.darkMode);
  const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = !!user;
  const { t, isRTL } = useTranslation();

  // حالة إظهار/إخفاء قائمة الإشعارات
  const [showNotifications, setShowNotifications] = useState(false);

  // مرجع للقائمة المنسدلة وزر الإشعارات
  const notificationRef = useRef(null);

  // إضافة مستمع للنقرات خارج القائمة
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    // إضافة مستمع الأحداث عند ظهور القائمة
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // إزالة مستمع الأحداث عند إخفاء القائمة أو إزالة المكون
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  return (
    <header
      className={`${
        darkMode
          ? "bg-gray-900"
          : "bg-gradient-to-r from-indigo-700 to-blue-900"
      } text-white py-4 shadow-xl shadow-black/20 dark:shadow-black/40 relative z-[100] transition-colors duration-300`}
    >
      <style>{`
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
      `}</style>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center text-2xl font-bold relative group"
          >
            <div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                Job
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500">
                Scope
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
          <button
            onClick={toggleDarkMode}
            className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-full ${
              darkMode
                ? "bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30"
                : "bg-indigo-500/20 text-indigo-100 hover:bg-indigo-500/30"
            } transition-colors duration-200`}
            aria-label={darkMode ? t("lightMode") : t("darkMode")}
          >
            {darkMode ? (
              <>
                <Sun size={18} className="animate-spin-slow" />
                <span className="text-sm font-medium">{t("lightMode")}</span>
              </>
            ) : (
              <>
                <Moon size={18} className="animate-pulse" />
                <span className="text-sm font-medium">{t("darkMode")}</span>
              </>
            )}
          </button>
          {isLoggedIn ? (
            <>
              <Link
                to="/home"
                className={`flex items-center gap-1 transition-colors duration-200 ${
                  location.pathname === "/home"
                    ? "text-yellow-300 font-medium"
                    : "text-white hover:text-yellow-200"
                }`}
              >
                <Home size={18} />
                <span>{t("home")}</span>
              </Link>
              <Link
                to="/search"
                className={`flex items-center gap-1 transition-colors duration-200 ${
                  location.pathname === "/search"
                    ? "text-yellow-300 font-medium"
                    : "text-white hover:text-yellow-200"
                }`}
              >
                <Search size={18} />
                <span>{t("search")}</span>
              </Link>
              <Link
                to="/profile/my"
                className={`flex items-center gap-1 transition-colors duration-200 ${
                  location.pathname === "/profile/my"
                    ? "text-yellow-300 font-medium"
                    : "text-white hover:text-yellow-200"
                }`}
              >
                <User size={18} />
                <span>{t("profile")}</span>
              </Link>
              <Link
                to="/bookings"
                className={`flex items-center gap-1 transition-colors duration-200 ${
                  location.pathname === "/bookings"
                    ? "text-yellow-300 font-medium"
                    : "text-white hover:text-yellow-200"
                }`}
              >
                <BookUser size={18} />
                <span>{t("myRequests")}</span>
              </Link>
              <Link
                to="/settings"
                className={`flex items-center gap-1 transition-colors duration-200 ${
                  location.pathname === "/settings"
                    ? "text-yellow-300 font-medium"
                    : "text-white hover:text-yellow-200"
                }`}
              >
                <Settings size={18} />
                <span>{t("settings")}</span>
              </Link>

              {/* زر الإشعارات */}
              <div className="relative" ref={notificationRef}>
                <NotificationBell
                  onClick={() => setShowNotifications(!showNotifications)}
                />
                <NotificationDropdown
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                />
              </div>

              <button
                onClick={() => {
                  onLogout();
                  navigate("/logout-redirect");
                }}
                className="flex items-center gap-1 text-white hover:text-white transition-all duration-200 hover:scale-105 transform border border-transparent bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-3 py-2 rounded-md relative overflow-hidden group shadow-md hover:shadow-lg"
              >
                <span className="relative z-10 flex items-center gap-1">
                  <LogOut size={18} />
                  <span>{t("logout")}</span>
                </span>
                <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white px-4 py-2 rounded-md hover:from-indigo-600 hover:to-indigo-800 transition-all duration-200 hover:shadow-md relative overflow-hidden group"
                style={{ animation: "pulse 2s infinite" }}
              >
                <span className="relative text-white z-10">تسجيل الدخول</span>
                <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </Link>
              <Link
                to="/register/craftsman"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-md hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 hover:shadow-md relative overflow-hidden group"
                style={{ animation: "pulse 2s infinite" }}
              >
                <span className="relative text-white z-10">تسجيل كحرفي</span>
                <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </Link>
            </>
          )}
        </nav>

        <div className="md:hidden">
          {/* Mobile menu button - to be implemented */}
          <button className="text-white hover:text-yellow-300 transition-colors duration-200 p-2 rounded-md hover:bg-indigo-800/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
