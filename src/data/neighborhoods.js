// مصفوفة فارغة بدلاً من قائمة الأحياء الوهمية
const neighborhoods = [];

// دالة لحساب المسافة بين نقطتين بالكيلومتر (صيغة هافرساين)
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // نصف قطر الأرض بالكيلومتر
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // المسافة بالكيلومتر
  return distance;
};

// دالة للحصول على الأحياء ضمن نطاق معين من موقع محدد
export const getNeighborhoodsInRadius = (location, radius) => {
  return neighborhoods.filter((neighborhood) => {
    const distance = calculateDistance(
      location.lat,
      location.lng,
      neighborhood.lat,
      neighborhood.lng
    );
    return distance <= radius;
  });
};

export default neighborhoods;
