import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, UserCheck } from "lucide-react";
import Button from "../../../components/common/Button";
import useThemeStore from "../../../store/themeStore";
import useUserStore from "../../../store/userStore";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const HeroSection = () => {
  const darkMode = useThemeStore((state) => state.darkMode);
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const isLoggedIn = !!user;
  const [imageSrc, setImageSrc] = useState({
    large: "",
    medium: "",
    small: "",
    placeholder: "",
  });

  useEffect(() => {
    // استخدام صور بديلة من مواقع خارجية موثوقة
    const defaultImages = {
      large: "https://www.raed.net/img?id=1312374",
      medium: "https://www.raed.net/img?id=1312376",
      small: "https://www.raed.net/img?id=1312377",
      placeholder: "https://www.raed.net/img?id=1312374",
    };

    // محاولة تحميل الصورة باستخدام import.meta.url
    try {
      // تحديد مسارات الصور بأحجام مختلفة
      const imgUrlLarge = new URL(
        "https://www.raed.net/img?id=1312374",
        import.meta.url
      ).href;
      const imgUrlMedium = new URL(
        "https://www.raed.net/img?id=1312376",
        import.meta.url
      ).href;
      const imgUrlSmall = new URL(
        "https://www.raed.net/img?id=1312377",
        import.meta.url
      ).href;

      // استخدام الصورة الكبيرة كمصدر أساسي
      setImageSrc({
        large: imgUrlLarge,
        medium: imgUrlMedium || imgUrlLarge, // استخدام الصورة الكبيرة كبديل إذا لم تكن الصورة المتوسطة متوفرة
        small: imgUrlSmall || imgUrlLarge, // استخدام الصورة الكبيرة كبديل إذا لم تكن الصورة الصغيرة متوفرة
        placeholder: imgUrlSmall || imgUrlLarge, // استخدام الصورة الصغيرة كصورة مؤقتة أثناء التحميل
      });
    } catch (error) {
      console.error("Error loading images with import.meta.url:", error);
      // استخدام الصور البديلة من مواقع خارجية
      setImageSrc(defaultImages);
    }
  }, []);

  return (
    <section
      className={`${
        darkMode
          ? "bg-gradient-to-r from-gray-900 to-gray-800"
          : "bg-gradient-to-r from-indigo-900 to-blue-900"
      } text-white py-20 transition-colors duration-300`}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
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
      `,
        }}
      />
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div
            className="md:w-1/2 mb-10 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1
              className={`text-4xl md:text-5xl font-bold mb-4 relative ${
                darkMode ? "text-white" : ""
              }`}
            >
              <span className="relative z-10">
                بوابتك الذكية للوصول إلى أفضل الحرفيين في سوريا
              </span>
              <span
                className={`absolute bottom-0 left-0 right-0 h-4 ${
                  darkMode ? "bg-indigo-500" : "bg-indigo-300"
                } opacity-20 transform -rotate-1 z-0`}
              ></span>
            </h1>
            <p className={`text-xl mb-8 ${darkMode ? "text-gray-300" : ""}`}>
              ابحث عن أفضل الحرفيين في منطقتك أو سجل كحرفي واستقبل طلبات العمل
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login?type=craftsman">
                <Button
                  variant="primary"
                  className="bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200  relative overflow-hidden group text-lg py-3"
                  style={{ animation: "pulse 2s infinite" }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 font-bold text-white">
                    <UserCheck size={20} />
                    تسجيل الدخول كحرفي
                  </span>
                  <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/20 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group text-lg py-3"
                onClick={() => {
                  // توجيه المستخدم إلى صفحة البحث
                  navigate("/search");
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 font-bold text-white">
                  <Search size={20} />
                  استكشاف كطالب خدمة
                </span>
                <span className="absolute inset-0 bg-white opacity-0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full group-hover:opacity-20 transition-all duration-700"></span>
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="md:w-1/2 flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex justify-center w-full relative mb-4">
              {imageSrc.large && (
                <picture className="w-full flex justify-center">
                  {/* استخدام LazyLoadImage مع تأثير blur أثناء التحميل */}
                  <LazyLoadImage
                    src={imageSrc.large}
                    srcSet={`${imageSrc.small} 500w, ${imageSrc.medium} 1000w, ${imageSrc.large} 1500w`}
                    sizes="(max-width: 600px) 500px, (max-width: 1200px) 1000px, 1500px"
                    alt="JobScope - منصة سورية لربط طالبي الخدمات بالحرفيين"
                    className="w-4/5 md:w-3/4 rounded-lg shadow-lg mx-auto"
                    effect="blur"
                    placeholderSrc={imageSrc.placeholder}
                    threshold={300}
                    onError={() => {
                      console.log("Image failed to load, trying fallback path");
                      // استخدام صور بديلة من مواقع خارجية موثوقة
                      setImageSrc({
                        large: "https://www.raed.net/img?id=1312374",
                        medium: "https://www.raed.net/img?id=1312376",
                        small: "https://www.raed.net/img?id=1312377",
                        placeholder: "https://www.raed.net/img?id=1312374",
                      });
                    }}
                  />
                </picture>
              )}
            </div>
            <div
              className={`w-4/5 md:w-3/4 p-4 rounded-lg ${
                darkMode ? "bg-gray-800/80" : "bg-white/80"
              } backdrop-blur-sm shadow-lg border ${
                darkMode ? "border-gray-700" : "border-indigo-100"
              }`}
            >
              <h3
                className={`text-lg font-bold mb-2 ${
                  darkMode ? "text-indigo-300" : "text-indigo-700"
                }`}
              >
                منصة JobScope
              </h3>
              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${
                  darkMode ? "text-indigo-200" : "text-indigo-600"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Search
                    size={16}
                    className="inline-block text-indigo-500 flex-shrink-0"
                  />
                  <span>العثور على حرفيين ماهرين</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="inline-block text-indigo-500 flex-shrink-0"
                  >
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                    <path d="m9 16 2 2 4-4" />
                  </svg>
                  <span>حجز مواعيد الخدمة بسهولة</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="inline-block text-indigo-500 flex-shrink-0"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span>التواصل مباشرة مع الحرفيين</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="inline-block text-indigo-500 flex-shrink-0"
                  >
                    <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6L12 2z" />
                  </svg>
                  <span>تقييمات موثوقة من العملاء</span>
                </div>
                <div className="flex items-center gap-2 md:col-span-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="inline-block text-indigo-500 flex-shrink-0"
                  >
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <circle cx="12" cy="5" r="2" />
                    <path d="M12 7v4" />
                    <line x1="8" y1="16" x2="8" y2="16" />
                    <line x1="16" y1="16" x2="16" y2="16" />
                  </svg>
                  <span>مساعد ذكي للرد على استفساراتك ومساعدتك</span>
                </div>

                <div className="flex items-center gap-2 md:col-span-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="inline-block text-indigo-500 flex-shrink-0"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                    <path d="m11 8v6" />
                    <path d="M8 11h6" />
                  </svg>
                  <span>
                    بحث ذكي يفهم اللغة العربية الطبيعية (الفصحى أو السورية)
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
