import api from "./api";

// خدمة المهن والتخصصات
const professionService = {
  // الحصول على جميع المهن
  getAllProfessions: async () => {
    try {
      console.log("Getting all professions");
      const response = await api.get("/professions");
      console.log("All professions response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get all professions error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء جلب المهن" };
    }
  },

  // الحصول على مهنة بواسطة المعرف
  getProfessionById: async (id) => {
    try {
      console.log("Getting profession by ID:", id);
      const response = await api.get(`/professions/${id}`);
      console.log("Profession by ID response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get profession by ID error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء جلب بيانات المهنة" };
    }
  },

  // الحصول على التخصصات لمهنة معينة
  getSpecializationsByProfession: async (professionId) => {
    try {
      console.log("Getting specializations for profession:", professionId);
      const response = await api.get(`/professions/${professionId}/specializations`);
      console.log("Specializations response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get specializations error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء جلب التخصصات" };
    }
  },

  // إضافة مهنة جديدة (للمدير فقط)
  addProfession: async (professionData) => {
    try {
      console.log("Adding new profession:", professionData);
      const response = await api.post("/professions", professionData);
      console.log("Add profession response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Add profession error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء إضافة المهنة" };
    }
  },

  // إضافة تخصص جديد (للمدير فقط)
  addSpecialization: async (professionId, specializationData) => {
    try {
      console.log("Adding new specialization:", {
        professionId,
        specializationData,
      });
      const response = await api.post(
        `/professions/${professionId}/specializations`,
        specializationData
      );
      console.log("Add specialization response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Add specialization error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء إضافة التخصص" };
    }
  },

  // تحديث مهنة (للمدير فقط)
  updateProfession: async (professionId, professionData) => {
    try {
      console.log("Updating profession:", { professionId, professionData });
      const response = await api.put(
        `/professions/${professionId}`,
        professionData
      );
      console.log("Update profession response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Update profession error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء تحديث المهنة" };
    }
  },

  // تحديث تخصص (للمدير فقط)
  updateSpecialization: async (
    professionId,
    specializationId,
    specializationData
  ) => {
    try {
      console.log("Updating specialization:", {
        professionId,
        specializationId,
        specializationData,
      });
      const response = await api.put(
        `/professions/${professionId}/specializations/${specializationId}`,
        specializationData
      );
      console.log("Update specialization response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Update specialization error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء تحديث التخصص" };
    }
  },

  // حذف مهنة (للمدير فقط)
  deleteProfession: async (professionId) => {
    try {
      console.log("Deleting profession:", professionId);
      const response = await api.delete(`/professions/${professionId}`);
      console.log("Delete profession response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Delete profession error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء حذف المهنة" };
    }
  },

  // حذف تخصص (للمدير فقط)
  deleteSpecialization: async (professionId, specializationId) => {
    try {
      console.log("Deleting specialization:", {
        professionId,
        specializationId,
      });
      const response = await api.delete(
        `/professions/${professionId}/specializations/${specializationId}`
      );
      console.log("Delete specialization response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Delete specialization error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء حذف التخصص" };
    }
  },
};

export default professionService;
