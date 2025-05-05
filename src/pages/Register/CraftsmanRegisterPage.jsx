import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import LoadingButton from "../../components/common/LoadingButton";
import MultiSelect from "../../components/common/MultiSelect";
import ProfessionSelector from "../../components/common/ProfessionSelector";
import MapBox from "../../components/maps/MapBox";
import useUserStore from "../../store/userStore";
import useThemeStore from "../../store/themeStore";
import authService from "../../services/authService";
import firebaseAuthService from "../../services/firebaseAuthService";
import { auth } from "../../config/firebase";
import { X, Plus, Mail, Check } from "lucide-react";
import { fetchStreetsFromOverpass } from "../../services/mapService";

// لم نعد نحتاج إلى بيانات المهن الوهمية لأننا نستخدم مكون ProfessionSelector

const CraftsmanRegisterPage = () => {
  const navigate = useNavigate();
  const login = useUserStore((state) => state.login);
  const darkMode = useThemeStore((state) => state.darkMode);

  // إضافة مرجع للخريطة
  const mapBoxRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    professions: [],
    specializations: [],
    location: { lng: 36.2765, lat: 33.5138 }, // Damascus, Syria
    workRadius: 5,
    bio: "",
    image: null,
    // إضافة قوائم للشوارع والمستشفيات والمساجد ضمن نطاق العمل
    streetsInWorkRange: [],
    hospitalsInWorkRange: [],
    mosquesInWorkRange: [],
    // أوقات الدوام
    workingHours: {
      saturday: { isWorking: false, from: "09:00", to: "17:00" },
      sunday: { isWorking: false, from: "09:00", to: "17:00" },
      monday: { isWorking: false, from: "09:00", to: "17:00" },
      tuesday: { isWorking: false, from: "09:00", to: "17:00" },
      wednesday: { isWorking: false, from: "09:00", to: "17:00" },
      thursday: { isWorking: false, from: "09:00", to: "17:00" },
      friday: { isWorking: false, from: "09:00", to: "17:00" },
    },
    // إضافة حقول التحقق من البريد الإلكتروني
    verificationCode: "",
  });

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  // لم نعد نستخدم الأحياء
  const [streetsInRadius, setStreetsInRadius] = useState([]);
  const [hospitalsInRadius, setHospitalsInRadius] = useState([]);
  const [mosquesInRadius, setMosquesInRadius] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // حالة التحقق من البريد الإلكتروني
  const [emailVerification, setEmailVerification] = useState({
    sent: false,
    verified: false,
    sending: false,
    firebaseUser: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // لم نعد نحتاج إلى هذه الدالة لأننا نستخدم مكون ProfessionSelector

  // معالجة تغييرات في مكون ProfessionSelector
  const handleProfessionSelectorChange = (name, values) => {
    setFormData({
      ...formData,
      [name]: values,
    });

    // مسح الخطأ عند اختيار المستخدم
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleLocationSelect = (location) => {
    // تحويل تنسيق الموقع من Leaflet إلى التنسيق المستخدم في التطبيق
    setFormData({
      ...formData,
      location: {
        lat: location.lat,
        lng: location.lng,
      },
    });
  };

  // دالة لتحديث نطاق العمل
  const handleRadiusChange = (radius) => {
    console.log("Radius changed to:", radius);

    // تحديث قيمة نطاق العمل في النموذج
    setFormData({
      ...formData,
      workRadius: radius,
    });

    // لا نستخدم getNeighborhoodsInRadius لأننا نريد استخدام البيانات الفعلية من API
    // سيتم تحديث الأحياء من خلال دالة handleNeighborhoodsChange

    // تحديث الخريطة إذا كان المرجع متاحًا
    if (mapBoxRef.current) {
      console.log("Updating map radius via ref");
      // تحديث نطاق العمل في مكون الخريطة
      mapBoxRef.current.updateRadius(radius);
    }
  };

  // لم نعد نستخدم دالة تحديث الأحياء

  // دالة لتحديث الشوارع والمساجد والمستشفيات ضمن نطاق العمل
  const handleStreetsChange = (
    newStreets,
    removedStreetsList,
    isPinMoved = false
  ) => {
    // إذا كان isPinMoved صحيحًا، فهذا يعني أن المستخدم قام بتحريك الدبوس أو تغيير نطاق العمل
    // في هذه الحالة، نقوم بجلب البيانات من Overpass API مباشرة
    if (isPinMoved) {
      // تعيين حالة التحميل
      setIsLoading(true);

      // استدعاء دالة جلب البيانات من Overpass API
      fetchStreetsFromOverpass(
        formData.location.lat,
        formData.location.lng,
        formData.workRadius
      )
        .then((data) => {
          // تأخير لمدة ثانيتين لإظهار مؤشر التحميل
          setTimeout(() => {
            // تحويل البيانات إلى التنسيق المطلوب
            const formattedStreets = data.streets.map((street, index) => ({
              id: index + 1,
              name: street,
              location: {
                lat: formData.location.lat,
                lng: formData.location.lng,
              },
            }));

            const formattedHospitals = data.hospitals.map(
              (hospital, index) => ({
                id: index + 1,
                name: hospital,
                location: {
                  lat: formData.location.lat,
                  lng: formData.location.lng,
                },
              })
            );

            const formattedMosques = data.mosques.map((mosque, index) => ({
              id: index + 1,
              name: mosque,
              location: {
                lat: formData.location.lat,
                lng: formData.location.lng,
              },
            }));

            // تحديث حالة الشوارع والمستشفيات والمساجد
            setStreetsInRadius(formattedStreets);
            setHospitalsInRadius(formattedHospitals);
            setMosquesInRadius(formattedMosques);

            // تحديث بيانات النموذج
            setFormData((prevData) => ({
              ...prevData,
              streetsInWorkRange: data.streets,
              hospitalsInWorkRange: data.hospitals,
              mosquesInWorkRange: data.mosques,
            }));

            // إيقاف حالة التحميل
            setIsLoading(false);
          }, 2000);
        })
        .catch((error) => {
          console.error("Error fetching data from Overpass API:", error);
          // إيقاف حالة التحميل في حالة حدوث خطأ
          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
        });
    } else if (newStreets && Array.isArray(newStreets)) {
      // إذا تم تمرير قائمة الشوارع مباشرة (من مكون آخر)
      // نتحقق مما إذا كانت البيانات تحتوي على كائنات أو مصفوفة من الشوارع والمساجد والمستشفيات
      if (typeof newStreets[0] === "string") {
        // إذا كانت البيانات عبارة عن مصفوفة من النصوص، فهي شوارع فقط
        const formattedStreets = newStreets.map((street, index) => ({
          id: index + 1,
          name: street,
          location: { lat: formData.location.lat, lng: formData.location.lng },
        }));

        setStreetsInRadius(formattedStreets);

        // تحديث قائمة الشوارع في بيانات النموذج
        setFormData((prevData) => ({
          ...prevData,
          streetsInWorkRange: newStreets,
        }));
      } else if (
        newStreets.streets ||
        newStreets.hospitals ||
        newStreets.mosques
      ) {
        // إذا كانت البيانات تحتوي على كائن به شوارع ومساجد ومستشفيات
        const streets = newStreets.streets || [];
        const hospitals = newStreets.hospitals || [];
        const mosques = newStreets.mosques || [];

        // تحويل البيانات إلى التنسيق المطلوب
        const formattedStreets = streets.map((street, index) => ({
          id: index + 1,
          name: street,
          location: { lat: formData.location.lat, lng: formData.location.lng },
        }));

        const formattedHospitals = hospitals.map((hospital, index) => ({
          id: index + 1,
          name: hospital,
          location: { lat: formData.location.lat, lng: formData.location.lng },
        }));

        const formattedMosques = mosques.map((mosque, index) => ({
          id: index + 1,
          name: mosque,
          location: { lat: formData.location.lat, lng: formData.location.lng },
        }));

        // تحديث حالة الشوارع والمستشفيات والمساجد
        setStreetsInRadius(formattedStreets);
        setHospitalsInRadius(formattedHospitals);
        setMosquesInRadius(formattedMosques);

        // تحديث بيانات النموذج
        setFormData((prevData) => ({
          ...prevData,
          streetsInWorkRange: streets,
          hospitalsInWorkRange: hospitals,
          mosquesInWorkRange: mosques,
        }));
      }
    }
  };

  // دالة لتحديث المستشفيات ضمن نطاق العمل (لا تستخدم حاليًا بشكل مباشر)
  const handleHospitalsChange = (hospitals) => {
    if (!hospitals) return;

    const hospitalsList = Array.isArray(hospitals) ? hospitals : [];

    // تحويل البيانات إلى التنسيق المطلوب
    const formattedHospitals = hospitalsList.map((hospital, index) => ({
      id: index + 1,
      name: hospital,
      location: { lat: formData.location.lat, lng: formData.location.lng },
    }));

    setHospitalsInRadius(formattedHospitals);

    // تحديث قائمة المستشفيات في بيانات النموذج
    setFormData((prevData) => ({
      ...prevData,
      hospitalsInWorkRange: hospitalsList,
    }));
  };

  // دالة لتحديث المساجد ضمن نطاق العمل (لا تستخدم حاليًا بشكل مباشر)
  const handleMosquesChange = (mosques) => {
    if (!mosques) return;

    const mosquesList = Array.isArray(mosques) ? mosques : [];

    // تحويل البيانات إلى التنسيق المطلوب
    const formattedMosques = mosquesList.map((mosque, index) => ({
      id: index + 1,
      name: mosque,
      location: { lat: formData.location.lat, lng: formData.location.lng },
    }));

    setMosquesInRadius(formattedMosques);

    // تحديث قائمة المساجد في بيانات النموذج
    setFormData((prevData) => ({
      ...prevData,
      mosquesInWorkRange: mosquesList,
    }));
  };

  // تم استيراد دالة جلب البيانات من خدمة الخرائط في أعلى الملف

  // لم نعد نستخدم الأحياء

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result;
        setPreviewImage(imageDataUrl);

        // Guardar la imagen en base64 en el formulario
        setFormData({
          ...formData,
          image: imageDataUrl, // Guardar la imagen como base64 en lugar del objeto File
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // إرسال رمز التحقق إلى البريد الإلكتروني باستخدام Firebase
  const sendVerificationCode = async () => {
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrors({
        ...errors,
        email: "يرجى إدخال بريد إلكتروني صالح",
      });
      return;
    }

    try {
      setEmailVerification((prev) => ({ ...prev, sending: true }));

      // التحقق أولاً مما إذا كان البريد الإلكتروني مستخدمًا بالفعل
      const emailCheckResponse = await authService.checkEmailExists(
        formData.email
      );

      if (emailCheckResponse.exists) {
        // إذا كان البريد الإلكتروني موجودًا بالفعل، نحاول تسجيل الدخول به
        try {
          // نستخدم كلمة مرور مؤقتة للتسجيل
          const tempPassword = Math.random()
            .toString(36)
            .slice(-8);

          // محاولة تسجيل الدخول (ستفشل غالبًا لأننا لا نعرف كلمة المرور)
          await firebaseAuthService
            .loginWithEmailAndPassword(formData.email, tempPassword)
            .catch(() => {
              // نتجاهل الخطأ هنا لأننا نتوقع فشل تسجيل الدخول
            });

          // إرسال بريد إعادة تعيين كلمة المرور
          await firebaseAuthService.sendPasswordResetEmail(formData.email);

          setEmailVerification((prev) => ({
            ...prev,
            sent: true,
            sending: false,
          }));

          // إظهار رسالة للمستخدم
          alert(
            "تم إرسال بريد إلكتروني لإعادة تعيين كلمة المرور. يرجى التحقق من بريدك الإلكتروني واتباع التعليمات لتأكيد حسابك."
          );
        } catch (error) {
          console.error("Error sending password reset:", error);
          setErrors({
            ...errors,
            email: "حدث خطأ أثناء إرسال بريد إعادة تعيين كلمة المرور",
          });
          setEmailVerification((prev) => ({ ...prev, sending: false }));
        }
      } else {
        // إذا لم يكن البريد الإلكتروني موجودًا، نقوم بإنشاء حساب جديد
        // إنشاء حساب مؤقت في Firebase للتحقق من البريد الإلكتروني
        const tempPassword = Math.random()
          .toString(36)
          .slice(-8);

        // تسجيل المستخدم باستخدام البريد الإلكتروني وكلمة مرور مؤقتة
        const response = await firebaseAuthService.registerWithEmailAndPassword(
          formData.email,
          tempPassword,
          formData.fullName
        );

        if (response.success) {
          // بريد التحقق يتم إرساله تلقائيًا عند إنشاء الحساب في Firebase
          setEmailVerification((prev) => ({
            ...prev,
            sent: true,
            sending: false,
          }));

          // تعيين مؤقت للتحقق من حالة التحقق
          const checkVerificationInterval = setInterval(async () => {
            try {
              // الحصول على المستخدم الحالي من Firebase
              const currentUser = auth.currentUser;

              if (currentUser) {
                // تحديث معلومات المستخدم
                await currentUser.reload();

                // التحقق مما إذا تم التحقق من البريد الإلكتروني
                if (currentUser.emailVerified) {
                  clearInterval(checkVerificationInterval);
                  setEmailVerification((prev) => ({
                    ...prev,
                    verified: true,
                  }));
                }
              }
            } catch (error) {
              console.error("Error checking verification status:", error);
            }
          }, 5000); // التحقق كل 5 ثوانٍ

          // تخزين المؤقت في مرجع للتمكن من تنظيفه لاحقًا
          window.verificationTimer = checkVerificationInterval;
        } else {
          setErrors({
            ...errors,
            email: response.error?.message || "فشل في إنشاء حساب مؤقت للتحقق",
          });
          setEmailVerification((prev) => ({ ...prev, sending: false }));
        }
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
      setErrors({
        ...errors,
        email: "حدث خطأ أثناء إرسال رمز التحقق",
      });
      setEmailVerification((prev) => ({ ...prev, sending: false }));
    }
  };

  // تنظيف المؤقت عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      if (window.verificationTimer) {
        clearInterval(window.verificationTimer);
      }
    };
  }, []);

  const validateStep1 = () => {
    let isValid = true;
    const newErrors = {};
    let firstErrorId = null;

    if (!formData.fullName) {
      newErrors.fullName = "الاسم الكامل مطلوب";
      firstErrorId = firstErrorId || "fullName";
      isValid = false;
    }

    if (!formData.phone) {
      newErrors.phone = "رقم الهاتف مطلوب";
      firstErrorId = firstErrorId || "phone";
      isValid = false;
    } else if (
      formData.phone.startsWith("+1") ||
      formData.phone.startsWith("1")
    ) {
      // التحقق من رقم الهاتف الأمريكي
      // يجب أن يتكون من 10 أرقام (منطقة 3 أرقام + 7 أرقام) بعد رمز الدولة
      const phoneWithoutCode = formData.phone.replace(/^\+?1/, "").trim();
      if (!/^\d{10}$/.test(phoneWithoutCode)) {
        newErrors.phone = "يرجى إدخال رقم هاتف أمريكي صالح (10 أرقام)";
        firstErrorId = firstErrorId || "phone";
        isValid = false;
      }
    } else if (!/^(\+?963|0)?9\d{8}$/.test(formData.phone)) {
      // التحقق من رقم الهاتف السوري (الافتراضي)
      newErrors.phone = "يرجى إدخال رقم هاتف سوري صالح";
      firstErrorId = firstErrorId || "phone";
      isValid = false;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "يرجى إدخال بريد إلكتروني صالح";
      firstErrorId = firstErrorId || "email";
      isValid = false;
    }

    // التحقق من البريد الإلكتروني إذا تم إدخاله
    if (formData.email && !emailVerification.verified) {
      newErrors.email = "يرجى التحقق من البريد الإلكتروني أولاً";
      firstErrorId = firstErrorId || "email";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
      firstErrorId = firstErrorId || "password";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل";
      firstErrorId = firstErrorId || "password";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "تأكيد كلمة المرور مطلوب";
      firstErrorId = firstErrorId || "confirmPassword";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "كلمات المرور غير متطابقة";
      firstErrorId = firstErrorId || "confirmPassword";
      isValid = false;
    }

    setErrors(newErrors);

    // التمرير إلى موقع الخطأ الأول
    if (firstErrorId) {
      setTimeout(() => {
        const errorElement = document.querySelector(`[name="${firstErrorId}"]`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
          errorElement.focus();
        }
      }, 100);
    }

    return isValid;
  };

  const validateStep2 = () => {
    let isValid = true;
    const newErrors = {};
    let firstErrorId = null;

    // التحقق من اختيار مهنة واحدة على الأقل
    if (!formData.professions || formData.professions.length === 0) {
      newErrors.professions = "يجب اختيار مهنة واحدة على الأقل";
      firstErrorId = firstErrorId || "professions-section";
      isValid = false;
    }

    // التحقق من اختيار تخصص واحد على الأقل
    if (!formData.specializations || formData.specializations.length === 0) {
      newErrors.specializations = "يجب اختيار تخصص واحد على الأقل";
      firstErrorId = firstErrorId || "professions-section";
      isValid = false;
    }

    setErrors(newErrors);

    // التمرير إلى موقع الخطأ الأول
    if (firstErrorId) {
      setTimeout(() => {
        const errorElement = document.getElementById(firstErrorId);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }

    return isValid;
  };

  const validateStep3 = () => {
    let isValid = true;
    const newErrors = {};
    let firstErrorId = null;

    if (!formData.bio) {
      newErrors.bio = "النبذة مطلوبة";
      firstErrorId = firstErrorId || "bio";
      isValid = false;
    } else if (formData.bio.length < 10) {
      newErrors.bio = "يجب أن تكون النبذة 20 حرفاً على الأقل";
      firstErrorId = firstErrorId || "bio";
      isValid = false;
    }

    setErrors(newErrors);

    // التمرير إلى موقع الخطأ الأول
    if (firstErrorId) {
      setTimeout(() => {
        const errorElement = document.querySelector(`[name="${firstErrorId}"]`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
          errorElement.focus();
        }
      }, 100);
    }

    return isValid;
  };

  const handleNextStep = async () => {
    if (step === 1) {
      // تحقق من صحة الحقول في الخطوة الأولى
      if (validateStep1()) {
        // التحقق من عدم وجود حساب بنفس البريد الإلكتروني أو رقم الهاتف
        setIsLoading(true);
        try {
          // التحقق من البريد الإلكتروني إذا تم إدخاله
          if (formData.email) {
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

              // التمرير إلى موقع الخطأ
              setTimeout(() => {
                const errorElement = document.getElementById("email");
                if (errorElement) {
                  // التمرير إلى الحقل
                  errorElement.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                  // تركيز الحقل
                  errorElement.focus();
                  // تحديد النص في الحقل
                  errorElement.select();
                  // إضافة تأثير وميض للحقل
                  errorElement.classList.add("error-flash");
                  // إزالة التأثير بعد ثانيتين
                  setTimeout(() => {
                    errorElement.classList.remove("error-flash");
                  }, 2000);
                }
              }, 100);

              return;
            }
          }

          // التحقق من رقم الهاتف
          const phoneCheckResponse = await authService.checkPhoneExists(
            formData.phone
          );
          if (phoneCheckResponse.exists) {
            setErrors({
              ...errors,
              phone: "رقم الهاتف مستخدم بالفعل، الرجاء استخدام رقم هاتف آخر",
            });
            setIsLoading(false);

            // التمرير إلى موقع الخطأ
            setTimeout(() => {
              const errorElement = document.getElementById("phone");
              if (errorElement) {
                // التمرير إلى الحقل
                errorElement.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
                // تركيز الحقل
                errorElement.focus();
                // تحديد النص في الحقل
                errorElement.select();
                // إضافة تأثير وميض للحقل
                errorElement.classList.add("error-flash");
                // إزالة التأثير بعد ثانيتين
                setTimeout(() => {
                  errorElement.classList.remove("error-flash");
                }, 2000);
              }
            }, 100);

            return;
          }

          // إذا لم يكن هناك أخطاء، انتقل إلى الخطوة التالية
          setIsLoading(false);
          setStep(2);
        } catch (error) {
          console.error("Error checking credentials:", error);
          setErrors({
            ...errors,
            general:
              "حدث خطأ أثناء التحقق من البيانات، الرجاء المحاولة مرة أخرى",
          });
          setIsLoading(false);

          // التمرير إلى رسالة الخطأ العامة
          setTimeout(() => {
            const errorElement = document.querySelector(
              ".bg-red-100.border-red-400"
            );
            if (errorElement) {
              errorElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          }, 100);
        }
      }
    } else if (step === 2 && validateStep2()) {
      // الانتقال إلى الخطوة الثالثة بدون تسجيل الدخول
      setStep(3);

      // Force a re-render after a short delay to ensure the map is properly initialized
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
        // Add another timeout to ensure the map is fully loaded
        setTimeout(() => {
          window.dispatchEvent(new Event("resize"));

          // تحديث الشوارع والمساجد والمستشفيات فور الانتقال إلى القسم الثالث
          // لكن فقط مرة واحدة عند فتح القسم الثالث، وليس عند الضغط على زر التسجيل
          if (mapBoxRef.current) {
            // تعيين الموقع الافتراضي (استخدام الموقع الحالي للخريطة)
            const defaultLocation = { lat: 33.5138, lng: 36.2765 }; // دمشق
            const defaultRadius = 2; // كيلومتر

            // تحديث الموقع ونطاق العمل في النموذج
            setFormData((prevData) => ({
              ...prevData,
              location: defaultLocation,
              workRadius: defaultRadius,
            }));

            // دالة لجلب البيانات من Overpass API
            const fetchDataFromOverpass = async (lat, lng, radius) => {
              try {
                // استعلام Overpass API للحصول على الشوارع والمستشفيات والمساجد
                const query = `
                  [out:json];
                  (
                    way["highway"]["name"](around:${radius *
                      1000},${lat},${lng});
                    node["amenity"="hospital"](around:${radius *
                      1000},${lat},${lng});
                    node["amenity"="clinic"](around:${radius *
                      1000},${lat},${lng});
                    node["amenity"="doctors"](around:${radius *
                      1000},${lat},${lng});
                    node["amenity"="mosque"](around:${radius *
                      1000},${lat},${lng});
                    node["building"="mosque"](around:${radius *
                      1000},${lat},${lng});
                  );
                  out tags;
                `;
                const url = "https://overpass-api.de/api/interpreter";
                const res = await fetch(url, {
                  method: "POST",
                  body: query,
                  headers: { "Content-Type": "text/plain" },
                });

                if (!res.ok) {
                  throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();

                // التحقق من بنية البيانات
                if (!data || !Array.isArray(data.elements)) {
                  console.error(
                    "Invalid data structure from Overpass API:",
                    data
                  );
                  return { streets: [], hospitals: [], mosques: [] };
                }

                // استخراج أسماء الشوارع والمستشفيات والمساجد
                const streets = [];
                const hospitals = [];
                const mosques = [];

                data.elements.forEach((el) => {
                  if (!el.tags || !el.tags.name) return;

                  const name = el.tags.name.trim();

                  if (el.type === "way" && el.tags.highway) {
                    streets.push(name);
                  } else if (
                    el.type === "node" &&
                    (el.tags.amenity === "hospital" ||
                      el.tags.amenity === "clinic" ||
                      el.tags.amenity === "doctors")
                  ) {
                    hospitals.push(name);
                  } else if (
                    el.type === "node" &&
                    (el.tags.amenity === "mosque" ||
                      el.tags.building === "mosque")
                  ) {
                    mosques.push(name);
                  }
                });

                // إزالة التكرارات
                return {
                  streets: [...new Set(streets)],
                  hospitals: [...new Set(hospitals)],
                  mosques: [...new Set(mosques)],
                };
              } catch (error) {
                console.error("Error fetching data:", error);
                return { streets: [], hospitals: [], mosques: [] };
              }
            };

            // استدعاء الدالة لجلب البيانات
            fetchDataFromOverpass(
              defaultLocation.lat,
              defaultLocation.lng,
              defaultRadius
            )
              .then((data) => {
                console.log("تم جلب البيانات بنجاح:", data);

                // تحديث الشوارع
                const streets = data.streets.map((name) => ({ name }));
                setStreetsInRadius(streets);
                setFormData((prevData) => ({
                  ...prevData,
                  streetsInWorkRange: streets.map((s) => s.name),
                }));

                // تحديث المساجد
                const mosques = data.mosques.map((name) => ({ name }));
                setMosquesInRadius(mosques);
                setFormData((prevData) => ({
                  ...prevData,
                  mosquesInWorkRange: mosques.map((m) => m.name),
                }));

                // تحديث المستشفيات
                const hospitals = data.hospitals.map((name) => ({ name }));
                setHospitalsInRadius(hospitals);
                setFormData((prevData) => ({
                  ...prevData,
                  hospitalsInWorkRange: hospitals.map((h) => h.name),
                }));
              })
              .catch((error) => {
                console.error("خطأ في جلب البيانات:", error);
              });
          }
        }, 500);
      }, 100);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    // منع السلوك الافتراضي للنموذج إذا تم تمرير حدث
    if (e) e.preventDefault();

    if (validateStep3()) {
      // تفعيل مؤشر التحميل
      setIsLoading(true);

      // لا نقوم بتحديث بيانات الشوارع والمشافي والمساجد عند الضغط على زر التسجيل
      // نستخدم البيانات الموجودة بالفعل في النموذج

      try {
        // التحقق من عدم وجود حساب بنفس البريد الإلكتروني أو رقم الهاتف
        // هذا التحقق يجب أن يتم في الخطوة الأولى، ولكن نقوم به هنا أيضًا للتأكد
        // التحقق من البريد الإلكتروني إذا تم إدخاله
        if (formData.email) {
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

            // العودة إلى الخطوة الأولى
            setStep(1);

            // التمرير إلى موقع الخطأ
            setTimeout(() => {
              const errorElement = document.getElementById("email");
              if (errorElement) {
                // التمرير إلى الحقل
                errorElement.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
                // تركيز الحقل
                errorElement.focus();
                // تحديد النص في الحقل
                errorElement.select();
                // إضافة تأثير وميض للحقل
                errorElement.classList.add("error-flash");
                // إزالة التأثير بعد ثانيتين
                setTimeout(() => {
                  errorElement.classList.remove("error-flash");
                }, 2000);
              }
            }, 100);

            return;
          }
        }

        // التحقق من رقم الهاتف
        const phoneCheckResponse = await authService.checkPhoneExists(
          formData.phone
        );
        if (phoneCheckResponse.exists) {
          setErrors({
            ...errors,
            phone: "رقم الهاتف مستخدم بالفعل، الرجاء استخدام رقم هاتف آخر",
          });
          setIsLoading(false);

          // العودة إلى الخطوة الأولى
          setStep(1);

          // التمرير إلى موقع الخطأ
          setTimeout(() => {
            const errorElement = document.getElementById("phone");
            if (errorElement) {
              // التمرير إلى الحقل
              errorElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
              // تركيز الحقل
              errorElement.focus();
              // تحديد النص في الحقل
              errorElement.select();
              // إضافة تأثير وميض للحقل
              errorElement.classList.add("error-flash");
              // إزالة التأثير بعد ثانيتين
              setTimeout(() => {
                errorElement.classList.remove("error-flash");
              }, 2000);
            }
          }, 100);

          return;
        }

        // إعداد بيانات التسجيل
        const registerData = {
          name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          userType: "craftsman",
          rememberMe: true,
          // إضافة الصورة الشخصية مباشرة في بيانات المستخدم
          profilePicture: formData.image,
          // بيانات إضافية للحرفي
          craftsmanData: {
            professions: formData.professions,
            specializations: formData.specializations,
            location: formData.location,
            workRadius: formData.workRadius,
            bio: formData.bio,
            // إضافة الشوارع والمستشفيات والمساجد ضمن نطاق العمل
            streetsInWorkRange: formData.streetsInWorkRange,
            hospitalsInWorkRange: formData.hospitalsInWorkRange,
            mosquesInWorkRange: formData.mosquesInWorkRange,
            workingHours: formData.workingHours,
          },
        };

        console.log("Registering craftsman with:", registerData);

        // استخدام خدمة المصادقة للتسجيل
        const response = await authService.register(registerData);
        console.log("Registration response:", response);

        // تسجيل دخول المستخدم في المخزن المحلي
        const userData = {
          ...response.user,
          profession: formData.professions.join(", "),
          specialization: formData.specializations.join(", "),
          professions: formData.professions,
          specializations: formData.specializations,
          location: formData.location,
          workRadius: formData.workRadius,
          bio: formData.bio,
          image: previewImage || "/img/user-avatar.svg",
          rating: 0,
          available: true,
          gallery: [],
          streetsInWorkRange: formData.streetsInWorkRange,
          hospitalsInWorkRange: formData.hospitalsInWorkRange,
          mosquesInWorkRange: formData.mosquesInWorkRange,
          workingHours: formData.workingHours,
        };

        console.log("User data for login:", userData);

        // تسجيل دخول المستخدم فقط عند الضغط على زر "تسجيل الآن" في القسم الثالث
        login(userData, "craftsman");

        // إيقاف مؤشر التحميل
        setIsLoading(false);

        // الانتقال إلى صفحة الملف الشخصي
        navigate("/profile/my");
      } catch (error) {
        console.error("Registration error:", error);
        setErrors({
          ...errors,
          general: error.message || "حدث خطأ أثناء التسجيل",
        });

        // إيقاف مؤشر التحميل
        setIsLoading(false);

        // التمرير إلى رسالة الخطأ العامة
        setTimeout(() => {
          const errorElement = document.querySelector(
            ".bg-red-100.border-red-400"
          );
          if (errorElement) {
            errorElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 100);
      }
    }
  };

  return (
    <Layout>
      <div
        className={`py-12 ${
          darkMode
            ? "bg-gray-900"
            : "bg-gradient-to-br from-blue-50 to-indigo-100"
        } transition-colors duration-300`}
      >
        <div className="container mx-auto px-4">
          <div
            className={`max-w-3xl mx-auto rounded-lg shadow-lg overflow-hidden border ${
              darkMode
                ? "bg-gray-800 text-gray-200 border-gray-700"
                : "bg-white border-indigo-100"
            } transition-colors duration-300`}
          >
            <div className="p-6">
              <h2
                className={`text-3xl font-bold text-center mb-6 ${
                  darkMode ? "text-indigo-300" : "text-indigo-800"
                } relative transition-colors duration-300`}
              >
                <span className="relative z-10">تسجيل كحرفي</span>
                <span
                  className={`absolute bottom-0 left-0 right-0 h-3 ${
                    darkMode ? "bg-indigo-500" : "bg-indigo-300"
                  } opacity-40 transform -rotate-1 z-0`}
                ></span>
              </h2>

              {/* Progress Steps */}
              <div className="flex justify-between mb-8">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                      step >= 1
                        ? "bg-gradient-to-br from-indigo-500 to-indigo-700 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    1
                  </div>
                  <span className="text-sm mt-1">المعلومات الشخصية</span>
                </div>
                <div className="flex-1 h-1 self-center bg-gray-200 mx-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      step >= 2
                        ? "bg-gradient-to-r from-indigo-400 to-indigo-600"
                        : "bg-gray-200"
                    }`}
                    style={{ width: step >= 2 ? "100%" : "0%" }}
                  ></div>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                      step >= 2
                        ? "bg-gradient-to-br from-indigo-500 to-indigo-700 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    2
                  </div>
                  <span className="text-sm mt-1">المهنة والتخصص</span>
                </div>
                <div className="flex-1 h-1 self-center bg-gray-200 mx-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      step >= 3
                        ? "bg-gradient-to-r from-indigo-400 to-indigo-600"
                        : "bg-gray-200"
                    }`}
                    style={{ width: step >= 3 ? "100%" : "0%" }}
                  ></div>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                      step >= 3
                        ? "bg-gradient-to-br from-indigo-500 to-indigo-700 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    3
                  </div>
                  <span className="text-sm mt-1">الموقع والنبذة</span>
                </div>
              </div>

              {/* رسالة الخطأ */}
              {errors.general && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {errors.general}
                </div>
              )}

              {/* مؤشر التحميل للتحقق من البيانات */}
              {isLoading && (
                <div className="flex justify-center items-center py-4 mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 ml-2"></div>
                  <span className="text-indigo-500">
                    {step === 1
                      ? "جاري التحقق من البيانات..."
                      : step === 3
                      ? "جاري إنشاء الحساب..."
                      : "جاري المعالجة..."}
                  </span>
                </div>
              )}

              <form onSubmit={(e) => e.preventDefault()}>
                {/* Step 1: Personal Information */}
                {step === 1 && (
                  <div>
                    <Input
                      label="الاسم الكامل"
                      type="text"
                      name="fullName"
                      id="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="أدخل الاسم الكامل"
                      error={errors.fullName}
                      required
                    />

                    <Input
                      label="رقم الهاتف"
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="أدخل رقم الهاتف"
                      error={errors.phone}
                      required
                    />

                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">
                        البريد الإلكتروني (اختياري)
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex-grow">
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="أدخل البريد الإلكتروني"
                            className={`input w-full ${
                              errors.email
                                ? "border-red-500 focus:ring-red-500"
                                : ""
                            } ${
                              emailVerification.verified
                                ? "border-green-500"
                                : ""
                            }`}
                            disabled={emailVerification.verified}
                          />
                        </div>
                        {!emailVerification.verified ? (
                          <LoadingButton
                            type="button"
                            variant="primary"
                            isLoading={emailVerification.sending}
                            loadingText="جاري الإرسال..."
                            onClick={sendVerificationCode}
                            disabled={
                              !formData.email ||
                              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
                            }
                            className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-2 px-4 ${
                              darkMode
                                ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                                : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                            }`}
                          >
                            <span className="relative z-10 font-bold text-white flex items-center gap-1">
                              <Mail size={16} />
                              إرسال رمز التحقق
                            </span>
                          </LoadingButton>
                        ) : (
                          <div className="bg-green-100 text-green-700 py-2 px-4 rounded-md flex items-center gap-1">
                            <Check size={16} />
                            تم التحقق
                          </div>
                        )}
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* قسم التحقق من البريد الإلكتروني */}
                    {emailVerification.sent && !emailVerification.verified && (
                      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                        <h4 className="text-blue-700 font-medium mb-2">
                          التحقق من البريد الإلكتروني
                        </h4>
                        <p className="text-gray-600 mb-3">
                          تم إرسال رابط التحقق إلى بريدك الإلكتروني. يرجى فتح
                          بريدك الإلكتروني والنقر على الرابط للتحقق من حسابك.
                        </p>
                        <div className="flex flex-col gap-3">
                          <Button
                            type="button"
                            variant="primary"
                            className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-2 px-4 ${
                              darkMode
                                ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                                : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                            }`}
                            onClick={() =>
                              window.open("https://mail.google.com", "_blank")
                            }
                          >
                            <span className="relative z-10 font-bold text-white flex items-center gap-1">
                              <Mail size={16} />
                              فتح البريد الإلكتروني
                            </span>
                          </Button>

                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                              لم يصلك بريد التحقق؟{" "}
                              <button
                                type="button"
                                onClick={sendVerificationCode}
                                className="text-indigo-600 hover:text-indigo-800 font-medium"
                              >
                                إعادة إرسال الرابط
                              </button>
                            </div>

                            <LoadingButton
                              type="button"
                              variant="secondary"
                              isLoading={false}
                              className="text-indigo-600 border border-indigo-200 hover:bg-indigo-50 py-1 px-3 text-sm"
                              onClick={() => {
                                try {
                                  // الحصول على المستخدم الحالي من Firebase
                                  const currentUser = auth.currentUser;

                                  if (currentUser) {
                                    currentUser
                                      .reload()
                                      .then(() => {
                                        if (currentUser.emailVerified) {
                                          setEmailVerification((prev) => ({
                                            ...prev,
                                            verified: true,
                                          }));
                                        } else {
                                          alert(
                                            "لم يتم التحقق من البريد الإلكتروني بعد. يرجى التحقق من بريدك والنقر على الرابط."
                                          );
                                        }
                                      })
                                      .catch((error) => {
                                        console.error(
                                          "Error reloading user:",
                                          error
                                        );
                                        alert(
                                          "حدث خطأ أثناء التحقق من حالة البريد الإلكتروني. يرجى المحاولة مرة أخرى."
                                        );
                                      });
                                  } else {
                                    alert(
                                      "لم يتم العثور على مستخدم مسجل. يرجى إعادة إرسال رابط التحقق."
                                    );
                                  }
                                } catch (error) {
                                  console.error(
                                    "Error checking verification status:",
                                    error
                                  );
                                  alert(
                                    "حدث خطأ أثناء التحقق من حالة البريد الإلكتروني. يرجى المحاولة مرة أخرى."
                                  );
                                }
                              }}
                            >
                              <span>تحديث الحالة</span>
                            </LoadingButton>
                          </div>
                        </div>
                      </div>
                    )}

                    <Input
                      label="كلمة المرور"
                      type="password"
                      name="password"
                      id="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="أدخل كلمة المرور"
                      error={errors.password}
                      required
                    />

                    <Input
                      label="تأكيد كلمة المرور"
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="أعد إدخال كلمة المرور"
                      error={errors.confirmPassword}
                      required
                    />

                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">
                        صورة الملف الشخصي (اختياري)
                      </label>
                      <div className="flex items-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full overflow-hidden mr-4 border-2 border-indigo-200 shadow-md">
                          {previewImage ? (
                            <img
                              src={previewImage}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-indigo-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          id="image"
                          name="image"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="image"
                          className={`cursor-pointer text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-2 px-4 rounded-md mr-2 ${
                            darkMode
                              ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                              : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                          }`}
                        >
                          <span className="relative z-10 font-bold text-white">
                            اختر صورة
                          </span>
                          <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Profession and Specialization */}
                {step === 2 && (
                  <div>
                    <div className="mb-4" id="professions-section">
                      <ProfessionSelector
                        professions={formData.professions}
                        specializations={formData.specializations}
                        onChange={handleProfessionSelectorChange}
                        errors={{
                          professions: errors.professions,
                          specializations: errors.specializations,
                        }}
                      />
                    </div>

                    <div
                      className={`p-4 rounded-md mb-4 border-r-4 shadow-sm ${
                        darkMode
                          ? "bg-gray-800 border-indigo-600"
                          : "bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-400"
                      } transition-colors duration-300`}
                    >
                      <h3
                        className={`text-lg font-medium mb-2 ${
                          darkMode ? "text-indigo-300" : ""
                        } transition-colors duration-300`}
                      >
                        معلومات المهنة
                      </h3>
                      <p
                        className={`mb-2 ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        } transition-colors duration-300`}
                      >
                        اختر المهنة والتخصص الذي تقدمه لعملائك. هذا سيساعد
                        العملاء في العثور عليك بسهولة.
                      </p>
                      <p
                        className={`${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        } transition-colors duration-300`}
                      >
                        يمكنك تعديل هذه المعلومات لاحقاً من صفحة الملف الشخصي.
                      </p>
                    </div>

                    {/* أوقات الدوام */}
                    <div className="mb-6">
                      <h3
                        className={`text-lg font-medium mb-4 ${
                          darkMode ? "text-indigo-300" : "text-indigo-700"
                        }`}
                      >
                        أوقات الدوام
                      </h3>
                      <p
                        className={`mb-4 ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        حدد أيام وساعات عملك ليتمكن العملاء من معرفة أوقات توفرك
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                          className={`p-4 rounded-lg shadow-sm ${
                            darkMode ? "bg-gray-800" : "bg-white"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-3">
                            <h4
                              className={`font-medium ${
                                darkMode ? "text-indigo-300" : "text-indigo-600"
                              }`}
                            >
                              أيام العمل
                            </h4>

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  // تحديد جميع الأيام
                                  const updatedWorkingHours = {
                                    ...formData.workingHours,
                                  };
                                  Object.keys(updatedWorkingHours).forEach(
                                    (day) => {
                                      updatedWorkingHours[day] = {
                                        ...updatedWorkingHours[day],
                                        isWorking: true,
                                      };
                                    }
                                  );

                                  setFormData({
                                    ...formData,
                                    workingHours: updatedWorkingHours,
                                  });
                                }}
                                className={`text-xs px-2 py-1 rounded-md ${
                                  darkMode
                                    ? "bg-indigo-700 text-white hover:bg-indigo-600"
                                    : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                                } transition-colors duration-200`}
                              >
                                تحديد الكل
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  // إلغاء تحديد جميع الأيام
                                  const updatedWorkingHours = {
                                    ...formData.workingHours,
                                  };
                                  Object.keys(updatedWorkingHours).forEach(
                                    (day) => {
                                      updatedWorkingHours[day] = {
                                        ...updatedWorkingHours[day],
                                        isWorking: false,
                                      };
                                    }
                                  );

                                  setFormData({
                                    ...formData,
                                    workingHours: updatedWorkingHours,
                                  });
                                }}
                                className={`text-xs px-2 py-1 rounded-md ${
                                  darkMode
                                    ? "bg-gray-700 text-white hover:bg-gray-600"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                } transition-colors duration-200`}
                              >
                                إلغاء تحديد الكل
                              </button>
                            </div>
                          </div>

                          {Object.entries({
                            saturday: "السبت",
                            sunday: "الأحد",
                            monday: "الاثنين",
                            tuesday: "الثلاثاء",
                            wednesday: "الأربعاء",
                            thursday: "الخميس",
                            friday: "الجمعة",
                          }).map(([day, dayName]) => (
                            <div key={day} className="flex items-center mb-3">
                              <input
                                type="checkbox"
                                id={`working-${day}`}
                                checked={formData.workingHours[day].isWorking}
                                onChange={(e) => {
                                  const isChecked = e.target.checked;
                                  setFormData({
                                    ...formData,
                                    workingHours: {
                                      ...formData.workingHours,
                                      [day]: {
                                        ...formData.workingHours[day],
                                        isWorking: isChecked,
                                      },
                                    },
                                  });
                                }}
                                className="w-5 h-5 accent-indigo-600 ml-2"
                              />
                              <label
                                htmlFor={`working-${day}`}
                                className={`${
                                  darkMode ? "text-gray-300" : "text-gray-700"
                                } cursor-pointer`}
                              >
                                {dayName}
                              </label>
                            </div>
                          ))}
                        </div>

                        <div
                          className={`p-4 rounded-lg shadow-sm ${
                            darkMode ? "bg-gray-800" : "bg-white"
                          }`}
                        >
                          <h4
                            className={`font-medium mb-3 ${
                              darkMode ? "text-indigo-300" : "text-indigo-600"
                            }`}
                          >
                            ساعات العمل
                          </h4>

                          {Object.values(formData.workingHours).some(
                            (day) => day.isWorking
                          ) ? (
                            <div className="mb-3">
                              <p
                                className={`text-sm mb-3 ${
                                  darkMode ? "text-gray-300" : "text-gray-600"
                                }`}
                              >
                                حدد وقت العمل الموحد لجميع الأيام المختارة
                              </p>

                              {/* وقت العمل الموحد */}
                              <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center">
                                  <span
                                    className={`ml-2 ${
                                      darkMode
                                        ? "text-gray-400"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    من
                                  </span>
                                  <input
                                    type="time"
                                    value={formData.workingHours.monday.from}
                                    onChange={(e) => {
                                      // تحديث جميع أيام العمل بنفس وقت البدء
                                      const newWorkingHours = {
                                        ...formData.workingHours,
                                      };
                                      Object.keys(newWorkingHours).forEach(
                                        (day) => {
                                          if (newWorkingHours[day].isWorking) {
                                            newWorkingHours[day].from =
                                              e.target.value;
                                          }
                                        }
                                      );

                                      setFormData({
                                        ...formData,
                                        workingHours: newWorkingHours,
                                      });
                                    }}
                                    className={`p-1 rounded border ${
                                      darkMode
                                        ? "bg-gray-700 border-gray-600 text-gray-200"
                                        : "bg-white border-gray-300"
                                    }`}
                                  />
                                </div>
                                <div className="flex items-center">
                                  <span
                                    className={`ml-2 ${
                                      darkMode
                                        ? "text-gray-400"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    إلى
                                  </span>
                                  <input
                                    type="time"
                                    value={formData.workingHours.monday.to}
                                    onChange={(e) => {
                                      // تحديث جميع أيام العمل بنفس وقت الانتهاء
                                      const newWorkingHours = {
                                        ...formData.workingHours,
                                      };
                                      Object.keys(newWorkingHours).forEach(
                                        (day) => {
                                          if (newWorkingHours[day].isWorking) {
                                            newWorkingHours[day].to =
                                              e.target.value;
                                          }
                                        }
                                      );

                                      setFormData({
                                        ...formData,
                                        workingHours: newWorkingHours,
                                      });
                                    }}
                                    className={`p-1 rounded border ${
                                      darkMode
                                        ? "bg-gray-700 border-gray-600 text-gray-200"
                                        : "bg-white border-gray-300"
                                    }`}
                                  />
                                </div>
                              </div>

                              {/* عرض الأيام المختارة */}
                              <div className="mt-4">
                                <h5
                                  className={`text-sm font-medium mb-2 ${
                                    darkMode ? "text-gray-300" : "text-gray-600"
                                  }`}
                                >
                                  أيام العمل المختارة:
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries({
                                    saturday: "السبت",
                                    sunday: "الأحد",
                                    monday: "الاثنين",
                                    tuesday: "الثلاثاء",
                                    wednesday: "الأربعاء",
                                    thursday: "الخميس",
                                    friday: "الجمعة",
                                  }).map(
                                    ([day, dayName]) =>
                                      formData.workingHours[day].isWorking && (
                                        <span
                                          key={`selected-${day}`}
                                          className={`px-2 py-1 rounded-full text-xs ${
                                            darkMode
                                              ? "bg-indigo-700 text-gray-200"
                                              : "bg-indigo-100 text-indigo-800"
                                          }`}
                                        >
                                          {dayName}
                                        </span>
                                      )
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p
                              className={`text-center py-4 ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              الرجاء تحديد أيام العمل أولاً
                            </p>
                          )}
                        </div>
                      </div>

                      <div
                        className={`mt-4 p-3 rounded-md ${
                          darkMode ? "bg-gray-700" : "bg-indigo-50"
                        }`}
                      >
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-300" : "text-indigo-700"
                          }`}
                        >
                          <span className="font-bold">ملاحظة:</span> سيتم
                          استخدام أوقات الدوام لتحديد ما إذا كنت متاحاً للعمل في
                          وقت معين. يمكنك تعديل هذه الأوقات لاحقاً من صفحة الملف
                          الشخصي.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Location and Bio */}
                {step === 3 && (
                  <div>
                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">
                        الموقع ونطاق العمل{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <p className="text-gray-600 mb-2">
                        حدد موقعك على الخريطة وحدد نطاق العمل الذي تغطيه
                        (بالكيلومتر).
                      </p>
                      <MapBox
                        ref={mapBoxRef}
                        initialCenter={{ lng: 36.2765, lat: 33.5138 }}
                        initialZoom={13}
                        onLocationSelect={handleLocationSelect}
                        onRadiusChange={handleRadiusChange}
                        onStreetsChange={handleStreetsChange}
                        onHospitalsChange={handleHospitalsChange}
                        onMosquesChange={handleMosquesChange}
                        radius={formData.workRadius}
                        height="400px"
                        showRadius={true}
                      />

                      <div className="mt-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            } transition-colors duration-300`}
                          >
                            نطاق العمل:{" "}
                            <span className="font-bold text-indigo-600">
                              {formData.workRadius} كم
                            </span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="0.5"
                          value={formData.workRadius}
                          onChange={(e) => {
                            const newRadius = parseFloat(e.target.value);
                            handleRadiusChange(newRadius);
                          }}
                          className="w-full accent-indigo-500 mb-2"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>1 كم</span>
                          <span>3 كم</span>
                          <span>5 كم</span>
                        </div>
                      </div>

                      {/* قسم الأماكن ضمن نطاق العمل */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* قسم الشوارع */}
                        <div
                          className={`p-4 rounded-md border-r-4 shadow-sm ${
                            darkMode
                              ? "bg-gray-800 border-indigo-600"
                              : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-400"
                          } transition-colors duration-300`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h4
                              className={`font-medium ${
                                darkMode ? "text-indigo-300" : ""
                              } transition-colors duration-300`}
                            >
                              الشوارع ضمن نطاق عملك:
                            </h4>
                            {isLoading && (
                              <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500 mr-2"></div>
                                <span className="text-xs text-indigo-500">
                                  جاري التحميل...
                                </span>
                              </div>
                            )}
                          </div>
                          <ul
                            className={`list-disc list-inside ${
                              darkMode ? "text-gray-300" : "text-gray-600"
                            } transition-colors duration-300 max-h-40 overflow-y-auto`}
                          >
                            {!isLoading && streetsInRadius.length > 0 ? (
                              streetsInRadius.map((street, index) => (
                                <li
                                  key={index}
                                  className={`flex justify-between items-center py-1 ${
                                    darkMode ? "text-gray-300" : ""
                                  } transition-colors duration-300`}
                                >
                                  <span>{street.name}</span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault(); // منع السلوك الافتراضي
                                      e.stopPropagation(); // منع انتشار الحدث

                                      // إنشاء نسخة جديدة من المصفوفة بدون العنصر المحدد
                                      const updatedStreets = [
                                        ...streetsInRadius,
                                      ];
                                      updatedStreets.splice(index, 1);

                                      // تحديث حالة الشوارع
                                      setStreetsInRadius(updatedStreets);

                                      // تحديث بيانات النموذج
                                      setFormData((prevData) => ({
                                        ...prevData,
                                        streetsInWorkRange: updatedStreets.map(
                                          (s) => s.name
                                        ),
                                      }));
                                    }}
                                    className={`text-red-500 hover:text-red-700 transition-colors duration-200`}
                                  >
                                    <X size={16} />
                                  </button>
                                </li>
                              ))
                            ) : !isLoading ? (
                              <li
                                className={`${
                                  darkMode ? "text-gray-400" : ""
                                } transition-colors duration-300`}
                              >
                                لم يتم تحديد أي شوارع بعد.
                              </li>
                            ) : null}
                          </ul>
                        </div>

                        {/* قسم المعالم (المساجد والمستشفيات) */}
                        <div
                          className={`p-4 rounded-md border-r-4 shadow-sm ${
                            darkMode
                              ? "bg-gray-800 border-indigo-600"
                              : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-400"
                          } transition-colors duration-300`}
                        >
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <h4
                                className={`font-medium ${
                                  darkMode ? "text-indigo-300" : ""
                                } transition-colors duration-300`}
                              >
                                المساجد ضمن نطاق عملك:
                              </h4>
                              {isLoading && (
                                <div className="flex items-center">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500 mr-2"></div>
                                  <span className="text-xs text-indigo-500">
                                    جاري التحميل...
                                  </span>
                                </div>
                              )}
                            </div>
                            <ul
                              className={`list-disc list-inside ${
                                darkMode ? "text-gray-300" : "text-gray-600"
                              } transition-colors duration-300 max-h-20 overflow-y-auto`}
                            >
                              {!isLoading && mosquesInRadius.length > 0 ? (
                                mosquesInRadius.map((mosque, index) => (
                                  <li
                                    key={index}
                                    className={`flex justify-between items-center py-1 ${
                                      darkMode ? "text-gray-300" : ""
                                    } transition-colors duration-300`}
                                  >
                                    <span>{mosque.name}</span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault(); // منع السلوك الافتراضي
                                        e.stopPropagation(); // منع انتشار الحدث

                                        // إنشاء نسخة جديدة من المصفوفة بدون العنصر المحدد
                                        const updatedMosques = [
                                          ...mosquesInRadius,
                                        ];
                                        updatedMosques.splice(index, 1);

                                        // تحديث حالة المساجد
                                        setMosquesInRadius(updatedMosques);

                                        // تحديث بيانات النموذج
                                        setFormData((prevData) => ({
                                          ...prevData,
                                          mosquesInWorkRange: updatedMosques.map(
                                            (m) => m.name
                                          ),
                                        }));
                                      }}
                                      className={`text-red-500 hover:text-red-700 transition-colors duration-200`}
                                    >
                                      <X size={16} />
                                    </button>
                                  </li>
                                ))
                              ) : !isLoading ? (
                                <li
                                  className={`${
                                    darkMode ? "text-gray-400" : ""
                                  } transition-colors duration-300`}
                                >
                                  لم يتم تحديد أي مساجد بعد.
                                </li>
                              ) : null}
                            </ul>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <h4
                                className={`font-medium ${
                                  darkMode ? "text-indigo-300" : ""
                                } transition-colors duration-300`}
                              >
                                المستشفيات ضمن نطاق عملك:
                              </h4>
                              {isLoading && (
                                <div className="flex items-center">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500 mr-2"></div>
                                  <span className="text-xs text-indigo-500">
                                    جاري التحميل...
                                  </span>
                                </div>
                              )}
                            </div>
                            <ul
                              className={`list-disc list-inside ${
                                darkMode ? "text-gray-300" : "text-gray-600"
                              } transition-colors duration-300 max-h-20 overflow-y-auto`}
                            >
                              {!isLoading && hospitalsInRadius.length > 0 ? (
                                hospitalsInRadius.map((hospital, index) => (
                                  <li
                                    key={index}
                                    className={`flex justify-between items-center py-1 ${
                                      darkMode ? "text-gray-300" : ""
                                    } transition-colors duration-300`}
                                  >
                                    <span>{hospital.name}</span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault(); // منع السلوك الافتراضي
                                        e.stopPropagation(); // منع انتشار الحدث

                                        // إنشاء نسخة جديدة من المصفوفة بدون العنصر المحدد
                                        const updatedHospitals = [
                                          ...hospitalsInRadius,
                                        ];
                                        updatedHospitals.splice(index, 1);

                                        // تحديث حالة المستشفيات
                                        setHospitalsInRadius(updatedHospitals);

                                        // تحديث بيانات النموذج
                                        setFormData((prevData) => ({
                                          ...prevData,
                                          hospitalsInWorkRange: updatedHospitals.map(
                                            (h) => h.name
                                          ),
                                        }));
                                      }}
                                      className={`text-red-500 hover:text-red-700 transition-colors duration-200`}
                                    >
                                      <X size={16} />
                                    </button>
                                  </li>
                                ))
                              ) : !isLoading ? (
                                <li
                                  className={`${
                                    darkMode ? "text-gray-400" : ""
                                  } transition-colors duration-300`}
                                >
                                  لم يتم تحديد أي مستشفيات بعد.
                                </li>
                              ) : null}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">
                        نبذة عنك <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="bio"
                        id="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="اكتب نبذة قصيرة عن خبرتك ومهاراتك..."
                        className={`input min-h-[120px] ${
                          errors.bio ? "border-red-500 focus:ring-red-500" : ""
                        }`}
                        required
                      ></textarea>
                      {errors.bio && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.bio}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
                  {step > 1 ? (
                    <Button
                      type="button"
                      variant="secondary"
                      className={`transition-all duration-200 shadow-sm hover:shadow-md py-2 px-4 relative overflow-hidden group ${
                        darkMode
                          ? "border-gray-700 text-indigo-300 hover:bg-gray-700"
                          : "border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                      }`}
                      onClick={handlePrevStep}
                    >
                      <span className="relative z-10 font-bold">السابق</span>
                      <span
                        className={`absolute inset-0 ${
                          darkMode ? "bg-gray-600" : "bg-indigo-50"
                        } opacity-0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full group-hover:opacity-100 transition-all duration-700`}
                      ></span>
                    </Button>
                  ) : (
                    <div></div>
                  )}

                  {step < 3 ? (
                    <LoadingButton
                      type="button"
                      variant="primary"
                      isLoading={isLoading && step === 1}
                      loadingText={
                        step === 1 ? "جاري التحقق..." : "جاري المعالجة..."
                      }
                      className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-3 px-6 text-lg ${
                        darkMode
                          ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                          : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                      }`}
                      onClick={handleNextStep}
                    >
                      <span className="relative z-10 font-bold text-white">
                        التالي
                      </span>
                      <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    </LoadingButton>
                  ) : (
                    <LoadingButton
                      type="button"
                      variant="primary"
                      isLoading={isLoading && step === 3}
                      loadingText="جاري إنشاء الحساب..."
                      className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-3 px-6 text-lg ${
                        darkMode
                          ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                          : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                      }`}
                      onClick={handleSubmit}
                    >
                      <span className="relative z-10 font-bold text-white">
                        تسجيل الآن
                      </span>
                      <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    </LoadingButton>
                  )}
                </div>
              </form>

              <div className="mt-8 text-center">
                <p
                  className={`${
                    darkMode ? "text-gray-300" : "text-indigo-600"
                  } text-lg`}
                >
                  هل تريد التسجيل كطالب خدمة بدلاً من ذلك؟{" "}
                  <Link
                    to="/register/client"
                    className={`${
                      darkMode ? "text-indigo-400" : "text-indigo-600"
                    } font-medium hover:text-indigo-800 transition-colors duration-200 border-b-2 border-indigo-200 hover:border-indigo-600 relative inline-block group`}
                  >
                    <span className="relative z-10">
                      انتقل إلى تسجيل طالب الخدمة
                    </span>
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CraftsmanRegisterPage;
