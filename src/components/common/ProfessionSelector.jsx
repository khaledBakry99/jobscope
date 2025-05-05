import React, { useState, useRef, useEffect } from "react";
import { Plus, X, ChevronDown } from "lucide-react";
import useThemeStore from "../../store/themeStore";

/**
 * تصنيفات المهن
 * يتم تنظيم المهن في تصنيفات لتسهيل البحث والتصفح
 * كل تصنيف يحتوي على مجموعة من المهن المرتبطة به
 */
const professionCategories = [
  {
    id: 1,
    name: "الزراعة والحدائق",
    professions: [12], // أرقام المهن التي تنتمي لهذا التصنيف (مزارع)
  },
  {
    id: 2,
    name: "خدمات الصيانة والإصلاح",
    professions: [1, 2, 6, 9, 13, 14, 28, 30, 33], // كهربائي، سباك، ميكانيكي، مكيفات، مصلح أجهزة، مصلح موبايلات، صيانة عامة، فني تبريد، فني تمديدات
  },
  {
    id: 3,
    name: "أعمال البناء",
    professions: [3, 4, 7, 8, 21, 22, 31, 34, 38], // نجار، دهان، حداد، بناء، ألمنيوم، سيراميك، عامل بناء، لحام، حداد أبواب
  },
  {
    id: 4,
    name: "الخدمات المنزلية",
    professions: [5, 10, 11, 25], // مصمم ديكور، خياط، طباخ، عامل نظافة
  },
  {
    id: 5,
    name: "النقل والتوصيل",
    professions: [15, 26], // سائق، عامل توصيل
  },
  {
    id: 6,
    name: "الخدمات المهنية",
    professions: [16, 17, 18, 19, 20], // مصور، معلم،   حلاق
  },
  {
    id: 7,
    name: "خدمات الصحة والجمال",
    professions: [40, 41, 42, 43], // طبيب، ممرض، معالج فيزيائي، خبير تجميل
  },
  {
    id: 8,
    name: "خدمات الطعام والضيافة",
    professions: [50, 51, 52], // شيف، نادل، منسق حفلات
  },
  {
    id: 9,
    name: "خدمات الإلكترونيات والتقنية",
    professions: [60, 61, 62], // فني إلكترونيات، مصمم مواقع، مطور تطبيقات
  },
];

