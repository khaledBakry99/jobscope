// تصنيفات المهن مع المهن التابعة لكل تصنيف
const professionCategories = [
  {
    id: 1,
    name: "الزراعة والحدائق",
    professions: [
      { id: 12, name: "مزارع" },
    ]
  },
  {
    id: 2,
    name: "خدمات الصيانة والإصلاح",
    professions: [
      { id: 1, name: "كهربائي" },
      { id: 2, name: "سباك" },
      { id: 6, name: "ميكانيكي" },
      { id: 9, name: "مكيفات" },
      { id: 13, name: "مصلح أجهزة كهربائية" },
      { id: 14, name: "مصلح موبايلات وكمبيوتر" },
      { id: 28, name: "عامل صيانة عامة" },
      { id: 30, name: "فني تبريد وتكييف" },
      { id: 33, name: "فني تمديدات صحية" },
    ]
  },
  {
    id: 3,
    name: "أعمال البناء",
    professions: [
      { id: 3, name: "نجار" },
      { id: 4, name: "دهان" },
      { id: 7, name: "حداد" },
      { id: 8, name: "بناء" },
      { id: 21, name: "تركيب و صيانة ألمنيوم" },
      { id: 22, name: "معلم سيراميك" },
      { id: 31, name: "عامل بناء" },
      { id: 34, name: "فني لحام وحدادة" },
      { id: 38, name: "حدّاد متخصص في الأبواب والنوافذ" },
    ]
  },
  {
    id: 4,
    name: "الخدمات المنزلية",
    professions: [
      { id: 5, name: "مصمم ديكور" },
      { id: 10, name: "خياط" },
      { id: 11, name: "طباخ" },
      { id: 25, name: "عامل نظافة" },
    ]
  },
  {
    id: 5,
    name: "النقل والتوصيل",
    professions: [
      { id: 15, name: "سائق" },
      { id: 26, name: "عامل توصيل" },
    ]
  },
  {
    id: 6,
    name: "الخدمات المهنية",
    professions: [
      { id: 16, name: "مصور" },
      { id: 17, name: "معلم" },
      { id: 20, name: "حلاق" },
    ]
  },
  {
    id: 7,
    name: "خدمات الصحة والجمال",
    professions: [
      { id: 40, name: "طبيب" },
      { id: 41, name: "ممرض" },
      { id: 42, name: "معالج فيزيائي" },
      { id: 43, name: "خبير تجميل" },
    ]
  },
  {
    id: 8,
    name: "خدمات الطعام والضيافة",
    professions: [
      { id: 50, name: "شيف" },
      { id: 51, name: "نادل" },
      { id: 52, name: "منسق حفلات" },
    ]
  }
];

export default professionCategories;
