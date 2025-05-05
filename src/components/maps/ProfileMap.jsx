import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import useThemeStore from "../../store/themeStore";

// استيراد دالة جلب البيانات من خدمة الخرائط
import { fetchStreetsFromOverpass as fetchPlacesFromAPI } from "../../services/mapService";

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

// مكون للتعامل مع أحداث النقر على الخريطة في وضع التعديل
function LocationMarkerWithEvents({ isEditing, location, setLocation }) {
  // استخدام أحداث الخريطة للتعامل مع النقر
  useMapEvents({
    click(e) {
      // فقط في وضع التعديل يمكن تغيير الموقع
      if (isEditing && setLocation) {
        const { lat, lng } = e.latlng;
        setLocation({ lat, lng });
      }
    },
  });

  return null;
}

// مكون للتحكم في مركز الخريطة
function MapController({ location }) {
  const map = useMap();

  // تحديث مركز الخريطة عندما يتغير الموقع
  useEffect(() => {
    if (location && map) {
      map.setView([location.lat, location.lng], map.getZoom());
    }
  }, [location, map]);

  return null;
}

const ProfileMap = ({
  location = { lat: 33.5138, lng: 36.2765 }, // Damascus, Syria (default)
  setLocation,
  radius = 1,
  setRadius,
  height = "400px",
  isEditing = false,
  showRadius = true,
  streetsInWorkRange = [],
  hospitalsInWorkRange = [],
  mosquesInWorkRange = [],
}) => {
  const darkMode = useThemeStore((state) => state.darkMode);
  const [streets, setStreets] = useState(streetsInWorkRange || []);
  const [hospitals, setHospitals] = useState(hospitalsInWorkRange || []);
  const [mosques, setMosques] = useState(mosquesInWorkRange || []);
  const [showAllStreets, setShowAllStreets] = useState(false);
  const [showAllHospitals, setShowAllHospitals] = useState(false);
  const [showAllMosques, setShowAllMosques] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // لا نحتاج إلى تحديث الأحياء لأننا نستخدم neighborhoodsInWorkRange مباشرة في العرض
  // وبالتالي يمكننا إزالة هذا الـ useEffect

  // Obtener calles, hospitales y mezquitas cuando cambia la ubicación o el radio
  useEffect(() => {
    if (!location) return;

    // إذا كانت هناك بيانات مخزنة مسبقًا، نستخدمها
    if (
      streetsInWorkRange.length > 0 ||
      hospitalsInWorkRange.length > 0 ||
      mosquesInWorkRange.length > 0
    ) {
      setStreets(streetsInWorkRange);
      setHospitals(hospitalsInWorkRange);
      setMosques(mosquesInWorkRange);
      return;
    }

    const getPlacesData = async () => {
      try {
        // في صفحة تعديل الملف الشخصي، لا نظهر مؤشر التحميل
        if (!isEditing) {
          setIsLoading(true);
        }
        console.log("جلب البيانات للموقع:", location);

        // استخدام دالة جلب البيانات من خدمة الخرائط
        const data = await fetchPlacesFromAPI(
          location.lat,
          location.lng,
          radius
        );

        // تحديث البيانات فوراً بدون تأخير في صفحة تعديل الملف الشخصي
        setStreets(data.streets || []);
        setHospitals(data.hospitals || []);
        setMosques(data.mosques || []);

        // إزالة مؤشر التحميل فقط إذا كنا لسنا في صفحة تعديل الملف الشخصي
        if (!isEditing) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching places data:", error);
        if (!isEditing) {
          setIsLoading(false);
        }
      }
    };

    getPlacesData();
  }, [
    location,
    radius,
    streetsInWorkRange,
    hospitalsInWorkRange,
    mosquesInWorkRange,
    isEditing,
  ]);

  // Handle radius change
  const handleRadiusChange = (e) => {
    const newRadius = parseFloat(e.target.value);
    if (setRadius) {
      setRadius(newRadius);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mapa */}
      <div className="space-y-2">
        {isEditing && (
          <div
            className={`p-3 rounded-md border mb-2 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-blue-50 border-blue-200"
            } transition-colors duration-300`}
          >
            <p
              className={`font-medium flex items-center justify-center ${
                darkMode ? "text-indigo-300" : "text-indigo-700"
              } transition-colors duration-300`}
            >
              انقر على الخريطة لتغيير موقعك
              <span
                className={`inline-block animate-pulse p-1 rounded-full mr-2 ${
                  darkMode ? "bg-indigo-900" : "bg-blue-200"
                } transition-colors duration-300`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${
                    darkMode ? "text-indigo-400" : "text-blue-700"
                  } transition-colors duration-300`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
            </p>
          </div>
        )}
        <div
          style={{ height }}
          className={`rounded-lg overflow-hidden shadow-md border ${
            darkMode ? "border-gray-700" : "border-indigo-200"
          } transition-colors duration-300`}
        >
          <MapContainer
            center={[location.lat, location.lng]}
            zoom={13}
            scrollWheelZoom={isEditing}
            style={{ height: "100%", width: "100%" }}
            attributionControl={true}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* مكون التعامل مع أحداث النقر */}
            <LocationMarkerWithEvents
              isEditing={isEditing}
              location={location}
              setLocation={setLocation}
            />

            {/* مكون التحكم في مركز الخريطة */}
            <MapController location={location} />

            {/* Display selected location marker */}
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
          </MapContainer>
        </div>
      </div>

      {/* Control de radio - solo visible en modo edición */}
      {isEditing && (
        <div
          className={`p-4 rounded-md shadow-sm border mb-4 ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-gradient-to-r from-blue-50 to-indigo-100 border-indigo-200"
          } transition-colors duration-300`}
        >
          <div className="flex items-center">
            <div className="flex-1">
              <label
                className={`block text-base font-medium mb-1 ${
                  darkMode ? "text-indigo-300" : "text-indigo-700"
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
              <div className="relative pt-1">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={radius}
                  onChange={handleRadiusChange}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-indigo-500 ${
                    darkMode ? "bg-indigo-900" : "bg-indigo-200"
                  } transition-colors duration-300`}
                />
                <div
                  className={`flex justify-between text-xs px-1 pt-2 ${
                    darkMode ? "text-indigo-400" : "text-indigo-600"
                  } transition-colors duration-300`}
                >
                  <span>1 كم</span>
                  <span>2 كم</span>
                  <span>3 كم</span>
                  <span>4 كم</span>
                  <span>5 كم</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* قسم الشوارع */}
      <div
        className={`p-4 rounded-md shadow-sm border ${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-gradient-to-r from-blue-50 to-indigo-100 border-indigo-200"
        } transition-colors duration-300`}
      >
        <div className="flex justify-between items-center mb-2">
          <h4
            className={`font-medium pr-2 border-r-4 ${
              darkMode
                ? "text-indigo-300 border-indigo-600"
                : "text-indigo-700 border-indigo-400"
            } transition-colors duration-300`}
          >
            الشوارع ضمن نطاق عملك:
          </h4>
          {isLoading && !isEditing && (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500 mr-2"></div>
              <span className="text-xs text-indigo-500">جاري التحميل...</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
          {!isLoading && streets.length > 0 ? (
            streets.slice(0, showAllStreets ? 25 : 10).map((street, index) => (
              <div
                key={`street-${index}`}
                className={`flex items-center rounded-full px-3 py-1 shadow-sm hover:shadow-md transition-all duration-200 ${
                  darkMode
                    ? "bg-gray-700/80 border-gray-600 text-gray-200"
                    : "bg-indigo-50/80 border border-indigo-100"
                }`}
              >
                <span className="mr-1">{street}</span>
              </div>
            ))
          ) : !isLoading ? (
            <div
              className={`w-full text-center py-2 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              لم يتم تحديد أي شوارع بعد.
            </div>
          ) : null}
        </div>
        {!isLoading && streets.length > 10 && (
          <button
            type="button"
            onClick={() => setShowAllStreets(!showAllStreets)}
            className={`mt-2 focus:outline-none transition-colors duration-200 border-b ${
              darkMode
                ? "text-indigo-400 hover:text-indigo-300 border-gray-700 hover:border-indigo-400"
                : "text-indigo-500 hover:text-indigo-700 border-indigo-200 hover:border-indigo-500"
            }`}
          >
            {showAllStreets ? "عرض أقل" : "عرض المزيد"}
          </button>
        )}
      </div>

      {/* قسم المساجد */}
      <div
        className={`p-4 rounded-md shadow-sm border mt-4 ${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-gradient-to-r from-blue-50 to-indigo-100 border-indigo-200"
        } transition-colors duration-300`}
      >
        <div className="flex justify-between items-center mb-2">
          <h4
            className={`font-medium pr-2 border-r-4 ${
              darkMode
                ? "text-indigo-300 border-indigo-600"
                : "text-indigo-700 border-indigo-400"
            } transition-colors duration-300`}
          >
            المساجد ضمن نطاق عملك:
          </h4>
          {isLoading && !isEditing && (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500 mr-2"></div>
              <span className="text-xs text-indigo-500">جاري التحميل...</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
          {!isLoading && mosques.length > 0 ? (
            mosques.slice(0, showAllMosques ? 25 : 5).map((mosque, index) => (
              <div
                key={`mosque-${index}`}
                className={`flex items-center rounded-full px-3 py-1 shadow-sm hover:shadow-md transition-all duration-200 ${
                  darkMode
                    ? "bg-gray-700/80 border-gray-600 text-gray-200"
                    : "bg-green-50/80 border border-green-100"
                }`}
              >
                <span className="mr-1">{mosque}</span>
              </div>
            ))
          ) : !isLoading ? (
            <div
              className={`w-full text-center py-2 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              لم يتم تحديد أي مساجد بعد.
            </div>
          ) : null}
        </div>
        {!isLoading && mosques.length > 5 && (
          <button
            type="button"
            onClick={() => setShowAllMosques(!showAllMosques)}
            className={`mt-2 focus:outline-none transition-colors duration-200 border-b ${
              darkMode
                ? "text-indigo-400 hover:text-indigo-300 border-gray-700 hover:border-indigo-400"
                : "text-indigo-500 hover:text-indigo-700 border-indigo-200 hover:border-indigo-500"
            }`}
          >
            {showAllMosques ? "عرض أقل" : "عرض المزيد"}
          </button>
        )}
      </div>

      {/* قسم المستشفيات */}
      <div
        className={`p-4 rounded-md shadow-sm border mt-4 ${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-gradient-to-r from-blue-50 to-indigo-100 border-indigo-200"
        } transition-colors duration-300`}
      >
        <div className="flex justify-between items-center mb-2">
          <h4
            className={`font-medium pr-2 border-r-4 ${
              darkMode
                ? "text-indigo-300 border-indigo-600"
                : "text-indigo-700 border-indigo-400"
            } transition-colors duration-300`}
          >
            المستشفيات والأطباء والصيدليات ضمن نطاق عملك:
          </h4>
          {isLoading && !isEditing && (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500 mr-2"></div>
              <span className="text-xs text-indigo-500">جاري التحميل...</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
          {!isLoading && hospitals.length > 0 ? (
            hospitals
              .slice(0, showAllHospitals ? 25 : 5)
              .map((hospital, index) => (
                <div
                  key={`hospital-${index}`}
                  className={`flex items-center rounded-full px-3 py-1 shadow-sm hover:shadow-md transition-all duration-200 ${
                    darkMode
                      ? "bg-gray-700/80 border-gray-600 text-gray-200"
                      : "bg-red-50/80 border border-red-100"
                  }`}
                >
                  <span className="mr-1">{hospital}</span>
                </div>
              ))
          ) : !isLoading ? (
            <div
              className={`w-full text-center py-2 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              لم يتم تحديد أي مستشفيات بعد.
            </div>
          ) : null}
        </div>
        {!isLoading && hospitals.length > 5 && (
          <button
            type="button"
            onClick={() => setShowAllHospitals(!showAllHospitals)}
            className={`mt-2 focus:outline-none transition-colors duration-200 border-b ${
              darkMode
                ? "text-indigo-400 hover:text-indigo-300 border-gray-700 hover:border-indigo-400"
                : "text-indigo-500 hover:text-indigo-700 border-indigo-200 hover:border-indigo-500"
            }`}
          >
            {showAllHospitals ? "عرض أقل" : "عرض المزيد"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileMap;
