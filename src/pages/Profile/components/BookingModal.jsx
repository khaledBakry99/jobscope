import React from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import Button from "../../../components/common/Button";

const BookingModal = ({
  darkMode,
  bookingData,
  bookingErrors,
  onClose,
  onInputChange,
  onSubmit,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
      <motion.div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-lg w-full max-w-md transition-colors duration-300`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div
          className={`p-6 rounded-lg ${
            darkMode
              ? "bg-gray-800 text-gray-200"
              : "bg-gradient-to-br from-blue-50 to-indigo-100"
          } shadow-inner transition-colors duration-300 border ${
            darkMode ? "border-gray-700" : "border-indigo-200"
          }`}
        >
          <div className="flex justify-between items-center mb-4 ">
            <h2
              className={`text-xl font-bold ${
                darkMode ? "text-indigo-300" : "text-indigo-800"
              } relative inline-block transition-colors duration-300`}
            >
              <span className="relative z-10">حجز موعد</span>
              <span
                className={`absolute bottom-0 left-0 right-0 h-2 ${
                  darkMode ? "bg-indigo-500" : "bg-indigo-300"
                } opacity-40 transform -rotate-1 z-0`}
              ></span>
            </h2>
            <button
              onClick={onClose}
              className={`${
                darkMode
                  ? "text-indigo-400 hover:text-indigo-300"
                  : "text-indigo-500 hover:text-indigo-700"
              } transition-colors duration-200`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div
            className={`p-4 mb-4 rounded-md ${
              darkMode
                ? "bg-indigo-900/30 border border-indigo-800"
                : "bg-indigo-50 border border-indigo-100"
            }`}
          >
            <p
              className={`text-sm ${
                darkMode ? "text-indigo-300" : "text-indigo-700"
              }`}
            >
              <span className="font-bold">ملاحظة:</span> يمكنك تحديد نطاق من
              التواريخ والأوقات التي تناسبك. سيختار الحرفي الوقت المناسب ضمن
              هذا النطاق.
            </p>
          </div>

          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  className={`block ${
                    darkMode ? "text-indigo-300" : "text-indigo-800"
                  } font-medium mb-2 transition-colors duration-300`}
                >
                  تاريخ البداية <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={bookingData.startDate}
                  onChange={onInputChange}
                  className={`input w-full ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-indigo-400 focus:ring-indigo-400"
                      : "border-indigo-200 focus:border-indigo-500 focus:ring-indigo-200"
                  } focus:ring focus:ring-opacity-50 rounded-md shadow-sm ${
                    bookingErrors.startDate
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
                {bookingErrors.startDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {bookingErrors.startDate}
                  </p>
                )}
              </div>

              <div>
                <label
                  className={`block ${
                    darkMode ? "text-indigo-300" : "text-indigo-800"
                  } font-medium mb-2 transition-colors duration-300`}
                >
                  تاريخ النهاية <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={bookingData.endDate}
                  onChange={onInputChange}
                  className={`input w-full ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-indigo-400 focus:ring-indigo-400"
                      : "border-indigo-200 focus:border-indigo-500 focus:ring-indigo-200"
                  } focus:ring focus:ring-opacity-50 rounded-md shadow-sm ${
                    bookingErrors.endDate
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  min={
                    bookingData.startDate ||
                    new Date().toISOString().split("T")[0]
                  }
                  required
                />
                {bookingErrors.endDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {bookingErrors.endDate}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  className={`block ${
                    darkMode ? "text-indigo-300" : "text-indigo-800"
                  } font-medium mb-2 transition-colors duration-300`}
                >
                  وقت البداية <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={bookingData.startTime}
                  onChange={onInputChange}
                  className={`input w-full ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-indigo-400 focus:ring-indigo-400"
                      : "border-indigo-200 focus:border-indigo-500 focus:ring-indigo-200"
                  } focus:ring focus:ring-opacity-50 rounded-md shadow-sm ${
                    bookingErrors.startTime
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  required
                />
                {bookingErrors.startTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {bookingErrors.startTime}
                  </p>
                )}
              </div>

              <div>
                <label
                  className={`block ${
                    darkMode ? "text-indigo-300" : "text-indigo-800"
                  } font-medium mb-2 transition-colors duration-300`}
                >
                  وقت النهاية <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={bookingData.endTime}
                  onChange={onInputChange}
                  className={`input w-full ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-indigo-400 focus:ring-indigo-400"
                      : "border-indigo-200 focus:border-indigo-500 focus:ring-indigo-200"
                  } focus:ring focus:ring-opacity-50 rounded-md shadow-sm ${
                    bookingErrors.endTime
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  required
                />
                {bookingErrors.endTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {bookingErrors.endTime}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-4 ">
              <label
                className={`block ${
                  darkMode ? "text-indigo-300" : "text-indigo-800"
                } font-medium mb-2 transition-colors duration-300`}
              >
                وصف المشكلة <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={bookingData.description}
                onChange={onInputChange}
                placeholder="اكتب وصفاً مختصراً للمشكلة أو الخدمة المطلوبة..."
                className={`input min-h-[100px] ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-indigo-400 focus:ring-indigo-400"
                    : "border-indigo-200 focus:border-indigo-500 focus:ring-indigo-200"
                } focus:ring focus:ring-opacity-50 rounded-md shadow-sm ${
                  bookingErrors.description
                    ? "border-red-500 focus:ring-red-500"
                    : ""
                }`}
                required
              ></textarea>
              {bookingErrors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {bookingErrors.description}
                </p>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <Button
                type="submit"
                variant="primary"
                className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-3 px-6 ${
                  darkMode
                    ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                }`}
              >
                <span className="relative z-10 flex items-center">
                  <Calendar size={18} className="ml-1" />
                  تأكيد الحجز
                </span>
                <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-3 px-6 ${
                  darkMode
                    ? "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
                    : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                }`}
              >
                <span className="relative z-10 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  إلغاء
                </span>
                <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingModal;
