import L from "leaflet";

// SVG أيقونات المهن بتنسيق
const svgIcons = {
  // كهربائي - Zap
  electrician: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3730A3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,

  // سباك - Wrench
  plumber: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,

  // نجار - Hammer
  carpenter: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"></path><path d="M17.64 15 22 10.64"></path><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"></path></svg>`,

  // دهان - Paintbrush
  painter: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EC4899" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18.37 2.63 14 7l-1.74-1.74a1 1 0 0 0-1.42 0L9.16 7l-7.53 7.53a1 1 0 0 0 0 1.42l4.24 4.24a1 1 0 0 0 1.42 0L15 12.58l1.74 1.74a1 1 0 0 0 1.42 0L20 12.5V7l1.9-1.9a.93.93 0 0 0 .63-.27.94.94 0 0 0 0-1.33l-2.83-2.83a.94.94 0 0 0-1.33 0 .93.93 0 0 0-.27.63Z"></path><path d="M11.5 15.5 8 19"></path></svg>`,

  // مصمم ديكور - PenTool
  designer: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"></path><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="m2 2 7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>`,

  // ميكانيكي - Settings
  mechanic: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,

  // حلاق - Scissors
  barber: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line></svg>`,

  // حداد - Hammer
  blacksmith: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"></path><path d="M17.64 15 22 10.64"></path><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"></path></svg>`,

  // بناء - Building
  builder: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>`,

  // مكيفات - Wind
  ac: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path></svg>`,

  // خياط - Scissors
  tailor: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D946EF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line></svg>`,

  // طباخ - Utensils
  chef: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FB923C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path></svg>`,

  // مزارع - Flower
  farmer: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#84CC16" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5M7.5 12H9m7.5 0a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5H15m-3 4.5V15"></path><circle cx="12" cy="12" r="3"></circle><path d="m8 16 1.5-1.5"></path><path d="M14.5 9.5 16 8"></path><path d="m8 8 1.5 1.5"></path><path d="M14.5 14.5 16 16"></path></svg>`,

  // مصلح أجهزة كهربائية - Tv
  appliance_repair: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0284C7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>`,

  // مصلح موبايلات وكمبيوتر - Smartphone
  phone_repair: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>`,

  // طبيب - Stethoscope
  doctor: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path><circle cx="20" cy="10" r="2"></circle></svg>`,

  // ممرض - Syringe
  nurse: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 2 4 4"></path><path d="m17 7 3-3"></path><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0v0c-1-1-1-2.5 0-3.4L15.6 5.6"></path><path d="m14 6 7.5-3.5"></path><path d="m5 14-1 1"></path><path d="m3 12 7.5-7.5"></path><path d="m7 18 1 1"></path><path d="m5 16 2 2"></path></svg>`,

  // معالج فيزيائي - Activity
  physiotherapist: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0891B2" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,

  // خبير تجميل - Sparkles
  beauty_expert: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D946EF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>`,

  // شيف - Chef Hat
  chef_hat: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FB923C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path><line x1="6" y1="17" x2="18" y2="17"></line></svg>`,

  // نادل - Coffee
  waiter: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"></path><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path><line x1="6" y1="2" x2="6" y2="4"></line><line x1="10" y1="2" x2="10" y2="4"></line><line x1="14" y1="2" x2="14" y2="4"></line></svg>`,

  // منسق حفلات - Calendar
  event_planner: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,

  // فني إلكترونيات - Cpu
  electronics_technician: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="2" x2="9" y2="4"></line><line x1="15" y1="2" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="22"></line><line x1="15" y1="20" x2="15" y2="22"></line><line x1="20" y1="9" x2="22" y2="9"></line><line x1="20" y1="14" x2="22" y2="14"></line><line x1="2" y1="9" x2="4" y2="9"></line><line x1="2" y1="14" x2="4" y2="14"></line></svg>`,

  // مصمم مواقع - Globe
  web_designer: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,

  // مطور تطبيقات - Code
  app_developer: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,

  // عام - Briefcase
  default: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3730A3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
};

// دالة لإنشاء أيقونة من SVG
const createIconFromSVG = (svgString, color = "#3730A3") => {
  const iconMarkup = `
    <div style="
      background-color: white;
      border-radius: 50%;
      padding: 8px;
      border: 2px solid ${color};
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25);
      width: 40px;
      height: 40px;
    ">
      ${svgString}
    </div>
  `;

  return L.divIcon({
    html: iconMarkup,
    className: "custom-profession-icon",
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  });
};

// أيقونات المهن
const ProfessionIcons = {
  // أيقونة افتراضية
  default: createIconFromSVG(svgIcons.default),

  // أيقونات المهن المختلفة بالعربية
  كهربائي: createIconFromSVG(svgIcons.electrician, "#3730A3"),
  سباك: createIconFromSVG(svgIcons.plumber, "#3B82F6"),
  نجار: createIconFromSVG(svgIcons.carpenter, "#8B5CF6"),
  دهان: createIconFromSVG(svgIcons.painter, "#EC4899"),
  "مصمم ديكور": createIconFromSVG(svgIcons.designer, "#10B981"),
  "مصممة ديكور": createIconFromSVG(svgIcons.designer, "#10B981"),
  ميكانيكي: createIconFromSVG(svgIcons.mechanic, "#F59E0B"),
  حلاق: createIconFromSVG(svgIcons.barber, "#6366F1"),
  حداد: createIconFromSVG(svgIcons.blacksmith, "#EF4444"),
  بناء: createIconFromSVG(svgIcons.builder, "#94A3B8"),
  مكيفات: createIconFromSVG(svgIcons.ac, "#0EA5E9"),
  خياط: createIconFromSVG(svgIcons.tailor, "#D946EF"),
  طباخ: createIconFromSVG(svgIcons.chef, "#FB923C"),
  مزارع: createIconFromSVG(svgIcons.farmer, "#84CC16"),
  "مصلح أجهزة كهربائية": createIconFromSVG(svgIcons.appliance_repair, "#0284C7"),
  "مصلح موبايلات وكمبيوتر": createIconFromSVG(svgIcons.phone_repair, "#7C3AED"),
  "تركيب و صيانة ألمنيوم": createIconFromSVG(svgIcons.blacksmith, "#64748B"),
  "معلم سيراميك": createIconFromSVG(svgIcons.builder, "#475569"),
  "عامل نظافة": createIconFromSVG(svgIcons.default, "#06B6D4"),
  "عامل توصيل": createIconFromSVG(svgIcons.default, "#F97316"),
  "عامل صيانة عامة": createIconFromSVG(svgIcons.mechanic, "#4F46E5"),
  "فني تبريد وتكييف": createIconFromSVG(svgIcons.ac, "#0EA5E9"),
  "عامل بناء": createIconFromSVG(svgIcons.builder, "#94A3B8"),
  "فني تمديدات صحية": createIconFromSVG(svgIcons.plumber, "#3B82F6"),
  "فني لحام وحدادة": createIconFromSVG(svgIcons.blacksmith, "#EF4444"),
  "حدّاد متخصص في الأبواب والنوافذ": createIconFromSVG(svgIcons.blacksmith, "#DC2626"),
  "معلم": createIconFromSVG(svgIcons.default, "#8B5CF6"),
  "مصور": createIconFromSVG(svgIcons.default, "#EC4899"),
  "سائق": createIconFromSVG(svgIcons.default, "#F97316"),

  // مهن الصحة والجمال
  "طبيب": createIconFromSVG(svgIcons.doctor, "#06B6D4"),
  "ممرض": createIconFromSVG(svgIcons.nurse, "#0EA5E9"),
  "معالج فيزيائي": createIconFromSVG(svgIcons.physiotherapist, "#0891B2"),
  "خبير تجميل": createIconFromSVG(svgIcons.beauty_expert, "#D946EF"),

  // مهن الطعام والضيافة
  "شيف": createIconFromSVG(svgIcons.chef_hat, "#FB923C"),
  "نادل": createIconFromSVG(svgIcons.waiter, "#F97316"),
  "منسق حفلات": createIconFromSVG(svgIcons.event_planner, "#F43F5E"),

  // مهن الإلكترونيات والتقنية
  "فني إلكترونيات": createIconFromSVG(svgIcons.electronics_technician, "#2563EB"),
  "مصمم مواقع": createIconFromSVG(svgIcons.web_designer, "#8B5CF6"),
  "مطور تطبيقات": createIconFromSVG(svgIcons.app_developer, "#4F46E5"),

  // تحويل الاسم إلى حروف صغيرة للتوافق مع الاستخدام السابق
  electrician: createIconFromSVG(svgIcons.electrician, "#3730A3"),
  plumber: createIconFromSVG(svgIcons.plumber, "#3B82F6"),
  carpenter: createIconFromSVG(svgIcons.carpenter, "#8B5CF6"),
  painter: createIconFromSVG(svgIcons.painter, "#EC4899"),
  designer: createIconFromSVG(svgIcons.designer, "#10B981"),
  mechanic: createIconFromSVG(svgIcons.mechanic, "#F59E0B"),
  barber: createIconFromSVG(svgIcons.barber, "#6366F1"),
  blacksmith: createIconFromSVG(svgIcons.blacksmith, "#EF4444"),
  builder: createIconFromSVG(svgIcons.builder, "#94A3B8"),
  ac: createIconFromSVG(svgIcons.ac, "#0EA5E9"),
  tailor: createIconFromSVG(svgIcons.tailor, "#D946EF"),
  chef: createIconFromSVG(svgIcons.chef, "#FB923C"),
  farmer: createIconFromSVG(svgIcons.farmer, "#84CC16"),
  appliance_repair: createIconFromSVG(svgIcons.appliance_repair, "#0284C7"),
  phone_repair: createIconFromSVG(svgIcons.phone_repair, "#7C3AED"),

  // مهن الصحة والجمال بالإنجليزية
  doctor: createIconFromSVG(svgIcons.doctor, "#06B6D4"),
  nurse: createIconFromSVG(svgIcons.nurse, "#0EA5E9"),
  physiotherapist: createIconFromSVG(svgIcons.physiotherapist, "#0891B2"),
  beauty_expert: createIconFromSVG(svgIcons.beauty_expert, "#D946EF"),

  // مهن الطعام والضيافة بالإنجليزية
  chef_hat: createIconFromSVG(svgIcons.chef_hat, "#FB923C"),
  waiter: createIconFromSVG(svgIcons.waiter, "#F97316"),
  event_planner: createIconFromSVG(svgIcons.event_planner, "#F43F5E"),

  // مهن الإلكترونيات والتقنية بالإنجليزية
  electronics_technician: createIconFromSVG(svgIcons.electronics_technician, "#2563EB"),
  web_designer: createIconFromSVG(svgIcons.web_designer, "#8B5CF6"),
  app_developer: createIconFromSVG(svgIcons.app_developer, "#4F46E5"),
};

export default ProfessionIcons;
