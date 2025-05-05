import React from "react";
import useThemeStore from "../../store/themeStore";

// قائمة رموز الدول مع رموز الدول بدلاً من الأعلام
const countryCodes = [
  { code: "+963", country: "سوريا", flag: "SY" },
  { code: "+966", country: "السعودية", flag: "SA" },
  { code: "+971", country: "الإمارات", flag: "AE" },
  { code: "+20", country: "مصر", flag: "EG" },

  { code: "+962", country: "الأردن", flag: "JO" },
  { code: "+961", country: "لبنان", flag: "LB" },
  { code: "+974", country: "قطر", flag: "QA" },
  { code: "+965", country: "الكويت", flag: "KW" },
  { code: "+968", country: "عمان", flag: "OM" },
  { code: "+973", country: "البحرين", flag: "BH" },
];

const CountryCodeSelect = ({ value, onChange, disabled }) => {
  const { darkMode } = useThemeStore();

  // ملاحظة: لا نحتاج إلى البحث عن الدولة هنا لأننا نستخدم عنصر select الأصلي

  // معالج تغيير القيمة
  const handleChange = (e) => {
    const selectedCode = e.target.value;
    console.log("Selected country code:", selectedCode);
    onChange(selectedCode);
  };

  return (
    <div className="h-full flex items-center relative">
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`h-full w-full px-2 py-2 border-0 focus:ring-0 outline-none appearance-none text-center ${
          darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-700"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        style={{ paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
        dir="ltr"
      >
        {countryCodes.map((country) => (
          <option key={country.code} value={country.code}>
            {country.flag} {country.code}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-700">
        <svg
          className={`h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default CountryCodeSelect;
