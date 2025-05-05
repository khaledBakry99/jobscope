import React from "react";
import { Link } from "react-router-dom";
import useThemeStore from "../../store/themeStore";
import useTranslation from "../../hooks/useTranslation";

const Footer = () => {
  const darkMode = useThemeStore((state) => state.darkMode);
  const { t } = useTranslation();
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
              {t("platformDescription") ||
                "منصة سورية لربط طالبي الخدمات بالحرفيين الأقرب إليك"}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 relative inline-block">
              <span className="relative z-10">
                {t("quickLinks") || "روابط سريعة"}
              </span>
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
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-indigo-200 hover:text-yellow-200 transition-colors duration-200"
                >
                  {t("searchForCraftsman") || "البحث عن حرفي"}
                </Link>
              </li>
              <li>
                <Link
                  to="/register/craftsman"
                  className="text-indigo-200 hover:text-yellow-200 transition-colors duration-200"
                >
                  {t("registerAsCraftsman") || "تسجيل كحرفي"}
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-indigo-200 hover:text-yellow-200 transition-colors duration-200"
                >
                  {t("login")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 relative inline-block">
              <span className="relative  z-10">{t("contact")}</span>
              <span
                className={`absolute bottom-0 left-0 right-0 h-2 ${
                  darkMode ? "bg-indigo-500" : "bg-indigo-300"
                } opacity-20 transform -rotate-1 z-0`}
              ></span>
            </h3>
            <p className="text-indigo-200 hover:text-yellow-200 transition-colors duration-200 inline-block mr-2 ">
              {t("address") || "سوريا، دمشق"}
            </p>
            <p className="text-indigo-200 mb-2">
              {t("email")}:{" "}
              <span className="hover:text-yellow-200 transition-colors duration-200">
                info@jobscope.sy
              </span>
            </p>
            <p className="text-indigo-200">
              {t("phone")}:{" "}
              <span className="hover:text-yellow-200 transition-colors duration-200">
                +963 11 123 4567
              </span>
            </p>
          </div>
        </div>

        <div className="border-t border-indigo-600 mt-8 pt-6 text-center">
          <p className="text-indigo-200">
            &copy; {new Date().getFullYear()}{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
              Job
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500">
              Scope
            </span>
            . {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
