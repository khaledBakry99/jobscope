import React from "react";
import Button from "../../common/Button";
import useThemeStore from "../../../store/themeStore";

const UsersSection = () => {
  const darkMode = useThemeStore((state) => state.darkMode);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-xl font-bold ${darkMode ? "text-indigo-300" : "text-indigo-800"} relative`}>
          <span className="relative z-10">إدارة المستخدمين</span>
          <span className={`absolute bottom-0 left-0 right-0 h-2 ${darkMode ? "bg-indigo-500" : "bg-indigo-300"} opacity-40 transform -rotate-1 z-0`}></span>
        </h3>
        <Button 
          variant="primary"
          className={`${
            darkMode
              ? "bg-gradient-to-r from-[#3730A3] to-[#4238C8] hover:from-[#322e92] hover:to-[#3b32b4]"
              : "bg-gradient-to-r from-[#4238C8] to-[#3730A3] hover:from-[#3b32b4] hover:to-[#322e92]"
          } text-white transition-all duration-200 shadow-md hover:shadow-lg relative overflow-hidden group`}
        >
          <span className="relative z-10">إضافة مستخدم جديد</span>
          <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
        </Button>
      </div>
      
      <div className={`mb-6 p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gradient-to-r from-indigo-50 to-blue-50"} border ${darkMode ? "border-gray-600" : "border-indigo-100"}`}>
        <div className="flex justify-between items-center mb-4">
          <h4 className={`font-bold ${darkMode ? "text-white" : "text-indigo-700"}`}>إحصائيات المستخدمين</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gradient-to-br from-white to-indigo-50/50"} border ${darkMode ? "border-gray-700" : "border-indigo-100"} shadow-sm`}>
            <p className="text-gray-500 text-sm mb-1">إجمالي المستخدمين</p>
            <p className={`text-2xl font-bold ${darkMode ? "text-indigo-300" : "text-indigo-600"}`}>1,245</p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gradient-to-br from-white to-blue-50/50"} border ${darkMode ? "border-gray-700" : "border-blue-100"} shadow-sm`}>
            <p className="text-gray-500 text-sm mb-1">طالبي الخدمة</p>
            <p className={`text-2xl font-bold ${darkMode ? "text-indigo-300" : "text-indigo-600"}`}>876</p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gradient-to-br from-white to-indigo-50/50"} border ${darkMode ? "border-gray-700" : "border-indigo-100"} shadow-sm`}>
            <p className="text-gray-500 text-sm mb-1">مستخدمين جدد (هذا الشهر)</p>
            <p className={`text-2xl font-bold ${darkMode ? "text-indigo-300" : "text-indigo-600"}`}>42</p>
          </div>
        </div>
      </div>
      
      <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gradient-to-br from-white to-blue-50"} border ${darkMode ? "border-gray-600" : "border-blue-100"} shadow-md`}>
        <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          هنا يمكنك إدارة حسابات المستخدمين وطالبي الخدمة.
        </p>
        <div className={`p-4 rounded-lg ${darkMode ? "bg-indigo-900/30 border border-indigo-800" : "bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100"}`}>
          <p className={`${darkMode ? "text-indigo-300" : "text-indigo-700"}`}>
            هذا القسم قيد التطوير. سيتم إضافة وظائف إدارة المستخدمين قريبًا.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UsersSection;
