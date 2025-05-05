import React, { useState } from "react";
import useThemeStore from "../../store/themeStore";
import { Eye, EyeOff } from "lucide-react";

const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className = "",
  ...props
}) => {
  const darkMode = useThemeStore((state) => state.darkMode);
  const [showPassword, setShowPassword] = useState(false);

  // تحديد نوع الإدخال الفعلي (لعرض/إخفاء كلمة المرور)
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={name}
          className={`block font-medium mb-2 ${
            darkMode ? "text-gray-200" : "text-gray-700"
          }`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`input ${
            error ? "border-red-500 focus:ring-red-500" : ""
          } ${type === "password" ? "pr-3 pl-10" : ""} ${className}`}
          required={required}
          {...props}
        />
        {type === "password" && (
          <button
            type="button"
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              darkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex="-1"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
