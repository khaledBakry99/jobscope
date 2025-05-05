import api from "./api";

// خدمة الحرفيين
const craftsmanService = {
  // الحصول على جميع الحرفيين
  getAllCraftsmen: async () => {
    try {
      console.log("Getting all craftsmen");
      const response = await api.get("/craftsmen");
      console.log("All craftsmen response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get all craftsmen error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء جلب الحرفيين" };
    }
  },

  // الحصول على حرفي بواسطة المعرف
  getCraftsmanById: async (id) => {
    try {
      console.log("Getting craftsman by ID:", id);
      const response = await api.get(`/craftsmen/${id}`);
      console.log("Craftsman by ID response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get craftsman by ID error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء جلب بيانات الحرفي" };
    }
  },

  // الحصول على الملف الشخصي للحرفي الحالي
  getMyProfile: async () => {
    try {
      console.log("Getting my craftsman profile");
      const response = await api.get("/craftsmen/me/profile");
      console.log("My craftsman profile response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get my craftsman profile error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء جلب الملف الشخصي" };
    }
  },

  // البحث عن الحرفيين
  searchCraftsmen: async (searchParams) => {
    try {
      console.log("Searching craftsmen:", searchParams);
      const response = await api.post("/craftsmen/search", searchParams);
      console.log("Search craftsmen response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Search craftsmen error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء البحث عن الحرفيين" };
    }
  },

  // تحديث الملف الشخصي للحرفي
  updateProfile: async (profileData) => {
    try {
      console.log("Updating craftsman profile:", profileData);
      const response = await api.put("/craftsmen/me/profile", profileData);
      console.log("Update craftsman profile response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Update craftsman profile error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء تحديث الملف الشخصي" };
    }
  },

  // تحديث معرض الأعمال
  updateWorkGallery: async (galleryData) => {
    try {
      console.log("Updating work gallery:", galleryData);
      const response = await api.put("/craftsmen/me/gallery", {
        workGallery: galleryData,
      });
      console.log("Update work gallery response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Update work gallery error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء تحديث معرض الأعمال" };
    }
  },

  // تحديث حالة التوفر
  updateAvailability: async (available) => {
    try {
      console.log("Updating availability:", available);
      const response = await api.put("/craftsmen/me/availability", { available });
      console.log("Update availability response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Update availability error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء تحديث حالة التوفر" };
    }
  },

  // الحصول على الشوارع ضمن نطاق العمل
  getStreetsInWorkRange: async (craftsmanId) => {
    try {
      console.log("Getting streets in work range for craftsman:", craftsmanId);
      const response = await api.get(`/craftsmen/${craftsmanId}/streets`);
      console.log("Streets in work range response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get streets in work range error:", error);
      throw error.response?.data || {
        message: "حدث خطأ أثناء جلب الشوارع ضمن نطاق العمل",
      };
    }
  },

  // تحديث الشوارع ضمن نطاق العمل
  updateStreetsInWorkRange: async () => {
    try {
      console.log("Updating streets in work range");
      const response = await api.put("/craftsmen/me/streets");
      console.log("Update streets in work range response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Update streets in work range error:", error);
      throw error.response?.data || {
        message: "حدث خطأ أثناء تحديث الشوارع ضمن نطاق العمل",
      };
    }
  },

  // رفع صور لمعرض الأعمال
  uploadGalleryImages: async (formData) => {
    try {
      console.log("Uploading gallery images");
      const response = await api.post("/craftsmen/me/upload-gallery", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload gallery images response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Upload gallery images error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء رفع الصور" };
    }
  },
};

export default craftsmanService;
