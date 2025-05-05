import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Star,
  MapPin,
  Filter,
  List,
  Map as MapIcon,
  Briefcase,
  Lock,
} from "lucide-react";
import Layout from "../../components/layout/Layout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import MapBox from "../../components/maps/MapBox";
import AdvancedMap from "../../components/map/AdvancedMap";
import MapFilter from "../../components/map/MapFilter";

import useUserStore from "../../store/userStore";
import useCraftsmenStore from "../../store/craftsmenStore";
import useThemeStore from "../../store/themeStore";
import SearchSuggestions from "../../components/search/SearchSuggestions";
import SearchFeedback from "../../components/search/SearchFeedback";
import { analyzeQuery, suggestQueries } from "../../services/nlpService";
import professionCategories from "../../data/professionCategories";

// استخراج جميع المهن من تصنيفات المهن
const professions = professionCategories.reduce((allProfessions, category) => {
  return [...allProfessions, ...category.professions];
}, []);

const SearchPage = () => {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const darkMode = useThemeStore((state) => state.darkMode);

  // التحقق من حالة تسجيل الدخول باستخدام متجر الحالة
  const isTokenExist = user !== null;

  // إذا لم يكن هناك رمز مميز في localStorage ولكن هناك مستخدم في المتجر، قم بتسجيل الخروج
  useEffect(() => {
    if (!isTokenExist && user) {
      // تسجيل الخروج من المتجر
      logout();
      console.log("تم تسجيل الخروج من المتجر في صفحة البحث");
    }

    // تحديث الفلاتر بعد التحقق من حالة تسجيل الدخول
    filterCraftsmen(filters);
  }, [isTokenExist, user, logout]);

  // تأكد من تحديث البيانات عند تغيير حالة تسجيل الدخول
  useEffect(() => {
    // إعادة تحميل البيانات عند تغيير حالة تسجيل الدخول
    fetchCraftsmen();
    filterCraftsmen(filters);
  }, [isTokenExist]);

  const {
    craftsmen,
    filteredCraftsmen,
    fetchCraftsmen,
    filterCraftsmen,
  } = useCraftsmenStore();

  const [viewMode, setViewMode] = useState("map"); // 'list' or 'map'
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // البحث الذكي مفعل دائمًا بدون الحاجة لمتغير حالة
  const [searchCriteria, setSearchCriteria] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const searchInputRef = useRef(null);
  const mapBoxRef = useRef(null);

  // تأكد من أن المهن المحددة تبدأ كمصفوفة فارغة
  const [selectedProfessions, setSelectedProfessions] = useState([]);

  // حالة لتخزين التصنيف المحدد
  const [selectedCategory, setSelectedCategory] = useState(null);

  // تأكد من عدم وجود مهنة محددة افتراضيًا عند تحميل الصفحة
  useEffect(() => {
    // إعادة تعيين المهن المحددة إلى مصفوفة فارغة
    setSelectedProfessions([]);
    // إعادة تعيين فلتر المهنة إلى قيمة فارغة
    setFilters((prev) => ({
      ...prev,
      profession: "",
      professions: [],
    }));
  }, []);

  const [selectedRating, setSelectedRating] = useState(0);



  const [filters, setFilters] = useState({
    profession: "", // للتوافق مع الكود القديم
    professions: [], // مصفوفة للمهن المتعددة
    available: true,
    rating: 0,
    location: user?.location || { lng: 36.2765, lat: 33.5138 }, // Damascus, Syria
    radius: 1,
  });

  // Estados para las calles, hospitales y mezquitas
  const [streets, setStreets] = useState([]);
  const [removedStreets, setRemovedStreets] = useState([]);
  const [showAllStreets, setShowAllStreets] = useState(false);

  // متغيرات حالة للمستشفيات
  const [hospitals, setHospitals] = useState([]);
  const [removedHospitals, setRemovedHospitals] = useState([]);
  const [showAllHospitals, setShowAllHospitals] = useState(false);

  // متغيرات حالة للمساجد
  const [mosques, setMosques] = useState([]);
  const [removedMosques, setRemovedMosques] = useState([]);
  const [showAllMosques, setShowAllMosques] = useState(false);

  useEffect(() => {
    // Fetch craftsmen once when component mounts
    fetchCraftsmen();

    // Apply initial filters
    filterCraftsmen(filters);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Efecto para actualizar el mapa cuando cambia la ubicación
  useEffect(() => {
    // Cuando cambia la ubicación, necesitamos actualizar el mapa
    console.log("Location changed:", filters.location);
    if (mapBoxRef.current && filters.location) {
      // Actualizar la ubicación del mapa cuando cambia filters.location
      mapBoxRef.current.updateLocation(filters.location);
    }
  }, [filters.location]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    // تحديث الفلاتر
    setFilters({
      ...filters,
      [name]: newValue,
    });

    // إذا كان التغيير في التقييم، قم بتحديث selectedRating أيضًا
    if (name === "rating") {
      setSelectedRating(parseFloat(value));
    }

    // تطبيق الفلتر مباشرة
    filterCraftsmen({
      ...filters,
      [name]: newValue,
    });
  };

  const handleLocationSelect = (location) => {
    setFilters({
      ...filters,
      location,
    });
    // عند تغيير الموقع يدوياً، نقوم بتحديث الموقع في الخريطة
    // الخريطة ستتحرك تلقائياً بفضل مكون MapController الذي أضفناه

    // تحديث الشوارع والمساجد والمستشفيات عند تغيير الموقع
    // دالة لجلب البيانات من Overpass API
    const fetchDataFromOverpass = async (lat, lng, radius) => {
      try {
        // إظهار مؤشر التحميل
        setIsStreetsLoading(true);

        // استعلام Overpass API للحصول على الشوارع والمستشفيات والمساجد
        const query = `
          [out:json];
          (
            way["highway"]["name"](around:${radius * 1000},${lat},${lng});
            node["amenity"="hospital"](around:${radius * 1000},${lat},${lng});
            node["amenity"="clinic"](around:${radius * 1000},${lat},${lng});
            node["amenity"="doctors"](around:${radius * 1000},${lat},${lng});
            node["amenity"="mosque"](around:${radius * 1000},${lat},${lng});
            node["building"="mosque"](around:${radius * 1000},${lat},${lng});
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

          if (el.type === "way" && el.tags.highway) {
            streets.push(name);
          } else if (
            el.type === "node" &&
            (el.tags.amenity === "hospital" ||
              el.tags.amenity === "clinic" ||
              el.tags.amenity === "doctors")
          ) {
            hospitals.push(name);
          } else if (
            el.type === "node" &&
            (el.tags.amenity === "mosque" || el.tags.building === "mosque")
          ) {
            mosques.push(name);
          }
        });

        // إزالة التكرارات
        return {
          streets: [...new Set(streets)],
          hospitals: [...new Set(hospitals)],
          mosques: [...new Set(mosques)],
        };
      } catch (error) {
        console.error("Error fetching data:", error);
        return { streets: [], hospitals: [], mosques: [] };
      }
    };

    // استدعاء الدالة لجلب البيانات
    fetchDataFromOverpass(location.lat, location.lng, filters.radius)
      .then((data) => {
        // تأخير لمدة ثانية لإظهار مؤشر التحميل
        setTimeout(() => {
          // تحديث الشوارع
          setStreets(data.streets || []);
          setRemovedStreets([]);

          // تحديث المساجد
          setMosques(data.mosques || []);
          setRemovedMosques([]);

          // تحديث المستشفيات
          setHospitals(data.hospitals || []);
          setRemovedHospitals([]);

          // إخفاء مؤشر التحميل
          setIsStreetsLoading(false);
        }, 1000);
      })
      .catch((error) => {
        console.error("خطأ في جلب البيانات:", error);
        // إخفاء مؤشر التحميل في حالة حدوث خطأ
        setTimeout(() => {
          setIsStreetsLoading(false);
        }, 1000);
      });
  };

  const handleRadiusChange = (radius) => {
    // Puede recibir el valor directamente o desde un evento
    const newRadius =
      typeof radius === "object" ? parseFloat(radius.target.value) : radius;

    // تحديث الفلاتر مع نطاق العمل الجديد
    const updatedFilters = {
      ...filters,
      radius: newRadius,
    };

    setFilters(updatedFilters);

    // تطبيق الفلتر مباشرة لتحديث الخريطة المتقدمة
    filterCraftsmen(updatedFilters);

    // تحديث الخريطة في MapBox إذا كانت متاحة
    if (mapBoxRef.current) {
      mapBoxRef.current.updateRadius(newRadius);
    }

    // تحديث الشوارع والمساجد والمستشفيات عند تغيير نطاق العمل
    // استدعاء دالة handleStreetsChange مع isPinMoved = true لتحديث البيانات
    handleStreetsChange(null, [], true);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    // تنفيذ البحث الذكي أولاً إذا كان هناك نص بحث
    if (searchQuery.trim()) {
      // تحليل الاستعلام باستخدام اللغة الطبيعية
      const criteria = analyzeQuery(searchQuery);

      // طباعة معايير البحث للتصحيح
      console.log("معايير البحث المستخرجة:", criteria);

      // بناء معايير البحث الجديدة بناءً على نتائج التحليل
      let updatedProfessions = [...filters.professions];

      // إذا تم العثور على مهنة في البحث، أضفها إلى مصفوفة المهن
      if (criteria.profession && !updatedProfessions.includes(criteria.profession)) {
        updatedProfessions.push(criteria.profession);
      }

      const searchFilters = {
        ...filters,
        // تحديث المهنة إذا وجدت (للتوافق مع الكود القديم)
        profession: criteria.profession || filters.profession,

        // تحديث مصفوفة المهن
        professions: updatedProfessions,

        // تحديث التقييم إذا وجد
        rating: criteria.rating > 0 ? criteria.rating : filters.rating,

        // تحديث الموقع إذا وجد
        location: criteria.location || filters.location,
        // إذا تم تحديد موقع جديد، سيتم تحريك الخريطة تلقائياً إليه بفضل مكون MapController

        // تحديث نطاق البحث إذا وجد
        radius: criteria.radius || filters.radius,
      };

      // طباعة الفلاتر المحدثة للتصحيح
      console.log("الفلاتر المحدثة:", searchFilters);

      // تحديث الفلاتر
      setFilters(searchFilters);

      // تحديث المهن المحددة في واجهة المستخدم
      if (criteria.profession && !selectedProfessions.includes(criteria.profession)) {
        setSelectedProfessions([...selectedProfessions, criteria.profession]);
      }

      // إذا تم العثور على شارع أو حي، أضفه إلى قائمة الشوارع
      if (criteria.street && !streets.includes(criteria.street)) {
        setStreets((prev) => [...prev, criteria.street]);
      }

      // تنفيذ البحث باستخدام المعايير الجديدة
      filterCraftsmen(searchFilters);
      setShowSuggestions(false);

      // عرض التغذية الراجعة فقط إذا تم العثور على معلومات مفيدة
      const hasUsefulInfo =
        criteria.profession ||
        criteria.city ||
        criteria.street ||
        criteria.rating > 0 ||
        criteria.radius;

      if (hasUsefulInfo) {
        // حفظ معايير البحث لعرضها للمستخدم
        setSearchCriteria(criteria);
        setShowFeedback(true);

        // للتسجيل في وحدة التحكم
        let message = "تم البحث عن: ";
        if (criteria.profession)
          message += `\n- المهنة: ${criteria.profession}`;
        if (criteria.city) message += `\n- المدينة: ${criteria.city}`;
        if (criteria.street) message += `\n- المنطقة: ${criteria.street}`;
        if (criteria.hospital) message += `\n- المشفى: ${criteria.hospital}`;
        if (criteria.mosque) message += `\n- الجامع: ${criteria.mosque}`;
        if (criteria.rating > 0)
          message += `\n- التقييم: ${criteria.rating} نجوم`;
        if (criteria.radius) message += `\n- نطاق البحث: ${criteria.radius} كم`;

        console.log(message);
      }
    } else {
      // البحث باستخدام الفلاتر فقط
      console.log("تطبيق البحث بالفلاتر فقط:", filters);
      filterCraftsmen(filters);
    }
  };

  const handleResetFilters = () => {
    console.log("إعادة ضبط جميع الفلاتر");

    const resetFilters = {
      profession: "",
      professions: [], // إعادة تعيين مصفوفة المهن
      available: true,
      rating: 0,
      location: user?.location || { lng: 36.2765, lat: 33.5138 },
      radius: 1,
    };

    setFilters(resetFilters);
    setSelectedProfessions([]); // إعادة تعيين المهن المحددة
    setSelectedCategory(null); // إعادة تعيين التصنيف المحدد
    setSearchQuery("");
    setSelectedRating(0); // إعادة تعيين التقييم المحدد

    // إعادة تعيين الشوارع والمستشفيات والمساجد
    setStreets([]);
    setRemovedStreets([]);
    setHospitals([]);
    setRemovedHospitals([]);
    setMosques([]);
    setRemovedMosques([]);

    // إعادة تعيين حالة عرض المزيد
    setShowAllStreets(false);
    setShowAllHospitals(false);
    setShowAllMosques(false);

    setSuggestions([]);
    setShowFeedback(false);
    setSearchCriteria(null);

    // تطبيق الفلتر مباشرة
    console.log("تطبيق الفلتر بعد إعادة الضبط");
    filterCraftsmen(resetFilters);

    // لا نقوم بتغيير وضع العرض هنا
    // تم إزالة: setViewMode("list");
  };

  // إضافة حالة لمؤشر التحميل
  const [isStreetsLoading, setIsStreetsLoading] = useState(false);

  // دالة لتحديث الشوارع والمساجد والمستشفيات ضمن نطاق العمل
  const handleStreetsChange = (
    newData,
    removedStreetsList,
    isPinMoved = false
  ) => {
    // إذا كان isPinMoved صحيحًا، فهذا يعني أن المستخدم قام بتحريك الدبوس أو تغيير نطاق العمل
    if (isPinMoved) {
      // إظهار مؤشر التحميل
      setIsStreetsLoading(true);

      // دالة لجلب البيانات من Overpass API
      const fetchDataFromOverpass = async (lat, lng, radius) => {
        try {
          // استعلام Overpass API للحصول على الشوارع والمستشفيات والمساجد
          const query = `
            [out:json];
            (
              way["highway"]["name"](around:${radius * 1000},${lat},${lng});
              node["amenity"="hospital"](around:${radius * 1000},${lat},${lng});
              node["amenity"="clinic"](around:${radius * 1000},${lat},${lng});
              node["amenity"="doctors"](around:${radius * 1000},${lat},${lng});
              node["amenity"="mosque"](around:${radius * 1000},${lat},${lng});
              node["building"="mosque"](around:${radius * 1000},${lat},${lng});
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

            if (el.type === "way" && el.tags.highway) {
              streets.push(name);
            } else if (
              el.type === "node" &&
              (el.tags.amenity === "hospital" ||
                el.tags.amenity === "clinic" ||
                el.tags.amenity === "doctors")
            ) {
              hospitals.push(name);
            } else if (
              el.type === "node" &&
              (el.tags.amenity === "mosque" || el.tags.building === "mosque")
            ) {
              mosques.push(name);
            }
          });

          // إزالة التكرارات
          return {
            streets: [...new Set(streets)],
            hospitals: [...new Set(hospitals)],
            mosques: [...new Set(mosques)],
          };
        } catch (error) {
          console.error("Error fetching data:", error);
          return { streets: [], hospitals: [], mosques: [] };
        }
      };

      // استدعاء الدالة لجلب البيانات
      fetchDataFromOverpass(
        filters.location.lat,
        filters.location.lng,
        filters.radius
      )
        .then((data) => {
          // تأخير لمدة ثانية لإظهار مؤشر التحميل
          setTimeout(() => {
            // تحديث الشوارع
            setStreets(data.streets || []);
            setRemovedStreets(removedStreetsList || []);

            // تحديث المساجد
            setMosques(data.mosques || []);
            setRemovedMosques([]);

            // تحديث المستشفيات
            setHospitals(data.hospitals || []);
            setRemovedHospitals([]);

            // إخفاء مؤشر التحميل
            setIsStreetsLoading(false);
          }, 1000);
        })
        .catch((error) => {
          console.error("خطأ في جلب البيانات:", error);
          // إخفاء مؤشر التحميل في حالة حدوث خطأ
          setTimeout(() => {
            setIsStreetsLoading(false);
          }, 1000);
        });
    } else {
      // تحديث البيانات مباشرة بدون مؤشر تحميل
      if (newData && typeof newData === "object" && newData.streets) {
        // تحديث الشوارع والمستشفيات والمساجد
        setStreets(newData.streets || []);
        setHospitals(newData.hospitals || []);
        setMosques(newData.mosques || []);
      } else {
        // إذا كانت البيانات عبارة عن مصفوفة، فهي شوارع فقط
        setStreets(Array.isArray(newData) ? newData : []);
      }

      setRemovedStreets(removedStreetsList || []);
    }
  };

  // دوال إزالة العناصر
  const handleRemoveStreet = (street) => {
    setRemovedStreets((prev) => [...prev, street]);
  };

  const handleRemoveHospital = (hospital) => {
    setRemovedHospitals((prev) => [...prev, hospital]);
  };

  const handleRemoveMosque = (mosque) => {
    setRemovedMosques((prev) => [...prev, mosque]);
  };

  // دوال التعامل مع الفلتر المتقدم
  const handleProfessionChange = (professions) => {
    setSelectedProfessions(professions);

    // تحديث الفلاتر بناءً على المهن المحددة
    const updatedFilters = {
      ...filters,
      professions: professions,
    };

    setFilters(updatedFilters);

    // تطبيق الفلتر مباشرة
    filterCraftsmen(updatedFilters);
  };

  // دالة لتبديل حالة اختيار المهنة (إضافة/إزالة)
  const handleProfessionToggle = (profession) => {
    console.log("تم النقر على المهنة:", profession);

    let updatedProfessions;
    if (selectedProfessions.includes(profession)) {
      // إزالة المهنة إذا كانت موجودة بالفعل
      console.log("إزالة المهنة:", profession);
      updatedProfessions = selectedProfessions.filter((p) => p !== profession);
    } else {
      // إضافة المهنة إذا لم تكن موجودة
      console.log("إضافة المهنة:", profession);
      updatedProfessions = [...selectedProfessions, profession];
    }

    // تحديث حالة المهن المحددة
    setSelectedProfessions(updatedProfessions);

    // تحديث الفلاتر
    const updatedFilters = {
      ...filters,
      professions: updatedProfessions,
    };

    console.log("الفلاتر المحدثة:", updatedFilters);
    setFilters(updatedFilters);

    // طباعة المهن المحددة للتصحيح
    console.log("المهن المحددة بعد التحديث:", updatedProfessions);

    // تطبيق الفلتر مباشرة
    console.log("تطبيق الفلتر مع المهن:", updatedProfessions);
    filterCraftsmen(updatedFilters);

    // تغيير وضع العرض إلى القائمة بعد تطبيق الفلتر
    setViewMode("list");
  };

  // دالة لمسح جميع المهن المحددة
  const handleClearProfessions = () => {
    console.log("مسح جميع المهن المحددة");

    setSelectedProfessions([]);
    setSelectedCategory(null); // إعادة تعيين التصنيف المحدد أيضًا

    // تحديث الفلاتر
    const updatedFilters = {
      ...filters,
      professions: [],
    };

    console.log("الفلاتر بعد المسح:", updatedFilters);
    setFilters(updatedFilters);

    // تطبيق الفلتر مباشرة
    console.log("تطبيق الفلتر بعد مسح المهن");
    filterCraftsmen(updatedFilters);

    // لا نقوم بتغيير وضع العرض هنا
    // تم إزالة: setViewMode("list");
  };

  const handleRatingChange = (rating) => {
    // تحديث قيمة التقييم المحددة
    setSelectedRating(rating);

    // تحديث فلتر التقييم في الفلاتر الرئيسية
    const updatedFilters = {
      ...filters,
      rating: rating,
    };

    setFilters(updatedFilters);

    // تطبيق الفلتر مباشرة
    filterCraftsmen(updatedFilters);

    console.log("تم تحديث التقييم إلى:", rating);
  };

  // Filter craftsmen by search query (name or profession)
  const searchFilteredCraftsmen = searchQuery
    ? filteredCraftsmen.filter(
        (craftsman) => {
          // تحقق من الاسم
          if (craftsman.name && craftsman.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            return true;
          }

          // تحقق من المهنة الرئيسية
          if (craftsman.profession && craftsman.profession.toLowerCase().includes(searchQuery.toLowerCase())) {
            return true;
          }

          // تحقق من التخصص
          if (craftsman.specialization && craftsman.specialization.toLowerCase().includes(searchQuery.toLowerCase())) {
            return true;
          }

          // تحقق من مصفوفة المهن إذا كانت موجودة
          if (craftsman.professions && Array.isArray(craftsman.professions)) {
            // تحقق مما إذا كانت أي من المهن تحتوي على نص البحث
            const hasProfessionMatch = craftsman.professions.some(profession => {
              if (typeof profession === 'string') {
                return profession.toLowerCase().includes(searchQuery.toLowerCase());
              } else if (profession && profession.name) {
                return profession.name.toLowerCase().includes(searchQuery.toLowerCase());
              }
              return false;
            });

            if (hasProfessionMatch) {
              return true;
            }
          }

          // تحقق من مصفوفة التخصصات إذا كانت موجودة
          if (craftsman.specializations && Array.isArray(craftsman.specializations)) {
            const hasSpecializationMatch = craftsman.specializations.some(spec => {
              if (typeof spec === 'string') {
                return spec.toLowerCase().includes(searchQuery.toLowerCase());
              } else if (spec && spec.name) {
                return spec.name.toLowerCase().includes(searchQuery.toLowerCase());
              }
              return false;
            });

            if (hasSpecializationMatch) {
              return true;
            }
          }

          return false;
        }
      )
    : filteredCraftsmen;

  // استخدام المستخدم المحدث من المتجر
  const currentUser = useUserStore((state) => state.user);

  return (
    <Layout user={currentUser} onLogout={logout}>
      <div
        className={`min-h-screen ${
          darkMode
            ? "bg-gray-900"
            : "bg-gradient-to-br from-blue-50 to-indigo-100"
        } transition-colors duration-300`}
      >
        {/* Search Header */}
        <section
          className={`${
            darkMode
              ? "bg-gradient-to-r from-gray-800 to-gray-700"
              : "bg-gradient-to-r from-blue-700 to-indigo-800"
          } text-white py-8 shadow-lg transition-colors duration-300`}
        >
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold mb-4 relative inline-block">
              <span className="relative z-10">البحث عن حرفي</span>
              <span className="absolute bottom-0 left-0 right-0 h-2 bg-indigo-500 opacity-30 transform -rotate-1 z-0"></span>
            </h1>
            <div className="relative">
              <div className="flex">
                <div className="relative flex-grow">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (e.target.value.length >= 3) {
                        const newSuggestions = suggestQueries(e.target.value);
                        setSuggestions(newSuggestions);
                        setShowSuggestions(newSuggestions.length > 0);
                      } else {
                        setShowSuggestions(false);
                      }
                    }}
                    onKeyDown={(e) => {
                      // Activar la búsqueda al presionar Enter
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearch(e);
                      }
                    }}
                    onFocus={() => {
                      if (searchQuery.length >= 3) {
                        const newSuggestions = suggestQueries(searchQuery);
                        setSuggestions(newSuggestions);
                        setShowSuggestions(newSuggestions.length > 0);
                      }
                    }}
                    onBlur={() => {
                      // تأخير إخفاء الاقتراحات للسماح بالنقر عليها
                      setTimeout(() => setShowSuggestions(false), 200);
                    }}
                    placeholder="ابحث بلغتك  الطبيعية مثل: أريد سباك لإصلاح تسرب في المنزل بالقرب من مشفى المجتهد تقيمه ممتاز على بعد 2 كم..."
                    className={`w-full py-3 px-4 pr-12 rounded-r-none rounded-l-md ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-indigo-200 text-black"
                    } focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 shadow-sm transition-colors duration-300`}
                  />
                  <Search
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-500"
                    size={20}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSearch}
                  className={`px-4 py-3 mr-2 rounded-l-md rounded-r-none flex items-center justify-center ${
                    darkMode
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-indigo-500 text-white hover:bg-indigo-600"
                  } transition-all duration-200 hover:scale-105 transform relative overflow-hidden group shadow-md hover:shadow-lg`}
                >
                  <span className="relative z-10 flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m21 21-6.05-6.05M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                    </svg>
                    <span>بحث</span>
                  </span>
                  <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                </button>
              </div>
              {/* عرض التغذية الراجعة عن نتائج تحليل البحث */}
              {showFeedback && searchCriteria && (
                <SearchFeedback
                  criteria={searchCriteria}
                  onClose={() => setShowFeedback(false)}
                />
              )}

              {showSuggestions && (
                <div className="relative ">
                  <SearchSuggestions
                    suggestions={suggestions}
                    onSelectSuggestion={(suggestion) => {
                      setSearchQuery(suggestion);
                      setShowSuggestions(false);
                      // تنفيذ البحث تلقائياً عند اختيار اقتراح
                      const criteria = analyzeQuery(suggestion);
                      const searchFilters = {
                        ...filters,
                        profession: criteria.profession || filters.profession,
                        // إذا تم العثور على مهنة في البحث، أضفها إلى مصفوفة المهن
                        professions: criteria.profession
                          ? [
                              ...filters.professions.filter(
                                (p) => p !== criteria.profession
                              ),
                              criteria.profession,
                            ]
                          : filters.professions,
                        rating:
                          criteria.rating > 0
                            ? criteria.rating
                            : filters.rating,
                        location: criteria.location || filters.location,
                        // إذا تم تحديد موقع جديد، سيتم تحريك الخريطة تلقائياً إليه بفضل مكون MapController
                        radius: criteria.radius || filters.radius,
                      };

                      // تحديث الفلاتر
                      setFilters(searchFilters);

                      // إذا تم العثور على شارع أو حي، أضفه إلى قائمة الشوارع
                      if (
                        criteria.street &&
                        !streets.includes(criteria.street)
                      ) {
                        setStreets((prev) => [...prev, criteria.street]);
                      }

                      // تنفيذ البحث
                      filterCraftsmen(searchFilters);

                      // عرض التغذية الراجعة
                      setSearchCriteria(criteria);
                      setShowFeedback(true);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* تنويه للمستخدمين غير المسجلين */}
        {!user && (
          <div className="login-notice">
            <div className="login-notice-icon">
              <Lock size={22} />
            </div>
            <div className="login-notice-content">
              <div className="login-notice-title">
                تنبيه: وصول محدود للمعلومات
              </div>
              <div className="login-notice-text">
                لا يمكنك الوصول إلى معلومات الحرفيين أو مشاهدة مواقعهم وأرقام
                هواتفهم بدون تسجيل الدخول. قم بتسجيل الدخول الآن للاستفادة من
                جميع مميزات المنصة والوصول الكامل لبيانات الحرفيين.
              </div>
              <Link to="/login" className="login-notice-button">
                تسجيل الدخول
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
              </Link>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters Sidebar */}
            <div
              className={`md:w-1/3 ${
                showFilters ? "block" : "hidden md:block"
              }`}
            >
              <Card
                className={`sticky top-4 p-4 overflow-hidden ${
                  darkMode
                    ? "bg-gray-800 text-gray-200"
                    : "bg-gradient-to-br from-blue-50 to-indigo-100"
                } shadow-lg transition-colors duration-300`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2
                    className={`text-xl font-bold ${
                      darkMode ? "text-indigo-300" : "text-indigo-800"
                    } relative inline-block transition-colors duration-300`}
                  >
                    <span className="relative z-10">الفلاتر</span>
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-2 ${
                        darkMode ? "bg-indigo-500" : "bg-indigo-300"
                      } opacity-40 transform -rotate-1 z-0`}
                    ></span>
                  </h2>
                  <button
                    onClick={handleResetFilters}
                    className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors duration-200 text-sm"
                  >
                    إعادة ضبط
                  </button>
                </div>

                <form
                  onSubmit={handleSearch}
                  onKeyDown={(e) => {
                    // Evitar que el formulario se envíe al presionar Enter en los campos individuales
                    // ya que queremos manejar esto en el campo de búsqueda principal
                    if (e.key === "Enter" && e.target.tagName !== "FORM") {
                      e.preventDefault();
                      handleSearch(e);
                    }
                  }}
                >
                  <div className="mb-4">
                    <label
                      className={`block ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      } font-medium mb-2 transition-colors duration-300`}
                    >
                      المهنة
                    </label>

                    {/* تصنيفات المهن */}
                    <div className="mb-3">
                      <h3 className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        اختر التصنيف:
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {professionCategories.map((category) => (
                          <div
                            key={category.id}
                            onClick={() => {
                              // تحديد التصنيف المحدد
                              setSelectedCategory(
                                selectedCategory === category.id ? null : category.id
                              );
                            }}
                            className={`cursor-pointer px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                              selectedCategory === category.id
                                ? darkMode
                                  ? "bg-indigo-700 text-white"
                                  : "bg-indigo-500 text-white"
                                : darkMode
                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {category.name}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* المهن ضمن التصنيف المحدد */}
                    {selectedCategory && (
                      <div className="mt-2">
                        <h3 className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          اختر المهنة:
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {professionCategories
                            .find(cat => cat.id === selectedCategory)
                            ?.professions.map((profession) => (
                              <div
                                key={profession.id}
                                onClick={() => handleProfessionToggle(profession.name)}
                                className={`cursor-pointer px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                                  selectedProfessions.includes(profession.name)
                                    ? darkMode
                                      ? "bg-indigo-700 text-white"
                                      : "bg-indigo-500 text-white"
                                    : darkMode
                                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                {profession.name}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* عرض المهن المحددة */}
                    {selectedProfessions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <h3 className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          المهن المحددة:
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProfessions.map((profName, index) => (
                            <div
                              key={index}
                              className={`flex items-center px-3 py-2 rounded-md text-sm ${
                                darkMode
                                  ? "bg-indigo-700 text-white"
                                  : "bg-indigo-500 text-white"
                              }`}
                            >
                              <span>{profName}</span>
                              <button
                                onClick={() => {
                                  // إزالة المهنة من القائمة المحددة
                                  setSelectedProfessions(
                                    selectedProfessions.filter(p => p !== profName)
                                  );
                                  // تحديث الفلاتر
                                  setFilters(prev => ({
                                    ...prev,
                                    professions: prev.professions.filter(p => p !== profName)
                                  }));
                                }}
                                className="mr-2 text-white hover:text-red-200 focus:outline-none"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <div
                            onClick={() => handleClearProfessions()}
                            className={`cursor-pointer px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                              darkMode
                                ? "bg-red-700 text-white hover:bg-red-800"
                                : "bg-red-500 text-white hover:bg-red-600"
                            }`}
                          >
                            مسح الكل
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label
                      className={`block ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      } font-medium mb-2 transition-colors duration-300`}
                    >
                      التقييم
                    </label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        name="rating"
                        min="0"
                        max="5"
                        step="0.5"
                        value={filters.rating}
                        onChange={handleFilterChange}
                        className="w-full accent-indigo-500"
                      />
                      <span className="mr-2 min-w-[30px]">
                        {filters.rating}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="available"
                        checked={filters.available}
                        onChange={handleFilterChange}
                        className="ml-2"
                      />
                      <span>الحرفيون المتاحون في الوقت الحالي</span>
                    </label>
                  </div>

                  <div className="mb-4">
                    <label
                      className={`block ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      } font-medium mb-2 transition-colors duration-300`}
                    >
                      الموقع ونطاق البحث
                    </label>
                    <div className="mb-2">
                      <MapBox
                        ref={mapBoxRef}
                        initialCenter={filters.location}
                        radius={filters.radius}
                        height="200px"
                        onLocationSelect={handleLocationSelect}
                        onRadiusChange={(radius) => handleRadiusChange(radius)}
                        onStreetsChange={handleStreetsChange}
                        showRadius={true}
                      />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        } transition-colors duration-300`}
                      >
                        نطاق العمل:{" "}
                        <span className="font-bold text-indigo-600">
                          {filters.radius} كم
                        </span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.5"
                      value={filters.radius}
                      onChange={handleRadiusChange}
                      className="w-full accent-indigo-500 mb-2"
                    />
                  </div>

                  {/* قسم الشوارع - مع ارتفاع ثابت */}
                  <div className="mb-4 h-[180px]">
                    <div className="mb-2">
                      <h3
                        className={`text-base font-bold ${
                          darkMode ? "text-indigo-300" : "text-indigo-800"
                        } relative inline-block transition-colors duration-300`}
                      >
                        <span className="relative z-10">
                          الشوارع ضمن نطاق العمل:
                        </span>
                        <span
                          className={`absolute bottom-0 left-0 right-0 h-1 ${
                            darkMode ? "bg-indigo-500" : "bg-indigo-300"
                          } opacity-40 transform -rotate-1 z-0`}
                        ></span>
                      </h3>
                      <div
                        className={`mt-1 text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        } flex items-center`}
                      >
                        إذا لم تظهر الشوارع، انتظر حتى يتم تحميلها. قد يتطلب ذلك
                        بضع ثوانٍ، حسب سرعة الاتصال.
                      </div>
                    </div>

                    {isStreetsLoading ? (
                      // مؤشر التحميل
                      <div className="h-[120px] flex flex-col items-center justify-center">
                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          جاري تحميل الشوارع...
                        </p>
                      </div>
                    ) : streets.length > 0 ? (
                      <div className="h-[120px] flex flex-col">
                        <div className="flex-1 flex flex-wrap gap-2 overflow-y-auto p-1">
                          {streets
                            .filter(
                              (street) => !removedStreets.includes(street)
                            )
                            .slice(0, showAllStreets ? 25 : 10)
                            .map((street, index) => (
                              <div
                                key={`street-${index}`}
                                className={`flex items-center ${
                                  darkMode
                                    ? "bg-gray-700 border-gray-600 text-gray-200"
                                    : "bg-blue-50 border-blue-200"
                                } rounded-full px-3 py-1 shadow-sm transition-colors duration-300`}
                              >
                                <span className="mr-1">{street}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveStreet(street)}
                                  className="ml-2 text-red-500 hover:text-red-700 focus:outline-none transition-colors duration-200"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                        </div>
                        {streets.filter(
                          (street) => !removedStreets.includes(street)
                        ).length > 10 && (
                          <div className="mt-2 text-center">
                            <button
                              type="button"
                              onClick={() => setShowAllStreets(!showAllStreets)}
                              className="text-indigo-600 hover:text-indigo-800 focus:outline-none transition-colors duration-200"
                            >
                              {showAllStreets ? "عرض أقل" : "عرض المزيد"}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-[120px] flex items-center justify-center text-gray-500 italic">
                        لا توجد شوارع ضمن نطاق البحث الحالي
                      </div>
                    )}
                  </div>

                  {/* قسم المستشفيات - مع ارتفاع ثابت */}
                  <div className="mb-4 h-[180px]">
                    <div className="mb-2">
                      <h3
                        className={`text-base font-bold ${
                          darkMode ? "text-indigo-300" : "text-indigo-800"
                        } relative inline-block transition-colors duration-300`}
                      >
                        <span className="relative z-10">
                          المستشفيات والعيادات ضمن نطاق العمل:
                        </span>
                        <span
                          className={`absolute bottom-0 left-0 right-0 h-1 ${
                            darkMode ? "bg-indigo-500" : "bg-indigo-300"
                          } opacity-40 transform -rotate-1 z-0`}
                        ></span>
                      </h3>
                    </div>

                    {isStreetsLoading ? (
                      // مؤشر التحميل
                      <div className="h-[120px] flex flex-col items-center justify-center">
                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          جاري تحميل المستشفيات والعيادات...
                        </p>
                      </div>
                    ) : hospitals.length > 0 ? (
                      <div className="h-[120px] flex flex-col">
                        <div className="flex-1 flex flex-wrap gap-2 overflow-y-auto p-1">
                          {hospitals
                            .filter(
                              (hospital) => !removedHospitals.includes(hospital)
                            )
                            .slice(0, showAllHospitals ? 25 : 10)
                            .map((hospital, index) => (
                              <div
                                key={`hospital-${index}`}
                                className={`flex items-center ${
                                  darkMode
                                    ? "bg-gray-700 border-gray-600 text-gray-200"
                                    : "bg-red-50 border-red-200"
                                } rounded-full px-3 py-1 shadow-sm transition-colors duration-300`}
                              >
                                <span className="mr-1">{hospital}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveHospital(hospital)}
                                  className="ml-2 text-red-500 hover:text-red-700 focus:outline-none transition-colors duration-200"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                        </div>
                        {hospitals.filter(
                          (hospital) => !removedHospitals.includes(hospital)
                        ).length > 10 && (
                          <div className="mt-2 text-center">
                            <button
                              type="button"
                              onClick={() =>
                                setShowAllHospitals(!showAllHospitals)
                              }
                              className="text-indigo-600 hover:text-indigo-800 focus:outline-none transition-colors duration-200"
                            >
                              {showAllHospitals ? "عرض أقل" : "عرض المزيد"}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-[120px] flex items-center justify-center text-gray-500 italic">
                        لا توجد مستشفيات ضمن نطاق البحث الحالي
                      </div>
                    )}
                  </div>

                  {/* قسم المساجد - مع ارتفاع ثابت */}
                  <div className="mb-4 h-[180px]">
                    <div className="mb-2">
                      <h3
                        className={`text-base font-bold ${
                          darkMode ? "text-indigo-300" : "text-indigo-800"
                        } relative inline-block transition-colors duration-300`}
                      >
                        <span className="relative z-10">
                          المساجد ضمن نطاق العمل:
                        </span>
                        <span
                          className={`absolute bottom-0 left-0 right-0 h-1 ${
                            darkMode ? "bg-indigo-500" : "bg-indigo-300"
                          } opacity-40 transform -rotate-1 z-0`}
                        ></span>
                      </h3>
                    </div>

                    {isStreetsLoading ? (
                      // مؤشر التحميل
                      <div className="h-[120px] flex flex-col items-center justify-center">
                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          جاري تحميل المساجد...
                        </p>
                      </div>
                    ) : mosques.length > 0 ? (
                      <div className="h-[120px] flex flex-col">
                        <div className="flex-1 flex flex-wrap gap-2 overflow-y-auto p-1">
                          {mosques
                            .filter(
                              (mosque) => !removedMosques.includes(mosque)
                            )
                            .slice(0, showAllMosques ? 25 : 10)
                            .map((mosque, index) => (
                              <div
                                key={`mosque-${index}`}
                                className={`flex items-center ${
                                  darkMode
                                    ? "bg-gray-700 border-gray-600 text-gray-200"
                                    : "bg-green-50 border-green-200"
                                } rounded-full px-3 py-1 shadow-sm transition-colors duration-300`}
                              >
                                <span className="mr-1">{mosque}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMosque(mosque)}
                                  className="ml-2 text-red-500 hover:text-red-700 focus:outline-none transition-colors duration-200"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                        </div>
                        {mosques.filter(
                          (mosque) => !removedMosques.includes(mosque)
                        ).length > 10 && (
                          <div className="mt-2 text-center">
                            <button
                              type="button"
                              onClick={() => setShowAllMosques(!showAllMosques)}
                              className="text-indigo-600 hover:text-indigo-800 focus:outline-none transition-colors duration-200"
                            >
                              {showAllMosques ? "عرض أقل" : "عرض المزيد"}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-[120px] flex items-center justify-center text-gray-500 italic">
                        لا توجد مساجد ضمن نطاق البحث الحالي
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    onClick={(e) => {
                      // تنفيذ البحث أولاً
                      handleSearch(e);
                      // ثم تغيير وضع العرض إلى القائمة
                      setViewMode("list");
                    }}
                    className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200  relative overflow-hidden group py-3 px-4 ${
                      darkMode
                        ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                        : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Filter size={18} className="ml-1" />
                      تطبيق الفلاتر وعرض القائمة
                    </span>
                    <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  </Button>
                </form>
              </Card>
            </div>

            {/* Results */}
            <div className="md:w-2/3">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden flex items-center text-gray-700 ml-4"
                  >
                    <Filter size={20} className="ml-1" />
                    <span>الفلاتر</span>
                  </button>
                  <span className="text-gray-600">
                    {searchFilteredCraftsmen.length} نتيجة
                  </span>
                </div>

                <div className="flex items-center">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-l-md ${
                      viewMode === "list"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm"
                        : "bg-gray-200 text-gray-700"
                    } transition-all duration-200`}
                  >
                    <List size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode("map")}
                    className={`p-2 rounded-r-md ${
                      viewMode === "map"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm"
                        : "bg-gray-200 text-gray-700"
                    } transition-all duration-200`}
                  >
                    <MapIcon size={20} />
                  </button>
                </div>
              </div>

              {viewMode === "list" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchFilteredCraftsmen.length > 0 ? (
                    searchFilteredCraftsmen.map((craftsman) => (
                      <motion.div
                        key={craftsman.id}
                        whileHover={{ y: -5 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card
                          className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${
                            darkMode
                              ? "bg-gray-800 text-gray-200"
                              : "bg-gradient-to-br from-blue-50 to-indigo-100"
                          } shadow-md`}
                        >
                          <div className="flex">
                            {/* Imagen del artesano con borde y sombra */}
                            <div className="w-1/3 relative">
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-30"></div>
                              <img
                                src={craftsman.image}
                                alt={craftsman.name}
                                className="w-full h-full object-cover"
                              />
                              {/* Indicador de disponibilidad */}
                              <div className="absolute top-2 right-2">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium shadow-sm ${
                                    craftsman.available
                                      ? "bg-green-500 text-white"
                                      : "bg-red-500 text-white"
                                  }`}
                                >
                                  {craftsman.available ? "متاح" : "غير متاح"}
                                </span>
                              </div>
                            </div>

                            {/* Información del artesano */}
                            <div className="w-2/3 p-4 flex flex-col rounded-r-lg">
                              <div className="flex-1">
                                {/* Nombre y profesión */}
                                <h3
                                  className={`font-bold text-lg ${
                                    darkMode
                                      ? "text-indigo-300"
                                      : "text-indigo-800"
                                  } mb-1 transition-colors duration-300`}
                                >
                                  {craftsman.name}
                                </h3>
                                <div
                                  className={`${
                                    darkMode ? "text-gray-400" : "text-gray-600"
                                  } mb-3 transition-colors duration-300`}
                                >
                                  {craftsman.professions &&
                                  craftsman.specializations ? (
                                    <div className="space-y-1">
                                      {craftsman.professions.map(
                                        (profession, index) => {
                                          // Encontrar las especializaciones relacionadas con esta profesión
                                          const relatedSpecializations = [];

                                          // Buscar en los datos de profesiones para encontrar las especializaciones relacionadas
                                          const professionsData = [
                                            {
                                              id: 1,
                                              name: "كهربائي",
                                              specializations: [
                                                "تمديدات منزلية",
                                                "صيانة كهربائية",
                                                "تركيب أنظمة إنارة",
                                              ],
                                            },
                                            {
                                              id: 2,
                                              name: "سباك",
                                              specializations: [
                                                "تمديدات صحية",
                                                "صيانة وتركيب",
                                                "معالجة تسربات",
                                              ],
                                            },
                                            {
                                              id: 3,
                                              name: "نجار",
                                              specializations: [
                                                "أثاث منزلي",
                                                "أبواب ونوافذ",
                                                "ديكورات خشبية",
                                              ],
                                            },
                                            {
                                              id: 4,
                                              name: "دهان",
                                              specializations: [
                                                "دهانات داخلية",
                                                "دهانات خارجية",
                                                "دهانات حديثة",
                                              ],
                                            },
                                            {
                                              id: 5,
                                              name: "مصمم ديكور",
                                              specializations: [
                                                "تصميم داخلي",
                                                "تصميم واجهات",
                                                "استشارات ديكور",
                                              ],
                                            },
                                            {
                                              id: 6,
                                              name: "ميكانيكي",
                                              specializations: [
                                                "صيانة سيارات",
                                                "كهرباء سيارات",
                                                "ميكانيك عام",
                                              ],
                                            },
                                            {
                                              id: 7,
                                              name: "حداد",
                                              specializations: [
                                                "أبواب وشبابيك",
                                                "هياكل معدنية",
                                                "أعمال الألمنيوم",
                                              ],
                                            },
                                            {
                                              id: 8,
                                              name: "بناء",
                                              specializations: [
                                                "بناء جدران",
                                                "تبليط",
                                                "أعمال إسمنتية",
                                              ],
                                            },
                                          ];

                                          const profData = professionsData.find(
                                            (p) => p.name === profession
                                          );
                                          if (profData) {
                                            // Filtrar las especializaciones del artesano que pertenecen a esta profesión
                                            craftsman.specializations.forEach(
                                              (spec) => {
                                                if (
                                                  profData.specializations.includes(
                                                    spec
                                                  )
                                                ) {
                                                  relatedSpecializations.push(
                                                    spec
                                                  );
                                                }
                                              }
                                            );
                                          }

                                          return (
                                            <div
                                              key={index}
                                              className="flex items-center"
                                            >
                                              <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 ml-2"></span>
                                              <div className="flex flex-col">
                                                <div
                                                  className={`font-medium ${
                                                    darkMode
                                                      ? "text-indigo-300"
                                                      : "text-indigo-700"
                                                  }`}
                                                >
                                                  {profession}
                                                </div>
                                                <div className="mr-4 text-xs">
                                                  {relatedSpecializations.length >
                                                  0
                                                    ? relatedSpecializations.join(
                                                        ", "
                                                      )
                                                    : "تخصصات متعددة"}
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        }
                                      )}
                                    </div>
                                  ) : craftsman.profession ? (
                                    <div className="flex items-center">
                                      <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 ml-2"></span>
                                      <div className="flex flex-col">
                                        <div
                                          className={`font-medium ${
                                            darkMode
                                              ? "text-indigo-300"
                                              : "text-indigo-700"
                                          }`}
                                        >
                                          {craftsman.profession}
                                        </div>
                                        {craftsman.specialization && (
                                          <div className="mr-4 text-xs">
                                            {craftsman.specialization}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ) : null}
                                </div>

                                {/* Calificación */}
                                <div
                                  className={`flex items-center mb-3 ${
                                    darkMode
                                      ? "bg-gray-700 border-gray-600"
                                      : "bg-white border-indigo-200"
                                  } p-2 rounded-md shadow-sm transition-colors duration-300`}
                                >
                                  <div className="flex items-center">
                                    <Star
                                      size={18}
                                      className={`${
                                        darkMode
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-yellow-500 fill-yellow-500"
                                      } transition-colors duration-300`}
                                    />
                                    <span className="mr-1 font-bold">
                                      {craftsman.rating}
                                    </span>
                                  </div>
                                  <span className="mx-2 text-gray-300">|</span>
                                  <div
                                    className={`flex items-center ${
                                      darkMode
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                    } transition-colors duration-300`}
                                  >
                                    <MapPin size={16} />
                                    <span className="mr-1">
                                      نطاق العمل: {craftsman.workRadius} كم
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Botón de acción */}
                              <div className="mt-auto">
                                <Link
                                  to={`/profile/craftsman/${craftsman.id}`}
                                  className="block w-full"
                                >
                                  <Button
                                    variant="primary"
                                    className={`text-sm w-full text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200  relative overflow-hidden group py-2 px-4 ${
                                      darkMode
                                        ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                                        : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                                    }`}
                                  >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                      <span>عرض الملف</span>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <path d="M5 12h14"></path>
                                        <path d="m12 5 7 7-7 7"></path>
                                      </svg>
                                    </span>
                                    <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-2">
                      <Card
                        className={`p-6 text-center ${
                          darkMode
                            ? "bg-gray-800 text-gray-200"
                            : "bg-gradient-to-br from-blue-50 to-indigo-100"
                        } shadow-md transition-colors duration-300`}
                      >
                        <p
                          className={`${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          } mb-4 transition-colors duration-300`}
                        >
                          لم يتم العثور على نتائج
                        </p>
                        <Button
                          variant="secondary"
                          onClick={handleResetFilters}
                          className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200  relative overflow-hidden group py-2 px-4 ${
                            darkMode
                              ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                              : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                          }`}
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            إعادة ضبط الفلاتر
                          </span>
                          <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                        </Button>
                      </Card>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {/* فلتر الخريطة المتقدم */}
                  <div className="flex flex-col gap-2">
                    <MapFilter
                      professions={professions.map((p) => p.name)}
                      selectedProfessions={selectedProfessions}
                      onProfessionChange={handleProfessionChange}
                      selectedRating={selectedRating}
                      onRatingChange={handleRatingChange}
                      searchRadius={filters.radius}
                      onRadiusChange={(radius) => {
                        console.log(
                          "تغيير نطاق العمل من فلتر الخريطة المتقدمة:",
                          radius
                        );
                        handleRadiusChange(radius);
                      }}
                    />
                  </div>

                  {/* الخريطة المتقدمة */}
                  <Card
                    className={`overflow-hidden ${
                      darkMode
                        ? "bg-gray-800 text-gray-200"
                        : "bg-gradient-to-br from-blue-50 to-indigo-100"
                    } shadow-md transition-colors duration-300`}
                  >
                    <div className="h-[600px]">
                      <AdvancedMap
                        craftsmen={filteredCraftsmen}
                        selectedProfessions={selectedProfessions}
                        selectedRating={selectedRating}
                        userLocation={
                          filters.location
                            ? {
                                latitude: filters.location.lat,
                                longitude: filters.location.lng,
                              }
                            : null
                        }
                        searchRadius={filters.radius * 1000} // تحويل من كم إلى متر
                        onCraftsmanSelect={(craftsman, fromButton = false) => {
                          // الانتقال إلى صفحة الحرفي فقط إذا تم النقر على الزر
                          if (fromButton) {
                            window.location.href = `/profile/craftsman/${craftsman.id}`;
                          }
                        }}
                      />
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
