import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import Layout from "../../components/layout/Layout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import LoadingButton from "../../components/common/LoadingButton";

import useUserStore from "../../store/userStore";
import useThemeStore from "../../store/themeStore";
import notificationService from "../../services/notificationService";
import authService from "../../services/authService";
import firebaseAuthService from "../../services/firebaseAuthService";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useUserStore((state) => state.login);
  const darkMode = useThemeStore((state) => state.darkMode);
  const savedCredentials = useUserStore((state) => state.savedCredentials);
  const rememberMe = useUserStore((state) => state.rememberMe);
  const setRememberMe = useUserStore((state) => state.setRememberMe);
  const setSavedCredentials = useUserStore(
    (state) => state.setSavedCredentials
  );

  // استخدام معلمة الاستعلام لتحديد نوع الحساب
  const queryParams = new URLSearchParams(location.search);
  const accountTypeFromQuery = queryParams.get("type");

  const [accountType, setAccountType] = useState(
    accountTypeFromQuery || savedCredentials?.accountType || "client"
  );
  const [formData, setFormData] = useState({
    email: savedCredentials?.email || "", // البريد الإلكتروني
    password: savedCredentials?.password || "", // كلمة المرور
  });
  const [errors, setErrors] = useState({});
  const [rememberMeChecked, setRememberMeChecked] = useState(rememberMe);
  // لم نعد بحاجة إلى متغير loginIdentifierType لأننا سنطلب كلا من رقم الهاتف والبريد الإلكتروني
  const [isLoading, setIsLoading] = useState(false);

  // مرجع لعنصر reCAPTCHA
  const recaptchaContainerRef = useRef(null);

  // إذا كانت هناك بيانات محفوظة، نقوم بتحديد نوع المعرف (هاتف أو بريد)
  useEffect(() => {
    if (savedCredentials?.identifier) {
      // تحديد ما إذا كان المعرف بريدًا إلكترونيًا أو رقم هاتف
      if (savedCredentials.identifier.includes("@")) {
        setLoginIdentifierType("email");
      } else {
        setLoginIdentifierType("phone");
      }
    }
  }, [savedCredentials]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // مسح الأخطاء عند كتابة المستخدم
    if (errors[name]) {
      // إذا كان الحقل هو المعرف، تأكد من مسح أي أخطاء متعلقة بنوع المعرف
      if (name === "identifier") {
        setErrors({
          ...errors,
          identifier: "",
          general: "",
        });
      } else {
        setErrors({
          ...errors,
          [name]: "",
        });
      }
    }
  };

  const validateLoginForm = () => {
    let isValid = true;
    const newErrors = {};

    // التحقق من البريد الإلكتروني
    if (!formData.email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "يرجى إدخال بريد إلكتروني صالح";
      isValid = false;
    }

    // التحقق من كلمة المرور
    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (validateLoginForm()) {
      setIsLoading(true);
      try {
        // التحقق من وجود البريد الإلكتروني
        const emailCheckResult = await authService.checkEmailExists(
          formData.email
        );
        console.log("Email check result:", emailCheckResult);

        // محاولة تسجيل الدخول باستخدام API
        let loginResult;
        try {
          loginResult = await authService.login({
            email: formData.email,
            password: formData.password,
            userType: accountType,
            rememberMe: rememberMeChecked,
          });

          console.log("Login result:", loginResult);
        } catch (loginError) {
          console.error("Login failed with error:", loginError);

          // إذا كان الخطأ هو "بيانات الاعتماد غير صالحة"، نحاول التحقق من Firebase
          if (loginError.message === "بيانات الاعتماد غير صالحة") {
            console.log("Attempting to verify with Firebase...");

            // محاولة تسجيل الدخول باستخدام Firebase
            console.log("Attempting Firebase login with:", {
              email: formData.email,
              passwordLength: formData.password.length,
            });

            const firebaseResult = await firebaseAuthService.loginWithEmailAndPassword(
              formData.email,
              formData.password
            );

            console.log("Firebase login result:", firebaseResult);

            if (firebaseResult.success) {
              console.log("Firebase login successful:", firebaseResult);

              // المستخدم موجود في Firebase ولكن غير موجود في قاعدة البيانات
              // نقوم بتسجيله في قاعدة البيانات
              const userData = {
                uid: firebaseResult.user.uid,
                name:
                  firebaseResult.user.name ||
                  formData.email.split("@")[0],
                email: formData.email,
                phone: "",
                userType: accountType,
                emailVerified: firebaseResult.user.emailVerified,
              };

              console.log(
                "Registering Firebase user with backend:",
                userData
              );

              // تسجيل المستخدم في قاعدة البيانات
              loginResult = await authService.registerFirebaseUser(
                userData
              );
              console.log("Registration result:", loginResult);
            } else {
              // إذا فشل تسجيل الدخول في Firebase أيضًا، نرمي الخطأ الأصلي
              throw loginError;
            }
          } else {
            // إذا كان الخطأ ليس "بيانات الاعتماد غير صالحة"، نرمي الخطأ
            throw loginError;
          }
        }

        // إعداد بيانات المستخدم من الاستجابة
        const userData = loginResult.user || {
          uid: loginResult.uid || "temp-uid",
          name: loginResult.name || "مستخدم",
          email: formData.email,
          phone: loginResult.phone || "",
          userType: accountType,
          emailVerified: true,
        };

        console.log("User data:", userData);

        // حفظ بيانات الاعتماد إذا تم تحديد خيار "تذكرني"
        if (rememberMeChecked) {
          const credentials = {
            email: formData.email,
            password: formData.password,
            accountType: accountType,
          };
          setSavedCredentials(credentials);
        } else {
          // إذا لم يتم تحديد خيار "تذكرني"، نقوم بمسح البيانات المحفوظة
          setSavedCredentials(null);
        }

        // تحديث خيار "تذكرني" في المخزن
        setRememberMe(rememberMeChecked);

        // تسجيل دخول المستخدم في المخزن المحلي
        login(
          userData,
          accountType,
          rememberMeChecked,
          rememberMeChecked
            ? {
                email: formData.email,
                password: formData.password,
                accountType: accountType,
              }
            : null
        );

        // إضافة بعض الإشعارات التجريبية
        if (accountType === "craftsman") {
          // إشعارات للحرفي
          notificationService.createBookingNotification(
            {
              id: 1001,
              clientName: "محمد أحمد",
              craftsmanName: userData.name,
              createdAt: new Date().toISOString(),
            },
            "craftsman"
          );

          notificationService.createSystemNotification(
            "تحديث في النظام",
            "تم تحديث سياسة الخصوصية الخاصة بالمنصة. يرجى الاطلاع عليها."
          );
        } else {
          // إشعارات لطالب الخدمة
          notificationService.createStatusChangeNotification(
            {
              id: 1003,
              clientName: userData.name,
              craftsmanName: "أحمد محمد",
              createdAt: new Date().toISOString(),
            },
            "accepted",
            "client"
          );

          notificationService.createSystemNotification(
            "عرض خاص",
            "احصل على خصم 10% على الخدمات المنزلية هذا الأسبوع!"
          );
        }

        // الانتقال إلى الصفحة المناسبة
        navigate(accountType === "craftsman" ? "/profile/my" : "/home");
      } catch (error) {
        console.error("Login error:", error);
        setErrors({
          ...errors,
          general: error.message || "حدث خطأ أثناء تسجيل الدخول",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    console.log("Google OAuth response:", credentialResponse);
    setIsLoading(true);

    try {
      // فك تشفير الرمز المميز JWT للحصول على معلومات المستخدم
      const decodedToken = jwtDecode(credentialResponse.credential);
      console.log("Decoded Google token:", decodedToken);

      // استخدام البيانات من JWT مباشرة بدلاً من استدعاء Firebase
      // هذا حل مؤقت حتى يتم إصلاح مشكلة الأصل في Google Cloud Console
      const userData = {
        uid: decodedToken.sub,
        name: decodedToken.name,
        email: decodedToken.email,
        phone: "",
        userType: accountType,
        googleId: decodedToken.sub,
        image: decodedToken.picture || "/img/user-avatar.svg",
        emailVerified: decodedToken.email_verified,
      };

      // تخطي استدعاء Firebase مؤقتًا
      /*
      const response = await firebaseAuthService.loginWithGoogle();

      if (!response.success) {
        throw new Error(response.error.message);
      }
      */

      // استخدام البيانات من JWT لتسجيل المستخدم في قاعدة البيانات
      console.log("Registering Google user with API:", userData);

      // حفظ بيانات المستخدم في قاعدة البيانات
      let registerResponse;
      try {
        // إضافة محاولات إعادة المحاولة في حالة فشل الاتصال
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
          try {
            registerResponse = await authService.registerFirebaseUser(userData);
            console.log("Registration response:", registerResponse);
            break; // الخروج من الحلقة في حالة النجاح
          } catch (err) {
            attempts++;
            console.error(
              `Error registering user with API (attempt ${attempts}/${maxAttempts}):`,
              err
            );

            if (attempts >= maxAttempts) {
              throw err; // إعادة رمي الخطأ بعد استنفاد جميع المحاولات
            }

            // انتظار قبل إعادة المحاولة
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
      } catch (error) {
        console.error("All attempts to register user with API failed:", error);
        // في حالة فشل التسجيل في قاعدة البيانات، استخدم البيانات مباشرة
        registerResponse = { user: userData };
      }

      // تسجيل دخول المستخدم في المخزن المحلي
      login(registerResponse.user || userData, accountType);

      // إضافة بعض الإشعارات التجريبية
      if (accountType === "craftsman") {
        // إشعارات للحرفي
        notificationService.createBookingNotification(
          {
            id: 2001,
            clientName: "عميل جديد",
            craftsmanName: userData.name,
            createdAt: new Date().toISOString(),
          },
          "craftsman"
        );

        notificationService.createSystemNotification(
          "مرحباً بك في JobScope",
          `مرحباً ${userData.name}، شكراً لتسجيلك في منصتنا. يمكنك الآن استقبال طلبات الخدمة.`
        );
      } else {
        // إشعارات لطالب الخدمة
        notificationService.createSystemNotification(
          "مرحباً بك في JobScope",
          `مرحباً ${userData.name}، شكراً لتسجيلك في منصتنا. يمكنك الآن البحث عن الحرفيين وطلب الخدمات.`
        );
      }

      // الانتقال إلى الصفحة المناسبة
      navigate(accountType === "craftsman" ? "/profile/my" : "/home");
    } catch (error) {
      console.error("Error with Google login:", error);
      setErrors({
        ...errors,
        general: error.message || "حدث خطأ أثناء تسجيل الدخول باستخدام Google",
      });
      handleGoogleLoginError();
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    console.error("Google login failed");
  };

  return (
    <Layout hideFooter>
      <div
        className={`min-h-screen py-8 md:py-12 ${
          darkMode
            ? "bg-gray-900"
            : "bg-gradient-to-br from-blue-50 to-indigo-100"
        } transition-colors duration-300`}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
            }
          }
        `,
          }}
        />
        <div className="container mx-auto px-4 pb-4">
          <motion.div
            className={`max-w-lg mx-auto rounded-lg shadow-xl overflow-hidden border-2 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-indigo-200"
            } transition-colors duration-300`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="p-4 sm:p-6">
              <h2
                className={`text-2xl font-bold text-center mb-4 ${
                  darkMode ? "text-indigo-300" : "text-indigo-800"
                } relative transition-colors duration-300`}
              >
                <span className="relative z-10">تسجيل الدخول</span>
                <span
                  className={`absolute bottom-0 left-0 right-0 h-3 ${
                    darkMode ? "bg-indigo-500" : "bg-indigo-300"
                  } opacity-40 transform -rotate-1 z-0`}
                ></span>
              </h2>

              {/* Account Type Selection */}
              <div className="mb-6">
                <label className="block text-indigo-700 font-medium mb-2">
                  نوع الحساب
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className={`p-2 rounded-md border transition-all duration-300 shadow-sm relative overflow-hidden group ${
                      accountType === "craftsman"
                        ? "border-indigo-500 bg-gradient-to-r from-blue-50 to-indigo-100 text-indigo-700 shadow-md"
                        : "border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                    }`}
                    onClick={() => setAccountType("craftsman")}
                  >
                    <span className="relative z-10">حرفي</span>
                    <span
                      className={`absolute inset-0 bg-indigo-50 opacity-0 transform -skew-x-12 -translate-x-full transition-all duration-500 ${
                        accountType !== "craftsman"
                          ? "group-hover:translate-x-full group-hover:opacity-50"
                          : ""
                      }`}
                    ></span>
                  </button>
                  <button
                    type="button"
                    className={`p-2 rounded-md border transition-all duration-300 shadow-sm relative overflow-hidden group ${
                      accountType === "client"
                        ? "border-indigo-500 bg-gradient-to-r from-blue-50 to-indigo-100 text-indigo-700 shadow-md"
                        : "border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                    }`}
                    onClick={() => setAccountType("client")}
                  >
                    <span className="relative z-10">طالب خدمة</span>
                    <span
                      className={`absolute inset-0 bg-indigo-50 opacity-0 transform -skew-x-12 -translate-x-full transition-all duration-500 ${
                        accountType !== "client"
                          ? "group-hover:translate-x-full group-hover:opacity-50"
                          : ""
                      }`}
                    ></span>
                  </button>
                </div>
              </div>

              {/* رسالة الخطأ */}
              {errors.general && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {errors.general}
                </div>
              )}

              {/* عنصر reCAPTCHA غير مرئي */}
              <div id="recaptcha-container" ref={recaptchaContainerRef}></div>

              {/* نموذج تسجيل الدخول */}
              <form onSubmit={handleLogin}>
                {/* حقل البريد الإلكتروني */}
                <Input
                  label="البريد الإلكتروني"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="أدخل البريد الإلكتروني"
                  error={errors.email}
                  required
                  className="text-base py-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mb-3"
                  dir="ltr"
                />



                <Input
                  label="كلمة المرور"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="أدخل كلمة المرور"
                  error={errors.password}
                  required
                  className="text-base py-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />

                <div className="mt-4 flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMeChecked}
                    onChange={(e) => setRememberMeChecked(e.target.checked)}
                    className="ml-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="rememberMe"
                    className={`${
                      darkMode ? "text-gray-300" : "text-indigo-700"
                    } text-sm font-medium`}
                  >
                    تذكرني
                  </label>
                </div>

                <LoadingButton
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={isLoading}
                  loadingText="جاري تسجيل الدخول..."
                  className={`mt-4 ${
                    darkMode
                      ? "bg-gradient-to-r from-[#3730A3] to-[#4238C8] hover:from-[#322e92] hover:to-[#3b32b4]"
                      : "bg-gradient-to-r from-[#4238C8] to-[#3730A3] hover:from-[#3b32b4] hover:to-[#322e92]"
                  } text-white transition-all duration-200 shadow-md hover:shadow-lg text-base py-2 relative overflow-hidden group`}
                  style={{
                    animation: isLoading ? "none" : "pulse 2s infinite",
                  }}
                >
                  <span className="relative z-10">تسجيل الدخول</span>
                  <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                </LoadingButton>
              </form>

              {/* فاصل أفقي مع نص "أو" */}
              <div className="mt-8 mb-6 relative flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    darkMode
                      ? "bg-gray-700 text-indigo-300"
                      : "bg-indigo-100 text-indigo-600"
                  } mx-4 text-sm font-medium`}
                >
                  أو
                </span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* تسجيل الدخول باستخدام Google */}
              <div className="mb-6">
                <div className="flex justify-center w-full">
                  <div
                    className={`w-full max-w-xs ${
                      darkMode ? "opacity-90 hover:opacity-100" : ""
                    } transition-all duration-300 hover:shadow-md rounded-full`}
                  >
                    <GoogleLogin
                      onSuccess={handleGoogleLogin}
                      onError={handleGoogleLoginError}
                      text="signin_with"
                      shape="pill"
                      locale="ar"
                      theme={darkMode ? "filled_black" : "outline"}
                      logo_alignment="center"
                      width="300"
                      useOneTap={true}
                      auto_select={false}
                    />
                  </div>
                </div>
                <p
                  className={`text-xs text-center mt-2 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  تسجيل الدخول بحساب Google الخاص بك
                </p>
              </div>

              {/* قسم إنشاء حساب جديد */}
              <div className="mt-8 mb-6">
                <div
                  className={`p-4 rounded-lg ${
                    darkMode ? "bg-gray-700/50" : "bg-indigo-50"
                  } border ${
                    darkMode ? "border-gray-600" : "border-indigo-200"
                  }`}
                >
                  <h3
                    className={`text-lg font-bold mb-3 text-center ${
                      darkMode ? "text-indigo-300" : "text-indigo-700"
                    }`}
                  >
                    ليس لديك حساب؟
                  </h3>
                  <p
                    className={`text-sm mb-4 text-center ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    اختر نوع الحساب الذي تريد إنشاؤه:
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/register/client" className="w-full">
                      <Button
                        variant="primary"
                        className={`${
                          darkMode
                            ? "bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800"
                            : "bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700"
                        } text-white transition-all duration-200 shadow-md hover:shadow-lg relative overflow-hidden group py-2 px-4 w-full`}
                      >
                        <span className="relative z-10 font-medium">
                          طالب خدمة
                        </span>
                        <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                      </Button>
                    </Link>

                    <Link to="/register/craftsman" className="w-full">
                      <Button
                        variant="primary"
                        className={`${
                          darkMode
                            ? "bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800"
                            : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                        } text-white transition-all duration-200 shadow-md hover:shadow-lg relative overflow-hidden group py-2 px-4 w-full`}
                      >
                        <span className="relative z-10 font-medium">حرفي</span>
                        <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* رابط العودة للصفحة الرئيسية */}
              <div className="mt-4 text-center">
                <Link
                  to="/"
                  className={`inline-flex items-center gap-1 text-indigo-500 hover:text-indigo-700 transition-colors duration-200 ${
                    darkMode ? "hover:bg-gray-700/50" : "hover:bg-indigo-50"
                  } px-3 py-1 rounded-md`}
                >
                  <span>العودة إلى الصفحة الرئيسية</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 rtl:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </Link>
              </div>

              {/* إضافة مساحة إضافية في الأسفل للتأكد من ظهور جميع المحتويات */}
              <div className="h-2"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
