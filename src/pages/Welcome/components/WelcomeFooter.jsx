import React from "react";
import { Link } from "react-router-dom";
import useThemeStore from "../../../store/themeStore";

const WelcomeFooter = () => {
  const darkMode = useThemeStore((state) => state.darkMode);

  return (
    <footer
      className={`${
        darkMode
          ? "bg-gray-900"
          : "bg-gradient-to-r from-indigo-700 to-blue-900"
      } text-white py-8 mt-auto shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.3)] relative z-[50] transition-colors duration-300`}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                Job
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500">
                Scope
              </span>
            </h3>
            <p className="text-indigo-200">
              منصة سورية لربط طالبي الخدمات بالحرفيين الأقرب إليك
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 relative inline-block">
              <span className="relative z-10">روابط سريعة</span>
              <span
                className={`absolute bottom-0 left-0 right-0 h-2 ${
                  darkMode ? "bg-indigo-500" : "bg-indigo-300"
                } opacity-20 transform -rotate-1 z-0`}
              ></span>
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-indigo-200 hover:text-yellow-200 transition-colors duration-200"
                >
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-indigo-200 hover:text-yellow-200 transition-colors duration-200"
                >
                  البحث عن حرفي
                </Link>
              </li>
              <li>
                <Link
                  to="/register/craftsman"
                  className="text-indigo-200 hover:text-yellow-200 transition-colors duration-200"
                >
                  تسجيل كحرفي
                </Link>
              </li>
              <li>
                <Link
                  to="/register/client"
                  className="text-indigo-200 hover:text-yellow-200 transition-colors duration-200"
                >
                  تسجيل كطالب خدمة
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-indigo-200 hover:text-yellow-200 transition-colors duration-200"
                >
                  تسجيل الدخول
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 relative inline-block">
              <span className="relative z-10">تواصل معنا</span>
              <span
                className={`absolute bottom-0 left-0 right-0 h-2 ${
                  darkMode ? "bg-indigo-500" : "bg-indigo-300"
                } opacity-20 transform -rotate-1 z-0`}
              ></span>
            </h3>
            <p className="text-indigo-200 mb-2 hover:text-yellow-200 transition-colors duration-200 inline-block mr-2">
              سوريا، دمشق
            </p>
            <p className="text-indigo-200 mb-2">
              البريد الإلكتروني:{" "}
              <span className="hover:text-yellow-200 transition-colors duration-200">
                info@jobscope.sy
              </span>
            </p>
            <p className="text-indigo-200">
              الهاتف:{" "}
              <span className="hover:text-yellow-200 transition-colors duration-200">
                +963 11 123 4567
              </span>
            </p>
          </div>
        </div>

        <div className="border-t border-indigo-600 mt-8 pt-6 text-center">
          <p className="text-indigo-200 mb-2">
            &copy; {new Date().getFullYear()}{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
              Job
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500">
              Scope
            </span>
            . جميع الحقوق محفوظة.
          </p>
          <Link
            to="/admin/login"
            className="text-xs text-indigo-300 hover:text-indigo-100 transition-colors duration-300"
          >
            الدخول إلى لوحة التحكم
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default WelcomeFooter;
