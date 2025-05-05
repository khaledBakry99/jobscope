import api from "./api";

// خدمة الطلبات
const requestService = {
  // إنشاء طلب جديد
  createRequest: async (requestData) => {
    try {
      console.log("Creating new request:", requestData);
      const response = await api.post("/requests", requestData);
      console.log("Create request response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Create request error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء إنشاء الطلب" };
    }
  },

  // الحصول على طلبات العميل
  getClientRequests: async (status, page = 1, limit = 5) => {
    try {
      console.log("Getting client requests:", { status, page, limit });
      const response = await api.get("/requests/client", {
        params: { status, page, limit },
      });
      console.log("Client requests response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get client requests error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء جلب الطلبات" };
    }
  },

  // الحصول على طلبات الحرفي
  getCraftsmanRequests: async (status, page = 1, limit = 5) => {
    try {
      console.log("Getting craftsman requests:", { status, page, limit });
      const response = await api.get("/requests/craftsman", {
        params: { status, page, limit },
      });
      console.log("Craftsman requests response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get craftsman requests error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء جلب الطلبات" };
    }
  },

  // الحصول على تفاصيل طلب
  getRequestDetails: async (requestId) => {
    try {
      console.log("Getting request details:", requestId);
      const response = await api.get(`/requests/${requestId}`);
      console.log("Request details response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get request details error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء جلب تفاصيل الطلب" };
    }
  },

  // تحديث حالة الطلب
  updateRequestStatus: async (requestId, statusData) => {
    try {
      console.log("Updating request status:", { requestId, statusData });
      const response = await api.put(`/requests/${requestId}/status`, statusData);
      console.log("Update request status response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Update request status error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء تحديث حالة الطلب" };
    }
  },

  // إضافة تقييم ومراجعة للطلب
  addReview: async (requestId, reviewData) => {
    try {
      console.log("Adding review:", { requestId, reviewData });
      const response = await api.put(`/requests/${requestId}/review`, reviewData);
      console.log("Add review response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Add review error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء إضافة التقييم" };
    }
  },

  // تعديل طلب
  updateRequest: async (requestId, requestData) => {
    try {
      console.log("Updating request:", { requestId, requestData });
      const response = await api.put(`/requests/${requestId}`, requestData);
      console.log("Update request response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Update request error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء تعديل الطلب" };
    }
  },

  // حذف طلب
  deleteRequest: async (requestId) => {
    try {
      console.log("Deleting request:", requestId);
      const response = await api.delete(`/requests/${requestId}`);
      console.log("Delete request response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Delete request error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء حذف الطلب" };
    }
  },

  // رفع صور للطلب
  uploadRequestImages: async (formData) => {
    try {
      console.log("Uploading request images");
      const response = await api.post("/requests/upload-images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload images response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Upload images error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء رفع الصور" };
    }
  },
};

export default requestService;
