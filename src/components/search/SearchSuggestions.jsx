import React from 'react';
import { motion } from 'framer-motion';
import useThemeStore from '../../store/themeStore';

/**
 * مكون لعرض اقتراحات البحث
 * @param {Array} suggestions - قائمة الاقتراحات
 * @param {Function} onSelectSuggestion - دالة تنفذ عند اختيار اقتراح
 * @returns {JSX.Element}
 */
const SearchSuggestions = ({ suggestions, onSelectSuggestion }) => {
  const { darkMode } = useThemeStore();

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <motion.div
      className={`absolute z-10 w-full mt-1 rounded-md shadow-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } border ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      }`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <ul className="py-1">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className={`px-4 py-2 cursor-pointer text-right ${
              darkMode
                ? 'hover:bg-gray-700 text-gray-200'
                : 'hover:bg-indigo-50 text-gray-700'
            } transition-colors duration-150`}
            onClick={() => onSelectSuggestion(suggestion)}
          >
            {suggestion}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default SearchSuggestions;
