import React, { useState, useRef, useEffect } from "react";
import { X, Plus } from "lucide-react";
import useThemeStore from "../../store/themeStore";

const MultiSelect = ({
  options,
  selectedValues = [],
  onChange,
  placeholder = "اختر...",
  label,
  required = false,
  error,
  name,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const darkMode = useThemeStore((state) => state.darkMode);

  // Filtrar opciones basadas en el término de búsqueda
  const filteredOptions = options.filter(
    (option) =>
      !selectedValues.includes(option) &&
      option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejar clic fuera del dropdown para cerrarlo
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

  // Agregar una opción seleccionada
  const handleSelect = (option) => {
    const newSelectedValues = [...selectedValues, option];
    onChange(name, newSelectedValues);
    setSearchTerm("");
  };

  // إضافة خيار جديد غير موجود في القائمة
  const handleAddCustomOption = () => {
    if (
      searchTerm &&
      !options.includes(searchTerm) &&
      !selectedValues.includes(searchTerm)
    ) {
      const newSelectedValues = [...selectedValues, searchTerm];
      onChange(name, newSelectedValues);
      setSearchTerm("");
    }
  };

  // Eliminar una opción seleccionada
  const handleRemove = (option) => {
    const newSelectedValues = selectedValues.filter((item) => item !== option);
    onChange(name, newSelectedValues);
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 font-medium mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        ref={dropdownRef}
        className={`relative ${
          error
            ? "border-red-500"
            : darkMode
            ? "border-gray-600"
            : "border-gray-300"
        }`}
      >
        <div
          className={`min-h-[42px] p-2 border rounded-md flex flex-wrap gap-2 cursor-pointer ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300"
          } ${error ? "border-red-500 focus:ring-red-500" : ""}`}
          onClick={() => setIsOpen(true)}
        >
          {selectedValues.length > 0 ? (
            selectedValues.map((value) => (
              <div
                key={value}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm ${
                  darkMode
                    ? "bg-gray-600 text-white"
                    : "bg-indigo-100 text-indigo-800"
                }`}
              >
                <span>{value}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(value);
                  }}
                  className={`rounded-full p-0.5 ${
                    darkMode
                      ? "hover:bg-gray-500 text-gray-300"
                      : "hover:bg-indigo-200 text-indigo-600"
                  }`}
                >
                  <X size={14} />
                </button>
              </div>
            ))
          ) : (
            <span
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {placeholder}
            </span>
          )}
        </div>

        {isOpen && (
          <div
            className={`absolute z-[100] mt-1 w-full rounded-md shadow-lg ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } border overflow-hidden`}
          >
            <div className="p-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="بحث..."
                className={`w-full p-2 text-sm border rounded-md ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
            <ul
              className={`max-h-60 overflow-auto py-1 text-base ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li
                    key={option}
                    className={`cursor-pointer select-none relative py-2 px-4 ${
                      darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50"
                    }`}
                    onClick={(e) => {
                      handleSelect(option);
                      if (!e.ctrlKey && !e.metaKey) {
                        setIsOpen(false);
                      }
                    }}
                  >
                    {option}
                  </li>
                ))
              ) : searchTerm ? (
                <li
                  className={`cursor-pointer select-none relative py-2 px-4 ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50"
                  } flex items-center justify-between`}
                  onClick={() => {
                    handleAddCustomOption();
                    setIsOpen(false);
                  }}
                >
                  <span>إضافة "{searchTerm}"</span>
                  <Plus size={16} className="text-indigo-500" />
                </li>
              ) : (
                <li
                  className={`cursor-default select-none relative py-2 px-4 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  لا توجد نتائج
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default MultiSelect;
