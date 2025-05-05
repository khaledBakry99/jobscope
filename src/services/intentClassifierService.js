/**
 * خدمة تصنيف النوايا باستخدام TensorFlow.js
 * هذه خدمة بسيطة تستخدم نموذج TensorFlow.js للتعرف على نوايا المستخدم
 */

import * as tf from "@tensorflow/tfjs";

// بيانات التدريب - أمثلة على النوايا المختلفة
const trainingData = {
  search: [
    "أريد كهربائي",
    "أبحث عن سباك",
    "أحتاج نجار",
    "دلني على دهان",
    "وين بلاقي حداد",
    "بدي مصمم ديكور",
    "أريد حرفي",
    "أبحث عن حرفي في دمشق",
    "أحتاج حرفي بالقرب من المشفى",
    "دلني على حرفي بالقرب من الجامع",
  ],
  booking: [
    "أريد حجز كهربائي",
    "كيف أحجز سباك",
    "بدي احجز نجار",
    "حجز دهان",
    "أحجز حداد",
    "موعد مع مصمم ديكور",
    "طلب حرفي",
    "أريد حجز خدمة",
    "كيف يمكنني حجز موعد",
    "بدي أعمل حجز",
  ],
  profile: [
    "الملف الشخصي",
    "معلوماتي",
    "بياناتي",
    "حسابي",
    "تعديل بياناتي",
    "تغيير معلوماتي",
    "تحديث الملف",
    "أريد تعديل ملفي",
    "كيف أغير معلوماتي",
    "بدي غير صورتي",
  ],
  requests: [
    "طلباتي",
    "الطلبات",
    "الحجوزات",
    "حجوزاتي",
    "طلباتي السابقة",
    "سجل الطلبات",
    "أريد رؤية طلباتي",
    "عرض الطلبات",
    "الطلبات السابقة",
    "حالة الطلب",
  ],
  settings: [
    "الإعدادات",
    "تغيير كلمة المرور",
    "تغيير اللغة",
    "الوضع المظلم",
    "الوضع الليلي",
    "تغيير الإعدادات",
    "إعدادات الحساب",
    "ضبط الإعدادات",
    "تخصيص الإعدادات",
    "خيارات الحساب",
  ],
  help: [
    "مساعدة",
    "دعم",
    "مشكلة",
    "كيف أستخدم",
    "كيفية الاستخدام",
    "شرح",
    "تعليمات",
    "أحتاج مساعدة",
    "لدي سؤال",
    "كيف يمكنني",
  ],
  greeting: [
    "مرحبا",
    "السلام عليكم",
    "صباح الخير",
    "مساء الخير",
    "أهلا",
    "هاي",
    "هلو",
    "مرحبا بك",
    "أهلا وسهلا",
    "صباح النور",
  ],
  thanks: [
    "شكرا",
    "شكرا لك",
    "شكرا جزيلا",
    "ممتن",
    "أشكرك",
    "جزاك الله خيرا",
    "بارك الله فيك",
    "ألف شكر",
    "شكرا على المساعدة",
    "شكرا على الرد",
  ],
  goodbye: [
    "مع السلامة",
    "إلى اللقاء",
    "وداعا",
    "باي",
    "تصبح على خير",
    "أراك لاحقا",
    "إلى اللقاء",
    "مع السلامة",
    "أستودعك الله",
    "في أمان الله",
  ],
};

// قائمة النوايا
const intents = Object.keys(trainingData);

// قائمة الكلمات المميزة
let vocabulary = [];

// نموذج TensorFlow.js
let model = null;

// حالة تهيئة النموذج
let isInitialized = false;

/**
 * تهيئة النموذج
 * @returns {Promise<void>}
 */
export const initializeModel = async () => {
  if (isInitialized) return;

  try {
    // بناء المفردات
    buildVocabulary();

    // إنشاء النموذج
    model = createModel();

    // تدريب النموذج
    await trainModel();

    isInitialized = true;
    console.log("تم تهيئة نموذج تصنيف النوايا بنجاح");
  } catch (error) {
    console.error("خطأ في تهيئة نموذج تصنيف النوايا:", error);
  }
};

