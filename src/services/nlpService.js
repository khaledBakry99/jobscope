// استيراد مكتبة compromise للاستخدام المستقبلي
// import nlp from "compromise";

// قائمة المهن المتاحة في التطبيق
const availableProfessions = [
  {
    name: "كهربائي",
    keywords: [
      "كهرباء",
      "كهربائي",
      "إضاءة",
      "مصباح",
      "فيوز",
      "قاطع",
      "تمديدات كهربائية",
      "كهربجي",
      "كهربا",
      "مشاكل كهربا",
      "تركيب ضو",
      "تشغيل كهربا",
      "فصل كهربا",
      "قاطع كهربا",
      "لمبة",
    ],
  },
  {
    name: "سباك",
    keywords: [
      "سباكة",
      "سباك",
      "ماء",
      "تسرب",
      "حنفية",
      "مجاري",
      "صرف صحي",
      "حمام",
      "مطبخ",
      "مصلّح مي",
      "مي تسربت",
      "مي بالحمام",
      "تبديل ماسورة",
      "تفجير ماسورة",
      "موي",
      "صرف",
      "انسداد مجاري",
    ],
  },
  {
    name: "نجار",
    keywords: [
      "نجارة",
      "نجار",
      "خشب",
      "أثاث",
      "باب",
      "نافذة",
      "خزانة",
      "طاولة",
      "نجّار",
      "نجارة خشب",
      "تصليح أثاث",
      "كراسي خشب",
      "كبت",
      "كمدينو",
      "تفصيل خزانة",
      "تفصيل مطبخ",
    ],
  },
  {
    name: "دهان",
    keywords: [
      "دهان",
      "طلاء",
      "صبغ",
      "جدران",
      "سقف",
      "ديكور",
      "صبّاغ",
      "دهانين",
      "دهان خارجي",
      "دهان داخلي",
      "لون الحيط",
      "دهان باب",
      "لون جدران",
      "دهان باب خشب",
    ],
  },
  {
    name: "مصمم ديكور",
    keywords: [
      "ديكور",
      "تصميم",
      "منزل",
      "غرفة",
      "تزيين",
      "منسق ديكور",
      "مهندس ديكور",
      "تزيين غرفة",
      "ستايل غرفة",
      "ديكور عصري",
      "لمسات ديكور",
      "ديزاين",
    ],
  },
  {
    name: "ميكانيكي",
    keywords: [
      "ميكانيك",
      "سيارة",
      "محرك",
      "إصلاح",
      "صيانة",
      "مكانيكي",
      "تصليح سيارة",
      "كهرباء سيارة",
      "فحص كمبيوتر",
      "كراج سيارات",
      "عطل موتور",
      "تبديل زيت",
    ],
  },
  {
    name: "حداد",
    keywords: [
      "حدادة",
      "حديد",
      "معدن",
      "أبواب حديد",
      "نوافذ حديد",
      "شبابيك",
      "شغل حديد",
      "بوابة حديد",
      "شبابيك حديد",
      "سياج حديد",
      "تفصيل حديد",
      "شغل لحام",
      "شغل حدادة",
      "باب خارجي حديد",
    ],
  },
  {
    name: "بناء",
    keywords: [
      "بناء",
      "جدار",
      "طوب",
      "إسمنت",
      "خرسانة",
      "ترميم",
      "معلم بناء",
      "بنيان",
      "قصارة",
      "بلاط",
      "صب أسطح",
      "إعادة ترميم",
      "هيكل",
      "شقف",
      "أرضيات",
    ],
  },
];

