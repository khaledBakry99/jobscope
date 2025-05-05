import React from "react";

const LoadingState = ({ darkMode }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div
        className={`animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 ${
          darkMode ? "border-indigo-400" : "border-indigo-500"
        }`}
      ></div>
      <p
        className={`mt-4 text-lg ${
          darkMode ? "text-indigo-300" : "text-indigo-700"
        }`}
      >
        جاري تحميل بيانات الحرفي...
      </p>
    </div>
  );
};

export default LoadingState;