/**
 * بناء قائمة المفردات من بيانات التدريب
 */
const buildVocabulary = () => {
  const allWords = new Set();

  // جمع جميع الكلمات من جميع الأمثلة
  Object.values(trainingData).forEach((examples) => {
    examples.forEach((example) => {
      const words = example.split(/\s+/);
      words.forEach((word) => {
        if (word.length > 1) {
          allWords.add(word);
        }
      });
    });
  });

  vocabulary = Array.from(allWords);
  console.log(`تم بناء المفردات: ${vocabulary.length} كلمة`);
};

/**
 * تحويل النص إلى متجه ميزات
 * @param {string} text - النص المراد تحويله
 * @returns {number[]} - متجه الميزات
 */
const textToFeatures = (text) => {
  const features = new Array(vocabulary.length).fill(0);
  const words = text.split(/\s+/);

  words.forEach((word) => {
    const index = vocabulary.indexOf(word);
    if (index !== -1) {
      features[index] = 1;
    }
  });

  return features;
};

/**
 * إنشاء نموذج TensorFlow.js
 * @returns {tf.Sequential} - نموذج TensorFlow.js
 */
const createModel = () => {
  const model = tf.sequential();

  // طبقة الإدخال
  model.add(
    tf.layers.dense({
      units: 128,
      activation: "relu",
      inputShape: [vocabulary.length],
    })
  );

  // طبقة مخفية
  model.add(
    tf.layers.dense({
      units: 64,
      activation: "relu",
    })
  );

  // طبقة الإخراج
  model.add(
    tf.layers.dense({
      units: intents.length,
      activation: "softmax",
    })
  );

  // تجميع النموذج
  model.compile({
    optimizer: "adam",
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

  return model;
};

/**
 * تدريب النموذج على بيانات التدريب
 * @returns {Promise<void>}
 */
const trainModel = async () => {
  // إعداد بيانات التدريب
  const xs = [];
  const ys = [];

  intents.forEach((intent, intentIndex) => {
    trainingData[intent].forEach((example) => {
      const features = textToFeatures(example);
      xs.push(features);

      const label = new Array(intents.length).fill(0);
      label[intentIndex] = 1;
      ys.push(label);
    });
  });

  // تحويل البيانات إلى تنسورات
  const xsTensor = tf.tensor2d(xs);
  const ysTensor = tf.tensor2d(ys);

  // تدريب النموذج
  await model.fit(xsTensor, ysTensor, {
    epochs: 100,
    batchSize: 8,
    shuffle: true,
    verbose: 0,
  });

  // تحرير الذاكرة
  xsTensor.dispose();
  ysTensor.dispose();

  console.log("تم تدريب النموذج بنجاح");
};

/**
 * التنبؤ بالنية من النص
 * @param {string} text - النص المراد تحليله
 * @returns {Promise<Object>} - نتيجة التنبؤ
 */
export const predictIntent = async (text) => {
  if (!isInitialized) {
    await initializeModel();
  }

  try {
    // تحويل النص إلى متجه ميزات
    const features = textToFeatures(text);
    const featuresTensor = tf.tensor2d([features]);

    // التنبؤ بالنية
    const predictions = await model.predict(featuresTensor).data();

    // تحرير الذاكرة
    featuresTensor.dispose();

    // العثور على النية ذات أعلى احتمالية
    let maxIndex = 0;
    let maxValue = predictions[0];

    for (let i = 1; i < predictions.length; i++) {
      if (predictions[i] > maxValue) {
        maxIndex = i;
        maxValue = predictions[i];
      }
    }

    // إذا كانت الاحتمالية منخفضة جداً، نعتبر النية غير معروفة
    if (maxValue < 0.3) {
      return {
        intent: "unknown",
        confidence: maxValue,
      };
    }

    return {
      intent: intents[maxIndex],
      confidence: maxValue,
    };
  } catch (error) {
    console.error("خطأ في التنبؤ بالنية:", error);
    return {
      intent: "unknown",
      confidence: 0,
    };
  }
};

export default {
  initializeModel,
  predictIntent,
};
