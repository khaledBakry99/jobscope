import React from "react";
import Button from "../../common/Button";
import useThemeStore from "../../../store/themeStore";

const ContentSection = () => {
  const darkMode = useThemeStore((state) => state.darkMode);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3
          className={`text-xl font-bold ${
            darkMode ? "text-indigo-300" : "text-indigo-800"
          } relative`}
        >
          <span className="relative z-10">إدارة المحتوى</span>
          <span
            className={`absolute bottom-0 left-0 right-0 h-2 ${
              darkMode ? "bg-indigo-500" : "bg-indigo-300"
            } opacity-40 transform -rotate-1 z-0`}
          ></span>
        </h3>
        <Button
          variant="primary"
          className={`${
            darkMode
              ? "bg-gradient-to-r from-[#3730A3] to-[#4238C8] hover:from-[#322e92] hover:to-[#3b32b4]"
              : "bg-gradient-to-r from-[#4238C8] to-[#3730A3] hover:from-[#3b32b4] hover:to-[#322e92]"
          } text-white transition-all duration-200 shadow-md hover:shadow-lg relative overflow-hidden group`}
        >
          <span className="relative z-10">إضافة محتوى جديد</span>
          <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div
          className={`p-4 rounded-lg ${
            darkMode
              ? "bg-gray-700"
              : "bg-gradient-to-br from-white to-indigo-100/40"
          } border ${
            darkMode ? "border-gray-600" : "border-indigo-200"
          } shadow-md`}
        >
          <h4
            className={`font-bold mb-3 ${
              darkMode ? "text-indigo-300" : "text-indigo-700"
            }`}
          >
            الإعلانات
          </h4>
          <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            إدارة الإعلانات والعروض الخاصة على المنصة.
          </p>
          <Button
            variant="primary"
            className={`${
              darkMode
                ? "bg-gradient-to-r from-[#3730A3] to-[#4238C8] hover:from-[#322e92] hover:to-[#3b32b4]"
                : "bg-gradient-to-r from-[#4238C8] to-[#3730A3] hover:from-[#3b32b4] hover:to-[#322e92]"
            } text-white transition-all duration-200 shadow-sm hover:shadow-md relative overflow-hidden group`}
          >
            <span className="relative z-10">إدارة الإعلانات</span>
            <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
          </Button>
        </div>

        <div
          className={`p-4 rounded-lg ${
            darkMode
              ? "bg-gray-700"
              : "bg-gradient-to-br from-white to-indigo-100/40"
          } border ${
            darkMode ? "border-gray-600" : "border-indigo-200"
          } shadow-md`}
        >
          <h4
            className={`font-bold mb-3 ${
              darkMode ? "text-indigo-300" : "text-indigo-700"
            }`}
          >
            الأسئلة الشائعة
          </h4>
          <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            إدارة الأسئلة الشائعة والمساعدة للمستخدمين.
          </p>
          <Button
            variant="primary"
            className={`${
              darkMode
                ? "bg-gradient-to-r from-[#3730A3] to-[#4238C8] hover:from-[#322e92] hover:to-[#3b32b4]"
                : "bg-gradient-to-r from-[#4238C8] to-[#3730A3] hover:from-[#3b32b4] hover:to-[#322e92]"
            } text-white transition-all duration-200 shadow-sm hover:shadow-md relative overflow-hidden group`}
          >
            <span className="relative z-10">إدارة الأسئلة الشائعة</span>
            <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
          </Button>
        </div>
      </div>

      <div
        className={`p-4 rounded-lg ${
          darkMode
            ? "bg-gray-700"
            : "bg-gradient-to-br from-white to-indigo-100/40"
        } border ${
          darkMode ? "border-gray-600" : "border-indigo-200"
        } shadow-md`}
      >
        <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          هنا يمكنك إدارة محتوى الموقع والإعلانات والعروض.
        </p>
        <div
          className={`p-4 rounded-lg ${
            darkMode
              ? "bg-indigo-900/30 border border-indigo-800"
              : "bg-gradient-to-r from-indigo-50/70 to-indigo-100/50 border border-indigo-200"
          }`}
        >
          <p className={`${darkMode ? "text-indigo-300" : "text-indigo-700"}`}>
            هذا القسم قيد التطوير. سيتم إضافة وظائف إدارة المحتوى قريبًا.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContentSection;