// قائمة المدن المتاحة في التطبيق
const availableCities = [
  {
    name: "دمشق",
    keywords: ["دمشق", "الشام", "شام", "الشآم", "دَمشَق", "دماشق"],
  },
  { name: "حلب", keywords: ["حلب", "حلاب", "حلَب", "حَلب", "حلبا"] },
  { name: "حمص", keywords: ["حمص", "حومص", "حمُص", "حمصس", "حمس"] },
  {
    name: "اللاذقية",
    keywords: [
      "اللاذقية",
      "لاذقية",
      "لاذقيه",
      "اللادئية",
      "اللازقية",
      "لادئيه",
    ],
  },
  { name: "طرطوس", keywords: ["طرطوس", "طرتوس", "طرطوص", "طرطووس"] },
  { name: "حماة", keywords: ["حماة", "حماه", "حما", "حماا", "حماأ", "حماهء"] },
  {
    name: "دير الزور",
    keywords: ["دير الزور", "ديرالزور", "دير", "دير الزورر", "دير الزوور"],
  },
  {
    name: "الرقة",
    keywords: ["الرقة", "رقة", "الرقا", "الرقّة", "الرقي", "رقا"],
  },
  { name: "درعا", keywords: ["درعا", "درعه", "درعاء", "درعاا"] },
  {
    name: "السويداء",
    keywords: ["السويداء", "سويداء", "سويدا", "سؤيدا", "السويدا", "سويْداء"],
  },
  { name: "إدلب", keywords: ["إدلب", "إدلبا", "ادلب", "ادلبا"] },
  { name: "الحسكة", keywords: ["الحسكة", "الحسكه", "حسكة", "حسكه"] },
  { name: "القنيطرة", keywords: ["القنيطرة", "القنيطره", "قنيطرة", "قنيطره"] },
  {
    name: "ريف دمشق",
    keywords: ["ريف دمشق", "ضواحي دمشق", "ضاحية دمشق", "ريف الشام"],
  },
  { name: "البوكمال", keywords: ["البوكمال", "بوكمال", "البوكمالا"] },
  { name: "الميادين", keywords: ["الميادين", "ميادين", "الميدين"] },
  { name: "عين العرب", keywords: ["عين العرب", "كوباني", "عين عرب"] },
  { name: "تل أبيض", keywords: ["تل أبيض", "تل ابيض", "تل أبيض الشمالي"] },
  { name: "منبج", keywords: ["منبج", "منبجية"] },
  { name: "عفرين", keywords: ["عفرين", "عفرينه"] },
];

