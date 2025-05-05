import React, { useEffect, useState, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { MapContainer, TileLayer, useMap, Marker } from "react-leaflet";
import useThemeStore from "../../store/themeStore";
import { User, Star, Phone, ExternalLink, Lock } from "lucide-react";
import { createRoot } from "react-dom/client";
import { Link } from "react-router-dom";
import ProfessionIcons from "./ProfessionIcons";

// مكون للتحكم في الخريطة
const MapController = ({ onMapReady, userLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (map && onMapReady) {
      onMapReady(map);
    }

    // تعطيل إعادة تعيين الخريطة عند تغيير المركز
    map.on("moveend", () => {
      // لا تفعل شيئًا عند انتهاء التحريك
    });

    // إضافة مستمع لحدث تغيير مستوى التكبير/التصغير
    map.on("zoomend", () => {
      // إعادة رسم الطبقات عند تغيير مستوى التكبير/التصغير
      map.eachLayer((layer) => {
        if (layer instanceof L.Circle) {
          layer.redraw();
        }
      });
    });

    return () => {
      map.off("moveend");
      map.off("zoomend");
    };
  }, [map, onMapReady]);

  // تحريك الخريطة عند تغيير موقع المستخدم
  useEffect(() => {
    if (map && userLocation) {
      console.log("تحريك الخريطة إلى موقع المستخدم:", userLocation);
      map.setView(
        [userLocation.latitude, userLocation.longitude],
        map.getZoom(),
        {
          animate: true,
          duration: 0.5,
        }
      );
    }
  }, [map, userLocation]);

  return null;
};

// مكون للتحكم في دائرة نطاق العمل
const SearchRadiusController = ({ center, radius }) => {
  const map = useMap();
  const circleRef = useRef(null);
  const centerMarkerRef = useRef(null);
  const centerRef = useRef(center); // تخزين مركز الدائرة
  const prevCenterRef = useRef(null); // تخزين المركز السابق للمقارنة

  // إضافة معالج لتغيير مستوى التكبير/التصغير
  useEffect(() => {
    const handleZoomEnd = () => {
      console.log("تم تغيير مستوى التكبير/التصغير في SearchRadiusController");
      // إعادة رسم الدائرة عند تغيير مستوى التكبير/التصغير
      if (circleRef.current) {
        circleRef.current.remove();

        // إعادة إنشاء الدائرة
        const circle = L.circle([center.latitude, center.longitude], {
          radius: radius,
          color: "#4238C8",
          fillColor: "#4238C8",
          fillOpacity: 0.1,
          weight: 2,
        }).addTo(map);

        circleRef.current = circle;
      }
    };

    map.on("zoomend", handleZoomEnd);

    return () => {
      map.off("zoomend", handleZoomEnd);
    };
  }, [map, center, radius]);

  // إنشاء وتحديث الدائرة
  const updateCircle = useCallback(() => {
    if (!centerRef.current || !radius || !map) return;

    // إزالة الطبقات السابقة إن وجدت
    if (circleRef.current) {
      map.removeLayer(circleRef.current);
    }
    if (centerMarkerRef.current) {
      map.removeLayer(centerMarkerRef.current);
    }

    // تحديث مركز الخريطة للتأكد من أن الدائرة تظهر في المكان الصحيح
    map.setView(
      [centerRef.current.latitude, centerRef.current.longitude],
      map.getZoom(),
      {
        animate: true,
        duration: 0.5,
      }
    );

    // استخدام Circle بدلاً من GeoJSON للحصول على دائرة أكثر دقة
    // وتجنب مشكلة ظهور المحيط بشكل ناقص عند تحريك الخريطة
    const circle = L.circle(
      [centerRef.current.latitude, centerRef.current.longitude],
      {
        radius: radius, // نصف القطر بالمتر
        color: "#6366F1",
        fillColor: "#6366F1",
        fillOpacity: 0.2,
        weight: 2,
        interactive: false,
        bubblingMouseEvents: false,
        renderer: L.svg({ padding: 100 }), // إضافة padding لتجنب قطع الدائرة عند حواف الخريطة
      }
    ).addTo(map);

    // تخزين مرجع للدائرة
    circleRef.current = circle;

    // إضافة دائرة صغيرة في المركز لتحديد موقع المستخدم
    const centerMarker = L.circleMarker(
      [centerRef.current.latitude, centerRef.current.longitude],
      {
        radius: 5,
        color: "#6366F1",
        fillColor: "#6366F1",
        fillOpacity: 1,
        weight: 2,
        interactive: false,
        zIndexOffset: 1000, // زيادة zIndex لضمان ظهور العلامة فوق جميع العناصر الأخرى
      }
    ).addTo(map);

    // تخزين مرجع للدائرة المركزية
    centerMarkerRef.current = centerMarker;
  }, [map, radius]);

  // تحديث مركز الدائرة عند تغيير موقع الدبوس
  useEffect(() => {
    // التحقق مما إذا كان المركز قد تغير فعلاً
    const hasLocationChanged =
      !prevCenterRef.current ||
      prevCenterRef.current.latitude !== center.latitude ||
      prevCenterRef.current.longitude !== center.longitude;

    // تحديث المركز فقط إذا تغير موقع الدبوس
    if (hasLocationChanged) {
      console.log("تم تغيير موقع الدبوس، تحديث مركز الدائرة");
      centerRef.current = center;
      prevCenterRef.current = { ...center };

      // إعادة رسم الدائرة بالمركز الجديد
      updateCircle();
    }
  }, [center, updateCircle]); // الاستماع لتغييرات المركز وتحديث دالة رسم الدائرة

  // إعادة رسم الدائرة عند تغيير نصف القطر
  useEffect(() => {
    updateCircle();
  }, [updateCircle, radius]);

  // إضافة مستمعات للأحداث عند تهيئة المكون
  useEffect(() => {
    if (!map) return;

    // إضافة مستمع لحدث تغيير مستوى التكبير/التصغير
    const handleZoomEnd = () => {
      // إعادة رسم الدائرة عند تغيير مستوى التكبير/التصغير
      if (circleRef.current) {
        updateCircle();
      }
    };

    // إضافة مستمع لحدث تحريك الخريطة
    const handleMoveEnd = () => {
      // إعادة رسم الدائرة عند تحريك الخريطة
      if (circleRef.current) {
        // لا نحتاج لإعادة رسم الدائرة هنا لأن Leaflet يتعامل مع ذلك تلقائيًا
        // لكن يمكننا التأكد من أن الدائرة لا تزال مرئية
        if (!map.getBounds().contains(circleRef.current.getLatLng())) {
          map.panTo(circleRef.current.getLatLng());
        }
      }
    };

    map.on("zoomend", handleZoomEnd);
    map.on("moveend", handleMoveEnd);

    return () => {
      map.off("zoomend", handleZoomEnd);
      map.off("moveend", handleMoveEnd);
      if (circleRef.current) {
        map.removeLayer(circleRef.current);
      }
      if (centerMarkerRef.current) {
        map.removeLayer(centerMarkerRef.current);
      }
    };
  }, [map, updateCircle]);

  return null;
};

