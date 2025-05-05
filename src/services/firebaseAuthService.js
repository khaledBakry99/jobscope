import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  RecaptchaVerifier,
} from "firebase/auth";
import { auth } from "../config/firebase";

// مزود المصادقة باستخدام Google
const googleProvider = new GoogleAuthProvider();

const firebaseAuthService = {
  // إنشاء حساب جديد باستخدام البريد الإلكتروني وكلمة المرور
  registerWithEmailAndPassword: async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // تحديث الملف الشخصي للمستخدم بإضافة الاسم
      await updateProfile(user, { displayName: name });

      // إرسال بريد إلكتروني للتحقق
      await sendEmailVerification(user);

      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          emailVerified: user.emailVerified,
        },
      };
    } catch (error) {
      console.error("Error registering with email and password:", error);
      return {
        success: false,
        error: {
          code: error.code,
          message: getErrorMessage(error.code),
        },
      };
    }
  },

  // تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور
  loginWithEmailAndPassword: async (email, password) => {
    try {
      console.log("Firebase: Attempting login with email:", email);

      // إضافة معلومات تشخيصية
      console.log("Firebase auth state before login:", auth.currentUser ? "User logged in" : "No user");

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      console.log("Firebase login successful, user details:", {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        providerId: user.providerId,
        providerData: user.providerData
      });

      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          emailVerified: user.emailVerified,
        },
      };
    } catch (error) {
      console.error("Error logging in with email and password:", error);
      console.error("Firebase error details:", {
        code: error.code,
        message: error.message,
        customMessage: getErrorMessage(error.code)
      });

      return {
        success: false,
        error: {
          code: error.code,
          message: getErrorMessage(error.code),
        },
      };
    }
  },

  // إنشاء reCAPTCHA للتحقق من رقم الهاتف
  setupRecaptcha: async (containerId) => {
    try {
      // التحقق من وجود reCAPTCHA سابق وإزالته
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {
          console.warn("Failed to clear existing recaptcha:", e);
        }
      }

      // إنشاء reCAPTCHA جديد
      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: "invisible",
        callback: (_response) => {
          // تم التحقق من reCAPTCHA بنجاح
          console.log("reCAPTCHA verified successfully");
        },
        'expired-callback': () => {
          // انتهت صلاحية reCAPTCHA
          console.log("reCAPTCHA expired");
        }
      });

      return { success: true };
    } catch (error) {
      console.error("Error setting up recaptcha:", error);
      return {
        success: false,
        error: {
          code: error.code || "recaptcha-error",
          message: error.message || getErrorMessage("recaptcha-error")
        }
      };
    }
  },

  // إرسال رمز التحقق إلى رقم الهاتف
  sendOtpToPhone: async (phoneNumber) => {
    try {
      if (!phoneNumber) {
        throw new Error("رقم الهاتف مطلوب");
      }

      // التأكد من أن رقم الهاتف بالتنسيق الدولي
      const formattedPhone = formatPhoneNumber(phoneNumber);
      console.log("Formatted phone number:", formattedPhone);

      // التحقق من صحة رقم الهاتف
      if (!/^\+\d{8,15}$/.test(formattedPhone)) {
        throw new Error("رقم الهاتف غير صالح");
      }

      // التحقق من نوع الرقم (أمريكي أم لا)
      const isUSNumber = formattedPhone.startsWith("+1");

      if (isUSNumber) {
        console.log("US phone number detected, checking if billing is enabled");
      }

      try {
        // إرسال رمز التحقق
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          formattedPhone,
          window.recaptchaVerifier
        );

        // تخزين نتيجة التأكيد لاستخدامها لاحقًا
        window.confirmationResult = confirmationResult;

        return {
          success: true,
          message: "تم إرسال رمز التحقق بنجاح",
        };
      } catch (error) {
        console.error("Error sending OTP to phone:", error);

        // التحقق من نوع الخطأ
        if (error.code === "auth/billing-not-enabled") {
          if (isUSNumber) {
            return {
              success: false,
              error: {
                code: error.code,
                message: "لا يمكن إرسال رمز التحقق إلى رقم هاتف أمريكي. الرجاء استخدام رقم هاتف سوري أو التسجيل باستخدام البريد الإلكتروني.",
              },
            };
          } else {
            return {
              success: false,
              error: {
                code: error.code,
                message: "لم يتم تفعيل الفوترة في مشروع Firebase. الرجاء التواصل مع مسؤول النظام.",
              },
            };
          }
        } else {
          return {
            success: false,
            error: {
              code: error.code,
              message: getErrorMessage(error.code),
            },
          };
        }
      }
    } catch (error) {
      console.error("Error in sendOtpToPhone:", error);
      return {
        success: false,
        error: {
          code: error.code || "unknown",
          message: error.message || getErrorMessage("unknown"),
        },
      };
    }
  },

  // التحقق من رمز التحقق المرسل إلى رقم الهاتف
  verifyPhoneOtp: async (otp) => {
    try {
      // التحقق من رمز التحقق
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;

      return {
        success: true,
        user: {
          uid: user.uid,
          phoneNumber: user.phoneNumber,
        },
      };
    } catch (error) {
      console.error("Error verifying phone OTP:", error);
      return {
        success: false,
        error: {
          code: error.code,
          message: getErrorMessage(error.code),
        },
      };
    }
  },

  // تسجيل الدخول باستخدام Google
  loginWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
        },
      };
    } catch (error) {
      console.error("Error logging in with Google:", error);
      return {
        success: false,
        error: {
          code: error.code,
          message: getErrorMessage(error.code),
        },
      };
    }
  },

  // إرسال بريد إلكتروني لإعادة تعيين كلمة المرور
  sendPasswordResetEmail: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: "تم إرسال بريد إلكتروني لإعادة تعيين كلمة المرور",
      };
    } catch (error) {
      console.error("Error sending password reset email:", error);
      return {
        success: false,
        error: {
          code: error.code,
          message: getErrorMessage(error.code),
        },
      };
    }
  },

  // إعادة إرسال بريد إلكتروني للتحقق
  sendEmailVerificationAgain: async (user) => {
    try {
      await sendEmailVerification(user);
      return {
        success: true,
        message: "تم إرسال بريد إلكتروني للتحقق",
      };
    } catch (error) {
      console.error("Error sending verification email:", error);
      return {
        success: false,
        error: {
          code: error.code,
          message: getErrorMessage(error.code),
        },
      };
    }
  },

  // تسجيل الخروج
  logout: async () => {
    try {
      await auth.signOut();
      return { success: true };
    } catch (error) {
      console.error("Error logging out:", error);
      return {
        success: false,
        error: {
          code: error.code,
          message: getErrorMessage(error.code),
        },
      };
    }
  },

  // الحصول على المستخدم الحالي
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // الحصول على معلومات المستخدم
  getUserInfo: async (uid) => {
    try {
      // في الوضع الحقيقي، سنقوم بجلب معلومات المستخدم من Firebase
      // لكن في هذه الحالة، سنقوم بإنشاء بيانات وهمية بناءً على نوع المستخدم

      // التحقق من وجود المستخدم الحالي
      const currentUser = auth.currentUser;

      if (currentUser) {
        return {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email,
          phoneNumber: currentUser.phoneNumber,
          photoURL: currentUser.photoURL,
          emailVerified: currentUser.emailVerified,
        };
      }

      // إذا لم يكن هناك مستخدم حالي، نعيد بيانات وهمية
      return {
        uid: uid,
        displayName: "مستخدم جديد",
        email: "",
        phoneNumber: "",
        photoURL: "",
        emailVerified: false,
      };
    } catch (error) {
      console.error("Error getting user info:", error);
      return null;
    }
  },
};

