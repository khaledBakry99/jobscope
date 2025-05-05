// ملف التكوين للتطبيق

// عنوان API
// استخدم دائماً عنوان URL المستضاف على Render
export const API_URL = "https://jobscope-8t58.onrender.com/api";

// عنوان الخادم الكامل (للصور وغيرها)
export const SERVER_URL = "https://jobscope-8t58.onrender.com";

// إعدادات أخرى
export const APP_CONFIG = {
  // الإعدادات العامة
  appName: "JobScope",

  // إعدادات الخريطة
  map: {
    defaultCenter: { lat: 33.5138, lng: 36.2765 }, // دمشق
    defaultZoom: 13,
    maxZoom: 18,
    minZoom: 5,
  },

  // إعدادات التحميل
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5 ميجابايت
    allowedImageTypes: ["image/jpeg", "image/png", "image/webp"],
  },

  // إعدادات المصادقة
  auth: {
    tokenExpiryDays: 30,
    googleClientId:
      "79461320705-ru94lkf71prenrqpv9v9pnvnlvndcseb.apps.googleusercontent.com",
  },
};
