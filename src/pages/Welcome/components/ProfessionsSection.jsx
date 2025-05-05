import React from "react";
import { motion } from "framer-motion";
import useThemeStore from "../../../store/themeStore";

// Mock profession icons
const professions = [
  { name: "كهربائي", icon: "⚡" },
  { name: "سباك", icon: "🔧" },
  { name: "نجار", icon: "🪚" },
  { name: "دهان", icon: "🖌️" },
  { name: "مصمم ديكور", icon: "🏠" },
  { name: "ميكانيكي", icon: "🔩" },
  { name: "حداد", icon: "⚒️" },
  { name: "بناء", icon: "🧱" },
];

const ProfessionsSection = () => {
  const darkMode = useThemeStore((state) => state.darkMode);

  return (
    <section
      className={`py-16 ${
        darkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-50 to-indigo-100"
      } transition-colors duration-300`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className={`text-3xl font-bold ${
              darkMode ? "text-indigo-300" : "text-indigo-800"
            } relative inline-block transition-colors duration-300`}
          >
            <span className="relative z-10">المهن المتوفرة</span>
            <span
              className={`absolute bottom-0 left-0 right-0 h-3 ${
                darkMode ? "bg-indigo-500" : "bg-indigo-300"
              } opacity-40 transform -rotate-1 z-0`}
            ></span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-6">
          {professions.map((profession, index) => (
            <motion.div
              key={profession.name}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-md mb-2 border transform transition-transform duration-300 hover:scale-110 ${
                  darkMode
                    ? "bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600"
                    : "bg-gradient-to-br from-white to-indigo-50 border-indigo-100"
                }`}
              >
                {profession.icon}
              </div>
              <span
                className={`text-center font-medium ${
                  darkMode ? "text-gray-300" : ""
                }`}
              >
                {profession.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfessionsSection;
