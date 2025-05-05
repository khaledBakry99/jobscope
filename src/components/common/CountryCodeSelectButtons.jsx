import React, { useState, useRef, useEffect } from "react";
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

const CountryCodeSelectButtons = ({ value, onChange, disabled }) => {
  const { darkMode } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // البحث عن الدولة بناءً على الرمز
  const selectedCountry =
    countryCodes.find((country) => country.code === value) || countryCodes[0];

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // اختيار رمز دولة
  const handleSelect = (countryCode) => {
    onChange(countryCode.code);
    setIsOpen(false);
  };

  return (
    <div className="relative h-full" ref={dropdownRef}>
      <button
        type="button"
        className={`flex items-center justify-between px-3 py-2 w-full h-full ${
          darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-700"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onClick={() => {
          if (!disabled) {
            console.log("Country code button clicked, toggling dropdown");
            setIsOpen(!isOpen);
          }
        }}
        disabled={disabled}
      >
        <div className="flex items-center">
          <span className="text-sm font-medium">{selectedCountry.code}</span>
          <span className="mx-1 text-xs font-bold bg-indigo-100 text-indigo-800 rounded px-1 py-0.5">
            {selectedCountry.flag}
          </span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 mt-1 left-0 w-64 rounded-md shadow-lg ${
            darkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          <ul
            className={`py-1 max-h-60 overflow-auto ${
              darkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            {countryCodes.map((countryCode) => (
              <li
                key={countryCode.code}
                className={`px-3 py-2 flex items-center justify-between cursor-pointer ${
                  darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50"
                } ${
                  countryCode.code === value
                    ? darkMode
                      ? "bg-indigo-900/30 font-medium"
                      : "bg-indigo-50 font-medium"
                    : ""
                }`}
                onClick={() => {
                  console.log("Selected country code:", countryCode.code);
                  handleSelect(countryCode);
                }}
              >
                <div className="flex items-center">
                  <span className="text-sm">{countryCode.country}</span>
                </div>
                <div className="flex items-center">
                  <span className="ml-2">{countryCode.code}</span>
                  <span className="mr-2 ml-2 text-xs font-bold bg-indigo-100 text-indigo-800 rounded px-1 py-0.5">
                    {countryCode.flag}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CountryCodeSelectButtons;
