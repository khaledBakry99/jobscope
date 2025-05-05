/**
 * تنسيق التاريخ إلى صيغة عربية
 * @param {string|Date} date - التاريخ المراد تنسيقه
 * @returns {string} التاريخ بصيغة عربية (مثال: ١٥ يناير ٢٠٢٣)
 */
export const formatDate = (date) => {
  if (!date) return "";
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  // تحويل إلى التنسيق العربي
  const options = { year: "numeric", month: "long", day: "numeric" };
  return dateObj.toLocaleDateString("ar-SA", options);
};

/**
 * تنسيق الوقت إلى صيغة 12 ساعة مع مؤشر ص/م
 * @param {string} time - الوقت بصيغة 24 ساعة (مثال: "14:30")
 * @returns {string} الوقت بصيغة 12 ساعة مع مؤشر ص/م (مثال: "2:30 م")
 */
export const formatTime = (time) => {
  if (!time) return "";
  
  // تقسيم الوقت إلى ساعات ودقائق
  const [hours, minutes] = time.split(":");
  
  // تحويل إلى نظام 12 ساعة
  let hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "م" : "ص";
  hour = hour % 12 || 12;
  
  return `${hour}:${minutes} ${ampm}`;
};

/**
 * تنسيق التاريخ والوقت معًا
 * @param {string|Date} date - التاريخ
 * @param {string} time - الوقت
 * @returns {string} التاريخ والوقت معًا
 */
export const formatDateTime = (date, time) => {
  if (!date || !time) return "";
  return `${formatDate(date)} - ${formatTime(time)}`;
};
