import React, { useEffect } from "react";
import { Briefcase, Star } from "lucide-react";
import useThemeStore from "../../store/themeStore";

const MapFilter = ({
  professions = [],
  selectedProfessions = [],
  onProfessionChange,
  selectedRating = 0,
  onRatingChange,
  searchRadius = 5,
  onRadiusChange,
}) => {
  const darkMode = useThemeStore((state) => state.darkMode);

  // التبديل بين تحديد وإلغاء تحديد المهنة
  const toggleProfession = (profession) => {
    if (selectedProfessions.includes(profession)) {
      onProfessionChange(selectedProfessions.filter((p) => p !== profession));
    } else {
      onProfessionChange([...selectedProfessions, profession]);
    }
  };

  // تأكد من عدم وجود مهنة محددة افتراضيًا
  useEffect(() => {
    // إذا كان هناك مهن محددة، تأكد من أنها موجودة في قائمة المهن
    if (selectedProfessions.length > 0) {
      // إعادة تعيين المهن المحددة إلى مصفوفة فارغة عند تحميل المكون
      onProfessionChange([]);
    }
  }, []);

  // تحديد تقييم معين
  const handleRatingSelect = (rating) => {
    onRatingChange(rating === selectedRating ? 0 : rating);
  };

  return (
    <div
      className={`map-filter-container ${
        darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
      } shadow-md`}
    >
      {/* عنوان الفلتر */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">فلترة النتائج</h3>
      </div>

      {/* فلتر المهن */}
      <div className="map-filter-group">
        <div className="map-filter-title flex items-center">
          <Briefcase size={16} className="ml-1" />
          المهنة
        </div>

        <div className="map-filter-options">
          {professions.map((profession) => (
            <div
              key={profession}
              onClick={() => toggleProfession(profession)}
              className={`map-filter-option ${
                selectedProfessions.includes(profession) ? "active" : ""
              } ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {profession}
            </div>
          ))}
        </div>
      </div>

      {/* فلتر التقييم */}
      <div className="map-filter-group">
        <div className="map-filter-title flex items-center">
          <Star size={16} className="ml-1" />
          التقييم
        </div>

        <div className="map-filter-options">
          {[1, 2, 3, 4, 5].map((rating) => (
            <div
              key={rating}
              onClick={() => handleRatingSelect(rating)}
              className={`map-filter-option ${
                selectedRating >= rating && selectedRating > 0 ? "active" : ""
              } ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {rating}+
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};

export default MapFilter;
