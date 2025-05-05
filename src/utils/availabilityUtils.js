/**
 * دالة للتحقق من توفر الحرفي بناءً على أوقات الدوام
 * @param {Object} workingHours - كائن يحتوي على أوقات الدوام للحرفي
 * @returns {boolean} - إذا كان الحرفي متاحًا حاليًا أم لا
 */
export const isAvailableNow = (workingHours) => {
  if (!workingHours) return false;

  // الحصول على الوقت الحالي
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  // الحصول على اليوم الحالي
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = daysOfWeek[now.getDay()]; // getDay() يعطي 0 للأحد، 1 للاثنين، إلخ

  // التحقق مما إذا كان اليوم الحالي هو يوم عمل
  const todaySchedule = workingHours[currentDay];
  if (!todaySchedule || !todaySchedule.isWorking) {
    return false;
  }

  // تحويل وقت البدء والانتهاء إلى دقائق
  const fromTimeParts = todaySchedule.from.split(':');
  const toTimeParts = todaySchedule.to.split(':');
  
  const fromTimeInMinutes = parseInt(fromTimeParts[0]) * 60 + parseInt(fromTimeParts[1]);
  const toTimeInMinutes = parseInt(toTimeParts[0]) * 60 + parseInt(toTimeParts[1]);

  // التحقق مما إذا كان الوقت الحالي ضمن ساعات العمل
  return currentTimeInMinutes >= fromTimeInMinutes && currentTimeInMinutes <= toTimeInMinutes;
};

/**
 * دالة لتنسيق الوقت بتنسيق 12 ساعة مع مؤشر ص/م
 * @param {string} time - الوقت بتنسيق 24 ساعة (مثل "14:30")
 * @returns {string} - الوقت بتنسيق 12 ساعة مع مؤشر ص/م (مثل "2:30 م")
 */
export const formatTime12Hour = (time) => {
  if (!time) return '';
  
  const [hours, minutes] = time.split(':');
  let hour = parseInt(hours);
  const ampm = hour >= 12 ? 'م' : 'ص';
  
  hour = hour % 12;
  hour = hour ? hour : 12; // الساعة 0 تصبح 12
  
  return `${hour}:${minutes} ${ampm}`;
};

/**
 * دالة للحصول على أيام العمل كنص
 * @param {Object} workingHours - كائن يحتوي على أوقات الدوام للحرفي
 * @returns {string} - نص يحتوي على أيام العمل
 */
export const getWorkingDaysText = (workingHours) => {
  if (!workingHours) return 'غير محدد';

  const daysMap = {
    saturday: 'السبت',
    sunday: 'الأحد',
    monday: 'الاثنين',
    tuesday: 'الثلاثاء',
    wednesday: 'الأربعاء',
    thursday: 'الخميس',
    friday: 'الجمعة'
  };

  const workingDays = Object.entries(workingHours)
    .filter(([_, value]) => value.isWorking)
    .map(([day, _]) => daysMap[day]);

  if (workingDays.length === 0) return 'غير محدد';
  if (workingDays.length === 7) return 'كل الأيام';

  return workingDays.join('، ');
};

/**
 * دالة للحصول على ساعات العمل كنص
 * @param {Object} workingHours - كائن يحتوي على أوقات الدوام للحرفي
 * @returns {string} - نص يحتوي على ساعات العمل
 */
export const getWorkingHoursText = (workingHours) => {
  if (!workingHours) return 'غير محدد';

  // البحث عن أول يوم عمل للحصول على ساعات العمل
  const firstWorkingDay = Object.values(workingHours).find(day => day.isWorking);
  
  if (!firstWorkingDay) return 'غير محدد';
  
  return `${formatTime12Hour(firstWorkingDay.from)} - ${formatTime12Hour(firstWorkingDay.to)}`;
};
