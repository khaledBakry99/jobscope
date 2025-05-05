import { create } from "zustand";
import { persist } from "zustand/middleware";

// بيانات المستخدمين الوهمية للاختبار
const mockUsers = {
  clients: [
    {
      id: 1,
      name: "أحمد محمد",
      email: "ahmed@example.com",
      phone: "0923456789",
      address: "دمشق، سوريا",
      profilePicture: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: 2,
      name: "سارة أحمد",
      email: "sara@example.com",
      phone: "0934567890",
      address: "حلب، سوريا",
      profilePicture: "https://randomuser.me/api/portraits/women/2.jpg",
    },
  ],
  craftsmen: [
    {
      id: 1,
      name: "محمد الخطيب",
      email: "mohammad@example.com",
      phone: "0912345678",
      address: "دمشق، سوريا",
      professions: ["سباكة"],
      specializations: ["إصلاح تسربات المياه", "تركيب حنفيات", "صيانة سخانات"],
      rating: 4.8,
      profilePicture: "https://randomuser.me/api/portraits/men/3.jpg",
      location: { lat: 33.5138, lng: 36.2765 }, // دمشق، سوريا
      workRadius: 5,
      bio:
        "أعمل في مجال السباكة منذ 10 سنوات، متخصص في إصلاح تسربات المياه وتركيب الحنفيات وصيانة السخانات.",
      streetsInWorkRange: [
        "شارع الثورة",
        "شارع بغداد",
        "شارع الحمراء",
        "شارع فيصل",
        "شارع النصر",
        "شارع الجلاء",
        "شارع 29 أيار",
        "شارع المزرعة",
      ],
      hospitalsInWorkRange: [
        "مشفى المواساة",
        "مشفى الأسد الجامعي",
        "مشفى المجتهد",
        "مشفى الأطفال",
        "مشفى التوليد",
        "عيادات إشراق الطبية",
        "مركز Diamond smiles",
      ],
      mosquesInWorkRange: [
        "جامع الأموي الكبير",
        "جامع الإيمان",
        "جامع الرحمن",
        "جامع النور",
        "جامع الصحابة",
      ],
      workingHours: {
        saturday: { isWorking: true, from: "09:00", to: "17:00" },
        sunday: { isWorking: true, from: "09:00", to: "17:00" },
        monday: { isWorking: true, from: "09:00", to: "17:00" },
        tuesday: { isWorking: true, from: "09:00", to: "17:00" },
        wednesday: { isWorking: true, from: "09:00", to: "17:00" },
        thursday: { isWorking: false, from: "09:00", to: "17:00" },
        friday: { isWorking: false, from: "09:00", to: "17:00" },
      },
    },
    {
      id: 2,
      name: "عمر السيد",
      email: "omar@example.com",
      phone: "0945678901",
      address: "حمص، سوريا",
      professions: ["نجارة"],
      specializations: ["صناعة أثاث", "تركيب أبواب", "إصلاح خزائن"],
      rating: 4.5,
      profilePicture: "https://randomuser.me/api/portraits/men/4.jpg",
      location: { lat: 34.7324, lng: 36.7266 }, // حمص، سوريا
      workRadius: 3,
      bio:
        "نجار محترف مع خبرة 15 عامًا في صناعة الأثاث وتركيب الأبواب وإصلاح الخزائن.",
      streetsInWorkRange: [
        "شارع الحضارة",
        "شارع الوليد",
        "شارع الغوطة",
        "شارع القاهرة",
        "شارع الزهراء",
      ],
      hospitalsInWorkRange: [
        "مشفى الحكمة",
        "مشفى الرازي",
        "وحدة الأسنان",
        "عيادة الشام",
      ],
      mosquesInWorkRange: ["جامع خالد بن الوليد", "جامع النور", "جامع الإيمان"],
      workingHours: {
        saturday: { isWorking: true, from: "10:00", to: "18:00" },
        sunday: { isWorking: true, from: "10:00", to: "18:00" },
        monday: { isWorking: true, from: "10:00", to: "18:00" },
        tuesday: { isWorking: false, from: "10:00", to: "18:00" },
        wednesday: { isWorking: false, from: "10:00", to: "18:00" },
        thursday: { isWorking: true, from: "10:00", to: "18:00" },
        friday: { isWorking: true, from: "10:00", to: "18:00" },
      },
    },
  ],
};

const useUserStore = create(
  persist(
    (set) => ({
      user: mockUsers.craftsmen[0], // تسجيل دخول افتراضي كحرفي
      isAuthenticated: true,
      userType: "craftsman", // 'craftsman' or 'client'
      rememberMe: false, // إضافة خيار تذكرني
      savedCredentials: null, // حفظ بيانات الاعتماد للمستخدم

      login: (userData, type, rememberMe = false, credentials = null) =>
        set({
          user: userData,
          isAuthenticated: true,
          userType: type,
          rememberMe,
          savedCredentials: rememberMe ? credentials : null,
        }),

      logout: () => {
        // حذف الرمز المميز من localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("tokenExpiry");

        // إزالة أي بيانات إضافية قد تكون مخزنة
        localStorage.removeItem("jobscope-user-storage");

        // تنظيف ذاكرة التخزين المؤقت للجلسة
        sessionStorage.clear();

        console.log("تم تنظيف بيانات المستخدم من userStore");

        set((state) => ({
          user: null,
          isAuthenticated: false,
          userType: null,
          // الاحتفاظ ببيانات الاعتماد إذا كان خيار تذكرني مفعل
          savedCredentials: state.rememberMe ? state.savedCredentials : null,
          // الاحتفاظ بخيار تذكرني حتى بعد تسجيل الخروج
          rememberMe: state.rememberMe,
        }));

        // إعادة تعيين حالة المتصفح لضمان تحديث جميع المكونات
        setTimeout(() => {
          console.log("تم إعادة تعيين حالة المتصفح");
        }, 100);
      },

      updateUser: (userData) =>
        set((state) => ({
          user: { ...state.user, ...userData },
        })),

      // تحديث خيار تذكرني
      setRememberMe: (value) =>
        set({
          rememberMe: value,
        }),

      // تحديث بيانات الاعتماد المحفوظة
      setSavedCredentials: (credentials) =>
        set({
          savedCredentials: credentials,
        }),

      // مسح بيانات الاعتماد المحفوظة
      clearSavedCredentials: () =>
        set({
          savedCredentials: null,
        }),
    }),
    {
      name: "jobscope-user-storage",
    }
  )
);

export default useUserStore;