// مكون لإضافة تجميع العلامات
const MarkerClusterGroup = ({ children }) => {
  const map = useMap();
  const clusterGroupRef = useRef(null);

  useEffect(() => {
    clusterGroupRef.current = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 50,
      iconCreateFunction: (cluster) => {
        return L.divIcon({
          html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
          className: "custom-marker-cluster",
          iconSize: L.point(40, 40),
        });
      },
      // تعطيل تجميع العلامات المنفردة
      singleMarkerMode: false,
      // تمكين النقر على المجموعات
      spiderfyOnMaxZoom: true,
      // تمكين التكبير التلقائي عند النقر على المجموعة
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: 16,
      // منع إعادة التجميع عند التكبير
      animate: true,
      animateAddingMarkers: false,
      // تحديد نطاق الرؤية للمجموعات
      removeOutsideVisibleBounds: true,
      // تعطيل إظهار المجموعات خارج نطاق الرؤية
      chunkedLoading: true,
    });

    map.addLayer(clusterGroupRef.current);

    // إضافة مستمع لحدث تغيير مستوى التكبير/التصغير
    map.on("zoomend", () => {
      // إعادة تحديث المجموعات عند تغيير مستوى التكبير/التصغير
      if (clusterGroupRef.current) {
        clusterGroupRef.current.refreshClusters();
      }
    });

    return () => {
      map.off("zoomend");
      map.removeLayer(clusterGroupRef.current);
    };
  }, [map]);

  useEffect(() => {
    // التأكد من وجود clusterGroupRef.current قبل محاولة استخدامه
    if (!clusterGroupRef.current) {
      console.warn("Cluster group reference is not available");
      return;
    }

    try {
      clusterGroupRef.current.clearLayers();

      React.Children.forEach(children, (child) => {
        if (child) {
          try {
            // استخراج البيانات من props
            const {
              position,
              icon,
              eventHandlers,
              children: popupContent,
            } = child.props;

            // التحقق من صحة البيانات
            if (
              !position ||
              !Array.isArray(position) ||
              position.length !== 2
            ) {
              console.warn("Invalid marker position:", position);
              return;
            }

            // إنشاء العلامة
            const marker = L.marker(position);

            // تعيين الأيقونة
            if (icon) {
              marker.setIcon(icon);
            }

            // إضافة معالج النقر
            if (eventHandlers && eventHandlers.click) {
              marker.on("click", eventHandlers.click);
            }

            // إضافة النافذة المنبثقة
            if (popupContent) {
              try {
                // إنشاء عنصر div للنافذة المنبثقة
                const container = document.createElement("div");
                container.className = "craftsman-popup-container";

                try {
                  // استخدام createRoot لعرض محتوى React
                  const root = createRoot(container);
                  root.render(popupContent);
                } catch (error) {
                  console.error("Error rendering popup content:", error);
                  // استخدام طريقة بديلة في حالة فشل createRoot
                  container.innerHTML = "معلومات الحرفي";
                }

                // ربط النافذة المنبثقة بالعلامة
                marker.bindPopup(container, {
                  className: "craftsman-popup",
                  minWidth: 300, // زيادة العرض الأدنى
                  maxWidth: 350, // زيادة العرض الأقصى
                  offset: [0, -10],
                  autoPan: true,
                  closeButton: true,
                  // تعطيل الإغلاق التلقائي
                  autoClose: false,
                  // تعطيل الإغلاق عند النقر خارج النافذة
                  closeOnClick: false,
                  // السماح بالإغلاق عند الضغط على زر Escape
                  closeOnEscapeKey: true,
                  autoPanPadding: [50, 50],
                });

                // فتح النافذة المنبثقة عند النقر على العلامة
                marker.on("click", function() {
                  // إغلاق جميع النوافذ المنبثقة الأخرى أولاً
                  map.closePopup();
                  // ثم فتح هذه النافذة المنبثقة
                  this.openPopup();
                });
              } catch (error) {
                console.error("Error creating popup:", error);
              }
            }

            // إضافة العلامة إلى المجموعة
            clusterGroupRef.current.addLayer(marker);
          } catch (error) {
            console.error("Error processing marker:", error);
          }
        }
      });
    } catch (error) {
      console.error("Error in MarkerClusterGroup useEffect:", error);
    }
  }, [children]);

  return null;
};

