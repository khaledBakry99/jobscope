import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
// لا نستخدم getNeighborhoodsInRadius لأننا نريد استخدام البيانات الفعلية من API
import L from "leaflet";
import useThemeStore from "../../store/themeStore";

// Función para obtener calles, hospitales y mezquitas desde Overpass API
async function fetchStreetsInRadius(lat, lng, radius) {
  try {
    // Overpass QL: consulta para obtener calles (highway), hospitales y mezquitas dentro de un radio
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

    // Verificar la estructura de datos
    if (!data || !Array.isArray(data.elements)) {
      console.error("Invalid data structure from Overpass API:", data);
      return { streets: [], hospitals: [], mosques: [] };
    }

    // Extraer nombres de calles, hospitales y mezquitas
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

    // Eliminar duplicados
    return {
      streets: [...new Set(streets)],
      hospitals: [...new Set(hospitals)],
      mosques: [...new Set(mosques)],
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { streets: [], hospitals: [], mosques: [] };
  }
}

// Fix for default marker icon issue in react-leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map events
function LocationEvents({
  onLocationSelect,
  onNeighborhoodsChange,
  radius,
  onStreetsChange,
  isUserInitiatedUpdateRef, // إضافة المرجع
}) {
  const map = useMap(); // استخدام hook للحصول على مرجع للخريطة

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      console.log("Map clicked at:", lat, lng);

      // تعيين المرجع إلى true لتنشيط مؤشر التحميل
      if (isUserInitiatedUpdateRef) {
        isUserInitiatedUpdateRef.current = true;
      }

      // إذا كان هناك دالة onStreetsChange، نقوم بتنشيط مؤشر التحميل
      // ولكن فقط عند النقر على الخريطة (تغيير موقع الدبوس)
      if (onStreetsChange) {
        // إرسال قائمة فارغة لتنشيط مؤشر التحميل مع تمرير معلمة isPinMoved = true
        onStreetsChange([], [], true);
      }

      if (onLocationSelect) {
        onLocationSelect({ lat, lng });
      }

      // تحريك الخريطة إلى الموقع الجديد
      map.setView([lat, lng], map.getZoom(), {
        animate: true,
        duration: 0.5,
      });

      // تحديث الأحياء ضمن نطاق العمل
      if (onNeighborhoodsChange) {
        // نستخدم setTimeout لتجنب التحديثات المتكررة
        setTimeout(() => {
          // نرسل مصفوفة فارغة لأننا نريد استخدام البيانات الفعلية من API
          onNeighborhoodsChange([]);
        }, 100);
      }
    },
  });
  return null;
}

// Component to control map view
function MapViewController({ center }) {
  const map = useMap();
  const { useEffect } = React;

  useEffect(() => {
    if (center && map) {
      console.log("Centering map to:", center);
      map.setView([center.lat, center.lng], 13, {
        animate: true,
        duration: 1,
      });
    }
  }, [center, map]);

  return null;
}

