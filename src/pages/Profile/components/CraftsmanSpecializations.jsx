import React from "react";
import Card from "../../../components/common/Card";

const CraftsmanSpecializations = ({ craftsman, darkMode }) => {
  return (
    <Card
      className={`p-6 mb-6 ${
        darkMode
          ? "bg-gray-800 text-gray-200"
          : "bg-gradient-to-br from-blue-50 to-indigo-100"
      } shadow-md transition-colors duration-300`}
    >
      <h2
        className={`text-xl font-bold mb-4 ${
          darkMode ? "text-indigo-300" : "text-indigo-800"
        } relative inline-block transition-colors duration-300`}
      >
        <span className="relative z-10">التخصصات</span>
        <span
          className={`absolute bottom-0 left-0 right-0 h-2 ${
            darkMode ? "bg-indigo-500" : "bg-indigo-300"
          } opacity-40 transform -rotate-1 z-0`}
        ></span>
      </h2>
      <div className="space-y-4">
        {craftsman.professions &&
          craftsman.professions.map((profession, index) => {
            const relatedSpecializations = [];

            // Datos de ejemplo para mostrar especialidades relacionadas con cada profesión
            const professionsData = [
              {
                id: 1,
                name: "كهربائي",
                specializations: [
                  "تمديدات منزلية",
                  "صيانة أعطال",
                  "تركيب إنارة",
                ],
              },
              {
                id: 2,
                name: "سباك",
                specializations: [
                  "تمديدات صحية",
                  "إصلاح تسريبات",
                  "تركيب أدوات صحية",
                ],
              },
              {
                id: 3,
                name: "نجار",
                specializations: [
                  "أثاث منزلي",
                  "أبواب وشبابيك",
                  "ديكورات خشبية",
                ],
              },
              {
                id: 4,
                name: "دهان",
                specializations: [
                  "دهانات داخلية",
                  "دهانات خارجية",
                  "ديكورات جبسية",
                ],
              },
              {
                id: 5,
                name: "تكييف وتبريد",
                specializations: [
                  "تركيب مكيفات",
                  "صيانة ثلاجات",
                  "إصلاح مكيفات",
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
              craftsman.specializations.forEach((spec) => {
                if (profData.specializations.includes(spec)) {
                  relatedSpecializations.push(spec);
                }
              });
            }

            return (
              <div key={index} className="flex flex-col">
                <div
                  className={`font-medium ${
                    darkMode
                      ? "text-indigo-300"
                      : "text-indigo-700"
                  }`}
                >
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
    </Card>
  );
};

export default CraftsmanSpecializations;
