import api from "./api";

// خدمة المستخدمين
const userService = {
  // الحصول على الملف الشخصي للمستخدم الحالي
  getMyProfile: async () => {
    try {
      console.log("Getting my user profile");
      const response = await api.get("/users/me");
      console.log("My user profile response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get my user profile error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء جلب الملف الشخصي" };
    }
  },

  // تحديث الملف الشخصي للمستخدم
  updateProfile: async (profileData) => {
    try {
      console.log("Updating user profile:", profileData);
      const response = await api.put("/users/me", profileData);
      console.log("Update user profile response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Update user profile error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء تحديث الملف الشخصي" };
    }
  },

  // تغيير كلمة المرور
  changePassword: async (passwordData) => {
    try {
      console.log("Changing password");
      const response = await api.put("/users/me/password", passwordData);
      console.log("Change password response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Change password error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء تغيير كلمة المرور" };
    }
  },

  // رفع صورة الملف الشخصي
  uploadProfilePicture: async (formData) => {
    try {
      console.log("Uploading profile picture");
      const response = await api.post("/users/me/upload-profile-picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload profile picture response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Upload profile picture error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء رفع صورة الملف الشخصي" };
    }
  },

  // الحصول على جميع المستخدمين (للمدير فقط)
  getAllUsers: async () => {
    try {
      console.log("Getting all users");
      const response = await api.get("/users");
      console.log("All users response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get all users error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء جلب المستخدمين" };
    }
  },

  // الحصول على مستخدم بواسطة المعرف (للمدير فقط)
  getUserById: async (id) => {
    try {
      console.log("Getting user by ID:", id);
      const response = await api.get(`/users/${id}`);
      console.log("User by ID response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get user by ID error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء جلب بيانات المستخدم" };
    }
  },

  // تحديث مستخدم (للمدير فقط)
  updateUser: async (userId, userData) => {
    try {
      console.log("Updating user:", { userId, userData });
      const response = await api.put(`/users/${userId}`, userData);
      console.log("Update user response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Update user error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء تحديث المستخدم" };
    }
  },

  // حذف مستخدم (للمدير فقط)
  deleteUser: async (userId) => {
    try {
      console.log("Deleting user:", userId);
      const response = await api.delete(`/users/${userId}`);
      console.log("Delete user response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Delete user error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء حذف المستخدم" };
    }
  },
};

export default userService;
