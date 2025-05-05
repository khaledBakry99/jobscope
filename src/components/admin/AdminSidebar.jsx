import React from "react";
import { User, Edit } from "lucide-react";
import useThemeStore from "../../store/themeStore";

const AdminSidebar = ({
  dashboardSections,
  activeTab,
  setActiveTab,
  admin,
}) => {
  const darkMode = useThemeStore((state) => state.darkMode);

  return (
    <div
      className={`w-full md:w-64 ${
        darkMode
          ? "bg-gradient-to-br from-gray-800 to-indigo-900/90 border border-gray-700"
          : "bg-gradient-to-br from-indigo-50/90 to-indigo-200/80 border border-indigo-200"
      } rounded-lg shadow-md transition-colors duration-300 p-4`}
    >
      {/* قسم الملف الشخصي */}
      <div
        className={`mb-6 p-4 rounded-lg ${
          darkMode
            ? "bg-gradient-to-r from-indigo-900/30 to-indigo-800/30"
            : "bg-gradient-to-r from-white/80 to-indigo-100/60"
        } border ${darkMode ? "border-indigo-800/50" : "border-indigo-200"}`}
      >
        <div className="flex flex-col items-center text-center">
          <img
            src={admin?.image}
            alt={admin?.name}
            className="w-20 h-20 rounded-full border-2 border-indigo-300 mb-2"
          />
          <h3
            className={`font-bold text-lg ${
              darkMode ? "text-white" : "text-indigo-800"
            }`}
          >
            {admin?.name}
          </h3>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-300" : "text-gray-600"
            } mb-3`}
          >
            {admin?.email || "admin@jobscope.com"}
          </p>

          <button
            className={`w-full flex items-center justify-center p-2 rounded-md text-sm ${
              darkMode
                ? "bg-gradient-to-r from-[#3730A3]/80 to-[#4238C8]/80 text-white hover:from-[#322e92]/80 hover:to-[#3b32b4]/80 border border-indigo-800"
                : "bg-gradient-to-r from-[#4238C8]/90 to-[#3730A3]/90 text-white hover:from-[#3b32b4]/90 hover:to-[#322e92]/90 border border-indigo-300"
            } transition-colors duration-200 mb-2 relative overflow-hidden group`}
            onClick={() => setActiveTab("profile")}
          >
            <span className="relative z-10 flex items-center justify-center">
              <User size={16} className="ml-2" />
              عرض الملف الشخصي
            </span>
            <span className="absolute inset-0 bg-white opacity-10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
          </button>

          <button
            className={`w-full flex items-center justify-center p-2 rounded-md text-sm ${
              darkMode
                ? "bg-gradient-to-r from-[#3730A3]/80 to-[#4238C8]/80 text-white hover:from-[#322e92]/80 hover:to-[#3b32b4]/80 border border-indigo-800"
                : "bg-gradient-to-r from-[#4238C8]/90 to-[#3730A3]/90 text-white hover:from-[#3b32b4]/90 hover:to-[#322e92]/90 border border-indigo-300"
            } transition-colors duration-200 relative overflow-hidden group`}
            onClick={() => setActiveTab("edit-profile")}
          >
            <span className="relative z-10 flex items-center justify-center">
              <Edit size={16} className="ml-2" />
              تعديل البيانات
            </span>
            <span className="absolute inset-0 bg-white opacity-10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
          </button>
        </div>
      </div>

      <h2
        className={`text-lg font-bold mb-4 ${
          darkMode ? "text-indigo-300" : "text-indigo-700"
        }`}
      >
        القائمة الرئيسية
      </h2>
      <nav>
        <ul className="space-y-2">
          {dashboardSections.map((section) => (
            <li key={section.id}>
              <button
                className={`w-full flex items-center p-3 rounded-md transition-colors duration-200 ${
                  activeTab === section.id
                    ? darkMode
                      ? "bg-gradient-to-r from-[#3730A3]/80 to-[#4238C8]/80 text-white border border-indigo-700"
                      : "bg-gradient-to-r from-[#4238C8]/90 to-[#3730A3]/90 text-white border border-indigo-300"
                    : darkMode
                    ? "text-gray-300 hover:bg-gray-700/70"
                    : "text-gray-700 hover:bg-indigo-50/50"
                } relative overflow-hidden group`}
                onClick={() => setActiveTab(section.id)}
              >
                <span className="relative z-10 flex items-center">
                  <span className="ml-3">{section.icon}</span>
                  {section.label}
                </span>
                {activeTab === section.id && (
                  <span className="absolute inset-0 bg-white opacity-10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
