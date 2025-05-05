import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../common/Button";
import LoadingButton from "../common/LoadingButton";
import useThemeStore from "../../store/themeStore";
import useUserStore from "../../store/userStore";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import notificationService from "../../services/notificationService";
import GoogleAccountSelector from "./GoogleAccountSelector";

const GoogleLoginModal = ({ isOpen, onClose, accountType }) => {
  const darkMode = useThemeStore((state) => state.darkMode);
  const login = useUserStore((state) => state.login);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState("select-account"); // select-account, initial, linking, complete, error
  const [error, setError] = useState("");
  const [googleProfile, setGoogleProfile] = useState(null);

  const handleAccountSelected = async (selectedAccount) => {
    setGoogleProfile(selectedAccount);
    setIsLoading(true);
    setError("");

    try {
      // استدعاء خدمة تسجيل الدخول باستخدام Google
      const response = await authService.googleLogin(accountType);

      if (response.success) {
        if (response.isNewAccount) {
          // إذا كان الحساب جديدًا، انتقل إلى خطوة ربط الحساب
          setStep("linking");
        } else {
          // إذا كان الحساب موجودًا، قم بتسجيل الدخول
          login(response.user, response.user.userType);

          // إضافة بعض الإشعارات التجريبية
          if (response.user.userType === "craftsman") {
            // إشعارات للحرفي
            notificationService.createBookingNotification(
              {
                id: 2001,
                clientName: "رامي سعيد",
                craftsmanName: response.user.name,
                createdAt: new Date().toISOString(),
              },
              "craftsman"
            );

            notificationService.createSystemNotification(
              "مرحباً بك في JobScope",
              "شكراً لتسجيلك في منصتنا. يمكنك الآن استقبال طلبات الخدمة."
            );
          } else {
            // إشعارات لطالب الخدمة
            notificationService.createSystemNotification(
              "مرحباً بك في JobScope",
              "شكراً لتسجيلك في منصتنا. يمكنك الآن البحث عن الحرفيين وطلب الخدمات."
            );
          }

          // الانتقال إلى الصفحة المناسبة
          setStep("complete");
          setTimeout(() => {
            onClose();
            navigate(
              response.user.userType === "craftsman" ? "/profile/my" : "/home"
            );
          }, 1500);
        }
      } else {
        setError("حدث خطأ أثناء تسجيل الدخول باستخدام Google");
        setStep("error");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setError(error.message || "حدث خطأ أثناء تسجيل الدخول باستخدام Google");
      setStep("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewAccount = () => {
    // إغلاق النافذة المنبثقة
    onClose();

    // الانتقال إلى صفحة التسجيل المناسبة مع تمرير بيانات Google
    if (accountType === "craftsman") {
      navigate("/register/craftsman", { state: { googleProfile } });
    } else {
      navigate("/register/client", { state: { googleProfile } });
    }
  };

  const handleLinkExistingAccount = () => {
    // إغلاق النافذة المنبثقة
    onClose();

    // الانتقال إلى صفحة تسجيل الدخول مع تمرير بيانات Google
    navigate("/login", { state: { googleProfile, linkAccount: true } });
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 50, scale: 0.95 },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        <motion.div
          className={`w-full max-w-md p-6 rounded-lg shadow-xl ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          } overflow-hidden`}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          {step === "select-account" && (
            <GoogleAccountSelector
              onSelect={handleAccountSelected}
              onCancel={onClose}
            />
          )}

          {step === "linking" && googleProfile && (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">ربط حساب Google</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  لم نجد حسابًا مرتبطًا بحساب Google الخاص بك
                </p>
              </div>

              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img
                    src={googleProfile.picture}
                    alt="صورة الملف الشخصي"
                    className="w-20 h-20 rounded-full object-cover border-4 border-indigo-200"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1 border-2 border-indigo-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="#4285F4"
                    >
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="text-center mb-6">
                <h3 className="font-bold text-lg">{googleProfile.name}</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {googleProfile.email}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  variant="primary"
                  fullWidth
                  className={`${
                    darkMode
                      ? "bg-gradient-to-r from-[#3730A3] to-[#4238C8] hover:from-[#322e92] hover:to-[#3b32b4]"
                      : "bg-gradient-to-r from-[#4238C8] to-[#3730A3] hover:from-[#3b32b4] hover:to-[#322e92]"
                  } text-white transition-all duration-200 shadow-md hover:shadow-lg text-base py-2 relative overflow-hidden group`}
                  onClick={handleCreateNewAccount}
                >
                  <span className="relative z-10">
                    إنشاء حساب جديد باستخدام Google
                  </span>
                  <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                </Button>

                <Button
                  variant="outline"
                  fullWidth
                  className={`${
                    darkMode
                      ? "border-indigo-600 text-indigo-300 hover:bg-indigo-900/30"
                      : "border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                  }`}
                  onClick={handleLinkExistingAccount}
                >
                  ربط بحساب موجود
                </Button>

                <Button
                  variant="outline"
                  fullWidth
                  className={`${
                    darkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={onClose}
                >
                  إلغاء
                </Button>
              </div>
            </>
          )}

          {step === "complete" && (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">تم تسجيل الدخول بنجاح</h2>
              <p className="text-gray-500 dark:text-gray-400">
                جاري تحويلك إلى الصفحة الرئيسية...
              </p>
            </div>
          )}

          {step === "error" && (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">حدث خطأ</h2>
              <p className="text-red-500 mb-4">{error}</p>
              <Button
                variant="primary"
                fullWidth
                className={`${
                  darkMode
                    ? "bg-gradient-to-r from-[#3730A3] to-[#4238C8]"
                    : "bg-gradient-to-r from-[#4238C8] to-[#3730A3]"
                } text-white`}
                onClick={() => setStep("select-account")}
              >
                حاول مرة أخرى
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GoogleLoginModal;
