import { create } from "zustand";
import { persist } from "zustand/middleware";

// بيانات الأدمن الوهمية للاختبار
const mockAdmin = {
  id: 1,
  username: "admin",
  name: "مدير النظام",
  email: "admin@jobscope.com",
  role: "admin",
  permissions: [
    "manage_users",
    "manage_craftsmen",
    "manage_bookings",
    "manage_content",
  ],
  image: "https://randomuser.me/api/portraits/men/10.jpg",
};

const useAdminStore = create(
  persist(
    (set) => ({
      admin: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // تسجيل دخول الأدمن
      loginAdmin: async (credentials) => {
        set({ loading: true, error: null });
        try {
          // في تطبيق حقيقي، هنا سيتم إرسال طلب للخادم للتحقق من بيانات الاعتماد
          // لكن في هذا المثال، سنقوم بمحاكاة ذلك
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // التحقق من بيانات الاعتماد
          if (
            credentials.username === "admin" &&
            credentials.password === "admin123"
          ) {
            // إذا كان خيار "تذكرني" مفعل، سيتم حفظ بيانات الدخول
            const adminData = {
              admin: mockAdmin,
              isAuthenticated: true,
              loading: false,
              error: null,
            };

            // إذا كان خيار "تذكرني" غير مفعل، سيتم حذف بيانات الدخول عند إغلاق المتصفح
            if (!credentials.rememberMe) {
              // استخدام sessionStorage بدلاً من localStorage
              sessionStorage.setItem(
                "admin-session",
                JSON.stringify({
                  admin: mockAdmin,
                  isAuthenticated: true,
                })
              );
              // لا نحفظ في localStorage
              localStorage.removeItem("admin-storage");
            }

            set(adminData);
            return true;
          } else {
            set({
              loading: false,
              error: "اسم المستخدم أو كلمة المرور غير صحيحة",
            });
            return false;
          }
        } catch (error) {
          set({
            loading: false,
            error: error.message || "حدث خطأ أثناء تسجيل الدخول",
          });
          return false;
        }
      },

      // تسجيل خروج الأدمن
      logoutAdmin: () => {
        // مسح بيانات الجلسة من sessionStorage
        sessionStorage.removeItem("admin-session");
        // مسح بيانات الجلسة من localStorage
        localStorage.removeItem("admin-storage");

        set({
          admin: null,
          isAuthenticated: false,
        });
      },

      // إعادة تعيين حالة الخطأ
      resetError: () => {
        set({ error: null });
      },

      // تحديث بيانات الأدمن
      updateAdminProfile: (updatedData) => {
        set((state) => ({
          admin: {
            ...state.admin,
            ...updatedData,
          },
        }));

        // تحديث البيانات في sessionStorage إذا كانت موجودة
        const sessionData = sessionStorage.getItem("admin-session");
        if (sessionData) {
          const parsedData = JSON.parse(sessionData);
          sessionStorage.setItem(
            "admin-session",
            JSON.stringify({
              ...parsedData,
              admin: {
                ...parsedData.admin,
                ...updatedData,
              },
            })
          );
        }

        return true;
      },
    }),
    {
      name: "admin-storage", // اسم مفتاح التخزين في localStorage
      partialize: (state) => ({
        admin: state.admin,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAdminStore;