// تنسيق رقم الهاتف إلى التنسيق الدولي
const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) {
    return "+963";
  }

  console.log("Formatting phone number:", phoneNumber);

  // إذا كان الرقم يحتوي على "undefined"، نستبدله بسلسلة فارغة
  phoneNumber = phoneNumber.replace("undefined", "");

  // إذا كان الرقم بالفعل في التنسيق الدولي الصحيح، نعيده كما هو
  if (/^\+\d{1,3}\d{7,14}$/.test(phoneNumber)) {
    console.log("Phone number already in international format:", phoneNumber);
    return phoneNumber;
  }

  // إزالة أي مسافات أو أحرف غير رقمية (باستثناء +)
  let cleaned = phoneNumber.replace(/[^\d+]/g, "");

  // التعامل مع أرقام الهواتف الأمريكية
  if (cleaned.startsWith("+1")) {
    console.log("US phone number with country code:", cleaned);
    return cleaned;
  } else if (cleaned.startsWith("1") && cleaned.length === 11) {
    // إذا كان الرقم يبدأ بـ 1 وطوله 11 رقمًا، نفترض أنه رقم أمريكي بدون +
    console.log("US phone number without + sign:", cleaned);
    return "+" + cleaned;
  } else if (cleaned.length === 10 && /^[2-9]\d{9}$/.test(cleaned)) {
    // إذا كان الرقم يتكون من 10 أرقام ويبدأ برقم من 2 إلى 9، نفترض أنه رقم أمريكي بدون رمز الدولة
    console.log("US phone number without country code:", cleaned);
    return "+1" + cleaned;
  }

  // التأكد من أن الرقم يبدأ بـ +
  if (!cleaned.startsWith("+")) {
    // إذا كان الرقم يبدأ بـ 0، نحذفه
    if (cleaned.startsWith("0")) {
      cleaned = cleaned.substring(1);
    }

    // نضيف رمز الدولة إذا لم يكن موجودًا
    if (cleaned.length > 0) {
      // إذا كان الرقم يبدأ بـ 9 وطوله 9 أرقام، نفترض أنه رقم سوري
      if (cleaned.startsWith("9") && cleaned.length === 9) {
        console.log("Syrian phone number:", cleaned);
        return `+963${cleaned}`;
      } else {
        // بخلاف ذلك، نضيف رمز الدولة الافتراضي
        console.log("Adding default country code to:", cleaned);
        return `+963${cleaned}`;
      }
    } else {
      return "+963"; // قيمة افتراضية
    }
  }

  console.log("Formatted phone number:", cleaned);
  return cleaned;
};

