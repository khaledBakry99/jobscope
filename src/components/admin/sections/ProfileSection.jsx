import React from "react";
import useThemeStore from "../../../store/themeStore";
import Button from "../../common/Button";

const ProfileSection = ({ admin }) => {
  const darkMode = useThemeStore((state) => state.darkMode);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3
          className={`text-xl font-bold ${
            darkMode ? "text-indigo-300" : "text-indigo-800"
          } relative`}
        >
          <span className="relative z-10">الملف الشخصي</span>
          <span
            className={`absolute bottom-0 left-0 right-0 h-2 ${
              darkMode ? "bg-indigo-500" : "bg-indigo-300"
            } opacity-40 transform -rotate-1 z-0`}
          ></span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* بطاقة المعلومات الشخصية */}
        <div
          className={`col-span-1 p-6 rounded-lg ${
            darkMode
              ? "bg-gray-700"
              : "bg-gradient-to-br from-white to-indigo-100/40"
          } border ${
            darkMode ? "border-gray-600" : "border-indigo-200"
          } shadow-md`}
        >
          <div className="flex flex-col items-center text-center">
            <img
              src={admin.image}
              alt={admin.name}
              className="w-32 h-32 rounded-full border-4 border-indigo-300 mb-4"
            />
            <h3
              className={`text-xl font-bold ${
                darkMode ? "text-white" : "text-indigo-800"
              } mb-1`}
            >
              {admin.name}
            </h3>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              } mb-4`}
            >
              {admin.role}
            </p>
            <div
              className={`w-full p-2 rounded-md ${
                darkMode
                  ? "bg-gray-800"
                  : "bg-gradient-to-r from-indigo-50/70 to-indigo-100/50"
              } text-center mb-2 border ${
                darkMode ? "border-gray-700" : "border-indigo-200"
              }`}
            >
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                البريد الإلكتروني
              </p>
              <p
                className={`font-medium ${
                  darkMode ? "text-indigo-300" : "text-indigo-700"
                }`}
              >
                {admin.email || "admin@jobscope.com"}
              </p>
            </div>
            <div
              className={`w-full p-2 rounded-md ${
                darkMode
                  ? "bg-gray-800"
                  : "bg-gradient-to-r from-indigo-50/70 to-indigo-100/50"
              } text-center border ${
                darkMode ? "border-gray-700" : "border-indigo-200"
              }`}
            >
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                رقم الهاتف
              </p>
              <p
                className={`font-medium ${
                  darkMode ? "text-indigo-300" : "text-indigo-700"
                }`}
              >
                {admin.phone || "+963 912 345 678"}
              </p>
            </div>

            <div className="mt-4">
              <Button
                variant="primary"
                className={`${
                  darkMode
                    ? "bg-gradient-to-r from-[#3730A3] to-[#4238C8] hover:from-[#322e92] hover:to-[#3b32b4]"
                    : "bg-gradient-to-r from-[#4238C8] to-[#3730A3] hover:from-[#3b32b4] hover:to-[#322e92]"
                } text-white transition-all duration-200 shadow-sm hover:shadow-md relative overflow-hidden group w-full`}
              >
                <span className="relative z-10">تعديل البيانات</span>
                <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </Button>
            </div>
          </div>
        </div>

        {/* معلومات إضافية */}
        <div
          className={`col-span-2 p-6 rounded-lg ${
            darkMode
              ? "bg-gray-700"
              : "bg-gradient-to-br from-white to-indigo-100/40"
          } border ${
            darkMode ? "border-gray-600" : "border-indigo-200"
          } shadow-md`}
        >
          <h4
            className={`text-lg font-bold mb-4 ${
              darkMode ? "text-indigo-300" : "text-indigo-700"
            } border-b ${
              darkMode ? "border-gray-600" : "border-gray-200"
            } pb-2`}
          >
            معلومات المدير
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                } mb-1`}
              >
                تاريخ الانضمام
              </p>
              <p
                className={`font-medium ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {admin.joinDate || "01/01/2023"}
              </p>
            </div>
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                } mb-1`}
              >
                آخر تسجيل دخول
              </p>
              <p
                className={`font-medium ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {admin.lastLogin || "اليوم، 10:30 ص"}
              </p>
            </div>
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                } mb-1`}
              >
                الصلاحيات
              </p>
              <p
                className={`font-medium ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {admin.permissions || "مدير النظام (كامل الصلاحيات)"}
              </p>
            </div>
            <div></div>
          </div>

          <h4
            className={`text-lg font-bold mb-4 ${
              darkMode ? "text-indigo-300" : "text-indigo-700"
            } border-b ${
              darkMode ? "border-gray-600" : "border-gray-200"
            } pb-2`}
          >
            النشاطات الأخيرة
          </h4>

          <div className="space-y-3">
            {[
              { action: "تسجيل دخول", time: "اليوم، 10:30 ص" },
              { action: "تعديل إعدادات النظام", time: "أمس، 2:45 م" },
              { action: "إضافة مستخدم جديد", time: "2023/04/20، 11:15 ص" },
            ].map((activity, index) => (
              <div
                key={index}
                className={`p-2 rounded-md ${
                  darkMode
                    ? "bg-gray-800"
                    : "bg-gradient-to-r from-indigo-50/70 to-indigo-100/50"
                } border ${
                  darkMode ? "border-gray-700" : "border-indigo-200/70"
                } flex justify-between items-center`}
              >
                <p
                  className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  {activity.action}
                </p>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {activity.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
