// خدمة الخرائط للتواصل مع الواجهة الخلفية
import api from "./api";

// خدمة الخريطة
const mapService = {
  // الحصول على الشوارع والمستشفيات والمساجد ضمن نطاق معين
  getStreetsInRadius: async (lat, lng, radius) => {
    try {
      console.log("Getting streets in radius:", { lat, lng, radius });
      const response = await api.get("/map/streets", {
        params: { lat, lng, radius },
      });
      console.log("Streets in radius response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get streets in radius error:", error);
      // في حالة حدوث خطأ، استخدام Overpass API مباشرة كاحتياط
      return fetchStreetsFromOverpass(lat, lng, radius);
    }
  },

  // الحصول على الأحياء ضمن نطاق معين
  getNeighborhoodsInRadius: async (lat, lng, radius) => {
    try {
      console.log("Getting neighborhoods in radius:", { lat, lng, radius });
      const response = await api.get("/map/neighborhoods", {
        params: { lat, lng, radius },
      });
      console.log("Neighborhoods in radius response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get neighborhoods in radius error:", error);
      // في حالة حدوث خطأ، استخدام البيانات المحلية
      return getLocalNeighborhoodsInRadius({ lat, lng }, radius);
    }
  },

  // الحصول على عنوان من إحداثيات
  getAddressFromCoordinates: async (lat, lng) => {
    try {
      console.log("Getting address from coordinates:", { lat, lng });
      const response = await api.get("/map/reverse-geocode", {
        params: { lat, lng },
      });
      console.log("Address from coordinates response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get address from coordinates error:", error);
      throw error.response?.data || {
        message: "حدث خطأ أثناء جلب العنوان من الإحداثيات",
      };
    }
  },

  // الحصول على إحداثيات من عنوان
  getCoordinatesFromAddress: async (address) => {
    try {
      console.log("Getting coordinates from address:", address);
      const response = await api.get("/map/geocode", {
        params: { address },
      });
      console.log("Coordinates from address response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get coordinates from address error:", error);
      throw error.response?.data || {
        message: "حدث خطأ أثناء جلب الإحداثيات من العنوان",
      };
    }
  },
};

export default mapService;

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