// الحصول على رسالة خطأ مناسبة باللغة العربية
const getErrorMessage = (errorCode) => {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "البريد الإلكتروني مستخدم بالفعل";
    case "auth/invalid-email":
      return "البريد الإلكتروني غير صالح";
    case "auth/user-disabled":
      return "تم تعطيل هذا الحساب";
    case "auth/user-not-found":
      return "لم يتم العثور على مستخدم بهذا البريد الإلكتروني";
    case "auth/wrong-password":
      return "كلمة المرور غير صحيحة";
    case "auth/weak-password":
      return "كلمة المرور ضعيفة جدًا";
    case "auth/invalid-verification-code":
      return "رمز التحقق غير صحيح";
    case "auth/invalid-phone-number":
      return "رقم الهاتف غير صالح";
    case "auth/too-many-requests":
      return "تم تجاوز عدد المحاولات المسموح بها، يرجى المحاولة لاحقًا";
    case "auth/popup-closed-by-user":
      return "تم إغلاق نافذة التسجيل قبل إكمال العملية";
    case "auth/captcha-check-failed":
      return "فشل التحقق من reCAPTCHA، يرجى المحاولة مرة أخرى";
    case "auth/billing-not-enabled":
      return "لا يمكن إرسال رمز التحقق. الرجاء استخدام رقم هاتف سوري أو التسجيل باستخدام البريد الإلكتروني";
    case "auth/quota-exceeded":
      return "تم تجاوز الحد الأقصى لعدد الرسائل المسموح بها، يرجى المحاولة لاحقًا";
    case "auth/missing-phone-number":
      return "رقم الهاتف مطلوب";
    case "auth/invalid-recipient-email":
      return "البريد الإلكتروني للمستلم غير صالح";
    case "auth/invalid-sender":
      return "المرسل غير صالح";
    case "auth/invalid-message-payload":
      return "محتوى الرسالة غير صالح";
    case "auth/invalid-recipient-phone-number":
      return "رقم هاتف المستلم غير صالح";
    case "recaptcha-error":
      return "حدث خطأ أثناء إعداد reCAPTCHA";
    case "unknown":
      return "حدث خطأ غير معروف";
    default:
      return "حدث خطأ أثناء المصادقة";
  }
};

export default firebaseAuthService;