// قائمة المهن والتخصصات المتاحة في سوريا
const professionsData = [
  {
    id: 1,
    name: "كهربائي",
    specializations: [
      "تمديدات منزلية",
      "صيانة كهربائية",
      "تركيب أنظمة إنارة",
      "لوحات كهربائية",
      "تركيب مولدات",
      "صيانة مصاعد",
      "أنظمة طاقة شمسية",
      "أتمتة منزلية",
    ],
  },
  {
    id: 2,
    name: "سباك",
    specializations: [
      "تمديدات صحية",
      "صيانة وتركيب",
      "معالجة تسربات",
      "تركيب أدوات صحية",
      "صيانة سخانات",
      "تركيب خزانات مياه",
      "تركيب مضخات",
      "صيانة شبكات الصرف",
    ],
  },
  {
    id: 3,
    name: "نجار",
    specializations: [
      "أثاث منزلي",
      "أبواب ونوافذ",
      "ديكورات خشبية",
      "مطابخ",
      "غرف نوم",
      "خزائن حائط",
      "أثاث مكتبي",
      "ترميم أثاث قديم",
    ],
  },
  {
    id: 4,
    name: "دهان",
    specializations: [
      "دهانات داخلية",
      "دهانات خارجية",
      "دهانات حديثة",
      "ديكورات جبسية",
      "ورق جدران",
      "دهانات زخرفية",
      "دهانات إيبوكسي",
      "دهانات مقاومة للرطوبة",
    ],
  },
  {
    id: 5,
    name: "مصمم ديكور",
    specializations: [
      "تصميم داخلي",
      "تصميم واجهات",
      "استشارات ديكور",
      "تصميم مساحات تجارية",
      "تصميم مكاتب",
      "تصميم حدائق",
      "تصميم إضاءة",
      "تصميم ثلاثي الأبعاد",
    ],
  },
  {
    id: 6,
    name: "ميكانيكي",
    specializations: [
      "صيانة سيارات",
      "كهرباء سيارات",
      "ميكانيك عام",
      "صيانة محركات",
      "تبديل زيوت",
      "إصلاح فرامل",
      "ضبط زوايا",
      "صيانة تكييف سيارات",
    ],
  },
  {
    id: 7,
    name: "حداد",
    specializations: [
      "أبواب وشبابيك",
      "هياكل معدنية",
      "أعمال الألمنيوم",
      "درابزين",
      "بوابات حديدية",
      "حماية نوافذ",
      "هناجر",
      "أعمال ستانلس ستيل",
    ],
  },
  {
    id: 8,
    name: "بناء",
    specializations: [
      "بناء جدران",
      "تبليط",
      "أعمال إسمنتية",
      "ترميم",
      "تشطيبات",
      "قصارة",
      "عزل مائي",
      "عزل حراري",
    ],
  },
  {
    id: 9,
    name: "مكيفات",
    specializations: [
      "تركيب",
      "صيانة",
      "تنظيف",
      "إصلاح",
      "شحن غاز",
      "تركيب وحدات مركزية",
      "صيانة دورية",
      "استبدال قطع",
    ],
  },
  {
    id: 10,
    name: "خياط",
    specializations: [
      "ملابس رجالية",
      "ملابس نسائية",
      "تفصيل وخياطة",
      "تعديل ملابس",
      "خياطة ستائر",
      "خياطة مفروشات",
      "تطريز",
      "تصميم أزياء",
    ],
  },
  {
    id: 11,
    name: "طباخ",
    specializations: [
      "مأكولات شرقية",
      "حلويات",
      "مأكولات غربية",
      "مشاوي",
      "معجنات",
      "طبخ منزلي",
      "طعام صحي",
      "مناسبات وحفلات",
    ],
  },
  {
    id: 12,
    name: "مزارع",
    specializations: [
      "زراعة خضروات",
      "زراعة أشجار مثمرة",
      "تقليم أشجار",
      "تركيب أنظمة ري",
      "مكافحة آفات",
      "تنسيق حدائق",
      "زراعة عضوية",
      "إنتاج شتلات",
    ],
  },
  {
    id: 13,
    name: "مصلح أجهزة كهربائية",
    specializations: [
      "غسالات",
      "ثلاجات",
      "أفران",
      "مكيفات",
      "تلفزيونات",
      "أجهزة صغيرة",
      "سخانات مياه",
      "مكانس كهربائية",
    ],
  },
  {
    id: 14,
    name: "مصلح موبايلات وكمبيوتر",
    specializations: [
      "إصلاح هواتف",
      "إصلاح حواسيب",
      "تغيير شاشات",
      "إزالة كلمات المرور",
      "استعادة البيانات",
      "إصلاح شبكات",
    ],
  },
  {
    id: 15,
    name: "سائق",
    specializations: [
      "توصيل ركاب",
      "نقل بضائع",
      "نقل أثاث",
      "رحلات بين المدن",
      "توصيل طلبات",
      "سيارات خاصة",
      "شاحنات",
      "حافلات",
    ],
  },
  {
    id: 16,
    name: "مصور",
    specializations: [
      "تصوير مناسبات",
      "تصوير منتجات",
      "تصوير عقارات",
      "تصوير فوتوغرافي",
      "تصوير فيديو",
      "مونتاج",
      "تصوير جوي",
      "تصوير وثائقي",
    ],
  },
  {
    id: 17,
    name: "معلم",
    specializations: [
      "رياضيات",
      "فيزياء",
      "كيمياء",
      "لغة عربية",
      "لغة إنجليزية",
      "علوم",
      "تاريخ وجغرافيا",
      "تقوية دراسية",
    ],
  },
  {
    id: 20,
    name: "حلاق",
    specializations: [
      "قص شعر رجالي",
      "حلاقة ذقن",
      "تصفيف شعر نسائي",
      "صبغ شعر",
      "تسريحات",
      "علاجات شعر",
      "ماكياج",
      "عناية بالبشرة",
    ],
  },

  {
    id: 21,
    name: "تركيب و صيانة ألمنيوم",
    specializations: [
      "تركيب نوافذ ألمنيوم",
      "أبواب ألمنيوم",
      "واجهات زجاجية",
      "مطابخ ألمنيوم",
      "غرف زجاجية",
      "شتر ودرابزين",
      "صيانة ألمنيوم",
      "تركيب سكك وأقفال",
    ],
  },

  {
    id: 22,
    name: "معلم سيراميك",
    specializations: [
      "تبليط أرضيات",
      "تبليط جدران حمامات",
      "قص وتشكيل السيراميك",
      "تركيب بورسلان",
      "تركيب غرانيت",
      "تنسيق فواصل",
      "تركيب سيراميك ثلاثي الأبعاد",
      "تصليح وتعديل بلاط",
    ],
  },

  {
    id: 25,
    name: "عامل نظافة",
    specializations: [
      "تنظيف منازل",
      "تنظيف مكاتب",
      "تنظيف واجهات زجاجية",
      "تنظيف خزانات مياه",
      "غسيل سجاد",
      "تنظيف مطاعم ومحلات",
      "تعقيم وتعطير",
      "تنظيف ما بعد البناء",
    ],
  },

  {
    id: 26,
    name: "عامل توصيل",
    specializations: [
      "توصيل طلبات طعام",
      "توصيل مستندات",
      "توصيل أدوية",
      "توصيل منتجات من متاجر",
      "توصيل ضمن المدينة",
      "توصيل سريع",
      "دراجة نارية",
      "سيارة صغيرة",
    ],
  },

  {
    id: 28,
    name: "عامل صيانة عامة",
    specializations: [
      "تصليح أثاث منزلي",
      "صيانة أبواب ونوافذ",
      "صيانة حمامات ومطابخ",
      "تصليح تسربات",
      "تصليح أقفال",
      "تثبيت أثاث",
      "صيانة دورية",
      "تركيب إكسسوارات منزلية",
    ],
  },

  {
    id: 30,
    name: "فني تبريد وتكييف",
    specializations: [
      "تركيب برادات",
      "صيانة وحدات تبريد",
      "تعبئة غاز تبريد",
      "صيانة برادات تجارية",
      "أنظمة تبريد صناعي",
      "فحص أعطال",
      "تركيب غرف تبريد",
      "تركيب وحدات تبريد مركزية",
    ],
  },

  {
    id: 31,
    name: "عامل بناء",
    specializations: [
      "بناء جدران حجر",
      "بناء جدران بلوك",
      "قصارة (لياسة)",
      "صب أعمدة وأسقف",
      "تركيب حجارة واجهات",
      "فورمجي (خشب تسليح)",
      "أعمال ترميم",
      "رفع سقايل (سقالات)",
    ],
  },

  {
    id: 33,
    name: "فني تمديدات صحية",
    specializations: [
      "تركيب مغاسل",
      "تمديد أنابيب مياه",
      "صيانة تسريبات",
      "تصليح مضخات",
      "تركيب سخانات",
      "فحص ضغط المياه",
      "تنظيف مجاري",
      "تجهيز حمامات جديدة",
    ],
  },

  {
    id: 34,
    name: "فني لحام وحدادة",
    specializations: [
      "لحام أبواب حديد",
      "لحام شبابيك",
      "لحام سلالم",
      "تصنيع قواعد معدنية",
      "لحام بالغاز",
      "لحام كهرباء",
      "قص وتشكيل الحديد",
      "صيانة هياكل معدنية",
    ],
  },

  {
    id: 38,
    name: "حدّاد متخصص في الأبواب والنوافذ",
    specializations: [
      "تصنيع أبواب حديد",
      "شبابيك حديد مزخرفة",
      "بوابات خارجية",
      "تركيب أبواب أمنية",
      "درابزينات وسلالم",
      "أبواب محلات",
      "صيانة لحام",
      "دهان الحديد",
    ],
  },

  // خدمات الصحة والجمال
  {
    id: 40,
    name: "طبيب",
    specializations: [
      "طب عام",
      "طب أسنان",
      "طب عيون",
      "طب أطفال",
      "طب باطني",
      "طب جلدية",
      "طب نسائية وتوليد",
      "طب عظام",
    ],
  },
  {
    id: 41,
    name: "ممرض",
    specializations: [
      "رعاية منزلية",
      "حقن وتضميد",
      "رعاية مسنين",
      "رعاية أطفال",
      "قياس ضغط وسكر",
      "تركيب محاليل",
      "رعاية ما بعد العمليات",
      "إسعافات أولية",
    ],
  },
  {
    id: 42,
    name: "معالج فيزيائي",
    specializations: [
      "علاج إصابات رياضية",
      "علاج آلام الظهر",
      "علاج ما بعد الكسور",
      "تأهيل حركي",
      "علاج تشنجات عضلية",
      "علاج مشاكل المفاصل",
      "تدليك علاجي",
      "علاج طبيعي منزلي",
    ],
  },
  {
    id: 43,
    name: "خبير تجميل",
    specializations: [
      "مكياج احترافي",
      "تصفيف شعر",
      "عناية بالبشرة",
      "مكياج عرائس",
      "حناء وتزيين",
      "قص وصبغ شعر",
      "علاجات تجميلية",
      "مانيكير وباديكير",
    ],
  },

  // خدمات الطعام والضيافة
  {
    id: 50,
    name: "شيف",
    specializations: [
      "مأكولات شرقية",
      "مأكولات غربية",
      "حلويات",
      "مشاوي",
      "مأكولات بحرية",
      "معجنات",
      "طبخ منزلي",
      "طعام صحي",
    ],
  },
  {
    id: 51,
    name: "نادل",
    specializations: [
      "خدمة مطاعم",
      "خدمة حفلات",
      "خدمة مناسبات",
      "خدمة مؤتمرات",
      "خدمة كوكتيل",
      "خدمة بوفيه",
      "خدمة كبار الشخصيات",
      "خدمة فنادق",
    ],
  },
  {
    id: 52,
    name: "منسق حفلات",
    specializations: [
      "تنسيق أعراس",
      "تنسيق مناسبات",
      "تنسيق مؤتمرات",
      "تنسيق حفلات أطفال",
      "تنسيق حفلات تخرج",
      "تنسيق معارض",
      "تنسيق ديكور حفلات",
      "تنسيق بوفيهات",
    ],
  },

  // خدمات الإلكترونيات والتقنية
  {
    id: 60,
    name: "فني إلكترونيات",
    specializations: [
      "إصلاح أجهزة كهربائية",
      "إصلاح أجهزة إلكترونية",
      "إصلاح أجهزة منزلية",
      "إصلاح أجهزة صوت",
      "إصلاح أجهزة تلفاز",
      "إصلاح أجهزة ألعاب",
      "إصلاح أجهزة طبية",
      "تركيب أنظمة إلكترونية",
    ],
  },
  {
    id: 61,
    name: "مصمم مواقع",
    specializations: [
      "تصميم مواقع تعريفية",
      "تصميم متاجر إلكترونية",
      "تصميم مواقع خدمية",
      "تصميم مواقع شخصية",
      "تصميم مواقع تعليمية",
      "تصميم مواقع إخبارية",
      "تصميم واجهات مستخدم",
      "تطوير مواقع ووردبريس",
    ],
  },
  {
    id: 62,
    name: "مطور تطبيقات",
    specializations: [
      "تطوير تطبيقات أندرويد",
      "تطوير تطبيقات آيفون",
      "تطوير تطبيقات ويب",
      "تطوير تطبيقات سطح المكتب",
      "تطوير ألعاب",
      "تطوير تطبيقات تعليمية",
      "تطوير تطبيقات خدمية",
      "صيانة وتحديث تطبيقات",
    ],
  },
];