// قائمة الأماكن المهمة (المشافي والجوامع) مع إحداثياتها
const importantPlaces = [
  // دمشق
  {
    name: "الجامع الأموي",
    type: "mosque",
    keywords: ["جامع الأموي", "المسجد الأموي", "الجامع الأموي", "الأموي"],
    location: { lng: 36.3067, lat: 33.5119 },
  },
  {
    name: "مستشفى المجتهد (دمشق)",
    type: "hospital",
    keywords: ["مستشفى المجتهد", "مشفى المجتهد", "مستشفى دمشق", "المجتهد"],
    location: { lng: 36.3029, lat: 33.5101 },
  },

  {
    name: "مسجد السيدة رقية",
    type: "mosque",
    keywords: ["مسجد السيدة رقية", "مقام السيدة رقية", "Ruqayya Mosque"],
    location: { lng: 36.30722, lat: 33.51333 }, // :contentReference[oaicite:0]{index=0}
  },
  {
    name: "المستشفى الوطني الجامعي (دمشق)",
    type: "hospital",
    keywords: [
      "المستشفى الوطني الجامعي",
      "National University Hospital",
      "مشفى جامعة دمشق",
    ],
    location: { lng: 36.269635, lat: 33.505716 }, // :contentReference[oaicite:1]{index=1}
  },

  // ريف دمشق
  {
    name: "مقام السيدة زينب",
    type: "mosque",
    keywords: ["مقام السيدة زينب", "مسجد السيدة زينب", "السيدة زينب"],
    location: { lng: 36.34064595743331, lat: 33.44429811416082 }, // :contentReference[oaicite:0]{index=0}
  },
  {
    name: "مشفى التل العسكري",
    type: "hospital",
    keywords: ["مشفى التل", "مشفى التل العسكري", "التل"],
    location: { lng: 36.308056, lat: 33.616389 }, // :contentReference[oaicite:1]{index=1}
  },

  // حلب
  {
    name: "الجامع الكبير (حلب)",
    type: "mosque",
    keywords: [
      "الجامع الكبير",
      "المسجد الكبير",
      "جامع الكبير",
      "جامع حلب الكبير",
    ],
    location: { lng: 37.1588, lat: 36.1989 },
  },
  {
    name: "مستشفى الرازي (حلب)",
    type: "hospital",
    keywords: ["مشفى الرازي", "مستشفى الرازي", "الرازي"],
    location: { lng: 37.1527, lat: 36.2098 },
  },

  {
    name: "الجامع الأموي (حلب) — الجامع الكبير",
    type: "mosque",
    keywords: [
      "الجامع الأموي حلب",
      "جامع حلب الكبير",
      "Great Mosque of Aleppo",
    ],
    location: { lng: 37.1541, lat: 36.193 }, // :contentReference[oaicite:2]{index=2}
  },
  {
    name: "مشفى حلب الجامعي",
    type: "hospital",
    keywords: ["مشفى حلب الجامعي", "Aleppo University Hospital", "AUH"],
    location: { lng: 37.12806, lat: 36.21083 }, // :contentReference[oaicite:3]{index=3}
  },

  // حمص
  {
    name: "جامع خالد بن الوليد",
    type: "mosque",
    keywords: ["جامع خالد بن الوليد", "مسجد خالد بن الوليد", "خالد بن الوليد"],
    location: { lng: 36.7306, lat: 34.739 },
  },
  {
    name: "مستشفى الباسل (حمص)",
    type: "hospital",
    keywords: ["مشفى الباسل", "مستشفى الباسل", "الباسل"],
    location: { lng: 36.7131, lat: 34.7324 },
  },

  // حماة
  {
    name: "الجامع الأعلى الكبير (حماة)",
    type: "mosque",
    keywords: ["الجامع الأعلى الكبير", "جامع حماة الكبير", "الجامع الكبير"],
    location: { lng: 36.74527778, lat: 35.13416667 }, // :contentReference[oaicite:2]{index=2}
  },
  {
    name: "مستشفى حماة الوطني",
    type: "hospital",
    keywords: ["مشفى حماة الوطني", "مستشفى حماة الوطني", "مشفى حماة"],
    location: { lng: 36.75783, lat: 35.13179 }, // تقريباً :contentReference[oaicite:3]{index=3}
  },

  // حماة (جامع النوري)
  {
    name: "جامع النوري (حماة)",
    type: "mosque",
    keywords: ["جامع النوري", "الجَامِعُ النُّورِيّ", "نوري"],
    location: { lng: 36.752539, lat: 35.135256 }, // :contentReference[oaicite:4]{index=4}
  },

  // حمص (كهوف علاجية & أخرى إن وجدت) – يمكن إضافة لاحقًا

  // حماة (كهوف علاجية & أخرى إن وجدت) – يمكن إضافة لاحقًا

  // طرطوس
  {
    name: "جامع البحر (طرطوس)",
    type: "mosque",
    keywords: ["جامع البحر", "مسجد البحر", "البحر"],
    location: { lng: 35.8663, lat: 34.9062 },
  },
  {
    name: "مستشفى الباسل (طرطوس)",
    type: "hospital",
    keywords: ["مشفى الباسل", "مستشفى الباسل", "الباسل"],
    location: { lng: 35.8721, lat: 34.897 },
  },

  // اللاذقية
  {
    name: "جامع الرحمن (اللاذقية)",
    type: "mosque",
    keywords: ["جامع الرحمن", "مسجد الرحمن", "الرحمن"],
    location: { lng: 35.7806, lat: 35.517 },
  },
  {
    name: "مستشفى تشرين الجامعي",
    type: "hospital",
    keywords: ["مشفى تشرين", "مستشفى تشرين", "تشرين الجامعي"],
    location: { lng: 35.7801, lat: 35.5136 },
  },

  // إدلب
  {
    name: "جامع إدلب الكبير",
    type: "mosque",
    keywords: ["جامع إدلب الكبير", "المسجد الكبير", "جامع الكبير"],
    location: { lng: 36.634, lat: 35.9306 },
  },
  {
    name: "مستشفى إدلب المركزي",
    type: "hospital",
    keywords: ["مشفى إدلب المركزي", "مستشفى إدلب المركزي", "إدلب المركزي"],
    location: { lng: 36.6345, lat: 35.9302 },
  },
  {
    name: "مشفى باب الهوى الإنساني (إدلب)",
    type: "hospital",
    keywords: ["مشفى باب الهوى", "Bab al-Hawa Hospital", "مشفى إدلب"],
    location: { lng: 36.692639, lat: 36.230639 }, // :contentReference[oaicite:4]{index=4}
  },

  // الرقة
  {
    name: "الجامع الكبير (الرقة)",
    type: "mosque",
    keywords: ["الجامع الكبير", "مسجد الرقة الكبير", "الجامع القديم"],
    location: { lng: 39.021009, lat: 35.951991 }, // :contentReference[oaicite:5]{index=5}
  },
  {
    name: "مستشفى الرقة المركزي",
    type: "hospital",
    keywords: ["مشفى الرقة", "مستشفى الرقة المركزي", "الرقة"],
    location: { lng: 39.01, lat: 35.95 }, // تقديري :contentReference[oaicite:6]{index=6}
  },

  // دير الزور
  {
    name: "جامع التوحيد (دير الزور)",
    type: "mosque",
    keywords: ["جامع التوحيد", "مسجد التوحيد", "التوحيد"],
    location: { lng: 40.1419, lat: 35.3366 },
  },
  {
    name: "مستشفى الأسد (دير الزور)",
    type: "hospital",
    keywords: ["مشفى الأسد", "مستشفى الأسد", "الأسد"],
    location: { lng: 40.1425, lat: 35.336 },
  },

  // درعا
  {
    name: "الجامع العمري الكبير (درعا)",
    type: "mosque",
    keywords: ["الجامع العمري", "مسجد عمري", "جامع عمر"],
    location: { lng: 36.101, lat: 32.6123 }, // :contentReference[oaicite:7]{index=7}
  },
  {
    name: "مستشفى درعا الوطني",
    type: "hospital",
    keywords: ["مشفى درعا الوطني", "مستشفى درعا", "الوطني"],
    location: { lng: 36.1061111111, lat: 32.6252777778 }, // :contentReference[oaicite:8]{index=8}
  },

  // القنيطرة
  {
    name: "الجامع الكبير (القنيطرة)",
    type: "mosque",
    keywords: ["جامع القنيطرة", "الجامع الكبير", "مسجد القنيطرة"],
    location: { lng: 35.824, lat: 33.126 }, // :contentReference[oaicite:9]{index=9}
  },
  {
    name: "مستشفى القنيطرة العام",
    type: "hospital",
    keywords: ["مشفى القنيطرة", "مستشفى القنيطرة", "القنيطرة"],
    location: { lng: 35.824, lat: 33.126 }, // تقريباً :contentReference[oaicite:10]{index=10}
  },

  // السويداء
  {
    name: "جامع السويداء الكبير",
    type: "mosque",
    keywords: ["جامع السويداء الكبير", "مسجد السويداء", "السويداء"],
    location: { lng: 36.7022, lat: 32.7112 },
  },
  {
    name: "مستشفى السويداء الوطني",
    type: "hospital",
    keywords: ["مشفى السويداء الوطني", "مستشفى السويداء", "الوطني"],
    location: { lng: 36.7045, lat: 32.7116 },
  },

  // إضافات جديدة (محافظة الحسكة)
  {
    name: "الجامع الكبير (الحسكة)",
    type: "mosque",
    keywords: ["الجامع الكبير", "مسجد معاذ بن جبل", "جامع الحسكة الكبير"],
    location: { lng: 40.74222, lat: 36.51167 }, // :contentReference[oaicite:0]{index=0}
  },
  {
    name: "مشفى القامشلي الوطني",
    type: "hospital",
    keywords: ["مشفى القامشلي", "مستشفى القامشلي الوطني", "مشفى القامشلي"],
    location: { lng: 41.21056, lat: 37.034 }, // :contentReference[oaicite:1]{index=1}
  },

  {
    name: "الجامع الكبير (الحسكة)",
    type: "mosque",
    keywords: [
      "جامع الحسكة الكبير",
      "مسجد معاذ بن جبل",
      "Great Mosque of Al-Hasakah",
    ],
    location: { lng: 40.74222, lat: 36.51167 }, // :contentReference[oaicite:5]{index=5}
  },
  {
    name: "مشفى القامشلي الوطني",
    type: "hospital",
    keywords: [
      "مشفى القامشلي",
      "مستشفى القامشلي الوطني",
      "Qamishli National Hospital",
    ],
    location: { lng: 41.21056, lat: 37.034 }, // :contentReference[oaicite:6]{index=6}
  },

  // طرطوس والسويداء والإضافات المستقبلية
  // يمكن إضافة المزيد من الأماكن عند الحاجة
];

