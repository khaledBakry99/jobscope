import React from "react";
import { Phone } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../../components/common/Card";

const CraftsmanContactInfo = ({ craftsman, darkMode }) => {
  // التحقق من حالة تسجيل الدخول
  const isLoggedIn = localStorage.getItem("token") !== null;

  return (
    <Card
      className={`mt-4 p-4 ${
        darkMode
          ? "bg-gray-800 text-gray-200"
          : "bg-gradient-to-br from-blue-50 to-indigo-100"
      } shadow-md transition-colors duration-300`}
    >
      <h2
        className={`text-xl font-bold mb-4 ${
          darkMode ? "text-indigo-300" : "text-indigo-800"
        } relative inline-block transition-colors duration-300`}
      >
        <span className="relative z-10">معلومات الاتصال</span>
        <span
          className={`absolute bottom-0 left-0 right-0 h-2 ${
            darkMode ? "bg-indigo-500" : "bg-indigo-300"
          } opacity-40 transform -rotate-1 z-0`}
        ></span>
      </h2>
      <div className="space-y-2">
        <div className="flex items-center">
          <Phone
            size={18}
            className={`${
              darkMode ? "text-indigo-400" : "text-indigo-500"
            } ml-2 transition-colors duration-300`}
          />
          {isLoggedIn ? (
            <span>{craftsman.phone || "رقم الهاتف غير متوفر"}</span>
          ) : (
            <div className="flex items-center">
              <span
                className={`${
                  darkMode ? "text-yellow-300" : "text-yellow-600"
                } text-sm`}
              >
                <Link
                  to="/login"
                  className="underline hover:text-indigo-500 transition-colors duration-200"
                >
                  سجل دخول
                </Link>{" "}
                لرؤية رقم الهاتف
              </span>
            </div>
          )}
        </div>
        {craftsman.email && (
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
            {isLoggedIn ? (
              <span>{craftsman.email}</span>
            ) : (
              <span
                className={`${
                  darkMode ? "text-yellow-300" : "text-yellow-600"
                } text-sm`}
              >
                <Link
                  to="/login"
                  className="underline hover:text-indigo-500 transition-colors duration-200"
                >
                  سجل دخول
                </Link>{" "}
                لرؤية البريد الإلكتروني
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default CraftsmanContactInfo;
