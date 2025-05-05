import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import useThemeStore from "../../store/themeStore";

/**
 * مكون لعرض تغذية راجعة عن نتائج تحليل البحث الطبيعي
 * @param {Object} criteria - معايير البحث المستخرجة من الاستعلام
 * @param {Function} onClose - دالة تنفذ عند إغلاق التغذية الراجعة
 * @returns {JSX.Element}
 */
const SearchFeedback = ({ criteria, onClose }) => {
  const { darkMode } = useThemeStore();

  if (!criteria) {
    return null;
  }

  // التحقق من وجود أي معايير تم استخراجها
  const hasAnyInfo =
    criteria.profession ||
    criteria.city ||
    criteria.street ||
    criteria.hospital ||
    criteria.mosque ||
    criteria.rating > 0 ||
    criteria.radius;

  if (!hasAnyInfo) {
    return null;
  }

  return (
    <motion.div
      className={`mb-4 p-4 rounded-lg shadow-md ${
        darkMode
          ? "bg-indigo-900/50 text-gray-200 border border-indigo-700"
          : "bg-indigo-50 text-gray-800 border border-indigo-200"
      }`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3
            className={`text-base font-bold mb-2 ${
              darkMode ? "text-indigo-300" : "text-indigo-700"
            }`}
          >
            تم فهم استعلامك كالتالي:
          </h3>
          <ul className="space-y-1 text-sm">
            {criteria.profession && (
              <li className="flex items-center">
                <span
                  className={`inline-block w-20 font-medium ${
                    darkMode ? "text-indigo-300" : "text-indigo-600"
                  }`}
                >
                  المهنة:
                </span>
                <span>{criteria.profession}</span>
              </li>
            )}
            {criteria.city && (
              <li className="flex items-center">
                <span
                  className={`inline-block w-20 font-medium ${
                    darkMode ? "text-indigo-300" : "text-indigo-600"
                  }`}
                >
                  المدينة:
                </span>
                <span>{criteria.city}</span>
              </li>
            )}
            {criteria.street && (
              <li className="flex items-center">
                <span
                  className={`inline-block w-20 font-medium ${
                    darkMode ? "text-indigo-300" : "text-indigo-600"
                  }`}
                >
                  المنطقة:
                </span>
                <span>{criteria.street}</span>
              </li>
            )}
            {criteria.hospital && (
              <li className="flex items-center">
                <span
                  className={`inline-block w-20 font-medium ${
                    darkMode ? "text-indigo-300" : "text-indigo-600"
                  }`}
                >
                  المشفى:
                </span>
                <span>{criteria.hospital}</span>
              </li>
            )}
            {criteria.mosque && (
              <li className="flex items-center">
                <span
                  className={`inline-block w-20 font-medium ${
                    darkMode ? "text-indigo-300" : "text-indigo-600"
                  }`}
                >
                  الجامع:
                </span>
                <span>{criteria.mosque}</span>
              </li>
            )}
            {criteria.rating > 0 && (
              <li className="flex items-center">
                <span
                  className={`inline-block w-20 font-medium ${
                    darkMode ? "text-indigo-300" : "text-indigo-600"
                  }`}
                >
                  التقييم:
                </span>
                <span>{criteria.rating} نجوم</span>
              </li>
            )}
            {criteria.radius && (
              <li className="flex items-center">
                <span
                  className={`inline-block w-20 font-medium ${
                    darkMode ? "text-indigo-300" : "text-indigo-600"
                  }`}
                >
                  نطاق البحث:
                </span>
                <span>{criteria.radius} كم</span>
              </li>
            )}
          </ul>

          <h1
            className={`text-sm  mb-1 mt-3 ${
              darkMode ? "text-indigo-300" : "text-indigo-700"
            }`}
          >
            جاري تحديث الخريطة، يرجى الانتظار للحظات.{" "}
          </h1>
        </div>
        <button
          onClick={onClose}
          className={`p-1 rounded-full ${
            darkMode
              ? "text-gray-400 hover:text-white hover:bg-gray-700"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
          } transition-colors duration-200`}
          aria-label="إغلاق"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default SearchFeedback;