const AdvancedMap = ({
  craftsmen = [],
  selectedProfessions = [],
  selectedRating = 0,
  userLocation = null,
  searchRadius = 5000, // بالمتر
  onCraftsmanSelect = () => {},
}) => {
  const darkMode = useThemeStore((state) => state.darkMode);
  const [mapCenter] = useState([33.5138, 36.2765]); // دمشق كمركز افتراضي
  const [mapZoom] = useState(13);
  const [filteredCraftsmen, setFilteredCraftsmen] = useState([]);
  const mapRef = useRef(null); // مرجع للخريطة
  const initialLoadRef = useRef(true); // للتحقق مما إذا كان هذا هو التحميل الأولي

  // دالة للتعامل مع الخريطة عند تهيئتها
  const handleMapReady = useCallback(
    (map) => {
      mapRef.current = map;

      // إذا كان لدينا موقع المستخدم بالفعل، قم بتعيين مركز الخريطة
      if (userLocation && initialLoadRef.current) {
        const newCenter = [userLocation.latitude, userLocation.longitude];
        map.setView(newCenter, map.getZoom(), {
          animate: true,
          duration: 0.5,
        });
        initialLoadRef.current = false;
      }
    },
    [userLocation]
  );

  // تحديث مركز الخريطة عند تغيير موقع المستخدم بشكل مباشر - فقط عند التحميل الأولي
  const prevUserLocationRef = useRef(null);

  useEffect(() => {
    // تنفيذ هذا الكود فقط عند التحميل الأولي أو عند تغيير موقع المستخدم بشكل كبير
    if (userLocation && mapRef.current) {
      // التحقق مما إذا كان هذا هو التحميل الأولي أو تغيير كبير في الموقع
      const isFirstLoad = initialLoadRef.current;
      const isSignificantChange = !prevUserLocationRef.current ||
        Math.abs(prevUserLocationRef.current.latitude - userLocation.latitude) > 0.01 ||
        Math.abs(prevUserLocationRef.current.longitude - userLocation.longitude) > 0.01;

      if (isFirstLoad || isSignificantChange) {
        // تعيين مركز الخريطة إلى موقع المستخدم
        const newCenter = [userLocation.latitude, userLocation.longitude];
        console.log("Centering map to:", newCenter);

        // تحديث المركز
        mapRef.current.setView(newCenter, mapRef.current.getZoom(), {
          animate: true,
          duration: 0.5,
        });

        // تحديث المرجع السابق
        prevUserLocationRef.current = { ...userLocation };

        // تعيين initialLoadRef.current إلى false بعد التحميل الأولي
        if (isFirstLoad) {
          initialLoadRef.current = false;
        }
      }
    }
  }, [userLocation]);

  // مكون للتعامل مع تغيير مستوى التكبير/التصغير
  const ZoomChangeHandler = () => {
    const map = useMap();

    useEffect(() => {
      const handleZoomEnd = () => {
        console.log("تم تغيير مستوى التكبير/التصغير:", map.getZoom());
        // إعادة تحديث الخريطة عند تغيير مستوى التكبير/التصغير
        map.invalidateSize();
      };

      map.on("zoomend", handleZoomEnd);

      // إضافة تلميح عند تمرير المؤشر فوق العلامات للمستخدمين غير المسجلين
      const isLoggedIn = localStorage.getItem("token") !== null;
      if (!isLoggedIn) {
        // إضافة طبقة CSS للخريطة للإشارة إلى أن المستخدم غير مسجل
        map.getContainer().classList.add("unregistered-user-map");

        // إضافة مستمع لحدث تمرير المؤشر فوق العلامات
        const handleMouseOver = (e) => {
          if (e.target.classList.contains("leaflet-marker-icon")) {
            e.target.title = "يرجى تسجيل الدخول لعرض معلومات الحرفي";
          }
        };

        map.getContainer().addEventListener("mouseover", handleMouseOver);

        return () => {
          map.off("zoomend", handleZoomEnd);
          map.getContainer().classList.remove("unregistered-user-map");
          map.getContainer().removeEventListener("mouseover", handleMouseOver);
        };
      }

      return () => {
        map.off("zoomend", handleZoomEnd);
      };
    }, [map]);

    return null;
  };

  // تصفية الحرفيين حسب المعايير المحددة
  const prevFilterParamsRef = useRef({
    craftsmen: [],
    selectedProfessions: [],
    selectedRating: 0,
    userLocation: null,
    searchRadius: 0
  });

  useEffect(() => {
    // تجنب التنفيذ إذا كانت المصفوفة فارغة أو غير معرفة
    if (!craftsmen || craftsmen.length === 0) {
      if (filteredCraftsmen.length !== 0) {
        setFilteredCraftsmen([]);
      }
      return;
    }

    // التحقق مما إذا كانت المعايير قد تغيرت فعليًا
    const currentParams = {
      craftsmenLength: craftsmen.length,
      selectedProfessions: selectedProfessions || [],
      selectedRating,
      userLocation,
      searchRadius
    };

    const prevParams = prevFilterParamsRef.current;

    // التحقق من التغييرات الجوهرية فقط
    const hasSignificantChanges =
      currentParams.craftsmenLength !== prevParams.craftsmenLength ||
      JSON.stringify(currentParams.selectedProfessions) !== JSON.stringify(prevParams.selectedProfessions) ||
      currentParams.selectedRating !== prevParams.selectedRating ||
      (currentParams.userLocation && !prevParams.userLocation) ||
      (prevParams.userLocation && !currentParams.userLocation) ||
      (currentParams.userLocation && prevParams.userLocation &&
        (Math.abs(currentParams.userLocation.latitude - prevParams.userLocation.latitude) > 0.0001 ||
         Math.abs(currentParams.userLocation.longitude - prevParams.userLocation.longitude) > 0.0001)) ||
      currentParams.searchRadius !== prevParams.searchRadius;

    if (!hasSignificantChanges) {
      return;
    }

    // تحديث المرجع للمقارنة المستقبلية
    prevFilterParamsRef.current = {
      craftsmenLength: craftsmen.length,
      selectedProfessions: [...(selectedProfessions || [])],
      selectedRating,
      userLocation: userLocation ? { ...userLocation } : null,
      searchRadius
    };

    // بدء عملية الفلترة
    let filtered = [...craftsmen];

    // تصفية حسب المهنة (فقط إذا تم تحديد مهن)
    if (selectedProfessions && selectedProfessions.length > 0) {
      filtered = filtered.filter((craftsman) => {
        // إذا كان لدى الحرفي مصفوفة من المهن، تحقق من جميع المهن
        if (craftsman.professions && Array.isArray(craftsman.professions) && craftsman.professions.length > 0) {
          // تحقق مما إذا كانت أي من مهن الحرفي تتطابق مع أي من المهن المحددة
          return craftsman.professions.some(craftsmanProf =>
            selectedProfessions.some(selectedProf =>
              (typeof craftsmanProf === 'string' ?
                craftsmanProf.trim().toLowerCase() === selectedProf.trim().toLowerCase() :
                (craftsmanProf.name && craftsmanProf.name.trim().toLowerCase() === selectedProf.trim().toLowerCase())
              )
            )
          );
        }

        // إذا كان لدى الحرفي حقل مهنة واحد فقط
        const craftsmanProfession = craftsman.profession || "";

        // التحقق من تطابق المهنة مع أي من المهن المحددة
        return selectedProfessions.some(
          (prof) =>
            craftsmanProfession.trim().toLowerCase() ===
            prof.trim().toLowerCase()
        );
      });

      // طباعة عدد الحرفيين بعد التصفية للتصحيح
      console.log(`Filtered by profession: ${filtered.length} craftsmen remain`);
    }

    // تصفية حسب التقييم
    if (selectedRating > 0) {
      filtered = filtered.filter(
        (craftsman) => craftsman.rating >= selectedRating
      );
    }

    // تصفية حسب المسافة من موقع المستخدم
    if (userLocation) {
      filtered = filtered.filter((craftsman) => {
        // استخدام الإحداثيات من الحقول المباشرة أو من كائن الموقع
        const craftsmanLat = craftsman.latitude || craftsman.location?.lat;
        const craftsmanLng = craftsman.longitude || craftsman.location?.lng;

        if (!craftsmanLat || !craftsmanLng) return false;

        // حساب المسافة بين موقع المستخدم وموقع الحرفي
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          craftsmanLat,
          craftsmanLng
        );

        return distance <= searchRadius;
      });
    }

    // تحديث الحالة بطريقة أكثر كفاءة
    // تجنب استخدام JSON.stringify لمقارنة المصفوفات الكبيرة لأنه بطيء

    // طباعة معلومات التصفية للتصحيح
    console.log(`Filtering results:
      - Total craftsmen: ${craftsmen.length}
      - After profession filter: ${filtered.length}
      - Selected professions: ${selectedProfessions ? selectedProfessions.join(', ') : 'none'}
      - Selected rating: ${selectedRating}
      - Search radius: ${searchRadius} meters
    `);

    // تحديث الحالة دائمًا لضمان التحديث الصحيح
    setFilteredCraftsmen(filtered);
  }, [
    craftsmen,
    selectedProfessions,
    selectedRating,
    userLocation,
    searchRadius
    // Eliminamos filteredCraftsmen de las dependencias para evitar bucles infinitos
  ]);

  // دالة لحساب المسافة بين نقطتين على الخريطة (بالمتر)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // نصف قطر الأرض بالمتر
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // الحصول على أيقونة مناسبة للمهنة
  const getIconForProfession = (profession) => {
    // تعامل مع الحالات الخاصة
    if (!profession) {
      console.log("No profession provided, using default icon");
      return ProfessionIcons.default;
    }

    // إذا كان الإدخال كائنًا، استخرج اسم المهنة
    if (typeof profession === 'object' && profession !== null) {
      if (profession.name) {
        profession = profession.name;
      } else {
        console.log("Profession object without name property:", profession);
        return ProfessionIcons.default;
      }
    }

    // تحويل المهنة إلى نص
    const professionStr = profession.toString();

    // طباعة المهنة للتصحيح
    console.log(`Getting icon for profession: "${professionStr}"`);

    // محاولة الحصول على الأيقونة باسم المهنة بالعربية أولاً
    if (ProfessionIcons[professionStr]) {
      console.log(`Found exact match for "${professionStr}"`);
      return ProfessionIcons[professionStr];
    }

    // محاولة مطابقة المهنة مع أيقونة مشابهة
    // للمهن التي قد تكون مكتوبة بطريقة مختلفة قليلاً
    const professionLower = professionStr.toLowerCase();

    if (professionLower.includes("كهرب")) {
      return ProfessionIcons["كهربائي"];
    } else if (
      professionLower.includes("سباك") ||
      professionLower.includes("صحي")
    ) {
      return ProfessionIcons["سباك"];
    } else if (professionLower.includes("نجار")) {
      return ProfessionIcons["نجار"];
    } else if (
      professionLower.includes("دهان") ||
      professionLower.includes("طلاء")
    ) {
      return ProfessionIcons["دهان"];
    } else if (
      professionLower.includes("ديكور") ||
      professionLower.includes("تصميم")
    ) {
      return ProfessionIcons["مصمم ديكور"];
    } else if (professionLower.includes("ميكانيك")) {
      return ProfessionIcons["ميكانيكي"];
    } else if (
      professionLower.includes("حلاق") ||
      professionLower.includes("شعر")
    ) {
      return ProfessionIcons["حلاق"];
    } else if (
      professionLower.includes("حداد") ||
      professionLower.includes("معدن")
    ) {
      return ProfessionIcons["حداد"];
    } else if (
      professionLower.includes("بناء") ||
      professionLower.includes("عمار")
    ) {
      return ProfessionIcons["بناء"];
    } else if (
      professionLower.includes("تكييف") ||
      professionLower.includes("مكيف")
    ) {
      return ProfessionIcons["مكيفات"];
    } else if (
      professionLower.includes("خياط") ||
      professionLower.includes("ملابس")
    ) {
      return ProfessionIcons["خياط"];
    } else if (
      professionLower.includes("طباخ") ||
      professionLower.includes("طبخ") ||
      professionLower.includes("طعام") ||
      professionLower.includes("شيف")
    ) {
      return ProfessionIcons["طباخ"];
    } else if (
      professionLower.includes("زراع") ||
      professionLower.includes("بستن")
    ) {
      return ProfessionIcons["مزارع"];
    } else if (
      professionLower.includes("أجهزة") ||
      professionLower.includes("صيانة")
    ) {
      return ProfessionIcons["مصلح أجهزة كهربائية"];
    } else if (
      professionLower.includes("موبايل") ||
      professionLower.includes("كمبيوتر") ||
      professionLower.includes("حاسوب")
    ) {
      return ProfessionIcons["مصلح موبايلات وكمبيوتر"];
    }
    // مهن الصحة والجمال
    else if (
      professionLower.includes("طبيب") ||
      professionLower.includes("دكتور")
    ) {
      return ProfessionIcons["طبيب"];
    } else if (
      professionLower.includes("ممرض") ||
      professionLower.includes("تمريض")
    ) {
      return ProfessionIcons["ممرض"];
    } else if (
      professionLower.includes("معالج") ||
      professionLower.includes("فيزيائي") ||
      professionLower.includes("علاج طبيعي")
    ) {
      return ProfessionIcons["معالج فيزيائي"];
    } else if (
      professionLower.includes("تجميل") ||
      professionLower.includes("ماكياج") ||
      professionLower.includes("مكياج")
    ) {
      return ProfessionIcons["خبير تجميل"];
    }
    // مهن الطعام والضيافة
    else if (
      professionLower.includes("نادل") ||
      professionLower.includes("خدمة") ||
      professionLower.includes("ضيافة")
    ) {
      return ProfessionIcons["نادل"];
    } else if (
      professionLower.includes("منسق") ||
      professionLower.includes("حفلات") ||
      professionLower.includes("مناسبات")
    ) {
      return ProfessionIcons["منسق حفلات"];
    }
    // مهن الإلكترونيات والتقنية
    else if (
      professionLower.includes("إلكترون") ||
      professionLower.includes("الكترون")
    ) {
      return ProfessionIcons["فني إلكترونيات"];
    } else if (
      professionLower.includes("مصمم مواقع") ||
      professionLower.includes("تصميم مواقع") ||
      professionLower.includes("ويب")
    ) {
      return ProfessionIcons["مصمم مواقع"];
    } else if (
      professionLower.includes("مطور") ||
      professionLower.includes("تطبيق") ||
      professionLower.includes("برمجة")
    ) {
      return ProfessionIcons["مطور تطبيقات"];
    }

    // إذا لم نجد الأيقونة بالاسم العربي، نستخدم الأيقونة الافتراضية
    console.log(`No matching icon found for "${professionStr}", using default`);
    return ProfessionIcons.default;
  };

  return (
    <div
      className={`advanced-map-container rounded-lg overflow-hidden shadow-lg ${
        darkMode ? "border border-gray-700" : "border border-gray-200"
      }`}
    >
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: "500px", width: "100%" }}
        className="z-0"
        zoomControl={true}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        dragging={true}
        zoomSnap={0.5}
        zoomDelta={0.5}
        minZoom={3}
        maxZoom={18}
        maxBounds={[
          [-90, -180],
          [90, 180],
        ]}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController
          onMapReady={handleMapReady}
          userLocation={userLocation}
        />

        {/* إضافة معالج تغيير مستوى التكبير/التصغير */}
        <ZoomChangeHandler />

        {/* عرض دائرة نطاق البحث إذا كان موقع المستخدم متاحًا */}
        {userLocation && (
          <SearchRadiusController center={userLocation} radius={searchRadius} />
        )}

        {/* عرض العلامات مع التجميع */}
        <MarkerClusterGroup
          chunkedLoading={true}
          zoomToBoundsOnClick={true}
          showCoverageOnHover={false}
          spiderfyOnMaxZoom={true}
          disableClusteringAtZoom={16}
          maxClusterRadius={50}
        >
          {filteredCraftsmen.map((craftsman) => {
            // استخدام الإحداثيات من الحقول المباشرة أو من كائن الموقع
            const craftsmanLat =
              craftsman.latitude ||
              (craftsman.location && craftsman.location.lat);
            const craftsmanLng =
              craftsman.longitude ||
              (craftsman.location && craftsman.location.lng);

            // الحصول على المهنة من الحقل المباشر أو من مصفوفة المهن
            let displayProfession = "default";

            // تحديد المهنة التي سيتم عرضها
            if (craftsman.professions && Array.isArray(craftsman.professions) && craftsman.professions.length > 0) {
              // إذا كانت هناك مهن محددة في الفلتر، حاول استخدام واحدة منها
              if (selectedProfessions && selectedProfessions.length > 0) {
                // ابحث عن أول مهنة متطابقة بين مهن الحرفي والمهن المحددة
                for (const prof of craftsman.professions) {
                  const profName = typeof prof === 'string' ? prof : (prof.name || "");
                  if (selectedProfessions.some(sp => sp.trim().toLowerCase() === profName.trim().toLowerCase())) {
                    displayProfession = profName;
                    break;
                  }
                }

                // إذا لم يتم العثور على تطابق، استخدم المهنة الأولى
                if (displayProfession === "default") {
                  const firstProf = craftsman.professions[0];
                  displayProfession = typeof firstProf === 'string' ? firstProf : (firstProf.name || "default");
                }
              } else {
                // إذا لم تكن هناك مهن محددة، استخدم المهنة الأولى
                const firstProf = craftsman.professions[0];
                displayProfession = typeof firstProf === 'string' ? firstProf : (firstProf.name || "default");
              }
            } else if (craftsman.profession) {
              // استخدم حقل المهنة المفرد إذا كان موجودًا
              displayProfession = craftsman.profession;
            }

            // طباعة بيانات الحرفي للتصحيح
            console.log(`Craftsman ${craftsman.id || craftsman._id || 'unknown'} data:`, {
              name: craftsman.name || (craftsman.user && craftsman.user.name) || 'unknown',
              displayProfession,
              selectedProfessions: selectedProfessions || [],
              hasMatchingProfession: selectedProfessions && selectedProfessions.length > 0 ?
                (craftsman.professions && craftsman.professions.some(p =>
                  selectedProfessions.includes(typeof p === 'string' ? p : (p.name || "")))) : 'N/A',
              icon: getIconForProfession(displayProfession),
            });

            // التحقق من وجود إحداثيات صالحة
            if (!craftsmanLat || !craftsmanLng) {
              console.warn(
                `Craftsman ${craftsman.id ||
                  craftsman._id} has invalid location`
              );
              return null;
            }

            // التحقق من أن الحرفي داخل نطاق العمل
            if (userLocation) {
              const distance = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                craftsmanLat,
                craftsmanLng
              );

              // إذا كان الحرفي خارج نطاق العمل، لا تعرضه
              if (distance > searchRadius) {
                console.log(
                  `Craftsman ${craftsman.id ||
                    craftsman._id} outside search radius:`,
                  {
                    distance,
                    searchRadius,
                  }
                );
                return null;
              }

              // نكتفي بالتحقق الأول فقط لتجنب أي تناقضات في الحسابات
              // وللتأكد من أن الحرفيين يظهرون بشكل متسق مع دائرة نطاق العمل
            }

            return (
              <Marker
                key={
                  craftsman.id || craftsman._id || `craftsman-${Math.random()}`
                }
                position={[craftsmanLat, craftsmanLng]}
                icon={getIconForProfession(displayProfession)}
                zIndexOffset={2000} // زيادة zIndex لضمان ظهور الأيقونة فوق الدائرة الزرقاء
                // إضافة معالج النقر فقط للمستخدمين المسجلين
                eventHandlers={{
                  click: (e) => {
                    // التحقق مما إذا كان المستخدم مسجل الدخول
                    const isLoggedIn = localStorage.getItem("token") !== null;
                    if (isLoggedIn) {
                      // إغلاق جميع النوافذ المنبثقة الأخرى أولاً
                      if (mapRef.current) {
                        mapRef.current.closePopup();
                      }
                      // تأخير قصير لضمان إغلاق النوافذ المنبثقة الأخرى
                      setTimeout(() => {
                        e.target.openPopup();
                      }, 50);
                    }
                  },
                }}
                // إضافة فئة CSS مخصصة للمستخدمين غير المسجلين
                className={
                  localStorage.getItem("token") === null
                    ? "disabled-marker"
                    : ""
                }
              >
                {localStorage.getItem("token") && (
                  <div className="craftsman-popup-content">
                    <div className="flex flex-col items-start w-full">
                      <div className="craftsman-popup-name mb-1 w-full text-right">
                        <User size={18} className="ml-1" />
                        {craftsman.name ||
                          (craftsman.user && craftsman.user.name) ||
                          "حرفي"}
                      </div>

                      {/* المهنة تحت الاسم مباشرة - محاذاة إلى اليمين */}
                      <div className="craftsman-popup-profession mb-2 w-full text-right">
                        <div className="font-medium text-indigo-600 dark:text-indigo-400 text-right">
                          {craftsman.profession ||
                            (craftsman.professions &&
                              craftsman.professions.length > 0 &&
                              craftsman.professions[0]) ||
                            "مهنة غير محددة"}
                        </div>
                        {(craftsman.specialization ||
                          (craftsman.specializations &&
                            craftsman.specializations.length > 0 &&
                            craftsman.specializations[0])) && (
                          <div className="text-xs opacity-75 text-right">
                            {craftsman.specialization ||
                              (craftsman.specializations &&
                                craftsman.specializations.length > 0 &&
                                craftsman.specializations[0])}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="craftsman-popup-rating mt-1">
                      <Star size={16} />
                      <span>{(craftsman.rating || 0).toFixed(1)}</span>
                      <span className="text-xs">
                        ({craftsman.reviewCount || 0} تقييم)
                      </span>
                    </div>

                    {(craftsman.phone ||
                      (craftsman.user && craftsman.user.phone)) && (
                      <div className="craftsman-popup-phone mt-1">
                        <Phone size={14} />
                        {craftsman.phone ||
                          (craftsman.user && craftsman.user.phone)}
                      </div>
                    )}

                    {/* إزالة قسم الموقع بناءً على طلب المستخدم */}

                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // منع انتشار الحدث
                        // استخدام المعرف المناسب
                        const craftsmanId = craftsman.id || craftsman._id;
                        onCraftsmanSelect(
                          { ...craftsman, id: craftsmanId },
                          true
                        ); // تمرير true لتوضيح أن النقر كان على الزر
                      }}
                      className="craftsman-popup-button"
                    >
                      عرض الملف الشخصي
                      <ExternalLink size={14} />
                    </button>
                  </div>
                )}
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>

      {/* معلومات إحصائية عن النتائج */}
      <div
        className={`p-3 ${
          darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
        }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <span className="font-bold">{filteredCraftsmen.length}</span>
            <span className="mr-1">حرفي في المنطقة المحددة</span>
          </div>

          {userLocation && (
            <div className="text-sm opacity-75">
              <span>نطاق البحث: </span>
              <span className="font-medium">
                {(searchRadius / 1000).toFixed(1)} كم
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedMap;
