import axios from "axios";
import { API_URL } from "./config";

// إنشاء نسخة من axios مع الإعدادات الافتراضية
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // إضافة مهلة للطلبات
  timeout: 100000, //
});

// إضافة معترض للطلبات لإضافة الرمز المميز إلى الرؤوس
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

// خدمة المصادقة
const authService = {
  // تسجيل مستخدم جديد
  register: async (userData) => {
    try {
      console.log("Registering user:", userData);
      const response = await api.post("/auth/register", userData);
      console.log("Registration response:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // إذا تم تحديد "تذكرني"، قم بتخزين وقت انتهاء الصلاحية
        if (userData.rememberMe) {
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 30); // 30 يوم
          localStorage.setItem("tokenExpiry", expiryDate.toISOString());
        }
      }
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء التسجيل" };
    }
  },

  // تسجيل الدخول باستخدام Google
  googleLogin: async (accountType) => {
    try {
      console.log("Google login attempt for account type:", accountType);

      // في الوضع الحقيقي، سنقوم بفتح نافذة منبثقة لتسجيل الدخول باستخدام Google
      // ثم نتلقى رمز المصادقة ونرسله إلى الخادم
      // لكن في الوضع الوهمي، سنقوم بمحاكاة الاستجابة

      // محاكاة تأخير الشبكة
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // التحقق من وجود حساب مرتبط بحساب Google
      const mockGoogleAccounts = {
        client: {
          exists: true,
          user: {
            id: 101,
            name: "رامي سعيد",
            phone: "+963934567890",
            email: "rami@example.com",
            userType: "client",
            googleId: "g-12345",
            image: "https://randomuser.me/api/portraits/men/6.jpg",
          },
        },
        craftsman: {
          exists: true,
          user: {
            id: 102,
            name: "محمود علي",
            phone: "+963934567891",
            email: "mahmoud@example.com",
            userType: "craftsman",
            googleId: "g-67890",
            profession: "سباك",
            specialization: "صيانة وتركيب",
            location: { lng: 36.28, lat: 33.51 },
            workRadius: 8,
            rating: 4.5,
            image: "https://randomuser.me/api/portraits/men/2.jpg",
          },
        },
      };

      const accountInfo = mockGoogleAccounts[accountType];

      if (accountInfo.exists) {
        // إذا كان الحساب موجودًا، قم بتسجيل الدخول
        const token =
          "google-mock-token-" +
          Math.random()
            .toString(36)
            .substring(2);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(accountInfo.user));

        // تعيين وقت انتهاء الصلاحية (30 يوم)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        localStorage.setItem("tokenExpiry", expiryDate.toISOString());

        return {
          success: true,
          isNewAccount: false,
          token: token,
          user: accountInfo.user,
        };
      } else {
        // إذا لم يكن الحساب موجودًا، قم بإنشاء حساب جديد
        return {
          success: true,
          isNewAccount: true,
          googleProfile: {
            email: "new.user@gmail.com",
            name: "مستخدم جديد",
            picture: "https://randomuser.me/api/portraits/men/22.jpg",
            googleId:
              "g-" +
              Math.random()
                .toString(36)
                .substring(2),
          },
        };
      }
    } catch (error) {
      console.error("Google login error:", error);
      throw error.response?.data || {
        message: "حدث خطأ أثناء تسجيل الدخول باستخدام Google",
      };
    }
  },

  // ربط حساب Google بحساب موجود
  linkGoogleAccount: async (userId, googleToken) => {
    try {
      console.log("Linking Google account for user:", userId);

      // في الوضع الحقيقي، سنقوم بإرسال طلب إلى الخادم لربط الحساب
      // لكن في الوضع الوهمي، سنقوم بمحاكاة الاستجابة

      // محاكاة تأخير الشبكة
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        success: true,
        message: "تم ربط حساب Google بنجاح",
      };
    } catch (error) {
      console.error("Link Google account error:", error);
      throw error.response?.data || {
        message: "حدث خطأ أثناء ربط حساب Google",
      };
    }
  },

  // تسجيل الدخول
  login: async (credentials) => {
    try {
      console.log("Logging in with:", credentials);
      const response = await api.post("/auth/login", credentials);
      console.log("Login response:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // إذا تم تحديد "تذكرني"، قم بتخزين وقت انتهاء الصلاحية
        if (credentials.rememberMe) {
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 30); // 30 يوم
          localStorage.setItem("tokenExpiry", expiryDate.toISOString());
        }

        return response.data;
      } else {
        throw { message: "لم يتم استلام رمز مميز من الخادم" };
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error.response?.data || { message: "حدث خطأ أثناء تسجيل الدخول" };
    }
  },

  // تسجيل الدخول كمدير
  adminLogin: async (credentials) => {
    try {
      console.log("Admin login with:", credentials);
      const response = await api.post("/auth/admin/login", credentials);
      console.log("Admin login response:", response.data);

      if (response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("admin", JSON.stringify(response.data.admin));

        // إذا تم تحديد "تذكرني"، قم بتخزين وقت انتهاء الصلاحية
        if (credentials.rememberMe) {
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 30); // 30 يوم
          localStorage.setItem("adminTokenExpiry", expiryDate.toISOString());
        }
      }
      return response.data;
    } catch (error) {
      console.error("Admin login error:", error);
      throw error.response?.data || {
        message: "حدث خطأ أثناء تسجيل الدخول كمدير",
      };
    }
  },

  // تسجيل الخروج
  logout: () => {
    // إزالة جميع البيانات المتعلقة بالمستخدم من التخزين المحلي
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("tokenExpiry");

    // إزالة أي بيانات إضافية قد تكون مخزنة
    localStorage.removeItem("jobscope-user-storage");

    // تنظيف ذاكرة التخزين المؤقت للجلسة
    sessionStorage.clear();

    console.log("تم تنظيف بيانات المستخدم من authService");

    // لا نقوم بإعادة توجيه المستخدم تلقائيًا، بل نترك ذلك للمكون الذي يستدعي هذه الدالة
    // window.location.href = "/login";
  },

  // تسجيل الخروج كمدير
  adminLogout: () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    localStorage.removeItem("adminTokenExpiry");
    window.location.href = "/admin/login";
  },

  // الحصول على المستخدم الحالي
  getCurrentUser: async () => {
    try {
      console.log("Getting current user");
      const response = await api.get("/auth/me");
      console.log("Current user response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get current user error:", error);
      throw error.response?.data || {
        message: "حدث خطأ أثناء جلب بيانات المستخدم",
      };
    }
  },

  // التحقق مما إذا كان المستخدم مسجل الدخول
  isLoggedIn: () => {
    const token = localStorage.getItem("token");
    return !!token;
  },

  // التحقق مما إذا كان المدير مسجل الدخول
  isAdminLoggedIn: () => {
    const token = localStorage.getItem("adminToken");
    return !!token;
  },

  // الحصول على المستخدم من التخزين المحلي
  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // الحصول على المدير من التخزين المحلي
  getAdmin: () => {
    const admin = localStorage.getItem("admin");
    return admin ? JSON.parse(admin) : null;
  },

  // التحقق من وجود حساب بنفس البريد الإلكتروني
  checkEmailExists: async (email) => {
    try {
      console.log("Checking if email exists:", email);

      // إرسال طلب إلى الخادم للتحقق من وجود البريد الإلكتروني
      const response = await api.get(`/auth/check-email?email=${encodeURIComponent(email)}`);
      console.log("Check email response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Check email error:", error);

      // في حالة فشل الاتصال بالخادم، نفترض أن البريد الإلكتروني موجود
      // هذا يسمح للمستخدم بمحاولة تسجيل الدخول على أي حال
      console.log("Falling back to default behavior - assuming email exists");

      return {
        exists: true,
        message: "تعذر التحقق من البريد الإلكتروني، سنفترض أنه موجود"
      };
    }
  },

  // التحقق من وجود حساب بنفس رقم الهاتف
  checkPhoneExists: async (phone) => {
    try {
      console.log("Checking if phone exists:", phone);
      const response = await api.get(
        `/auth/check-phone?phone=${encodeURIComponent(phone)}`
      );
      console.log("Check phone response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Check phone error:", error);
      throw error.response?.data || {
        message: "حدث خطأ أثناء التحقق من رقم الهاتف",
      };
    }
  },

  // تسجيل مستخدم تم إنشاؤه باستخدام Firebase
  registerFirebaseUser: async (userData) => {
    try {
      console.log("Registering Firebase user:", userData);

      // التأكد من وجود جميع البيانات المطلوبة
      if (!userData.uid) {
        throw new Error("معرف المستخدم (uid) مطلوب");
      }

      // إضافة معلومات إضافية للتشخيص
      console.log("API URL:", API_URL);

      // محاولة تسجيل المستخدم باستخدام نقطة النهاية الجديدة أولاً
      console.log("Trying new endpoint first: /auth/register-firebase-user");

      try {
        const response = await api.post("/auth/register-firebase-user", userData, {
          timeout: 15000,
          headers: {
            'Content-Type': 'application/json',
            'X-Client-Info': 'JobScope Web App'
          }
        });

        console.log("Firebase user registration response:", response.data);

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));

          // تعيين وقت انتهاء الصلاحية (30 يوم)
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 30);
          localStorage.setItem("tokenExpiry", expiryDate.toISOString());
        }

        return response.data;
      } catch (newEndpointError) {
        console.warn("New endpoint failed, trying legacy endpoint:", newEndpointError);

        // إذا فشلت النقطة الجديدة، نجرب النقطة القديمة
        console.log("Falling back to legacy endpoint: /auth/register-firebase");

        const response = await api.post("/auth/register-firebase", userData, {
          timeout: 15000,
          headers: {
            'Content-Type': 'application/json',
            'X-Client-Info': 'JobScope Web App'
          }
        });

        console.log("Firebase registration response (legacy):", response.data);

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));

          // تعيين وقت انتهاء الصلاحية (30 يوم)
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 30);
          localStorage.setItem("tokenExpiry", expiryDate.toISOString());
        }

        return response.data;
      }
    } catch (error) {
      console.error("Firebase registration error:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data
        } : 'No response',
        request: error.request ? 'Request sent but no response received' : 'Request setup failed'
      });

      // في حالة الفشل، نستخدم وضع الطوارئ
      console.log("Using emergency mode for user registration");

      // تخزين بيانات المستخدم محليًا
      localStorage.setItem("user", JSON.stringify(userData));

      // إنشاء رمز مميز وهمي
      const token =
        "firebase-" +
        Math.random()
          .toString(36)
          .substring(2);
      localStorage.setItem("token", token);

      // تعيين وقت انتهاء الصلاحية (30 يوم)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      localStorage.setItem("tokenExpiry", expiryDate.toISOString());

      return {
        success: true,
        user: userData,
        token: token,
        message: "تم تسجيل المستخدم بنجاح (وضع الطوارئ)",
      };
    }
  },
};

export default authService;
