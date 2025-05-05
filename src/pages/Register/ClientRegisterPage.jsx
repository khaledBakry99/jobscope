import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../../components/layout/Layout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import LoadingButton from "../../components/common/LoadingButton";
import CountryCodeSelectButtons from "../../components/common/CountryCodeSelectButtons";
import useUserStore from "../../store/userStore";
import useThemeStore from "../../store/themeStore";
import authService from "../../services/authService";
import firebaseAuthService from "../../services/firebaseAuthService";

const ClientRegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useUserStore((state) => state.login);
  const darkMode = useThemeStore((state) => state.darkMode);

  // التحقق من وجود بيانات Google في حالة الانتقال
  const googleProfile = location.state?.googleProfile;

  const [step, setStep] = useState(1);
  // نستخدم البريد الإلكتروني دائمًا للتسجيل والتأكيد
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [formData, setFormData] = useState({
    name: googleProfile?.name || "",
    phone: "",
    countryCode: "+963", // تعيين رمز سوريا كقيمة افتراضية
    email: googleProfile?.email || "",
    password: "",
    confirmPassword: "",
    otp: "",
    googleId: googleProfile?.googleId || "",
    image: googleProfile?.picture || "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  // لم نعد بحاجة إلى متغير otpSent
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // مرجع لعنصر reCAPTCHA
  const recaptchaContainerRef = useRef(null);

  // تنظيف reCAPTCHA عند تفكيك المكون
  useEffect(() => {
    return () => {
      // إعادة تعيين متغير recaptchaVerifier عند تفكيك المكون
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        } catch (error) {
          console.error("Error clearing recaptcha:", error);
        }
      }
    };
  }, []);

  // إذا كان هناك ملف شخصي من Google، قم بملء البيانات تلقائيًا
  useEffect(() => {
    if (googleProfile) {
      setRegisterMethod("email");
      setFormData((prev) => ({
        ...prev,
        name: googleProfile.name || prev.name,
        email: googleProfile.email || prev.email,
        googleId: googleProfile.googleId || prev.googleId,
        image: googleProfile.picture || prev.image,
      }));
    }
  }, [googleProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // مسح الخطأ عند الكتابة
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateStep1 = () => {
    let isValid = true;
    const newErrors = {};

    // التحقق من الاسم
    if (!formData.name) {
      newErrors.name = "الاسم مطلوب";
      isValid = false;
    } else if (formData.name.length < 3) {
      newErrors.name = "يجب أن يتكون الاسم من 3 أحرف على الأقل";
      isValid = false;
    }

    // التحقق من رقم الهاتف (إلزامي)
    if (!formData.phone) {
      newErrors.phone = "رقم الهاتف مطلوب";
      isValid = false;
    } else {
      // التحقق من صحة رقم الهاتف بناءً على رمز الدولة
      if (formData.countryCode === "+963") {
        // التحقق من رقم الهاتف السوري
        // يجب أن يبدأ بـ 9 ويتكون من 9 أرقام إجمالاً
        const cleanedPhone = formData.phone
          .replace(/^0+/, "")
          .replace(/\D/g, "");
        if (!/^9\d{8}$/.test(cleanedPhone)) {
          newErrors.phone = "يرجى إدخال رقم هاتف سوري صالح (9 أرقام تبدأ بـ 9)";
          isValid = false;
        }
      } else if (formData.countryCode === "+1") {
        // التحقق من رقم الهاتف الأمريكي
        // يجب أن يتكون من 10 أرقام (منطقة 3 أرقام + 7 أرقام)
        // إزالة أي أحرف غير رقمية (مثل المسافات والشرطات والأقواس)
        const cleanedPhone = formData.phone.replace(/\D/g, "");
        console.log("Validating US phone:", cleanedPhone);

        // قبول الأرقام الأمريكية بطول 10 أرقام
        if (cleanedPhone.length !== 10) {
          newErrors.phone = "يرجى إدخال رقم هاتف أمريكي صالح (10 أرقام)";
          isValid = false;
        }
      } else {
        // التحقق العام من رقم الهاتف
        const cleanedPhone = formData.phone
          .replace(/^0+/, "")
          .replace(/\D/g, "");
        if (cleanedPhone.length < 7 || cleanedPhone.length > 15) {
          newErrors.phone = "يرجى إدخال رقم هاتف صالح";
          isValid = false;
        }
      }
    }

    // التحقق من البريد الإلكتروني (إلزامي)
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

    // التحقق من تأكيد كلمة المرور
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "تأكيد كلمة المرور مطلوب";
      isValid = false;
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "كلمات المرور غير متطابقة";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // إضافة تأثير العد التنازلي لإعادة إرسال رمز التحقق
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  // لم نعد بحاجة إلى وظيفة validateStep2 لأننا نستخدم البريد الإلكتروني للتأكيد

  // إرسال رمز التحقق عبر البريد الإلكتروني
  const sendVerificationCode = async () => {
    try {
      setIsLoading(true);
      setErrors({});

      // إرسال رابط التحقق إلى البريد الإلكتروني
      const response = await firebaseAuthService.registerWithEmailAndPassword(
        formData.email,
        formData.password,
        formData.name
      );

      if (!response.success) {
        throw new Error(response.error.message);
      }

      console.log("Email registration response:", response);

      // تخزين معرف المستخدم وتعيين حالة إرسال البريد الإلكتروني
      setFormData({
        ...formData,
        uid: response.user.uid,
      });

      // تعيين حالة إرسال البريد الإلكتروني
      setEmailVerificationSent(true);

      // تعطيل زر إعادة الإرسال لمدة 60 ثانية
      setResendDisabled(true);
      setResendCountdown(60);

      // الانتقال إلى الخطوة التالية
      setStep(2);

      return true;
    } catch (error) {
      console.error("Error sending verification code:", error);

      // التحقق من نوع الخطأ
      if (error.message && error.message.includes("أمريكي")) {
        // إذا كان الخطأ متعلقًا برقم هاتف أمريكي، نعرض رسالة خطأ مع خيار التبديل إلى البريد الإلكتروني
        setErrors({
          ...errors,
          general: (
            <div>
              <p>{error.message}</p>
              <button
                type="button"
                onClick={() => setRegisterMethod("email")}
                className="mt-2 text-indigo-600 hover:text-indigo-800 underline"
              >
                التسجيل باستخدام البريد الإلكتروني بدلاً من ذلك
              </button>
            </div>
          ),
        });
      } else {
        // خطأ آخر
        setErrors({
          ...errors,
          general: error.message || "حدث خطأ أثناء إرسال رمز التحقق",
        });
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // إعادة إرسال رابط التحقق للبريد الإلكتروني
  const handleResendOtp = async () => {
    if (!resendDisabled) {
      // إعادة إرسال رابط التحقق للبريد الإلكتروني
      setIsLoading(true);
      try {
        // الحصول على المستخدم الحالي من Firebase
        const currentUser = firebaseAuthService.getCurrentUser();

        if (currentUser) {
          // إرسال بريد إلكتروني للتحقق
          await firebaseAuthService.sendEmailVerificationAgain(currentUser);

          // تعطيل زر إعادة الإرسال لمدة 60 ثانية
          setResendDisabled(true);
          setResendCountdown(60);

          // عرض رسالة نجاح
          setErrors({
            ...errors,
            general:
              "تم إعادة إرسال رابط التحقق بنجاح. يرجى التحقق من بريدك الإلكتروني.",
          });
        } else {
          throw new Error("لم يتم العثور على المستخدم");
        }
      } catch (error) {
        console.error("Error resending verification email:", error);
        setErrors({
          ...errors,
          general: error.message || "حدث خطأ أثناء إعادة إرسال رابط التحقق",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleNextStep = async (e) => {
    e.preventDefault();

    if (validateStep1()) {
      // التحقق من عدم وجود حساب بنفس البريد الإلكتروني ورقم الهاتف
      setIsLoading(true);
      try {
        // تنسيق رقم الهاتف مع رمز الدولة
        const cleanedPhone = formData.phone
          .replace(/\D/g, "")
          .replace(/^0+/, "");
        const countryCode = formData.countryCode || "+963"; // استخدام رمز سوريا كقيمة افتراضية إذا كان رمز الدولة غير محدد

        // تنسيق رقم الهاتف بناءً على رمز الدولة
        let fullPhoneNumber;
        if (countryCode === "+1") {
          // للأرقام الأمريكية، نتأكد من أن الرقم يتكون من 10 أرقام
          if (cleanedPhone.length === 10) {
            fullPhoneNumber = countryCode + cleanedPhone;
          } else {
            setErrors({
              ...errors,
              phone: "يرجى إدخال رقم هاتف أمريكي صالح (10 أرقام)",
            });
            setIsLoading(false);
            return;
          }
        } else {
          // للأرقام الأخرى
          fullPhoneNumber = countryCode + cleanedPhone;
        }

        console.log("Checking phone number:", fullPhoneNumber);

        // التحقق من عدم وجود حساب بنفس رقم الهاتف
        const phoneCheckResponse = await authService.checkPhoneExists(
          fullPhoneNumber
        );
        if (phoneCheckResponse.exists) {
          setErrors({
            ...errors,
            phone: "رقم الهاتف مستخدم بالفعل، الرجاء استخدام رقم هاتف آخر",
          });
          setIsLoading(false);
          return;
        }

        // التحقق من عدم وجود حساب بنفس البريد الإلكتروني
        const emailCheckResponse = await authService.checkEmailExists(
          formData.email
        );
        if (emailCheckResponse.exists) {
          setErrors({
            ...errors,
            email:
              "البريد الإلكتروني مستخدم بالفعل، الرجاء استخدام بريد إلكتروني آخر",
          });
          setIsLoading(false);
          return;
        }

        // إرسال رمز التحقق عبر البريد الإلكتروني
        await sendVerificationCode();
      } catch (error) {
        console.error("Error checking existing account:", error);
        setErrors({
          ...errors,
          general: error.message || "حدث خطأ أثناء التحقق من البيانات",
        });
        setIsLoading(false);
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // التحقق من تأكيد البريد الإلكتروني
    setIsLoading(true);
    try {
      // الحصول على المستخدم الحالي من Firebase
      const currentUser = firebaseAuthService.getCurrentUser();

      if (currentUser) {
        // التحقق من تأكيد البريد الإلكتروني
        if (currentUser.emailVerified) {
          // إعداد بيانات المستخدم للتخزين في قاعدة البيانات الخاصة بنا
          // تنسيق رقم الهاتف مع رمز الدولة
          const cleanedPhone = formData.phone
            .replace(/\D/g, "")
            .replace(/^0+/, "");
          const countryCode = formData.countryCode || "+963";
          const fullPhoneNumber = countryCode + cleanedPhone;

          const userData = {
            uid: currentUser.uid,
            name: formData.name,
            phone: fullPhoneNumber,
            email: currentUser.email,
            userType: "client",
            // إضافة معرف Google وصورة الملف الشخصي إذا كان التسجيل باستخدام Google
            googleId: formData.googleId || null,
            image: formData.image || currentUser.photoURL || null,
          };

          console.log("Registering client with Firebase:", userData);

          // حفظ بيانات المستخدم في قاعدة البيانات الخاصة بنا
          const response = await authService.registerFirebaseUser(userData);
          console.log("Registration response:", response);

          // تسجيل دخول المستخدم في المخزن المحلي
          login(response.user || userData, "client");

          // الانتقال إلى الصفحة الرئيسية
          navigate("/home");
        } else {
          // البريد الإلكتروني غير مؤكد
          setErrors({
            ...errors,
            general: "يرجى تأكيد بريدك الإلكتروني قبل المتابعة",
          });
        }
      } else {
        // المستخدم غير مسجل دخول
        setErrors({
          ...errors,
          general: "يرجى إنشاء حساب جديد",
        });
        // العودة إلى الخطوة الأولى
        setStep(1);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        ...errors,
        general: error.message || "حدث خطأ أثناء التسجيل",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout hideFooter>
      <div
        className={`min-h-screen py-12 ${
          darkMode
            ? "bg-gray-900"
            : "bg-gradient-to-br from-blue-50 to-indigo-100"
        } transition-colors duration-300`}
      >
        <div className="container mx-auto px-4">
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
            <div className="p-6">
              <h2
                className={`text-2xl font-bold text-center mb-4 ${
                  darkMode ? "text-indigo-300" : "text-indigo-800"
                } relative transition-colors duration-300`}
              >
                <span className="relative z-10">إنشاء حساب جديد</span>
                <span
                  className={`absolute bottom-0 left-0 right-0 h-3 ${
                    darkMode ? "bg-indigo-500" : "bg-indigo-300"
                  } opacity-40 transform -rotate-1 z-0`}
                ></span>
              </h2>

              <div className="mb-4 text-center">
                <p
                  className={`${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  } text-sm`}
                >
                  سجل كطالب خدمة للوصول إلى أفضل الحرفيين في منطقتك
                </p>
              </div>

              {/* رسالة الخطأ */}
              {errors.general && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {typeof errors.general === "string"
                    ? errors.general
                    : errors.general}
                </div>
              )}

              {/* عنصر reCAPTCHA غير مرئي */}
              <div id="recaptcha-container" ref={recaptchaContainerRef}></div>

              {step === 1 ? (
                <form onSubmit={handleNextStep}>
                  <Input
                    label="الاسم الكامل"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="أدخل اسمك الكامل"
                    error={errors.name}
                    required
                    className="text-base py-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mb-3"
                  />

                  {/* حقل إدخال رقم الهاتف */}
                  <div className="mb-3">
                    <label className="block text-indigo-700 font-medium mb-2">
                      رقم الهاتف
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {/* حقل إدخال رقم الهاتف (على اليمين) */}
                      <div className="col-span-2 rounded-md border border-indigo-200 focus-within:border-indigo-500 focus-within:ring focus-within:ring-indigo-200 focus-within:ring-opacity-50">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="أدخل رقم الهاتف"
                          required
                          className="w-full py-2 px-3 outline-none border-0 focus:ring-0 text-base"
                          dir="ltr"
                        />
                      </div>
                      {/* رمز الدولة (على اليسار) */}
                      <div className="relative rounded-md border border-indigo-200 focus-within:border-indigo-500 focus-within:ring focus-within:ring-indigo-200 focus-within:ring-opacity-50">
                        <CountryCodeSelectButtons
                          value={formData.countryCode || "+963"}
                          onChange={(code) => {
                            console.log("Country code changed to:", code);
                            setFormData({ ...formData, countryCode: code });
                          }}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* حقل إدخال البريد الإلكتروني */}
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
                    className="text-base py-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 "
                  />

                  <Input
                    label="تأكيد كلمة المرور"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="أعد إدخال كلمة المرور"
                    error={errors.confirmPassword}
                    required
                    className="text-base py-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />

                  <LoadingButton
                    type="submit"
                    variant="primary"
                    fullWidth
                    isLoading={isLoading}
                    loadingText="جاري التحقق..."
                    className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white transition-all duration-200 shadow-md hover:shadow-lg text-base py-2 relative overflow-hidden group"
                  >
                    <span className="relative z-10">متابعة</span>
                    <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  </LoadingButton>
                </form>
              ) : (
                <form onSubmit={handleRegister}>
                  {/* عرض رسالة التحقق من البريد الإلكتروني */}
                  <div
                    className={`mb-6 p-4 rounded-lg ${
                      darkMode ? "bg-indigo-900/20" : "bg-indigo-50"
                    } border ${
                      darkMode ? "border-indigo-800" : "border-indigo-200"
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          darkMode ? "bg-indigo-800" : "bg-indigo-100"
                        } mr-3`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 ${
                            darkMode ? "text-indigo-300" : "text-indigo-600"
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3
                          className={`font-bold ${
                            darkMode ? "text-indigo-300" : "text-indigo-700"
                          }`}
                        >
                          تحقق من بريدك الإلكتروني
                        </h3>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          تم إرسال رابط التحقق إلى{" "}
                          <span className="font-medium">{formData.email}</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-white rounded-lg border border-indigo-100 shadow-sm">
                      <p className="text-gray-700 mb-3">
                        لإكمال عملية التسجيل، يرجى:
                      </p>
                      <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm">
                        <li>فتح بريدك الإلكتروني</li>
                        <li>البحث عن رسالة من JobScope</li>
                        <li>النقر على رابط التحقق في الرسالة</li>
                        <li>
                          العودة إلى هذه الصفحة والنقر على زر "تحقق من التأكيد"
                        </li>
                      </ol>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <button
                        type="button"
                        className={`text-sm ${
                          darkMode ? "text-indigo-400" : "text-indigo-600"
                        } hover:underline flex items-center`}
                        onClick={() => setStep(1)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 17l-5-5m0 0l5-5m-5 5h12"
                          />
                        </svg>
                        تعديل البيانات
                      </button>

                      <button
                        type="button"
                        className={`text-sm ${
                          darkMode ? "text-indigo-400" : "text-indigo-600"
                        } hover:underline flex items-center ${
                          resendDisabled ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={handleResendOtp}
                        disabled={resendDisabled}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        {resendDisabled
                          ? `إعادة الإرسال (${resendCountdown})`
                          : "إعادة إرسال رابط التحقق"}
                      </button>
                    </div>
                  </div>

                  {/* زر التحقق من التأكيد */}
                  <LoadingButton
                    type="submit"
                    variant="primary"
                    fullWidth
                    isLoading={isLoading}
                    loadingText="جاري التحقق..."
                    className={`mt-4 ${
                      darkMode
                        ? "bg-gradient-to-r from-indigo-700 to-blue-700 hover:from-indigo-800 hover:to-blue-800"
                        : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                    } text-white transition-all duration-200 shadow-md hover:shadow-lg text-base py-2 relative overflow-hidden group`}
                  >
                    <span className="relative z-10">تحقق من التأكيد</span>
                    <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  </LoadingButton>

                  {/* زر الانتقال إلى صفحة تسجيل الدخول */}
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      هل قمت بتأكيد بريدك الإلكتروني بالفعل؟
                    </p>
                    <button
                      type="button"
                      className={`text-sm ${
                        darkMode ? "text-indigo-400" : "text-indigo-600"
                      } hover:underline`}
                      onClick={() => navigate("/login")}
                    >
                      الانتقال إلى صفحة تسجيل الدخول
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-6 text-center">
                <p
                  className={`${
                    darkMode ? "text-gray-300" : "text-indigo-600"
                  } text-sm mb-3`}
                >
                  هل تريد التسجيل كحرفي بدلاً من ذلك؟{" "}
                  <Link
                    to="/register/craftsman"
                    className={`${
                      darkMode ? "text-indigo-400" : "text-indigo-600"
                    } font-medium hover:text-indigo-800 transition-colors duration-200 border-b-2 border-indigo-200 hover:border-indigo-600 relative inline-block group`}
                  >
                    <span className="relative z-10">انتقل إلى تسجيل حرفي</span>
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </Link>
                </p>
              </div>

              <div className="mt-4 text-center">
                <Link
                  to="/"
                  className="text-indigo-500 text-sm hover:text-indigo-700 transition-colors duration-200 border-b border-transparent hover:border-indigo-500 inline-block"
                >
                  العودة إلى الصفحة الرئيسية
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ClientRegisterPage;