/**
 * تحليل استعلام البحث الطبيعي وتحويله إلى معايير بحث
 * @param {string} query - استعلام البحث بلغة طبيعية
 * @returns {Object} معايير البحث المستخرجة
 */
export const analyzeQuery = (query) => {
  // تحويل النص إلى حروف صغيرة للتسهيل
  const normalizedQuery = query.trim();

  // يمكن استخدام مكتبة compromise للتحليل المتقدم
  // const doc = nlp(normalizedQuery);

  // البحث عن المهنة
  let profession = null;
  for (const prof of availableProfessions) {
    // البحث في الكلمات المفتاحية
    for (const keyword of prof.keywords) {
      if (normalizedQuery.includes(keyword)) {
        profession = prof.name;
        break;
      }
    }
    if (profession) break;
  }

  // البحث عن المدينة
  let city = null;
  let location = null;
  for (const cityObj of availableCities) {
    // البحث في الكلمات المفتاحية
    for (const keyword of cityObj.keywords) {
      if (normalizedQuery.includes(keyword)) {
        city = cityObj.name;
        // تعيين إحداثيات المدينة (هذه إحداثيات تقريبية للمدن السورية)
        if (city === "دمشق") {
          location = { lng: 36.2765, lat: 33.5138 };
        } else if (city === "حلب") {
          location = { lng: 37.1613, lat: 36.2021 };
        } else if (city === "حمص") {
          location = { lng: 36.7184, lat: 34.7324 };
        } else if (city === "اللاذقية") {
          location = { lng: 35.7901, lat: 35.5317 };
        } else if (city === "طرطوس") {
          location = { lng: 35.8866, lat: 34.8886 };
        } else if (city === "حماة") {
          location = { lng: 36.7578, lat: 35.1354 };
        } else if (city === "دير الزور") {
          location = { lng: 40.155, lat: 35.3359 };
        } else if (city === "الرقة") {
          location = { lng: 39.0062, lat: 35.9528 };
        } else if (city === "درعا") {
          location = { lng: 36.1021, lat: 32.6218 };
        } else if (city === "السويداء") {
          location = { lng: 36.569, lat: 32.7093 };
        }
        break;
      }
    }
    if (city) break;
  }

  // البحث عن الشوارع أو الأحياء
  let street = null;
  const streetKeywords = ["شارع", "حي", "منطقة"];
  for (const keyword of streetKeywords) {
    const index = normalizedQuery.indexOf(keyword);
    if (index !== -1) {
      // استخراج اسم الشارع أو الحي (الكلمات التي تلي الكلمة المفتاحية)
      const words = normalizedQuery.substring(index).split(" ");
      if (words.length > 1) {
        street = words.slice(1, 3).join(" "); // أخذ كلمتين بعد الكلمة المفتاحية
        break;
      }
    }
  }

  // البحث عن المشافي والجوامع في قائمة الأماكن المهمة
  let hospital = null;
  let mosque = null;
  let placeLocation = null;

  // البحث في قائمة الأماكن المهمة
  for (const place of importantPlaces) {
    for (const keyword of place.keywords) {
      if (normalizedQuery.includes(keyword)) {
        if (place.type === "hospital") {
          hospital = place.name;
          placeLocation = place.location;
        } else if (place.type === "mosque") {
          mosque = place.name;
          placeLocation = place.location;
        }
        break;
      }
    }
    if (hospital || mosque) break;
  }

  // إذا لم يتم العثور على مكان في القائمة، نبحث بالطريقة التقليدية
  if (!hospital && !mosque) {
    // البحث عن المشافي
    const hospitalKeywords = ["مشفى", "مستشفى", "مركز طبي", "عيادة", "مستوصف"];
    for (const keyword of hospitalKeywords) {
      const index = normalizedQuery.indexOf(keyword);
      if (index !== -1) {
        // استخراج اسم المشفى (الكلمات التي تلي الكلمة المفتاحية)
        const words = normalizedQuery.substring(index).split(" ");
        if (words.length > 1) {
          hospital = words.slice(1, 3).join(" "); // أخذ كلمتين بعد الكلمة المفتاحية
          break;
        }
      }
    }

    // البحث عن الجوامع
    const mosqueKeywords = ["جامع", "مسجد", "مصلى", "الجامع", "المسجد"];
    for (const keyword of mosqueKeywords) {
      const index = normalizedQuery.indexOf(keyword);
      if (index !== -1) {
        // استخراج اسم الجامع (الكلمات التي تلي الكلمة المفتاحية)
        const words = normalizedQuery.substring(index).split(" ");
        if (words.length > 1) {
          mosque = words.slice(1, 3).join(" "); // أخذ كلمتين بعد الكلمة المفتاحية
          break;
        }
      }
    }
  }

  // البحث عن التقييم
  let rating = 0;
  const ratingKeywords = {
    ممتاز: 5,
    "جيد جدا": 4,
    جيد: 3,
    مقبول: 2,
    ضعيف: 1,
    "5 نجوم": 5,
    "4 نجوم": 4,
    "3 نجوم": 3,
    "2 نجوم": 2,
    "1 نجمة": 1,
    "خمس نجوم": 5,
    "أربع نجوم": 4,
    "ثلاث نجوم": 3,
    نجمتين: 2,
    "نجمة واحدة": 1,
  };

  for (const [keyword, value] of Object.entries(ratingKeywords)) {
    if (normalizedQuery.includes(keyword)) {
      rating = value;
      break;
    }
  }

  // البحث عن نطاق العمل (الشعاع)
  let radius = 0;
  const radiusRegex = /(\d+)\s*(كم|كيلومتر|متر)/;
  const radiusMatch = normalizedQuery.match(radiusRegex);
  if (radiusMatch) {
    const distance = parseInt(radiusMatch[1]);
    const unit = radiusMatch[2];
    if (unit === "متر") {
      radius = distance / 1000; // تحويل المتر إلى كيلومتر
    } else {
      radius = distance;
    }
    // التأكد من أن الشعاع ضمن النطاق المسموح (1-5 كم)
    radius = Math.max(1, Math.min(5, radius));
  }

  // استخراج الكلمات المفتاحية الإضافية
  const keywords = extractKeywords(normalizedQuery);

  // استخدام موقع المكان المهم إذا كان متاحًا
  const finalLocation = placeLocation || location;

  return {
    profession,
    city,
    location: finalLocation,
    street,
    hospital,
    mosque,
    rating,
    radius: radius || null,
    keywords,
    originalQuery: query,
  };
};

