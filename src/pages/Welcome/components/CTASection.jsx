import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../../../components/common/Button";
import useThemeStore from "../../../store/themeStore";

const CTASection = () => {
  const darkMode = useThemeStore((state) => state.darkMode);

  return (
    <section
      className={`py-20 ${
        darkMode
          ? "bg-gradient-to-r from-gray-800 to-gray-700"
          : "bg-gradient-to-r from-indigo-600 to-blue-700"
      } text-white transition-colors duration-300`}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
          }
        }
      ` }} />
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-8 relative inline-block"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="relative z-10">انضم إلى منصتنا اليوم</span>
          <span
            className={`absolute bottom-0 left-0 right-0 h-3 ${
              darkMode ? "bg-indigo-500" : "bg-indigo-300"
            } opacity-40 transform -rotate-1 z-0`}
          ></span>
        </motion.h2>
        <motion.p
          className="text-xl mb-8 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          سواء كنت حرفياً تبحث عن فرص عمل جديدة أو كنت تبحث عن حرفي ماهر لإنجاز
          مهمة ما، منصة JobScope هي الحل الأمثل لك.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link to="/register/craftsman">
            <Button
              variant="primary"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group text-lg py-3"
            >
              <span className="relative z-10 font-bold">سجل كحرفي</span>
              <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            </Button>
          </Link>
          <Link to="/register/client">
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/20 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group text-lg py-3"
            >
              <span className="relative z-10 font-bold">سجل كطالب خدمة</span>
              <span className="absolute inset-0 bg-white opacity-0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full group-hover:opacity-20 transition-all duration-700"></span>
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
