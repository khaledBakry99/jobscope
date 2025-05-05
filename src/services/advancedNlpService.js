// استيراد مكتبة compromise للتحليل المتقدم
import nlp from "compromise";
import { analyzeQuery as basicAnalyzeQuery } from "./nlpService";

// تعريف الأنماط اللغوية العربية للتعرف على النوايا
const arabicPatterns = {
  search: [
    "أريد [.+]",
    "أبحث عن [.+]",
    "أحتاج [.+]",
    "ابحث عن [.+]",
    "ابحثلي عن [.+]",
    "دلني على [.+]",
    "وين بلاقي [.+]",
    "بدي [.+]",
  ],
  booking: [
    "أريد حجز [.+]",
    "كيف أحجز [.+]",
    "بدي احجز [.+]",
    "حجز [.+]",
    "أحجز [.+]",
    "موعد [.+]",
    "طلب [.+]",
    "كيف يمكنني حجز خدمة",
    "كيف يمكنني حجز موعد",
    "كيف يمكنني طلب خدمة",
    "كيف يمكنني إنشاء طلب",
    "كيف أقوم بالحجز",
    "كيف أطلب خدمة",
    "ما هي خطوات الحجز",
    "ما هي مدة الانتظار للحصول على رد",
    "هل يمكنني حجز أكثر من خدمة في نفس الوقت",
  ],
  profile: [
    "الملف الشخصي",
    "معلوماتي",
    "بياناتي",
    "حسابي",
    "تعديل بياناتي",
    "تغيير معلوماتي",
    "تحديث الملف",
    "تغيير رقم هاتفي",
    "تغيير بريدي الإلكتروني",
    "تغيير صورتي الشخصية",
    "تعديل رقم الهاتف",
    "تعديل البريد الإلكتروني",
    "تعديل الصورة الشخصية",
    "كيف يمكنني تغيير رقم هاتفي",
    "كيف يمكنني تغيير بريدي الإلكتروني",
    "كيف يمكنني تغيير صورتي الشخصية",
  ],
  requests: [
    "طلباتي",
    "الطلبات",
    "الحجوزات",
    "حجوزاتي",
    "طلباتي السابقة",
    "سجل الطلبات",
    "كيف يمكنني معرفة حالة طلبي",
    "كيف يمكنني إلغاء طلب",
    "كيف يمكنني تعديل طلب",
    "كيف يمكنني تقييم خدمة مكتملة",
    "كيف يمكنني الاتصال بالحرفي",
    "معرفة حالة الطلب",
    "إلغاء طلب",
    "تعديل طلب",
    "تقييم خدمة",
    "الاتصال بالحرفي",
  ],
  settings: [
    "الإعدادات",
    "تغيير كلمة المرور",
    "تغيير اللغة",
    "الوضع المظلم",
    "الوضع الليلي",
    "تغيير الإعدادات",
    "كيف يمكنني تغيير كلمة المرور",
    "كيف يمكنني تغيير اللغة",
    "كيف يمكنني تفعيل الوضع المظلم",
    "كيف يمكنني تغيير إعدادات الإشعارات",
    "كيف يمكنني حذف حسابي",
    "تعديل كلمة المرور",
    "تعديل اللغة",
    "تفعيل الوضع المظلم",
    "تغيير إعدادات الإشعارات",
    "حذف الحساب",
  ],
  help: [
    "مساعدة",
    "دعم",
    "مشكلة",
    "كيف أستخدم",
    "كيفية الاستخدام",
    "شرح",
    "تعليمات",
    "كيف يمكنني استخدام المنصة",
    "كيف يمكنني التواصل مع الدعم",
    "لدي مشكلة في الحجز",
    "لدي مشكلة في البحث",
    "لدي مشكلة في التسجيل",
    "لدي مشكلة في الدفع",
    "هل هناك رسوم لاستخدام المنصة",
    "ما هي مواعيد عمل فريق الدعم",
    "هل يمكنني استخدام المنصة بدون تسجيل",
  ],
  greeting: [
    "مرحبا",
    "السلام عليكم",
    "صباح الخير",
    "مساء الخير",
    "أهلا",
    "هاي",
    "هلو",
  ],
  thanks: ["شكرا", "شكرا لك", "شكرا جزيلا", "ممتن", "أشكرك"],
  goodbye: ["مع السلامة", "إلى اللقاء", "وداعا", "باي", "تصبح على خير"],
};