/**
 * استخراج الكلمات المفتاحية من النص
 * @param {string} text - النص المراد تحليله
 * @returns {Array} قائمة الكلمات المفتاحية
 */
const extractKeywords = (text) => {
  // قائمة الكلمات التي يجب تجاهلها (كلمات توقف)
  const stopWords = [
    "في",
    "من",
    "إلى",
    "على",
    "عن",
    "مع",
    "أريد",
    "أبحث",
    "أحتاج",
    "يمكن",
    "هل",
    "لدي",
    "هناك",
    "أنا",
    "هو",
    "هي",
    "نحن",
    "هم",
    "أنت",
    "أنتم",
    "لكم",
    "لكن",
    "لي",
    "له",
    "لها",
    "لهم",
  ];

  // تقسيم النص إلى كلمات
  const words = text.split(/\s+/);

  // تصفية الكلمات المهمة
  const keywords = words.filter((word) => {
    // تجاهل الكلمات القصيرة جداً والكلمات التي يجب تجاهلها
    return word.length > 2 && !stopWords.includes(word);
  });

  return [...new Set(keywords)]; // إزالة التكرارات
};

/**
 * تحويل معايير البحث إلى استعلام بحث منظم
 * @param {Object} criteria - معايير البحث
 * @returns {Object} استعلام البحث المنظم
 */
