import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap, Polygon } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import useThemeStore from "../../store/themeStore";
import { X } from "lucide-react";

// مكون لإضافة أدوات الرسم إلى الخريطة
const DrawTools = ({ onAreaChange }) => {
  const map = useMap();
  const drawControlRef = useRef(null);
  const drawnItemsRef = useRef(null);

  useEffect(() => {
    // إنشاء طبقة للعناصر المرسومة
    drawnItemsRef.current = new L.FeatureGroup();
    map.addLayer(drawnItemsRef.current);

    // إنشاء أدوات الرسم
    drawControlRef.current = new L.Control.Draw({
      draw: {
        marker: false,
        circlemarker: false,
        circle: {
          shapeOptions: {
            color: "#3730A3",
            fillColor: "#3730A3",
            fillOpacity: 0.2,
          },
        },
        rectangle: {
          shapeOptions: {
            color: "#3730A3",
            fillColor: "#3730A3",
            fillOpacity: 0.2,
          },
        },
        polygon: {
          allowIntersection: false,
          drawError: {
            color: "#e1e100",
            message: "<strong>خطأ:</strong> لا يمكن تقاطع المضلعات!",
          },
          shapeOptions: {
            color: "#3730A3",
            fillColor: "#3730A3",
            fillOpacity: 0.2,
          },
        },
        polyline: false,
      },
      edit: {
        featureGroup: drawnItemsRef.current,
        remove: true,
      },
    });

    map.addControl(drawControlRef.current);

    // استماع لأحداث الرسم
    map.on(L.Draw.Event.CREATED, handleDrawCreated);
    map.on(L.Draw.Event.DELETED, handleDrawDeleted);
    map.on(L.Draw.Event.EDITED, handleDrawEdited);

    return () => {
      if (map && drawControlRef.current) {
        map.removeControl(drawControlRef.current);
      }

      map.off(L.Draw.Event.CREATED, handleDrawCreated);
      map.off(L.Draw.Event.DELETED, handleDrawDeleted);
      map.off(L.Draw.Event.EDITED, handleDrawEdited);
    };
  }, [map]);

  // معالجة إنشاء شكل جديد
  const handleDrawCreated = (e) => {
    const layer = e.layer;
    drawnItemsRef.current.addLayer(layer);
    updateAreas();
  };

  // معالجة حذف شكل
  const handleDrawDeleted = () => {
    updateAreas();
  };

  // معالجة تعديل شكل
  const handleDrawEdited = () => {
    updateAreas();
  };

  // تحديث مناطق الخدمة
  const updateAreas = () => {
    const areas = [];

    drawnItemsRef.current.eachLayer((layer) => {
      if (layer instanceof L.Polygon) {
        // مضلع (بما في ذلك المستطيل)
        const coordinates = layer
          .getLatLngs()[0]
          .map((point) => [point.lat, point.lng]);
        areas.push({
          type: "polygon",
          coordinates,
        });
      } else if (layer instanceof L.Circle) {
        // دائرة
        areas.push({
          type: "circle",
          center: [layer.getLatLng().lat, layer.getLatLng().lng],
          radius: layer.getRadius(),
        });
      }
    });

    onAreaChange(areas);
  };

  return null;
};

// مكون تحديد مناطق الخدمة
const ServiceAreaSelector = ({
  initialAreas = [],
  neighborhoods = [],
  onAreaChange,
  onClose,
}) => {
  const darkMode = useThemeStore((state) => state.darkMode);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState([]);
  const [customAreas, setCustomAreas] = useState(initialAreas);

  // تحديث مناطق الخدمة عند تغيير الأحياء المحددة أو المناطق المخصصة
  useEffect(() => {
    const areas = [
      ...customAreas,
      ...selectedNeighborhoods.map((id) => {
        const neighborhood = neighborhoods.find((n) => n.id === id);
        return {
          type: "neighborhood",
          id,
          name: neighborhood?.name || "",
          coordinates: neighborhood?.coordinates || [],
        };
      }),
    ];

    onAreaChange(areas);
  }, [customAreas, selectedNeighborhoods, neighborhoods, onAreaChange]);

  // التبديل بين تحديد وإلغاء تحديد الحي
  const toggleNeighborhood = (id) => {
    setSelectedNeighborhoods((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // معالجة تغيير المناطق المخصصة
  const handleCustomAreaChange = (areas) => {
    setCustomAreas(areas);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-auto rounded-lg shadow-xl ${
          darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
        }`}
      >
        {/* رأس النافذة */}
        <div
          className={`p-4 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          } flex justify-between items-center`}
        >
          <h2 className="text-xl font-bold">تحديد مناطق الخدمة</h2>

          <button
            onClick={onClose}
            className={`p-1 rounded-full ${
              darkMode
                ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            } transition-colors`}
          >
            <X size={24} />
          </button>
        </div>

        {/* محتوى النافذة */}
        <div className="p-4">
          <div className="mb-4">
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              } mb-2`}
            >
              يمكنك تحديد مناطق الخدمة الخاصة بك إما برسم منطقة مخصصة على
              الخريطة أو باختيار أحياء محددة
            </p>

            {/* الخريطة مع أدوات الرسم */}
            <div className="h-[400px] w-full rounded-lg overflow-hidden shadow-md mb-4">
              <MapContainer
                center={[33.5138, 36.2765]} // دمشق كمركز افتراضي
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <DrawTools onAreaChange={handleCustomAreaChange} />

                {/* عرض الأحياء المحددة */}
                {selectedNeighborhoods.map((id) => {
                  const neighborhood = neighborhoods.find((n) => n.id === id);
                  if (!neighborhood || !neighborhood.coordinates) return null;

                  return (
                    <Polygon
                      key={id}
                      positions={neighborhood.coordinates}
                      pathOptions={{
                        color: "#3730A3",
                        fillColor: "#3730A3",
                        fillOpacity: 0.3,
                      }}
                    />
                  );
                })}
              </MapContainer>
            </div>

            {/* تعليمات استخدام الخريطة */}
            <div
              className={`p-3 rounded-md text-sm mb-4 ${
                darkMode
                  ? "bg-indigo-900/30 text-indigo-300"
                  : "bg-indigo-50 text-indigo-800"
              }`}
            >
              <p className="font-bold mb-1">تعليمات:</p>
              <ul className="list-disc list-inside">
                <li>
                  استخدم أدوات الرسم في الجانب الأيسر من الخريطة لرسم مناطق خدمة
                  مخصصة
                </li>
                <li>يمكنك رسم دوائر أو مستطيلات أو مضلعات حسب احتياجاتك</li>
                <li>
                  يمكنك تعديل أو حذف المناطق المرسومة باستخدام أدوات التحرير
                </li>
              </ul>
            </div>
          </div>



          {/* أزرار التحكم */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onClose}
              className={`py-2 px-4 rounded ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              } transition-colors`}
            >
              إلغاء
            </button>

            <button
              onClick={() => {
                // تطبيق الفلترة ثم إغلاق النافذة
                onAreaChange(customAreas);
                onClose();
              }}
              className={`py-2 px-4 rounded ${
                darkMode
                  ? "bg-indigo-700 hover:bg-indigo-600 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              } transition-colors`}
            >
              تطبيق وحفظ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceAreaSelector;
