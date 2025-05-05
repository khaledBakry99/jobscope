import api from "./api";

const otpService = {
  // إرسال رمز التحقق إلى رقم الهاتف
  sendOtpToPhone: async (phone) => {
    try {
      console.log("Sending OTP to phone:", phone);

      // استدعاء API لإرسال رمز التحقق إلى رقم الهاتف
      const response = await api.post("/auth/send-otp-phone", { phone });

      return {
        success: true,
        message: response.data.message || "تم إرسال رمز التحقق بنجاح",
      };
    } catch (error) {
      console.error("Send OTP to phone error:", error);
      throw error.response?.data || {
        message: "حدث خطأ أثناء إرسال رمز التحقق",
      };
    }
  },

  // إرسال رمز التحقق إلى البريد الإلكتروني
  sendOtpToEmail: async (email) => {
    try {
      console.log("Sending OTP to email:", email);

      // استدعاء API لإرسال رمز التحقق إلى البريد الإلكتروني
      const response = await api.post("/auth/send-otp-email", { email });

      return {
        success: true,
        message: response.data.message || "تم إرسال رمز التحقق بنجاح",
      };
    } catch (error) {
      console.error("Send OTP to email error:", error);
      throw error.response?.data || {
        message: "حدث خطأ أثناء إرسال رمز التحقق",
      };
    }
  },

  // التحقق من صحة رمز التحقق
  verifyOtp: async (identifier, otp) => {
    try {
      console.log("Verifying OTP:", { identifier, otp });

      // تحديد نوع المعرف (هاتف أو بريد إلكتروني)
      const isEmail = identifier.includes("@");

      // استدعاء API للتحقق من صحة الرمز
      const response = await api.post("/auth/verify-otp", {
        [isEmail ? "email" : "phone"]: identifier,
        otp,
      });

      return {
        success: response.data.success,
        message:
          response.data.message ||
          (response.data.success ? "تم التحقق بنجاح" : "رمز التحقق غير صحيح"),
      };
    } catch (error) {
      console.error("Verify OTP error:", error);
      throw error.response?.data || {
        message: "حدث خطأ أثناء التحقق من الرمز",
      };
    }
  },
};

export default otpService;