export const buildSearchQuery = (criteria) => {
  const { profession, city, keywords } = criteria;

  // بناء استعلام البحث
  const searchQuery = {
    profession: profession || "",
    city: city || "",
    keywords: keywords || [],
  };

  return searchQuery;
};

/**
 * اقتراح استعلامات بحث بناءً على الاستعلام الحالي
 * @param {string} query - استعلام البحث الحالي
 * @returns {Array} قائمة الاقتراحات
 */
export const suggestQueries = (query) => {
  if (!query || query.length < 3) return [];

  const suggestions = [];
  const criteria = analyzeQuery(query);

  // اقتراح استعلامات بناءً على المهنة
  if (criteria.profession) {
    const profession = availableProfessions.find(
      (p) => p.name === criteria.profession
    );
    if (profession) {
      // اقتراح مهنة + مشكلة شائعة
      const commonIssues = {
        كهربائي: ["إصلاح مصباح", "تمديدات كهربائية", "تركيب أباجورة"],
        سباك: ["إصلاح تسرب", "تركيب حنفية", "إصلاح مجاري"],
        نجار: ["إصلاح باب", "تركيب خزانة", "صيانة أثاث"],
        دهان: ["طلاء غرفة", "دهان منزل", "ديكور جدران"],
        "مصمم ديكور": ["تصميم غرفة", "ديكور منزل", "تزيين صالون"],
        ميكانيكي: ["إصلاح سيارة", "صيانة محرك", "تغيير زيت"],
        حداد: ["تركيب باب حديد", "إصلاح نافذة", "عمل شبابيك"],
        بناء: ["بناء جدار", "ترميم منزل", "صيانة سقف"],
      };

      if (commonIssues[criteria.profession]) {
        commonIssues[criteria.profession].forEach((issue) => {
          suggestions.push(`${criteria.profession} ${issue}`);
        });
      }
    }
  }

  // اقتراح استعلامات بناءً على المدينة
  if (criteria.city) {
    // اقتراح مدينة + مهن شائعة
    const popularProfessions = ["كهربائي", "سباك", "نجار", "دهان"];
    popularProfessions.forEach((prof) => {
      if (prof !== criteria.profession) {
        suggestions.push(`${prof} في ${criteria.city}`);
      }
    });
  }

  // اقتراح استعلامات بناءً على المشافي والجوامع
  if (criteria.hospital) {
    suggestions.push(`كهربائي بالقرب من مشفى ${criteria.hospital}`);
    suggestions.push(`سباك بالقرب من مشفى ${criteria.hospital}`);
  }

  if (criteria.mosque) {
    suggestions.push(`كهربائي بالقرب من جامع ${criteria.mosque}`);
    suggestions.push(`سباك بالقرب من جامع ${criteria.mosque}`);
  }

  // إذا لم يتم العثور على مهنة أو مدينة أو مشفى أو جامع، اقترح بعض الاستعلامات الشائعة
  if (
    !criteria.profession &&
    !criteria.city &&
    !criteria.hospital &&
    !criteria.mosque &&
    criteria.keywords.length > 0
  ) {
    const keyword = criteria.keywords[0];
    suggestions.push(`كهربائي لإصلاح ${keyword}`);
    suggestions.push(`سباك لإصلاح ${keyword}`);
    suggestions.push(`نجار لإصلاح ${keyword}`);
  }

  // إضافة بعض الاقتراحات العامة إذا كانت القائمة فارغة
  if (suggestions.length === 0) {
    suggestions.push("كهربائي لإصلاح مصباح");
    suggestions.push("سباك لإصلاح تسرب في الحمام");
    suggestions.push("نجار لإصلاح باب");
    suggestions.push("دهان لطلاء غرفة");
    suggestions.push("جامع الأموي");
    suggestions.push("مشفى المواساة");
  }

  // إزالة التكرارات وترتيب الاقتراحات
  return [...new Set(suggestions)].slice(0, 5);
};

export default {
  analyzeQuery,
  buildSearchQuery,
  suggestQueries,
};
