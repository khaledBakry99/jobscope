import React, { useEffect, useState } from "react";
import { Star, MapPin, Clock, Calendar } from "lucide-react";
import Card from "../../../components/common/Card";
import useThemeStore from "../../../store/themeStore";
import LazyImage from "../../../components/common/LazyImage";
import {
  isAvailableNow,
  getWorkingDaysText,
  getWorkingHoursText,
} from "../../../utils/availabilityUtils";

const ProfileHeader = ({ user, userType }) => {
  const darkMode = useThemeStore((state) => state.darkMode);
  const [isAvailable, setIsAvailable] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // تحديث الوقت الحالي كل دقيقة للتحقق من توفر الحرفي
  useEffect(() => {
    // التحقق من توفر الحرفي عند تحميل المكون
    if (user && user.workingHours) {
      setIsAvailable(isAvailableNow(user.workingHours));
    }

    // تحديث الوقت كل دقيقة
    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      if (user && user.workingHours) {
        setIsAvailable(isAvailableNow(user.workingHours));
      }
    }, 60000); // 60000 مللي ثانية = دقيقة واحدة

    return () => clearInterval(intervalId);
  }, [user]);

  return (
    <Card
      className={`overflow-hidden ${
        darkMode
          ? "bg-gray-800 text-gray-200 border-gray-700"
          : "bg-gradient-to-br from-blue-50 to-indigo-100 border-indigo-200"
      } shadow-lg border transition-colors duration-300`}
    >
      <div className="h-96 overflow-hidden">
        <LazyImage
          src={user.image}
          alt={user.name}
          className="w-full h-full object-cover"
          placeholderClassName="w-full h-full bg-gray-200 animate-pulse"
          onError={() =>
            console.log("Error loading profile image:", user.image)
          }
        />
      </div>
      <div className="p-4">
        <h1
          className={`text-2xl font-bold mb-1 ${
            darkMode ? "text-indigo-300" : "text-indigo-800"
          } transition-colors duration-300`}
        >
          {user.name}
        </h1>
        {userType === "craftsman" && (
          <>
            <div className="text-indigo-600 mb-4">
              {user.professions && user.specializations ? (
                <div className="space-y-2">
                  {user.professions.map((profession, index) => {
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
                      user.specializations.forEach((spec) => {
                        if (profData.specializations.includes(spec)) {
                          relatedSpecializations.push(spec);
                        }
                      });
                    }

                    return (
                      <div key={index} className="flex flex-col">
                        <div className="font-medium text-indigo-700">
                          {profession}
                        </div>
                        <div className="mr-4 text-sm">
                          {relatedSpecializations.length > 0
                            ? relatedSpecializations.join(", ")
                            : "تخصصات متعددة"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="font-medium">
                  {user.profession} - {user.specialization}
                </p>
              )}
            </div>

            <div className="flex items-center mb-4">
              <Star size={20} className="text-yellow-500 fill-yellow-500" />
              <span className="mr-1 text-lg">{user.rating || 0}</span>
              <span className="mr-2 text-indigo-500">
                ({user.reviewCount || 0} تقييم)
              </span>
            </div>

            <div className="flex items-center mb-4">
              <MapPin size={20} className="text-indigo-500" />
              <span className="mr-1 text-indigo-600">
                نطاق العمل: {user.workRadius} كم
              </span>
            </div>

            {/* أوقات الدوام والتوفر */}
            <div className="space-y-3 mb-4">
              {/* حالة التوفر */}
              <div className="flex items-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm transition-all duration-200 ${
                    isAvailable
                      ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300"
                      : "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300"
                  }`}
                >
                  {isAvailable ? "متاح الآن" : "غير متاح حالياً"}
                </span>
              </div>

              {/* أيام العمل */}
              {user.workingHours && (
                <div className="flex items-center">
                  <Calendar
                    size={18}
                    className={`ml-2 ${
                      darkMode ? "text-indigo-300" : "text-indigo-600"
                    }`}
                  />
                  <div
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <span className="font-medium ml-1">أيام العمل:</span>
                    <span>{getWorkingDaysText(user.workingHours)}</span>
                  </div>
                </div>
              )}

              {/* ساعات العمل */}
              {user.workingHours && (
                <div className="flex items-center">
                  <Clock
                    size={18}
                    className={`ml-2 ${
                      darkMode ? "text-indigo-300" : "text-indigo-600"
                    }`}
                  />
                  <div
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <span className="font-medium ml-1">ساعات العمل:</span>
                    <span>{getWorkingHoursText(user.workingHours)}</span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default ProfileHeader;