// دالة للحصول على الشوارع والمستشفيات والمساجد ضمن نطاق معين
export const fetchStreetsInRadius = async (lat, lng, radius) => {
  try {
    // استخدام الواجهة الخلفية للحصول على البيانات
    const response = await api.get(`/map/streets-in-radius`, {
      params: { lat, lng, radius },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching streets in radius:", error);

    // في حالة حدوث خطأ، استخدام Overpass API مباشرة كاحتياط
    return fetchStreetsFromOverpass(lat, lng, radius);
  }
};

// دالة احتياطية للحصول على البيانات من Overpass API مباشرة
export const fetchStreetsFromOverpass = async (lat, lng, radius) => {
  try {
    // Overpass QL: استعلام للحصول على الشوارع والمستشفيات والمساجد ضمن نطاق معين
    const query = `
      [out:json];
      (
        way["highway"]["name"](around:${radius * 1000},${lat},${lng});
        node["amenity"="hospital"](around:${radius * 1000},${lat},${lng});
        node["amenity"="clinic"](around:${radius * 1000},${lat},${lng});
        node["amenity"="doctors"](around:${radius * 1000},${lat},${lng});
        node["healthcare"](around:${radius * 1000},${lat},${lng});
        node["amenity"="mosque"](around:${radius * 1000},${lat},${lng});
        way["amenity"="mosque"](around:${radius * 1000},${lat},${lng});
        node["building"="mosque"](around:${radius * 1000},${lat},${lng});
        way["building"="mosque"](around:${radius * 1000},${lat},${lng});
      );
      out tags;
    `;
    const url = "https://overpass-api.de/api/interpreter";
    const res = await fetch(url, {
      method: "POST",
      body: query,
      headers: { "Content-Type": "text/plain" },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    // التحقق من بنية البيانات
    if (!data || !Array.isArray(data.elements)) {
      console.error("Invalid data structure from Overpass API:", data);
      return { streets: [], hospitals: [], mosques: [] };
    }

    // استخراج أسماء الشوارع والمستشفيات والمساجد
    const streets = [];
    const hospitals = [];
    const mosques = [];

    data.elements.forEach((el) => {
      if (!el.tags || !el.tags.name) return;

      const name = el.tags.name.trim();

      // تحديد نوع العنصر بناءً على الوسوم
      if (el.tags.highway && (el.type === "way" || el.type === "relation")) {
        // الشوارع - فقط الطرق التي لها اسم وليست مسارات مشاة أو دراجات
        if (!el.tags.footway && !el.tags.cycleway && !el.tags.path) {
          // تأكد من أن الاسم ليس مسجدًا أو مستشفى
          if (
            !name.includes("مسجد") &&
            !name.includes("جامع") &&
            !name.includes("مستشفى") &&
            !name.includes("عيادة") &&
            !name.includes("مشفى") &&
            !name.includes("clinic") &&
            !name.includes("hospital") &&
            !name.includes("mosque")
          ) {
            streets.push(name);
          }
        }
      } else if (
        // المستشفيات والعيادات
        (el.tags.amenity === "hospital" ||
          el.tags.amenity === "clinic" ||
          el.tags.amenity === "doctors" ||
          el.tags.healthcare) &&
        !el.tags.mosque && // تأكد من أنه ليس مسجدًا
        !el.tags.religion // تأكد من أنه ليس مبنى دينيًا
      ) {
        // تأكد من أن الاسم ليس مسجدًا
        if (
          !name.includes("مسجد") &&
          !name.includes("جامع") &&
          !name.includes("mosque")
        ) {
          hospitals.push(name);
        }
      } else if (
        // المساجد
        el.tags.amenity === "mosque" ||
        el.tags.building === "mosque" ||
        (el.tags.religion === "muslim" && el.tags.building) ||
        el.tags.religion === "islam" ||
        name.includes("مسجد") ||
        name.includes("جامع")
      ) {
        // تأكد من أن الاسم ليس مستشفى
        if (
          !name.includes("مستشفى") &&
          !name.includes("عيادة") &&
          !name.includes("مشفى") &&
          !name.includes("clinic") &&
          !name.includes("hospital")
        ) {
          mosques.push(name);
        }
      }
    });

    // إزالة التكرارات
    return {
      streets: [...new Set(streets)],
      hospitals: [...new Set(hospitals)],
      mosques: [...new Set(mosques)],
    };
  } catch (error) {
    console.error("Error fetching data from Overpass API:", error);
    return { streets: [], hospitals: [], mosques: [] };
  }
};

// دالة للحصول على الأحياء ضمن نطاق معين
export const getNeighborhoodsInRadius = async (location, radius) => {
  try {
    // استخدام الواجهة الخلفية للحصول على البيانات
    const response = await api.get(`/map/neighborhoods-in-radius`, {
      params: {
        lat: location.lat,
        lng: location.lng,
        radius,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching neighborhoods in radius:", error);

    // في حالة حدوث خطأ، استخدام البيانات المحلية
    return getLocalNeighborhoodsInRadius(location, radius);
  }
};

// دالة احتياطية للحصول على الأحياء من البيانات المحلية
const getLocalNeighborhoodsInRadius = (location, radius) => {
  // بيانات الأحياء في دمشق وضواحيها مع إحداثياتها
  const neighborhoods = [
    { name: "المزة", lat: 33.5038, lng: 36.2478 },
    { name: "المالكي", lat: 33.5125, lng: 36.2789 },
    { name: "أبو رمانة", lat: 33.5167, lng: 36.2833 },
    { name: "الروضة", lat: 33.5189, lng: 36.3033 },
    { name: "كفرسوسة", lat: 33.4978, lng: 36.2689 },
    { name: "المهاجرين", lat: 33.5256, lng: 36.2922 },
    { name: "دمر", lat: 33.5367, lng: 36.2256 },
    { name: "قدسيا", lat: 33.5578, lng: 36.2389 },
    { name: "برزة", lat: 33.5456, lng: 36.3256 },
    { name: "ركن الدين", lat: 33.5367, lng: 36.3056 },
    { name: "الميدان", lat: 33.4889, lng: 36.3022 },
    { name: "القابون", lat: 33.5367, lng: 36.3322 },
    { name: "جوبر", lat: 33.5289, lng: 36.3389 },
    { name: "الشعلان", lat: 33.5133, lng: 36.2922 },
    { name: "الصالحية", lat: 33.5178, lng: 36.2978 },
    { name: "ساروجة", lat: 33.5156, lng: 36.3056 },
    { name: "القصاع", lat: 33.5156, lng: 36.3156 },
    { name: "باب توما", lat: 33.5133, lng: 36.3178 },
    { name: "الجسر الأبيض", lat: 33.5111, lng: 36.2922 },
    { name: "الحلبوني", lat: 33.5178, lng: 36.3089 },
    { name: "العباسيين", lat: 33.5211, lng: 36.3211 },
    { name: "القصور", lat: 33.5156, lng: 36.3089 },
    { name: "الشاغور", lat: 33.5067, lng: 36.3089 },
    { name: "باب سريجة", lat: 33.5067, lng: 36.3022 },
    { name: "الصناعة", lat: 33.4978, lng: 36.3089 },
    { name: "التجارة", lat: 33.5022, lng: 36.3056 },
    { name: "الحريقة", lat: 33.5089, lng: 36.3056 },
    { name: "السبع بحرات", lat: 33.5111, lng: 36.3089 },
    { name: "الشيخ محي الدين", lat: 33.5178, lng: 36.2922 },
    { name: "الصالحية الجديدة", lat: 33.5211, lng: 36.2889 },
  ];

  // تصفية الأحياء حسب المسافة
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
