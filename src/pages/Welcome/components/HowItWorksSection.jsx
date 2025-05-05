import React from "react";
import { motion } from "framer-motion";
import useThemeStore from "../../../store/themeStore";

const HowItWorksSection = () => {
  const darkMode = useThemeStore((state) => state.darkMode);

  return (
    <section
      className={`py-16 ${
        darkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-indigo-300 to-blue-100"
      } transition-colors duration-300`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className={`text-3xl font-bold ${
              darkMode ? "text-indigo-300" : "text-indigo-800"
            } relative inline-block transition-colors duration-300`}
          >
            <span className="relative z-10">كيف تعمل المنصة؟</span>
            <span
              className={`absolute bottom-0 left-0 right-0 h-3 ${
                darkMode ? "bg-indigo-500" : "bg-indigo-300"
              } opacity-40 transform -rotate-1 z-0`}
            ></span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className={`p-6 rounded-lg shadow-lg border hover:border-indigo-300 transition-all duration-300 hover:shadow-xl ${
              darkMode
                ? "bg-gradient-to-br from-indigo-900 to-indigo-800 text-gray-200 border-indigo-700 hover:border-indigo-400"
                : "bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 shadow-md">
              1
            </div>
            <h3
              className={`text-xl font-bold mb-2 ${
                darkMode ? "text-white" : ""
              }`}
            >
              سجل حسابك
            </h3>
            <p
              className={`${
                darkMode ? "text-indigo-200" : "text-indigo-600"
              } mb-2`}
            >
              سجل كحرفي لعرض خدماتك أو استكشف المنصة كطالب خدمة
            </p>
            <p
              className={`${
                darkMode ? "text-indigo-300" : "text-indigo-500"
              } text-sm`}
            >
              يمكنك إنشاء حساب بسهولة باستخدام بريدك الإلكتروني أو رقم هاتفك،
              وتخصيص ملفك الشخصي بالمعلومات المناسبة
            </p>
          </motion.div>

          <motion.div
            className={`p-6 rounded-lg shadow-lg border hover:border-indigo-300 transition-all duration-300 hover:shadow-xl ${
              darkMode
                ? "bg-gradient-to-br from-indigo-900 to-indigo-800 text-gray-200 border-indigo-700 hover:border-indigo-400"
                : "bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 shadow-md">
              2
            </div>
            <h3 className="text-xl font-bold mb-2">ابحث عن الخدمة</h3>
            <p
              className={`${
                darkMode ? "text-indigo-200" : "text-indigo-600"
              } mb-2`}
            >
              ابحث عن الحرفي المناسب في منطقتك حسب التخصص والتقييم
            </p>
            <p
              className={`${
                darkMode ? "text-indigo-300" : "text-indigo-500"
              } text-sm`}
            >
              استخدم خيارات البحث المتقدمة لتحديد المهنة والموقع ونطاق العمل
              للعثور على أفضل الحرفيين بالقرب منك
            </p>
          </motion.div>

          <motion.div
            className={`p-6 rounded-lg shadow-lg border hover:border-indigo-300 transition-all duration-300 hover:shadow-xl ${
              darkMode
                ? "bg-gradient-to-br from-indigo-900 to-indigo-800 text-gray-200 border-indigo-700 hover:border-indigo-400"
                : "bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 shadow-md">
              3
            </div>
            <h3 className="text-xl font-bold mb-2">احجز واستمتع بالخدمة</h3>
            <p
              className={`${
                darkMode ? "text-indigo-200" : "text-indigo-600"
              } mb-2`}
            >
              تواصل مع الحرفي واحجز موعداً مناسباً وقيّم الخدمة بعد الانتهاء
            </p>
            <p
              className={`${
                darkMode ? "text-indigo-300" : "text-indigo-500"
              } text-sm`}
            >
              يمكنك التواصل مباشرة مع الحرفي، وتحديد موعد مناسب، ومتابعة حالة
              الطلب، وتقييم الخدمة بعد إتمامها
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