const WorkerLocationMap = ({
  location,
  setLocation,
  radius = 5,
  setRadius,
  setAreas,
  height = "400px",
  interactive = true,
  showRadius = true,
  markers = [],
  onStreetsChange,
}) => {
  const darkMode = useThemeStore((state) => state.darkMode);
  const [mapCenter, setMapCenter] = useState(
    location || { lat: 33.5138, lng: 36.2765 } // Damascus, Syria
  );
  const [streets, setStreets] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [mosques, setMosques] = useState([]);
  const [removedStreets, setRemovedStreets] = useState([]);
  const [removedHospitals, setRemovedHospitals] = useState([]);
  const [removedMosques, setRemovedMosques] = useState([]);
  const [showAllStreets, setShowAllStreets] = useState(false);
  const [showAllHospitals, setShowAllHospitals] = useState(false);
  const [showAllMosques, setShowAllMosques] = useState(false);

  // Handle location selection
  const handleLocationSelect = (newLocation) => {
    // تعيين المرجع إلى true لتنشيط مؤشر التحميل
    isUserInitiatedUpdateRef.current = true;

    if (setLocation) {
      setLocation(newLocation);
    }
    setMapCenter(newLocation);

    // تحريك الخريطة إلى الموقع الجديد (سيتم تنفيذه في مكون MapViewController)
    // لا نحتاج لتنفيذه هنا لأن تغيير mapCenter سيؤدي إلى تحديث MapViewController

    // إذا كان هناك دالة onStreetsChange، نقوم بتنشيط مؤشر التحميل
    // سيتم تحديث الشوارع تلقائيًا من خلال useEffect الذي يراقب تغييرات الموقع
    if (onStreetsChange) {
      // إرسال قائمة فارغة لتنشيط مؤشر التحميل مع تمرير معلمة isPinMoved = true
      onStreetsChange([], [], true);
    }
  };

  // Handle radius change
  const handleRadiusChange = (e) => {
    const newRadius = parseFloat(e.target.value);

    // تعيين المرجع إلى true لتنشيط مؤشر التحميل
    isUserInitiatedUpdateRef.current = true;

    // تحديث نطاق العمل
    setRadius(newRadius);

    // تحديث الأحياء عند تغيير نطاق العمل
    if (setAreas && location) {
      // نستخدم setTimeout لتجنب التحديثات المتكررة
      setTimeout(() => {
        // نرسل مصفوفة فارغة لأننا نريد استخدام البيانات الفعلية من API
        setAreas([]);
      }, 100);
    }

    // إذا كان هناك دالة onStreetsChange، نقوم بتنشيط مؤشر التحميل
    // لأننا نريد إظهار مؤشر التحميل عند تغيير نطاق العمل أيضًا
    if (onStreetsChange) {
      // إرسال قائمة فارغة لتنشيط مؤشر التحميل مع تمرير معلمة isPinMoved = true
      // نستخدم isPinMoved = true هنا لتنشيط مؤشر التحميل، حتى لو كان التغيير في نطاق العمل وليس موقع الدبوس
      onStreetsChange([], [], true);

      // تحديث البيانات فورًا عند تغيير نطاق العمل
      if (location) {
        fetchStreetsInRadius(location.lat, location.lng, newRadius)
          .then(data => {
            // تأخير قصير لإظهار مؤشر التحميل
            setTimeout(() => {
              const placesData = {
                streets: data.streets,
                hospitals: data.hospitals,
                mosques: data.mosques,
              };
              onStreetsChange(placesData, [], true);
            }, 1000);
          })
          .catch(error => {
            console.error("Error fetching data on radius change:", error);
            // إخفاء مؤشر التحميل في حالة الخطأ
            setTimeout(() => {
              onStreetsChange([], [], false);
            }, 1000);
          });
      }
    }
  };

  // تحديث الأحياء عند تحميل الخريطة أو تغيير الموقع
  useEffect(() => {
    if (setAreas && location) {
      const timeoutId = setTimeout(() => {
        // نرسل مصفوفة فارغة لأننا نريد استخدام البيانات الفعلية من API
        setAreas([]);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [location, radius, setAreas]);

  // Actualizar el centro del mapa cuando cambia la ubicación externa
  useEffect(() => {
    if (location) {
      setMapCenter(location);
    }
  }, [location]);

  // Función para eliminar una calle de la lista
  const handleRemoveStreet = (street) => {
    setRemovedStreets((prev) => [...prev, street]);
  };

  // Función para eliminar un hospital de la lista
  const handleRemoveHospital = (hospital) => {
    setRemovedHospitals((prev) => [...prev, hospital]);
  };

  // Función para eliminar un mezquita de la lista
  const handleRemoveMosque = (mosque) => {
    setRemovedMosques((prev) => [...prev, mosque]);
  };

  // استخدام مرجع لتتبع ما إذا كان التحديث بسبب تغيير موقع الدبوس أو نطاق العمل
  const isUserInitiatedUpdateRef = useRef(false);
  const lastLocationRef = useRef(null);
  const lastRadiusRef = useRef(null);

  // Obtener calles, hospitales y mezquitas cuando cambia la ubicación o el radio
  useEffect(() => {
    if (!location) return;

    // التحقق مما إذا كان التحديث بسبب تغيير موقع الدبوس أو نطاق العمل
    const isLocationChanged =
      !lastLocationRef.current ||
      lastLocationRef.current.lat !== location.lat ||
      lastLocationRef.current.lng !== location.lng;

    const isRadiusChanged = lastRadiusRef.current !== radius;

    // تحديث المراجع
    lastLocationRef.current = { ...location };
    lastRadiusRef.current = radius;

    // إذا لم يكن التحديث بسبب تغيير موقع الدبوس أو نطاق العمل، ولم يكن التحديث مبدوءًا من المستخدم، فلا نقوم بتحديث الشوارع
    if (
      !isLocationChanged &&
      !isRadiusChanged &&
      !isUserInitiatedUpdateRef.current
    ) {
      return;
    }

    // إعادة تعيين المرجع
    const isUserInitiated = isUserInitiatedUpdateRef.current;
    isUserInitiatedUpdateRef.current = false;

    const getPlacesData = async () => {
      try {
        // جلب البيانات من API
        const data = await fetchStreetsInRadius(
          location.lat,
          location.lng,
          radius
        );

        // تأخير تحديث البيانات لمدة ثانيتين لإظهار مؤشر التحميل
        setTimeout(() => {
          setStreets(data.streets);
          setHospitals(data.hospitals);
          setMosques(data.mosques);

          // إرسال البيانات المفرزة إلى الواجهة
          if (onStreetsChange) {
            // نمرر البيانات المفرزة بشكل منفصل
            const placesData = {
              streets: data.streets,
              hospitals: data.hospitals,
              mosques: data.mosques,
            };

            // نمرر isPinMoved = true فقط إذا كان التحديث مبدوءًا من المستخدم
            onStreetsChange(placesData, [], isUserInitiated);
          }
        }, 2000); // تأخير لمدة ثانيتين
      } catch (error) {
        console.error("Error fetching places data:", error);

        // في حالة حدوث خطأ، نقوم بإخفاء مؤشر التحميل بعد ثانيتين
        if (onStreetsChange) {
          setTimeout(() => {
            // نمرر isPinMoved = false لإخفاء مؤشر التحميل
            onStreetsChange([], [], false);
          }, 2000);
        }
      }
    };

    getPlacesData();
  }, [
    location,
    radius,
    onStreetsChange,
    removedStreets,
    removedHospitals,
    removedMosques,
  ]);

  return (
    <div className="relative">
      {showRadius && setRadius && !onStreetsChange && interactive && (
        <div className="mb-4">
          <div className="flex items-center">
            <div className="flex-1">
              <label
                className={`block text-base font-medium mb-1 ${
                  darkMode ? "text-indigo-300" : "text-gray-700"
                } transition-colors duration-300`}
              >
                نطاق العمل:{" "}
                <span
                  className={`text-xl font-bold ${
                    darkMode ? "text-indigo-400" : "text-indigo-500"
                  } transition-colors duration-300`}
                >
                  {radius} كم
                </span>
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={radius}
                onChange={handleRadiusChange}
                className={`w-full accent-indigo-500 ${
                  darkMode ? "bg-gray-700" : ""
                } transition-colors duration-300`}
              />
            </div>
          </div>

          {/* عرض الشوارع والمشافي والجوامع ضمن نطاق العمل (فقط إذا لم يتم توفير onStreetsChange) */}
          {!onStreetsChange && (
            <>
              {/* قسم الشوارع - مع ارتفاع ثابت */}
              <div className="mt-3 h-[150px]">
                <h3
                  className={`text-base font-bold mb-2 ${
                    darkMode ? "text-indigo-300" : ""
                  } transition-colors duration-300`}
                >
                  الشوارع ضمن نطاق العمل:
                </h3>

                {streets.length > 0 ? (
                  <div className="h-[100px]">
                    <div className="flex flex-wrap gap-2 h-full overflow-y-auto p-1">
                      {streets
                        .filter((street) => !removedStreets.includes(street))
                        .slice(0, showAllStreets ? 25 : 10)
                        .map((street, index) => (
                          <div
                            key={`street-${index}`}
                            className={`flex items-center rounded-full px-3 py-1 ${
                              darkMode
                                ? "bg-gray-700 text-gray-200"
                                : "bg-indigo-100"
                            } transition-colors duration-300`}
                          >
                            <span className="mr-1">{street}</span>
                            {interactive && (
                              <button
                                type="button"
                                onClick={() => handleRemoveStreet(street)}
                                className={`ml-2 focus:outline-none ${
                                  darkMode
                                    ? "text-red-400 hover:text-red-300"
                                    : "text-red-500 hover:text-red-700"
                                } transition-colors duration-300`}
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                    </div>
                    {streets.filter(
                      (street) => !removedStreets.includes(street)
                    ).length > 10 && (
                      <button
                        type="button"
                        onClick={() => setShowAllStreets(!showAllStreets)}
                        className={`mt-2 focus:outline-none ${
                          darkMode
                            ? "text-indigo-400 hover:text-indigo-300"
                            : "text-blue-500 hover:text-blue-700"
                        } transition-colors duration-300`}
                      >
                        {showAllStreets ? "عرض أقل" : "عرض المزيد"}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="h-[100px] flex items-center justify-center text-gray-500 italic">
                    لا توجد شوارع ضمن نطاق البحث الحالي
                  </div>
                )}
              </div>

              {/* قسم المشافي - مع ارتفاع ثابت */}
              <div className="mt-3 h-[150px]">
                <h3
                  className={`text-base font-bold mb-2 ${
                    darkMode ? "text-indigo-300" : ""
                  } transition-colors duration-300`}
                >
                  المستشفيات والعيادات ضمن نطاق العمل:
                </h3>

                {hospitals.length > 0 ? (
                  <div className="h-[100px]">
                    <div className="flex flex-wrap gap-2 h-full overflow-y-auto p-1">
                      {hospitals
                        .filter(
                          (hospital) => !removedHospitals.includes(hospital)
                        )
                        .slice(0, showAllHospitals ? 25 : 5)
                        .map((hospital, index) => (
                          <div
                            key={`hospital-${index}`}
                            className={`flex items-center rounded-full px-3 py-1 ${
                              darkMode
                                ? "bg-gray-700 text-gray-200"
                                : "bg-red-100"
                            } transition-colors duration-300`}
                          >
                            <span className="mr-1">{hospital}</span>
                            {interactive && (
                              <button
                                type="button"
                                onClick={() => handleRemoveHospital(hospital)}
                                className={`ml-2 focus:outline-none ${
                                  darkMode
                                    ? "text-red-400 hover:text-red-300"
                                    : "text-red-500 hover:text-red-700"
                                } transition-colors duration-300`}
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                    </div>
                    {hospitals.filter(
                      (hospital) => !removedHospitals.includes(hospital)
                    ).length > 5 && (
                      <button
                        type="button"
                        onClick={() => setShowAllHospitals(!showAllHospitals)}
                        className={`mt-2 focus:outline-none ${
                          darkMode
                            ? "text-indigo-400 hover:text-indigo-300"
                            : "text-blue-500 hover:text-blue-700"
                        } transition-colors duration-300`}
                      >
                        {showAllHospitals ? "عرض أقل" : "عرض المزيد"}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="h-[100px] flex items-center justify-center text-gray-500 italic">
                    لا توجد مشافي ضمن نطاق البحث الحالي
                  </div>
                )}
              </div>

              {/* قسم الجوامع - مع ارتفاع ثابت */}
              <div className="mt-3 h-[150px]">
                <h3
                  className={`text-base font-bold mb-2 ${
                    darkMode ? "text-indigo-300" : ""
                  } transition-colors duration-300`}
                >
                  الجوامع ضمن نطاق العمل:
                </h3>

                {mosques.length > 0 ? (
                  <div className="h-[100px]">
                    <div className="flex flex-wrap gap-2 h-full overflow-y-auto p-1">
                      {mosques
                        .filter((mosque) => !removedMosques.includes(mosque))
                        .slice(0, showAllMosques ? 25 : 5)
                        .map((mosque, index) => (
                          <div
                            key={`mosque-${index}`}
                            className={`flex items-center rounded-full px-3 py-1 ${
                              darkMode
                                ? "bg-gray-700 text-gray-200"
                                : "bg-green-100"
                            } transition-colors duration-300`}
                          >
                            <span className="mr-1">{mosque}</span>
                            {interactive && (
                              <button
                                type="button"
                                onClick={() => handleRemoveMosque(mosque)}
                                className={`ml-2 focus:outline-none ${
                                  darkMode
                                    ? "text-red-400 hover:text-red-300"
                                    : "text-red-500 hover:text-red-700"
                                } transition-colors duration-300`}
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                    </div>
                    {mosques.filter(
                      (mosque) => !removedMosques.includes(mosque)
                    ).length > 5 && (
                      <button
                        type="button"
                        onClick={() => setShowAllMosques(!showAllMosques)}
                        className={`mt-2 focus:outline-none ${
                          darkMode
                            ? "text-indigo-400 hover:text-indigo-300"
                            : "text-blue-500 hover:text-blue-700"
                        } transition-colors duration-300`}
                      >
                        {showAllMosques ? "عرض أقل" : "عرض المزيد"}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="h-[100px] flex items-center justify-center text-gray-500 italic">
                    لا توجد جوامع ضمن نطاق البحث الحالي
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
      <div style={{ height }} className="rounded-lg overflow-hidden">
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={13}
          scrollWheelZoom={interactive}
          style={{ height: "100%", width: "100%" }}
          attributionControl={true}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LocationEvents
            onLocationSelect={handleLocationSelect}
            onNeighborhoodsChange={setAreas}
            radius={radius}
            onStreetsChange={onStreetsChange}
            isUserInitiatedUpdateRef={isUserInitiatedUpdateRef}
          />

          {/* Controller to update map view when location or mapCenter changes */}
          <MapViewController center={mapCenter} />

          {/* Display selected location marker */}
          {location && (
            <>
              <Marker position={[location.lat, location.lng]} />
              {showRadius && (
                <Circle
                  center={[location.lat, location.lng]}
                  radius={radius * 1000}
                  pathOptions={{
                    color: "#6366F1",
                    fillColor: "#6366F1",
                    fillOpacity: 0.2,
                  }}
                />
              )}
            </>
          )}

          {/* Display other markers */}
          {markers &&
            markers.length > 0 &&
            markers.map((marker, index) => (
              <Marker
                key={`marker-${index}`}
                position={[marker.lat, marker.lng]}
                title={marker.title || "موقع"}
              />
            ))}
        </MapContainer>
      </div>

      {/* El control deslizante y la sección de calles se han movido arriba */}
    </div>
  );
};

export default WorkerLocationMap;
