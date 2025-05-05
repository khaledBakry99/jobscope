// خدمة API للتواصل مع الواجهة الخلفية
import axios from "axios";
import { API_URL } from "./config";

// إنشاء نسخة من axios مع الإعدادات الافتراضية
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// إضافة معترض للطلبات لإضافة رمز المصادقة
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// إضافة معترض للاستجابات للتعامل مع أخطاء المصادقة
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // تسجيل الخطأ للتشخيص
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.response && error.response.status === 401) {
      // تسجيل الخروج إذا انتهت صلاحية الرمز
      // لكن لا نقوم بتسجيل الخروج إذا كانت محاولة تسجيل دخول
      if (!error.config.url.includes('/auth/login')) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    // إضافة معلومات إضافية للخطأ
    if (error.response) {
      error.customMessage = error.response.data?.message || "حدث خطأ في الاتصال بالخادم";
    } else if (error.request) {
      error.customMessage = "لم يتم استلام استجابة من الخادم";
    } else {
      error.customMessage = "حدث خطأ أثناء إعداد الطلب";
    }

    return Promise.reject(error);
  }
);

// خدمات المصادقة
export const authService = {
  // تسجيل مستخدم جديد
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // تسجيل الدخول
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // تسجيل دخول المدير
  adminLogin: async (credentials) => {
    const response = await api.post("/auth/admin/login", credentials);
    return response.data;
  },

  // الحصول على بيانات المستخدم الحالي
  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

// خدمات المستخدمين
export const userService = {
  // تحديث الملف الشخصي
  updateProfile: async (userData) => {
    const response = await api.put("/users/me", userData);
    return response.data;
  },

  // تغيير كلمة المرور
  changePassword: async (passwordData) => {
    const response = await api.put("/users/change-password", passwordData);
    return response.data;
  },

  // تحميل صورة الملف الشخصي
  uploadProfileImage: async (formData) => {
    const response = await api.post("/users/upload-profile-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

// خدمات الحرفيين
export const craftsmanService = {
  // الحصول على جميع الحرفيين
  getAllCraftsmen: async () => {
    const response = await api.get("/craftsmen");
    return response.data;
  },

  // الحصول على حرفي بواسطة المعرف
  getCraftsmanById: async (id) => {
    const response = await api.get(`/craftsmen/${id}`);
    return response.data;
  },

  // الحصول على الشوارع ضمن نطاق عمل الحرفي
  getStreetsInWorkRange: async (id) => {
    const response = await api.get(`/craftsmen/${id}/streets`);
    return response.data;
  },

  // البحث عن الحرفيين
  searchCraftsmen: async (filters) => {
    const response = await api.post("/craftsmen/search", filters);
    return response.data;
  },

  // البحث عن الحرفيين بواسطة الشارع
  searchCraftsmenByStreet: async (street, filters = {}) => {
    const response = await api.post("/craftsmen/search", {
      ...filters,
      street,
    });
    return response.data;
  },

  // البحث عن الحرفيين بواسطة الحي
  searchCraftsmenByNeighborhood: async (neighborhood, filters = {}) => {
    const response = await api.post("/craftsmen/search", {
      ...filters,
      neighborhood,
    });
    return response.data;
  },

  // الحصول على الملف الشخصي للحرفي الحالي
  getMyProfile: async () => {
    const response = await api.get("/craftsmen/me/profile");
    return response.data;
  },

  // تحديث الملف الشخصي للحرفي
  updateProfile: async (profileData) => {
    const response = await api.put("/craftsmen/me/profile", profileData);
    return response.data;
  },

  // تحديث معرض الأعمال
  updateGallery: async (galleryData) => {
    const response = await api.put("/craftsmen/me/gallery", galleryData);
    return response.data;
  },

  // تحديث حالة التوفر
  updateAvailability: async (available) => {
    const response = await api.put("/craftsmen/me/availability", { available });
    return response.data;
  },

  // تحديث الشوارع ضمن نطاق العمل
  updateStreetsInWorkRange: async () => {
    const response = await api.put("/craftsmen/me/streets");
    return response.data;
  },

  // تحميل صور لمعرض الأعمال
  uploadGalleryImages: async (formData) => {
    const response = await api.post("/craftsmen/me/upload-gallery", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

// خدمات الحجوزات
export const bookingService = {
  // إنشاء حجز جديد
  createBooking: async (bookingData) => {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  },

  // الحصول على حجوزات المستخدم الحالي
  getMyBookings: async () => {
    const response = await api.get("/bookings/me");
    return response.data;
  },

  // الحصول على حجز بواسطة المعرف
  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // تحديث حالة الحجز
  updateBookingStatus: async (id, status) => {
    const response = await api.put(`/bookings/${id}/status`, { status });
    return response.data;
  },

  // تعديل حجز
  updateBooking: async (id, bookingData) => {
    const response = await api.put(`/bookings/${id}`, bookingData);
    return response.data;
  },
};

// خدمات التقييمات
export const reviewService = {
  // إنشاء تقييم جديد
  createReview: async (reviewData) => {
    const response = await api.post("/reviews", reviewData);
    return response.data;
  },

  // الحصول على تقييمات حرفي
  getCraftsmanReviews: async (craftsmanId) => {
    const response = await api.get(`/reviews/craftsman/${craftsmanId}`);
    return response.data;
  },

  // الحصول على تقييمات مفصلة لحرفي
  getCraftsmanDetailedRatings: async (craftsmanId) => {
    const response = await api.get(`/reviews/craftsman/${craftsmanId}/ratings`);
    return response.data;
  },

  // الحصول على تقييم بواسطة المعرف
  getReviewById: async (id) => {
    const response = await api.get(`/reviews/${id}`);
    return response.data;
  },

  // تحميل صور للتقييم
  uploadReviewImages: async (formData) => {
    const response = await api.post("/reviews/upload-images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

// خدمات المهن
export const professionService = {
  // الحصول على جميع المهن
  getAllProfessions: async () => {
    const response = await api.get("/professions");
    return response.data;
  },

  // الحصول على مهنة بواسطة المعرف
  getProfessionById: async (id) => {
    const response = await api.get(`/professions/${id}`);
    return response.data;
  },
};

// خدمات الإشعارات
export const notificationService = {
  // الحصول على إشعارات المستخدم الحالي
  getMyNotifications: async () => {
    const response = await api.get("/notifications/me");
    return response.data;
  },

  // تعليم إشعار كمقروء
  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  // تعليم جميع الإشعارات كمقروءة
  markAllAsRead: async () => {
    const response = await api.put("/notifications/read-all");
    return response.data;
  },

  // حذف إشعار
  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};

export default api;