// تعريف الأنماط اللغوية الإنجليزية للدعم المستقبلي
const englishPatterns = {
  search: [
    "I need [.+]",
    "I'm looking for [.+]",
    "Find me [.+]",
    "Search for [.+]",
    "Where can I find [.+]",
    "I want [.+]",
  ],
  booking: [
    "I want to book [.+]",
    "How to book [.+]",
    "Book [.+]",
    "Schedule [.+]",
    "Appointment [.+]",
    "Request [.+]",
  ],
  profile: [
    "profile",
    "my information",
    "my data",
    "my account",
    "edit my information",
    "update profile",
  ],
  requests: [
    "my requests",
    "my bookings",
    "booking history",
    "request history",
    "previous bookings",
  ],
  settings: [
    "settings",
    "change password",
    "change language",
    "dark mode",
    "night mode",
    "change settings",
  ],
  help: [
    "help",
    "support",
    "problem",
    "how to use",
    "instructions",
    "explain",
    "guide",
  ],
  greeting: ["hello", "hi", "good morning", "good evening", "greetings", "hey"],
  thanks: ["thank you", "thanks", "appreciate it", "grateful"],
  goodbye: ["goodbye", "bye", "see you", "farewell", "good night"],
};

// تدريب مكتبة compromise على الأنماط العربية
const trainCompromise = () => {
  // إضافة قواعد للغة العربية
  nlp.extend({
    words: {
      أريد: "Verb",
      أبحث: "Verb",
      أحتاج: "Verb",
      ابحث: "Verb",
      دلني: "Verb",
      بدي: "Verb",
      حجز: "Verb",
      أحجز: "Verb",
      تعديل: "Verb",
      تغيير: "Verb",
      تحديث: "Verb",
      مرحبا: "Expression",
      السلام: "Expression",
      شكرا: "Expression",
      وداعا: "Expression",
      باي: "Expression",
      كهربائي: "Profession",
      سباك: "Profession",
      نجار: "Profession",
      دهان: "Profession",
      حداد: "Profession",
      بناء: "Profession",
      ميكانيكي: "Profession",
      "مصمم ديكور": "Profession",
    },
  });
};

// تهيئة المكتبة
trainCompromise();

/**
 * تحليل النص وتحديد النية
 * @param {string} text - النص المراد تحليله
 * @returns {Object} - نتيجة التحليل
 */
export const analyzeIntent = (text) => {
  // تحليل أساسي باستخدام الخدمة الحالية
  const basicAnalysis = basicAnalyzeQuery(text);

  // تحليل النص باستخدام compromise
  const doc = nlp(text);

  // تحديد النية من النص
  let intent = "unknown";
  let confidence = 0;
  let entities = {};

  // فحص الأنماط العربية
  for (const [intentName, patterns] of Object.entries(arabicPatterns)) {
    for (const pattern of patterns) {
      if (text.includes(pattern.replace("[.+]", "").trim())) {
        // إذا كان النمط يحتوي على متغير
        if (pattern.includes("[.+]")) {
          const parts = pattern.split("[.+]");
          const prefix = parts[0].trim();
          const suffix = parts[1] ? parts[1].trim() : "";

          if (text.includes(prefix)) {
            const startIndex = text.indexOf(prefix) + prefix.length;
            const endIndex = suffix
              ? text.indexOf(suffix, startIndex)
              : text.length;

            if (endIndex > startIndex) {
              const entity = text.substring(startIndex, endIndex).trim();
              entities.value = entity;
              intent = intentName;
              confidence = 0.8;
              break;
            }
          }
        } else {
          // نمط بدون متغيرات
          intent = intentName;
          confidence = 0.9;
          break;
        }
      }
    }
    if (confidence > 0) break;
  }

  // دمج النتائج
  return {
    intent,
    confidence,
    entities,
    ...basicAnalysis,
  };
};

/**
 * تحليل سياق المحادثة
 * @param {Array} messages - سجل الرسائل السابقة
 * @param {Object} currentAnalysis - تحليل الرسالة الحالية
 * @returns {Object} - تحليل محسن بناءً على السياق
 */
