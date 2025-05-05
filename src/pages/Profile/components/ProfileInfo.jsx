import React from "react";
import { Phone, Briefcase } from "lucide-react";
import Card from "../../../components/common/Card";
import useThemeStore from "../../../store/themeStore";

const ProfileInfo = ({ user }) => {
  const darkMode = useThemeStore((state) => state.darkMode);
  return (
    <Card
      className={`p-4 shadow-md border transition-colors duration-300 ${
        darkMode
          ? "bg-gray-800 text-gray-200 border-gray-700"
          : "bg-gradient-to-br from-blue-50 to-indigo-100 border-indigo-200"
      }`}
    >
      <h2
        className={`text-xl font-bold mb-4 relative inline-block ${
          darkMode ? "text-indigo-300" : "text-indigo-800"
        } transition-colors duration-300`}
      >
        <span className="relative z-10">معلومات الاتصال</span>
        <span
          className={`absolute bottom-0 left-0 right-0 h-2 ${
            darkMode ? "bg-indigo-500" : "bg-indigo-300"
          } opacity-40 transform -rotate-1 z-0`}
        ></span>
      </h2>
      <div className="space-y-4">
        {/* Profesiones y especializaciones */}
        {user.userType === "craftsman" && (
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Briefcase
                size={18}
                className={`${
                  darkMode ? "text-indigo-400" : "text-indigo-500"
                } ml-2 transition-colors duration-300`}
              />
              <span
                className={`font-medium ${
                  darkMode ? "text-indigo-300" : "text-indigo-700"
                } transition-colors duration-300`}
              >
                المهن والتخصصات
              </span>
            </div>
            <div className="mr-6 mt-2">
              {user.professions && user.professions.length > 0 ? (
                <div className="space-y-2">
                  {user.professions.map((profession, index) => {
                    // البحث عن التخصصات المرتبطة بهذه المهنة
                    let relatedSpecializations = [];

                    // إذا كانت التخصصات موجودة، نعرضها
                    if (
                      user.specializations &&
                      user.specializations.length > 0
                    ) {
                      relatedSpecializations = user.specializations;
                    }

                    return (
                      <div key={index} className="flex flex-col">
                        <div
                          className={`font-medium ${
                            darkMode ? "text-indigo-300" : "text-indigo-700"
                          }`}
                        >
                          {profession}
                        </div>
                        <div className="mr-4 text-sm">
                          {relatedSpecializations.length > 0
                            ? relatedSpecializations.join(", ")
                            : "لا توجد تخصصات"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : user.profession ? (
                <div className="flex flex-col">
                  <div
                    className={`font-medium ${
                      darkMode ? "text-indigo-300" : "text-indigo-700"
                    }`}
                  >
                    {user.profession}
                  </div>
                  {user.specialization && (
                    <div className="mr-4 text-sm">{user.specialization}</div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-500">لم يتم تحديد مهنة</div>
              )}
            </div>
          </div>
        )}

        {/* Información de contacto */}
        <div className="flex items-center">
          <Phone
            size={18}
            className={`${
              darkMode ? "text-indigo-400" : "text-indigo-500"
            } ml-2 transition-colors duration-300`}
          />
          <span
            className={`${
              darkMode ? "text-indigo-300" : "text-indigo-700"
            } transition-colors duration-300`}
          >
            {user.phone}
          </span>
        </div>
        {user.email && (
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${
                darkMode ? "text-indigo-400" : "text-indigo-500"
              } ml-2 transition-colors duration-300`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span
              className={`${
                darkMode ? "text-indigo-300" : "text-indigo-700"
              } transition-colors duration-300`}
            >
              {user.email}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProfileInfo;
