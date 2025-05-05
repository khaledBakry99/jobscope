import React from "react";
import Button from "./Button";

/**
 * زر مع حالة تحميل
 * @param {Object} props - خصائص الزر
 * @param {boolean} props.isLoading - هل الزر في حالة تحميل
 * @param {string} props.loadingText - النص الذي يظهر أثناء التحميل
 * @param {React.ReactNode} props.children - محتوى الزر
 * @param {string} props.className - فئات CSS إضافية
 * @param {Function} props.onClick - دالة تنفذ عند النقر
 * @param {string} props.variant - نوع الزر (primary, secondary, etc.)
 * @param {boolean} props.fullWidth - هل الزر يأخذ العرض الكامل
 * @param {boolean} props.disabled - هل الزر معطل
 */
const LoadingButton = ({
  isLoading = false,
  loadingText = "جاري التنفيذ...",
  children,
  className = "",
  onClick,
  variant = "primary",
  fullWidth = false,
  disabled = false,
  ...rest
}) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      fullWidth={fullWidth}
      disabled={isLoading || disabled}
      className={`relative ${className}`}
      {...rest}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="absolute left-0 right-0 flex items-center justify-center">
            <svg
              className="animate-spin h-6 w-6 ml-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-base font-bold whitespace-nowrap px-2 py-1 bg-indigo-600 bg-opacity-30 rounded-md">
              {loadingText}
            </span>
          </div>
          <div className="opacity-0">{children}</div>
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default LoadingButton;