export const analyzeContext = (messages, currentAnalysis) => {
  let enhancedAnalysis = { ...currentAnalysis };

  // إذا كانت الرسالة الحالية غير واضحة، نحاول استنتاج النية من السياق
  if (
    currentAnalysis.intent === "unknown" &&
    currentAnalysis.confidence < 0.5
  ) {
    // البحث في آخر 3 رسائل للسياق
    const recentMessages = messages.slice(-3);

    for (const message of recentMessages) {
      // إذا كانت الرسالة من البوت وتحتوي على سؤال
      if (!message.isUser && message.text.includes("؟")) {
        // إذا كان السؤال عن المهنة
        if (message.text.includes("مهنة") || message.text.includes("حرفي")) {
          enhancedAnalysis.intent = "search";
          enhancedAnalysis.confidence = 0.6;
        }
        // إذا كان السؤال عن الحجز
        else if (
          message.text.includes("حجز") ||
          message.text.includes("موعد")
        ) {
          enhancedAnalysis.intent = "booking";
          enhancedAnalysis.confidence = 0.6;
        }
        break;
      }
    }
  }

  // إذا كانت الرسالة قصيرة جداً (كلمة أو كلمتين)، نحاول تحسين التحليل
  if (
    currentAnalysis.keywords.length <= 2 &&
    currentAnalysis.intent === "unknown"
  ) {
    // إذا كانت الكلمة مهنة
    if (currentAnalysis.profession) {
      enhancedAnalysis.intent = "search";
      enhancedAnalysis.confidence = 0.7;
    }
    // إذا كانت الكلمة مكان
    else if (
      currentAnalysis.city ||
      currentAnalysis.hospital ||
      currentAnalysis.mosque
    ) {
      enhancedAnalysis.intent = "search";
      enhancedAnalysis.confidence = 0.6;
    }
  }

  return enhancedAnalysis;
};

/**
 * توليد رد مناسب بناءً على تحليل النية
 * @param {Object} analysis - نتيجة تحليل النية
 * @returns {Object} - الرد المناسب
 */
export const generateResponse = (analysis) => {
  const { intent, profession, city, hospital, mosque, keywords } = analysis;

  // ردود حسب النية
  const responses = {
    search: () => {
      if (profession) {
        return `يمكنك البحث عن ${profession} من خلال صفحة البحث. هل تريد مساعدة في تحديد المنطقة أو المواصفات؟`;
      } else if (city) {
        return `يمكنك البحث عن الحرفيين في ${city} من خلال صفحة البحث. هل هناك مهنة محددة تبحث عنها؟`;
      } else if (hospital) {
        return `يمكنك البحث عن الحرفيين بالقرب من ${hospital} من خلال صفحة البحث. هل تريد مساعدة في تحديد المهنة؟`;
      } else if (mosque) {
        return `يمكنك البحث عن الحرفيين بالقرب من ${mosque} من خلال صفحة البحث. هل تريد مساعدة في تحديد المهنة؟`;
      } else {
        return "يمكنك البحث عن الحرفيين من خلال صفحة البحث. هل تبحث عن مهنة محددة؟";
      }
    },
    booking: () => {
      if (profession) {
        return `لحجز ${profession}، يمكنك أولاً البحث عن ${profession} مناسب ثم النقر على زر "حجز" في صفحة الملف الشخصي.`;
      } else {
        return 'لحجز خدمة، يمكنك البحث عن الحرفي المناسب، ثم النقر على زر "حجز" في صفحة الملف الشخصي للحرفي، وملء نموذج الحجز بالتفاصيل المطلوبة.';
      }
    },
    profile: () => {
      return 'يمكنك تعديل معلومات ملفك الشخصي من خلال الانتقال إلى صفحة "الملف الشخصي" ثم النقر على زر "تعديل".';
    },
    requests: () => {
      return 'يمكنك عرض طلباتك السابقة والحالية من خلال الانتقال إلى صفحة "طلباتي".';
    },
    settings: () => {
      return 'يمكنك تغيير إعدادات حسابك من خلال الانتقال إلى صفحة "الإعدادات".';
    },
    help: () => {
      return "كيف يمكنني مساعدتك؟ يمكنك طرح أسئلة حول كيفية استخدام المنصة، أو البحث عن حرفيين، أو حجز خدمة، أو إدارة حسابك.";
    },
    greeting: () => {
      return "مرحباً بك في منصة JobScope! كيف يمكنني مساعدتك اليوم؟";
    },
    thanks: () => {
      return "العفو! سعيد بمساعدتك. هل هناك شيء آخر يمكنني مساعدتك به؟";
    },
    goodbye: () => {
      return "شكراً لاستخدامك منصة JobScope! نتمنى لك يوماً سعيداً.";
    },
    unknown: () => {
      if (keywords.length > 0) {
        return `عذراً، لم أفهم طلبك تماماً. هل يمكنك توضيح ما إذا كنت تبحث عن معلومات حول "${keywords.join(
          ", "
        )}"؟`;
      } else {
        return "عذراً، لم أفهم طلبك. الرجاء توضيح طلبك بشكل أكثر أو اختيار أحد الاقتراحات أدناه.";
      }
    },
  };

  // استدعاء الدالة المناسبة حسب النية
  const responseFunction = responses[intent] || responses.unknown;
  return {
    text: responseFunction(),
    intent,
    suggestions: generateSuggestions(analysis),
  };
};

