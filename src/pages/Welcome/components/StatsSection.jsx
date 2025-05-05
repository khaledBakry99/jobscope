import React from "react";
import { motion } from "framer-motion";
import useThemeStore from "../../../store/themeStore";

const StatsSection = () => {
  const darkMode = useThemeStore((state) => state.darkMode);

  return (
    <section
      className={`py-16 ${
        darkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-indigo-200 to-blue-100"
      } transition-colors duration-300`}
    >
      <div className="container mx-auto px-4 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
          <motion.div
            className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white p-8 rounded-lg text-center shadow-lg border border-indigo-300"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-4xl font-bold mb-2">+2000</h3>
            <p className="text-xl">حرفي مسجل</p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-indigo-400 to-indigo-600 text-white p-8 rounded-lg text-center shadow-lg border border-indigo-300"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h3 className="text-4xl font-bold mb-2">+5000</h3>
            <p className="text-xl">طلب خدمة</p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-8 rounded-lg text-center shadow-lg border border-indigo-300"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h3 className="text-4xl font-bold mb-2">+10</h3>
            <p className="text-xl">مدن مغطاة</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
