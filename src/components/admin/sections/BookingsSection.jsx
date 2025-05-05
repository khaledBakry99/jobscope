import React from "react";
import useThemeStore from "../../../store/themeStore";

const BookingsSection = () => {
  const darkMode = useThemeStore((state) => state.darkMode);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-xl font-bold ${darkMode ? "text-indigo-300" : "text-indigo-800"} relative`}>
          <span className="relative z-10">إدارة الحجوزات</span>
          <span className={`absolute bottom-0 left-0 right-0 h-2 ${darkMode ? "bg-indigo-500" : "bg-indigo-300"} opacity-40 transform -rotate-1 z-0`}></span>
        </h3>
      </div>
      
      <div className={`mb-6 p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-indigo-50"}`}>
        <div className="flex justify-between items-center mb-4">
          <h4 className={`font-bold ${darkMode ? "text-white" : "text-indigo-700"}`}>إحصائيات الحجوزات</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
            <p className="text-gray-500 text-sm mb-1">إجمالي الحجوزات</p>
            <p className={`text-2xl font-bold ${darkMode ? "text-indigo-300" : "text-indigo-600"}`}>5,247</p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
            <p className="text-gray-500 text-sm mb-1">حجوزات قيد الانتظار</p>
            <p className={`text-2xl font-bold ${darkMode ? "text-yellow-300" : "text-yellow-600"}`}>124</p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
            <p className="text-gray-500 text-sm mb-1">حجوزات مكتملة</p>
            <p className={`text-2xl font-bold ${darkMode ? "text-green-300" : "text-green-600"}`}>4,892</p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
            <p className="text-gray-500 text-sm mb-1">حجوزات ملغاة</p>
            <p className={`text-2xl font-bold ${darkMode ? "text-red-300" : "text-red-600"}`}>231</p>
          </div>
        </div>
      </div>
      
      <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} border ${darkMode ? "border-gray-600" : "border-gray-200"}`}>
        <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          هنا يمكنك مراقبة وإدارة الحجوزات والطلبات في النظام.
        </p>
        <div className={`p-4 rounded-lg ${darkMode ? "bg-indigo-900/30 border border-indigo-800" : "bg-indigo-50 border border-indigo-100"}`}>
          <p className={`${darkMode ? "text-indigo-300" : "text-indigo-700"}`}>
            هذا القسم قيد التطوير. سيتم إضافة وظائف إدارة الحجوزات قريبًا.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingsSection;
