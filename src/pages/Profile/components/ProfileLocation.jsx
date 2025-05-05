import React from "react";
import Card from "../../../components/common/Card";
import ProfileMap from "../../../components/maps/ProfileMap";
import useThemeStore from "../../../store/themeStore";

const ProfileLocation = ({
  location,
  workRadius,
  isEditing,
  onLocationChange,
  onRadiusChange,
  streetsInWorkRange = [],
  hospitalsInWorkRange = [],
  mosquesInWorkRange = [],
  neighborhoodsInWorkRange = [],
}) => {
  const darkMode = useThemeStore((state) => state.darkMode);
  return (
    <Card
      className={`p-6 mb-6 ${
        darkMode
          ? "bg-gray-800 text-gray-200 border-gray-700"
          : "bg-gradient-to-br from-blue-50 to-indigo-100 border-indigo-200"
      } shadow-md border transition-colors duration-300`}
    >
      <h2
        className={`text-xl font-bold mb-4 ${
          darkMode ? "text-indigo-300" : "text-indigo-800"
        } relative inline-block transition-colors duration-300`}
      >
        <span className="relative z-10">الموقع ونطاق العمل</span>
        <span
          className={`absolute bottom-0 left-0 right-0 h-2 ${
            darkMode ? "bg-indigo-500" : "bg-indigo-300"
          } opacity-40 transform -rotate-1 z-0`}
        ></span>
      </h2>
      {isEditing ? (
        <ProfileMap
          location={location}
          setLocation={onLocationChange}
          radius={workRadius}
          setRadius={onRadiusChange}
          height="300px"
          isEditing={true}
          showRadius={true}
          streetsInWorkRange={streetsInWorkRange}
          hospitalsInWorkRange={hospitalsInWorkRange}
          mosquesInWorkRange={mosquesInWorkRange}
          neighborhoodsInWorkRange={neighborhoodsInWorkRange}
        />
      ) : (
        <div className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
          <div className="flex items-center mb-3">
            <div
              className={`flex items-center ${
                darkMode ? "text-indigo-300" : "text-indigo-600"
              }`}
            >
              <span className="ml-2 font-bold">نطاق العمل:</span>
              <span>{workRadius} كم</span>
            </div>
          </div>

          {/* عرض الشوارع ضمن نطاق العمل */}
          {streetsInWorkRange && streetsInWorkRange.length > 0 && (
            <div className="mb-3">
              <h3
                className={`text-base font-bold mb-2 ${
                  darkMode ? "text-indigo-300" : "text-indigo-700"
                }`}
              >
                الشوارع ضمن نطاق العمل:
              </h3>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
                {streetsInWorkRange.slice(0, 20).map((street, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm ${
                      darkMode
                        ? "bg-gray-700 text-gray-200"
                        : "bg-white text-gray-800 border border-indigo-200"
                    }`}
                  >
                    {street}
                  </span>
                ))}
                {streetsInWorkRange.length > 20 && (
                  <span
                    className={`text-sm ${
                      darkMode ? "text-indigo-300" : "text-indigo-600"
                    }`}
                  >
                    +{streetsInWorkRange.length - 20} شارع آخر
                  </span>
                )}
              </div>
            </div>
          )}

          {/* عرض المستشفيات ضمن نطاق العمل */}
          {hospitalsInWorkRange && hospitalsInWorkRange.length > 0 && (
            <div className="mb-3">
              <h3
                className={`text-base font-bold mb-2 ${
                  darkMode ? "text-indigo-300" : "text-indigo-700"
                }`}
              >
                المستشفيات والعيادات ضمن نطاق العمل:
              </h3>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
                {hospitalsInWorkRange.slice(0, 20).map((hospital, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm ${
                      darkMode
                        ? "bg-gray-700 text-gray-200"
                        : "bg-red-50 text-gray-800 border border-red-200"
                    }`}
                  >
                    {hospital}
                  </span>
                ))}
                {hospitalsInWorkRange.length > 20 && (
                  <span
                    className={`text-sm ${
                      darkMode ? "text-indigo-300" : "text-indigo-600"
                    }`}
                  >
                    +{hospitalsInWorkRange.length - 20} مستشفى آخر
                  </span>
                )}
              </div>
            </div>
          )}

          {/* عرض المساجد ضمن نطاق العمل */}
          {mosquesInWorkRange && mosquesInWorkRange.length > 0 && (
            <div>
              <h3
                className={`text-base font-bold mb-2 ${
                  darkMode ? "text-indigo-300" : "text-indigo-700"
                }`}
              >
                المساجد ضمن نطاق العمل:
              </h3>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
                {mosquesInWorkRange.slice(0, 20).map((mosque, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm ${
                      darkMode
                        ? "bg-gray-700 text-gray-200"
                        : "bg-green-50 text-gray-800 border border-green-200"
                    }`}
                  >
                    {mosque}
                  </span>
                ))}
                {mosquesInWorkRange.length > 20 && (
                  <span
                    className={`text-sm ${
                      darkMode ? "text-indigo-300" : "text-indigo-600"
                    }`}
                  >
                    +{mosquesInWorkRange.length - 20} مسجد آخر
                  </span>
                )}
              </div>
            </div>
          )}

          {/* رسالة إذا لم تكن هناك بيانات */}
          {streetsInWorkRange.length === 0 &&
            hospitalsInWorkRange.length === 0 &&
            mosquesInWorkRange.length === 0 && (
              <div className="text-center py-4">
                <p
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  لا توجد معلومات متاحة عن الأماكن ضمن نطاق العمل
                </p>
              </div>
            )}
        </div>
      )}
    </Card>
  );
};

export default ProfileLocation;
