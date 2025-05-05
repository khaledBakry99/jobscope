import { create } from "zustand";
import { craftsmanService } from "../services/api";

// دالة للتحقق مما إذا كانت نقطة داخل مضلع
const isPointInPolygon = (point, polygon) => {
  // خوارزمية Ray Casting للتحقق مما إذا كانت نقطة داخل مضلع
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;
    const xj = polygon[j].lng;
    const yj = polygon[j].lat;

    const intersect =
      yi > point.lat !== yj > point.lat &&
      point.lng < ((xj - xi) * (point.lat - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }
  return inside;
};

const useCraftsmenStore = create((set, get) => ({
  craftsmen: [],
  filteredCraftsmen: [],
  loading: false,
  error: null,

  // جلب جميع الحرفيين من الخادم
  fetchCraftsmen: async () => {
    // التحقق مما إذا كان هناك استدعاء جارٍ بالفعل أو إذا كانت البيانات موجودة بالفعل
    if (get().loading || get().craftsmen.length > 0) {
      return get().craftsmen;
    }

    set({ loading: true, error: null });
    try {
      // استدعاء خدمة الحرفيين للحصول على البيانات من الخادم
      const response = await craftsmanService.getAllCraftsmen();

      // طباعة البيانات المستلمة للتصحيح فقط إذا كانت هناك بيانات
      if (response && (Array.isArray(response) ? response.length > 0 : (response.craftsmen && response.craftsmen.length > 0))) {
        console.log("API Response:", response);
      }

      // تحديث المتجر بالبيانات الجديدة
      // تعديل: استخدام response مباشرة إذا كان مصفوفة، أو response.craftsmen إذا كان كائنًا
      const craftsmenData = Array.isArray(response) ? response : (response.craftsmen || []);

      set({
        craftsmen: craftsmenData,
        filteredCraftsmen: craftsmenData,
        loading: false,
      });

      return craftsmenData;
    } catch (error) {
      console.error("Error fetching craftsmen:", error);

      // في حالة حدوث خطأ، نستخدم مصفوفة فارغة بدلاً من البيانات الوهمية
      set({
        craftsmen: [],
        filteredCraftsmen: [],
        loading: false,
        error: error.message,
      });

      return [];
    }
  },

  // جلب حرفي واحد بواسطة المعرف
  fetchCraftsman: async (id) => {
    set({ loading: true, error: null });
    try {
      // البحث عن الحرفي في المتجر أولاً
      const existingCraftsman = get().craftsmen.find(
        (c) => c.id === parseInt(id) || c.id === id
      );
      if (existingCraftsman) {
        set({ loading: false });
        return existingCraftsman;
      }

      // إذا لم يتم العثور عليه، جلبه من الخادم
      const response = await craftsmanService.getCraftsmanById(id);

      // طباعة بيانات الحرفي للتأكد من استلامها بشكل صحيح
      console.log("Craftsman data from API:", response);

      // تعديل: استخدام response مباشرة إذا لم يكن يحتوي على حقل craftsman
      const craftsmanData = response.craftsman || response;

      // التأكد من أن البيانات تحتوي على معرف
      if (craftsmanData && !craftsmanData.id && craftsmanData._id) {
        craftsmanData.id = craftsmanData._id;
      }

      // تحديث قائمة الحرفيين في المتجر
      set((state) => ({
        craftsmen: [...state.craftsmen, craftsmanData],
        loading: false,
      }));

      return craftsmanData;
    } catch (error) {
      console.error("Error fetching craftsman:", error);
      set({ loading: false, error: error.message });
      return null;
    }
  },

  // Filter craftsmen by various criteria
  filterCraftsmen: ({
    profession,
    professions,
    specialization,
    available,
    rating,
    location,
    radius,
    serviceAreas,
  }) => {
    set((state) => {
      let filtered = [...state.craftsmen];

      // طباعة معلومات التصحيح
      console.log("بدء تصفية الحرفيين:");
      console.log("- عدد الحرفيين الكلي:", state.craftsmen.length);
      console.log("- المهنة المحددة:", profession);
      console.log("- المهن المحددة:", professions);

      // طباعة بيانات الحرفيين للتصحيح
      if (state.craftsmen.length > 0) {
        console.log("نموذج بيانات الحرفي الأول:", JSON.stringify(state.craftsmen[0], null, 2));
      }

      // دعم تصفية متعددة للمهن
      if (professions && professions.length > 0) {
        // طباعة المهن المحددة للتصحيح
        console.log("المهن المحددة للفلترة:", professions);

        // تحويل المهن المحددة إلى تنسيق موحد للمقارنة
        const normalizedSelectedProfessions = professions.map(prof => {
          if (typeof prof === 'string') {
            return prof.trim().toLowerCase();
          } else if (typeof prof === 'object' && prof.name) {
            return prof.name.trim().toLowerCase();
          }
          return '';
        }).filter(name => name !== '');

        console.log("المهن المحددة بعد التوحيد:", normalizedSelectedProfessions);

        // تصفية حسب مصفوفة المهن
        filtered = filtered.filter((craftsman) => {
          // طباعة بيانات الحرفي للتصحيح
          console.log(`فحص الحرفي: ${craftsman.name}, المهن:`,
            craftsman.professions || craftsman.profession || "غير محدد");

          // تجميع جميع المهن المحتملة للحرفي في مصفوفة واحدة
          let craftsmanProfessions = [];

          // إضافة المهن من مصفوفة المهن إذا كانت موجودة
          if (craftsman.professions && Array.isArray(craftsman.professions) && craftsman.professions.length > 0) {
            craftsmanProfessions = [
              ...craftsmanProfessions,
              ...craftsman.professions.map(prof => {
                if (typeof prof === 'string') {
                  return prof.trim().toLowerCase();
                } else if (typeof prof === 'object' && prof.name) {
                  return prof.name.trim().toLowerCase();
                }
                return '';
              }).filter(name => name !== '')
            ];
          }

          // إضافة المهنة الرئيسية إذا كانت موجودة
          if (craftsman.profession) {
            if (typeof craftsman.profession === 'string') {
              craftsmanProfessions.push(craftsman.profession.trim().toLowerCase());
            } else if (typeof craftsman.profession === 'object' && craftsman.profession.name) {
              craftsmanProfessions.push(craftsman.profession.name.trim().toLowerCase());
            }
          }

          // إضافة المهنة من حقل profession_id إذا كان موجودًا
          if (craftsman.profession_id) {
            // يمكن إضافة منطق هنا للبحث عن اسم المهنة بناءً على الرقم
            // لكن هذا يتطلب قائمة مرجعية بجميع المهن
          }

          console.log(`مهن الحرفي بعد التوحيد:`, craftsmanProfessions);

          // التحقق من وجود تطابق بين مهن الحرفي والمهن المحددة
          const hasMatch = normalizedSelectedProfessions.some(selectedProf =>
            craftsmanProfessions.includes(selectedProf)
          );

          if (hasMatch) {
            console.log(`الحرفي ${craftsman.name} يتطابق مع المهن المحددة`);
          }

          return hasMatch;
        });

        // طباعة عدد الحرفيين بعد التصفية للتصحيح
        console.log(`تمت التصفية حسب المهن: ${filtered.length} حرفي متبقي`);
      } else if (profession) {
        // للتوافق مع الكود القديم
        console.log("تصفية حسب مهنة واحدة:", profession);

        // تحويل المهنة المحددة إلى تنسيق موحد للمقارنة
        let normalizedProfession = '';
        if (typeof profession === 'string') {
          normalizedProfession = profession.trim().toLowerCase();
        } else if (typeof profession === 'object' && profession.name) {
          normalizedProfession = profession.name.trim().toLowerCase();
        }

        console.log("المهنة المحددة بعد التوحيد:", normalizedProfession);

        filtered = filtered.filter((craftsman) => {
          // تجميع جميع المهن المحتملة للحرفي في مصفوفة واحدة
          let craftsmanProfessions = [];

          // إضافة المهن من مصفوفة المهن إذا كانت موجودة
          if (craftsman.professions && Array.isArray(craftsman.professions) && craftsman.professions.length > 0) {
            craftsmanProfessions = [
              ...craftsmanProfessions,
              ...craftsman.professions.map(prof => {
                if (typeof prof === 'string') {
                  return prof.trim().toLowerCase();
                } else if (typeof prof === 'object' && prof.name) {
                  return prof.name.trim().toLowerCase();
                }
                return '';
              }).filter(name => name !== '')
            ];
          }

          // إضافة المهنة الرئيسية إذا كانت موجودة
          if (craftsman.profession) {
            if (typeof craftsman.profession === 'string') {
              craftsmanProfessions.push(craftsman.profession.trim().toLowerCase());
            } else if (typeof craftsman.profession === 'object' && craftsman.profession.name) {
              craftsmanProfessions.push(craftsman.profession.name.trim().toLowerCase());
            }
          }

          // التحقق من وجود تطابق بين مهن الحرفي والمهنة المحددة
          const hasMatch = craftsmanProfessions.includes(normalizedProfession);

          if (hasMatch) {
            console.log(`الحرفي ${craftsman.name} يتطابق مع المهنة المحددة`);
          }

          return hasMatch;
        });

        // طباعة عدد الحرفيين بعد التصفية للتصحيح
        console.log(`تمت التصفية حسب مهنة واحدة: ${filtered.length} حرفي متبقي`);
      }

      if (specialization) {
        filtered = filtered.filter((c) => c.specialization === specialization);
      }

      if (available !== undefined) {
        filtered = filtered.filter((c) => c.available === available);
      }

      if (rating) {
        filtered = filtered.filter((c) => c.rating >= rating);
      }

      // فلترة بناءً على الموقع ونطاق العمل
      if (location && radius) {
        // تحسين حساب المسافة والتعامل مع هياكل البيانات المختلفة
        filtered = filtered.filter((c) => {
          // التعامل مع الحالات المختلفة لهيكل البيانات
          const craftsmanLat = c.latitude || (c.location && c.location.lat);
          const craftsmanLng = c.longitude || (c.location && c.location.lng);

          // إذا لم تكن هناك إحداثيات، استبعاد الحرفي
          if (!craftsmanLat || !craftsmanLng) {
            console.log("Craftsman without location:", c);
            return false;
          }

          // حساب المسافة باستخدام صيغة هافرساين (أكثر دقة)
          const R = 6371; // نصف قطر الأرض بالكيلومتر
          const dLat = ((location.lat - craftsmanLat) * Math.PI) / 180;
          const dLng = ((location.lng - craftsmanLng) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((craftsmanLat * Math.PI) / 180) *
              Math.cos((location.lat * Math.PI) / 180) *
              Math.sin(dLng / 2) *
              Math.sin(dLng / 2);
          const angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * angle; // المسافة بالكيلومتر

          return distance <= radius;
        });
      }

      // فلترة بناءً على مناطق الخدمة المخصصة
      if (serviceAreas && serviceAreas.length > 0) {
        console.log("تطبيق الفلترة بناءً على مناطق الخدمة المخصصة:", serviceAreas);

        filtered = filtered.filter((c) => {
          // التعامل مع الحالات المختلفة لهيكل البيانات
          const craftsmanLat = c.latitude || (c.location && c.location.lat);
          const craftsmanLng = c.longitude || (c.location && c.location.lng);

          // إذا لم تكن هناك إحداثيات، استبعاد الحرفي
          if (!craftsmanLat || !craftsmanLng) {
            return false;
          }

          // التحقق مما إذا كان الحرفي يقع داخل أي من المناطق المرسومة
          return serviceAreas.some((area) => {
            if (area.type === "polygon") {
              // التحقق مما إذا كان الحرفي داخل المضلع
              return isPointInPolygon(
                { lat: craftsmanLat, lng: craftsmanLng },
                area.coordinates.map((coord) => ({ lat: coord[0], lng: coord[1] }))
              );
            } else if (area.type === "circle") {
              // التحقق مما إذا كان الحرفي داخل الدائرة
              const R = 6371; // نصف قطر الأرض بالكيلومتر
              const dLat = ((area.center[0] - craftsmanLat) * Math.PI) / 180;
              const dLng = ((area.center[1] - craftsmanLng) * Math.PI) / 180;
              const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos((craftsmanLat * Math.PI) / 180) *
                  Math.cos((area.center[0] * Math.PI) / 180) *
                  Math.sin(dLng / 2) *
                  Math.sin(dLng / 2);
              const angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              const distance = R * angle; // المسافة بالكيلومتر

              return distance <= area.radius / 1000; // تحويل من متر إلى كيلومتر
            }
            return false;
          });
        });
      }

      return { filteredCraftsmen: filtered };
    });
  },

  // Get a single craftsman by ID
  getCraftsmanById: (id) => {
    return useCraftsmenStore
      .getState()
      .craftsmen.find((c) => c.id === parseInt(id));
  },
}));

export default useCraftsmenStore;