const ProfessionSelector = ({
  professions = [],
  specializations = [],
  onChange,
  errors = {},
}) => {
  const darkMode = useThemeStore((state) => state.darkMode);
  const [showProfessionDropdown, setShowProfessionDropdown] = useState(false);
  const [showSpecializationDropdown, setShowSpecializationDropdown] = useState(
    false
  );
  const [availableSpecializations, setAvailableSpecializations] = useState([]);
  const [customProfession, setCustomProfession] = useState("");
  const [customSpecialization, setCustomSpecialization] = useState("");
  const [showCustomProfessionInput, setShowCustomProfessionInput] = useState(
    false
  );
  const [
    showCustomSpecializationInput,
    setShowCustomSpecializationInput,
  ] = useState(false);

  // حالة لتتبع التصنيف المحدد حالياً (0 يعني عرض جميع المهن)
  const [selectedCategory, setSelectedCategory] = useState(0);

  const professionDropdownRef = useRef(null);
  const specializationDropdownRef = useRef(null);

  /**
   * تحديث التخصصات المتاحة بناءً على المهن المحددة
   * عند اختيار مهنة، يتم تحديث قائمة التخصصات المتاحة لتشمل
   * جميع التخصصات المرتبطة بالمهن المختارة
   */
  useEffect(() => {
    const specs = [];
    professions.forEach((profession) => {
      const profData = professionsData.find((p) => p.name === profession);
      if (profData) {
        specs.push(...profData.specializations);
      }
    });
    // إزالة التكرارات باستخدام Set
    setAvailableSpecializations([...new Set(specs)]);
  }, [professions]);

  // إغلاق القوائم المنسدلة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        professionDropdownRef.current &&
        !professionDropdownRef.current.contains(event.target)
      ) {
        setShowProfessionDropdown(false);
      }
      if (
        specializationDropdownRef.current &&
        !specializationDropdownRef.current.contains(event.target)
      ) {
        setShowSpecializationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // إضافة مهنة
  const handleAddProfession = (profession) => {
    if (!professions.includes(profession)) {
      const newProfessions = [...professions, profession];
      onChange("professions", newProfessions);
    }
    setShowProfessionDropdown(false);
  };

  // إضافة تخصص
  const handleAddSpecialization = (specialization) => {
    if (!specializations.includes(specialization)) {
      const newSpecializations = [...specializations, specialization];
      onChange("specializations", newSpecializations);
    }
    setShowSpecializationDropdown(false);
  };

  // إزالة مهنة
  const handleRemoveProfession = (profession) => {
    const newProfessions = professions.filter((p) => p !== profession);
    onChange("professions", newProfessions);

    // إزالة التخصصات المرتبطة بالمهنة المحذوفة
    const profData = professionsData.find((p) => p.name === profession);
    if (profData) {
      const relatedSpecs = profData.specializations;
      const newSpecializations = specializations.filter(
        (s) => !relatedSpecs.includes(s)
      );
      onChange("specializations", newSpecializations);
    }
  };

  // إزالة تخصص
  const handleRemoveSpecialization = (specialization) => {
    const newSpecializations = specializations.filter(
      (s) => s !== specialization
    );
    onChange("specializations", newSpecializations);
  };

  // إضافة مهنة مخصصة
  const handleAddCustomProfession = () => {
    if (
      customProfession.trim() !== "" &&
      !professions.includes(customProfession.trim())
    ) {
      const newProfessions = [...professions, customProfession.trim()];
      onChange("professions", newProfessions);
      setCustomProfession("");
      setShowCustomProfessionInput(false);
    }
  };

  // إضافة تخصص مخصص
  const handleAddCustomSpecialization = () => {
    if (
      customSpecialization.trim() !== "" &&
      !specializations.includes(customSpecialization.trim())
    ) {
      const newSpecializations = [
        ...specializations,
        customSpecialization.trim(),
      ];
      onChange("specializations", newSpecializations);
      setCustomSpecialization("");
      setShowCustomSpecializationInput(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* المهن */}
      <div>
        <label
          className={`block font-medium mb-2 ${
            darkMode ? "text-gray-200" : "text-gray-700"
          }`}
        >
          المهنة <span className="text-red-500">*</span>
        </label>

        {/* عرض المهن المحددة */}
        <div className="flex flex-wrap gap-2 mb-2">
          {professions.map((profession, index) => (
            <div
              key={index}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                darkMode
                  ? "bg-indigo-900 text-indigo-200"
                  : "bg-indigo-100 text-indigo-800"
              }`}
            >
              <span>{profession}</span>
              <button
                type="button"
                onClick={() => handleRemoveProfession(profession)}
                className={`rounded-full p-0.5 ${
                  darkMode ? "hover:bg-indigo-800" : "hover:bg-indigo-200"
                }`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* زر إضافة مهنة */}
        <div className="relative" ref={professionDropdownRef}>
          <button
            type="button"
            onClick={() => setShowProfessionDropdown(!showProfessionDropdown)}
            className={`flex items-center justify-between w-full px-4 py-2 rounded-md border ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-gray-200"
                : "bg-white border-gray-300 text-gray-700"
            } ${errors.professions ? "border-red-500" : ""}`}
          >
            <span>اختر مهنة</span>
            <ChevronDown size={18} />
          </button>

          {/* قائمة المهن المنسدلة */}
          {showProfessionDropdown && (
            <div
              className={`absolute z-10 mt-1 w-full rounded-md shadow-lg ${
                darkMode
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}
            >
              {/* قائمة التصنيفات */}
              <div className="border-b border-gray-300 dark:border-gray-700 py-2 px-2">
                <div className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  تصفية حسب التصنيف:
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(0)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                      selectedCategory === 0
                        ? darkMode
                          ? "bg-indigo-700 text-white"
                          : "bg-indigo-500 text-white"
                        : darkMode
                        ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    الكل
                  </button>

                  {professionCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                        selectedCategory === category.id
                          ? darkMode
                            ? "bg-indigo-700 text-white"
                            : "bg-indigo-500 text-white"
                          : darkMode
                          ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* قائمة المهن مع تصفية حسب التصنيف المحدد */}
              <div className="py-1 max-h-60 overflow-y-auto">
                {/* عنوان القسم */}
                <div className="px-4 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800">
                  {selectedCategory === 0
                    ? "جميع المهن"
                    : `مهن ${
                        professionCategories.find(
                          (cat) => cat.id === selectedCategory
                        )?.name
                      }`}
                </div>

                {/* قائمة المهن المصفاة */}
                {professionsData
                  .filter(
                    (profession) =>
                      selectedCategory === 0 ||
                      professionCategories.find(
                        (cat) =>
                          cat.id === selectedCategory &&
                          cat.professions.includes(profession.id)
                      )
                  )
                  .map((profession) => (
                    <button
                      key={profession.id}
                      type="button"
                      onClick={() => handleAddProfession(profession.name)}
                      className={`block w-full text-right px-4 py-2 text-sm transition-colors duration-200 ${
                        darkMode
                          ? "text-gray-200 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100"
                      } ${
                        professions.includes(profession.name)
                          ? darkMode
                            ? "bg-indigo-900"
                            : "bg-indigo-100"
                          : ""
                      }`}
                    >
                      {profession.name}
                    </button>
                  ))}

                {/* زر إضافة مهنة مخصصة */}
                <div className="border-t px-4 py-2">
                  {showCustomProfessionInput ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={customProfession}
                        onChange={(e) => setCustomProfession(e.target.value)}
                        placeholder="أدخل مهنة جديدة"
                        className={`flex-1 px-3 py-1 rounded-md border ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-gray-200"
                            : "bg-white border-gray-300 text-gray-700"
                        }`}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomProfession}
                        className={`px-3 py-1 rounded-md ${
                          darkMode
                            ? "bg-indigo-700 text-white hover:bg-indigo-600"
                            : "bg-indigo-500 text-white hover:bg-indigo-600"
                        }`}
                      >
                        إضافة
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowCustomProfessionInput(true)}
                      className={`flex items-center gap-1 text-sm ${
                        darkMode
                          ? "text-indigo-400 hover:text-indigo-300"
                          : "text-indigo-600 hover:text-indigo-700"
                      }`}
                    >
                      <Plus size={16} />
                      <span>إضافة مهنة جديدة</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* رسالة الخطأ */}
        {errors.professions && (
          <p className="text-red-500 text-sm mt-1">{errors.professions}</p>
        )}
      </div>

      {/* التخصصات */}
      {professions.length > 0 && (
        <div>
          <label
            className={`block font-medium mb-2 ${
              darkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            التخصص <span className="text-red-500">*</span>
          </label>

          {/* عرض التخصصات المحددة */}
          <div className="flex flex-wrap gap-2 mb-2">
            {specializations.map((specialization, index) => (
              <div
                key={index}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                  darkMode
                    ? "bg-indigo-900 text-indigo-200"
                    : "bg-indigo-100 text-indigo-800"
                }`}
              >
                <span>{specialization}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSpecialization(specialization)}
                  className={`rounded-full p-0.5 ${
                    darkMode ? "hover:bg-indigo-800" : "hover:bg-indigo-200"
                  }`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* زر إضافة تخصص */}
          <div className="relative" ref={specializationDropdownRef}>
            <button
              type="button"
              onClick={() =>
                setShowSpecializationDropdown(!showSpecializationDropdown)
              }
              className={`flex items-center justify-between w-full px-4 py-2 rounded-md border ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-gray-200"
                  : "bg-white border-gray-300 text-gray-700"
              } ${errors.specializations ? "border-red-500" : ""}`}
            >
              <span>اختر تخصص</span>
              <ChevronDown size={18} />
            </button>

            {/* قائمة التخصصات المنسدلة */}
            {showSpecializationDropdown && (
              <div
                className={`absolute z-10 mt-1 w-full rounded-md shadow-lg ${
                  darkMode
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-white border border-gray-200"
                }`}
              >
                <div className="py-1 max-h-60 overflow-y-auto">
                  {availableSpecializations.map((specialization, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleAddSpecialization(specialization)}
                      className={`block w-full text-right px-4 py-2 text-sm ${
                        darkMode
                          ? "text-gray-200 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100"
                      } ${
                        specializations.includes(specialization)
                          ? darkMode
                            ? "bg-indigo-900"
                            : "bg-indigo-100"
                          : ""
                      }`}
                    >
                      {specialization}
                    </button>
                  ))}

                  {/* زر إضافة تخصص مخصص */}
                  <div className="border-t px-4 py-2">
                    {showCustomSpecializationInput ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={customSpecialization}
                          onChange={(e) =>
                            setCustomSpecialization(e.target.value)
                          }
                          placeholder="أدخل تخصص جديد"
                          className={`flex-1 px-3 py-1 rounded-md border ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-gray-200"
                              : "bg-white border-gray-300 text-gray-700"
                          }`}
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomSpecialization}
                          className={`px-3 py-1 rounded-md ${
                            darkMode
                              ? "bg-indigo-700 text-white hover:bg-indigo-600"
                              : "bg-indigo-500 text-white hover:bg-indigo-600"
                          }`}
                        >
                          إضافة
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowCustomSpecializationInput(true)}
                        className={`flex items-center gap-1 text-sm ${
                          darkMode
                            ? "text-indigo-400 hover:text-indigo-300"
                            : "text-indigo-600 hover:text-indigo-700"
                        }`}
                      >
                        <Plus size={16} />
                        <span>إضافة تخصص جديد</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* رسالة الخطأ */}
          {errors.specializations && (
            <p className="text-red-500 text-sm mt-1">
              {errors.specializations}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfessionSelector;