/**
 * توليد اقتراحات بناءً على تحليل النية
 * @param {Object} analysis - نتيجة تحليل النية
 * @returns {Array} - قائمة الاقتراحات
 */
export const generateSuggestions = (analysis) => {
  const { intent, profession, city, hospital, mosque } = analysis;

  // اقتراحات افتراضية
  const defaultSuggestions = [
    "كيف يمكنني التسجيل كحرفي؟",
    "كيف يمكنني حجز خدمة؟",
    "كيف يمكنني تعديل معلومات ملفي الشخصي؟",
    "كيف يمكنني تغيير كلمة المرور؟",
    "كيف يمكنني إلغاء طلب؟",
  ];

  // اقتراحات حسب النية
  const intentSuggestions = {
    search: () => {
      if (profession) {
        return [
          `كيف يمكنني حجز ${profession}؟`,
          `ما هي أسعار ${profession}؟`,
          `ما هي أفضل شركة ${profession}؟`,
          `كيف يمكنني تقييم ${profession}؟`,
          `كيف يمكنني التسجيل كحرفي؟`,
        ];
      } else if (city) {
        return [
          `أريد كهربائي في ${city}`,
          `أريد سباك في ${city}`,
          `أريد نجار في ${city}`,
          `أريد دهان في ${city}`,
          `ما هي أفضل الحرفيين في ${city}؟`,
        ];
      } else if (hospital || mosque) {
        const place = hospital || mosque;
        return [
          `أريد كهربائي بالقرب من ${place}`,
          `أريد سباك بالقرب من ${place}`,
          `أريد نجار بالقرب من ${place}`,
          `ما هي المهن المتوفرة بالقرب من ${place}؟`,
          `كيف يمكنني البحث حسب الموقع؟`,
        ];
      } else {
        return [
          "أريد كهربائي",
          "أريد سباك",
          "أريد نجار",
          "أريد دهان",
          "كيف يمكنني البحث عن حرفي؟",
        ];
      }
    },
    booking: () => {
      return [
        "كيف يمكنني إلغاء طلب؟",
        "كيف يمكنني تعديل طلب؟",
        "كيف يمكنني معرفة حالة طلبي؟",
        "ما هي مدة الانتظار للحصول على رد؟",
        "هل يمكنني حجز أكثر من خدمة في نفس الوقت؟",
      ];
    },
    profile: () => {
      return [
        "كيف يمكنني تغيير صورتي الشخصية؟",
        "كيف يمكنني تغيير رقم هاتفي؟",
        "كيف يمكنني تغيير بريدي الإلكتروني؟",
        "كيف يمكنني تغيير كلمة المرور؟",
        "كيف يمكنني حذف حسابي؟",
      ];
    },
    requests: () => {
      return [
        "كيف يمكنني معرفة حالة طلبي؟",
        "كيف يمكنني إلغاء طلب؟",
        "كيف يمكنني تعديل طلب؟",
        "كيف يمكنني تقييم خدمة مكتملة؟",
        "كيف يمكنني الاتصال بالحرفي؟",
      ];
    },
    settings: () => {
      return [
        "كيف يمكنني تغيير اللغة؟",
        "كيف يمكنني تفعيل الوضع المظلم؟",
        "كيف يمكنني تغيير كلمة المرور؟",
        "كيف يمكنني تغيير إعدادات الإشعارات؟",
        "كيف يمكنني حذف حسابي؟",
      ];
    },
    help: () => {
      return [
        "كيف يمكنني البحث عن حرفي؟",
        "كيف يمكنني حجز خدمة؟",
        "كيف يمكنني تعديل معلومات ملفي الشخصي؟",
        "كيف يمكنني تغيير كلمة المرور؟",
        "كيف يمكنني التواصل مع الدعم؟",
      ];
    },
    greeting: () => defaultSuggestions,
    thanks: () => defaultSuggestions,
    goodbye: () => defaultSuggestions,
    unknown: () => defaultSuggestions,
  };

  // استدعاء الدالة المناسبة حسب النية
  const suggestionFunction =
    intentSuggestions[intent] || intentSuggestions.unknown;
  return suggestionFunction();
};

/**
 * تدريب نموذج TensorFlow.js للتعرف على النوايا
 * سيتم تنفيذه في المستقبل
 */
export const trainTensorFlowModel = async () => {
  // سيتم تنفيذ هذه الوظيفة في المستقبل
  // يمكن استخدام TensorFlow.js لتدريب نموذج بسيط للتعرف على النوايا
  console.log("تدريب نموذج TensorFlow.js للتعرف على النوايا");
};

export default {
  analyzeIntent,
  analyzeContext,
  generateResponse,
  generateSuggestions,
  trainTensorFlowModel,
};
