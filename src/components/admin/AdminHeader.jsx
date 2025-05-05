import React from "react";
import { Link } from "react-router-dom";
import { LogOut, Home, Moon, Sun } from "lucide-react";
import Button from "../common/Button";
import useThemeStore from "../../store/themeStore";

const AdminHeader = ({ admin, onLogout }) => {
  const darkMode = useThemeStore((state) => state.darkMode);
  const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);

  return (
    <div
      className={`py-4 px-6 ${
        darkMode
          ? "bg-gray-800 border-b border-gray-700"
          : "bg-gradient-to-r from-indigo-900 to-blue-900 text-white"
      } shadow-md transition-colors duration-300`}
    >
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold ml-2">لوحة تحكم </h1>
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
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white/10 rounded-full px-3 py-1">
              <img
                src={admin.image}
                alt={admin.name}
                className="w-8 h-8 rounded-full border-2 border-indigo-300 ml-2"
              />
              <span className="font-medium">{admin.name}</span>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                darkMode
                  ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                  : "bg-indigo-800 text-yellow-300 hover:bg-indigo-700"
              } transition-colors duration-200 flex items-center justify-center`}
              aria-label={darkMode ? "تفعيل الوضع الفاتح" : "تفعيل الوضع المظلم"}
            >
              {darkMode ? (
                <Sun size={18} className="text-yellow-300" />
              ) : (
                <Moon size={18} className="text-yellow-300" />
              )}
            </button>
            <Button
              variant="primary"
              className="flex items-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all duration-200 shadow-md hover:shadow-lg relative overflow-hidden group"
              onClick={onLogout}
            >
              <span className="relative z-10 flex items-center">
                <LogOut size={16} className="ml-2" />
                تسجيل الخروج
              </span>
              <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            </Button>
            <Link to="/">
              <Button
                className={`${
                  darkMode
                    ? "bg-gradient-to-r from-[#3730A3] to-[#4238C8] hover:from-[#322e92] hover:to-[#3b32b4]"
                    : "bg-gradient-to-r from-[#4238C8] to-[#3730A3] hover:from-[#3b32b6] hover:to-[#322e92]"
                } text-white transition-all duration-200 shadow-md hover:shadow-lg relative overflow-hidden group`}
              >
                <span className="relative z-10 flex items-center">
                  <Home size={16} className="ml-2" />
                  الرئيسية
                </span>
                <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
