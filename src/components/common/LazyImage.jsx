import React, { useState, useEffect, useRef } from "react";
import { SERVER_URL } from "../../services/config";

const LazyImage = ({ src, alt, className, placeholderClassName, onError }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [hasError, setHasError] = useState(false);
  const [useProxy, setUseProxy] = useState(false);
  const imgRef = useRef();

  // استخدام Intersection Observer API لتحديد متى تصبح الصورة مرئية
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // إذا كانت الصورة مرئية، نبدأ بتحميلها
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 } // تحميل الصورة عندما يكون 10% منها مرئيًا على الأقل
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  // تحديث مصدر الصورة عند تغيير الـ prop
  useEffect(() => {
    // إعادة تعيين حالة الخطأ عند تغيير مصدر الصورة
    setHasError(false);
    setUseProxy(false);

    if (!src) {
      // إذا كان المصدر فارغًا، استخدم الصورة الافتراضية
      setImgSrc("/img/user-avatar.svg");
    } else if (src.startsWith("data:")) {
      // إذا كان المصدر بيانات Base64، استخدمه كما هو
      setImgSrc(src);
    } else if (src.startsWith("https://jobscope-8t58.onrender.com/uploads/")) {
      // إذا كان المصدر URL كاملاً من الخادم، استخدم المسار النسبي مع proxy
      const relativePath = src.replace(
        "https://jobscope-8t58.onrender.com",
        ""
      );
      setImgSrc(relativePath);
      setUseProxy(true);
    } else if (src.startsWith("http")) {
      // إذا كان المصدر URL كاملاً آخر، استخدمه كما هو
      setImgSrc(src);
    } else if (src.startsWith("/uploads/")) {
      // إذا كان المسار يبدأ بـ /uploads/، فهو مسار للصور المحملة على الخادم
      setImgSrc(src);
      setUseProxy(true);
    } else if (src.startsWith("/")) {
      // إذا كان المسار يبدأ بـ / ولكن ليس /uploads/، فهو مسار محلي
      setImgSrc(src);
    } else {
      // إذا كان مسارًا نسبيًا، أضف عنوان الخادم
      setImgSrc(`${SERVER_URL}${src.startsWith("/") ? "" : "/"}${src}`);
    }
  }, [src]);

  // معالج تحميل الصورة
  const handleImageLoaded = () => {
    console.log("Image loaded successfully:", imgSrc);
    setIsLoaded(true);
  };

  // معالج خطأ تحميل الصورة
  const handleImageError = () => {
    console.log("Error loading image:", imgSrc);

    // تجنب الدخول في حلقة لا نهائية من الأخطاء
    if (!hasError) {
      setHasError(true);
      setIsLoaded(true); // تعيين الصورة كمحملة لإخفاء مؤشر التحميل

      if (useProxy) {
        // إذا كنا نستخدم proxy وفشل التحميل، جرب استخدام المسار الكامل
        const fullUrl = `${SERVER_URL}${imgSrc}`;
        console.log("Trying full URL:", fullUrl);
        setImgSrc(fullUrl);
        setUseProxy(false);
        return;
      }

      // إذا كان المسار يبدأ بـ https://jobscope-8t58.onrender.com وفشل التحميل
      if (imgSrc.startsWith("https://jobscope-8t58.onrender.com")) {
        // جرب استخدام المسار النسبي
        const relativePath = imgSrc.replace("https://jobscope-8t58.onrender.com", "");
        console.log("Trying relative path:", relativePath);
        setImgSrc(relativePath);
        return;
      }

      // استخدام صورة المستخدم الافتراضية فقط إذا فشل تحميل الصورة الأصلية
      if (!imgSrc.includes("user-avatar.svg")) {
        console.log("Switching to default user avatar");
        setImgSrc("/img/user-avatar.svg");
      }
    }

    // استدعاء معالج الخطأ المخصص إذا تم توفيره
    if (onError) {
      onError();
    }
  };

  return (
    <div ref={imgRef} className={className || ""}>
      {isInView ? (
        <>
          {/* صورة غير مرئية للتحميل */}
          <img
            src={imgSrc}
            alt={alt}
            className={`${className || ""} ${isLoaded ? "block" : "hidden"}`}
            onLoad={handleImageLoaded}
            onError={handleImageError}
          />

          {/* مؤشر التحميل يظهر حتى تكتمل الصورة */}
          {!isLoaded && (
            <div
              className={
                placeholderClassName ||
                `${className || ""} bg-gray-200 animate-pulse`
              }
            ></div>
          )}
        </>
      ) : (
        // مكان حجز قبل أن تصبح الصورة مرئية
        <div
          className={placeholderClassName || `${className || ""} bg-gray-200`}
        ></div>
      )}
    </div>
  );
};

export default LazyImage;
