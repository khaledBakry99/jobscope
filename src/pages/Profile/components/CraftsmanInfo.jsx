import React from "react";
import { Star, MapPin, Phone, Calendar, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import LazyImage from "../../../components/common/LazyImage";

const CraftsmanInfo = ({ craftsman, darkMode, onBookingClick }) => {
  // التحقق من حالة تسجيل الدخول
  const isLoggedIn = localStorage.getItem("token") !== null;
  return (
    <Card
      className={`overflow-hidden ${
        darkMode
          ? "bg-gray-800 text-gray-200"
          : "bg-gradient-to-br from-blue-50 to-indigo-100"
      } transition-colors duration-300`}
    >
      <div className="h-96 overflow-hidden">
        <LazyImage
          src={craftsman.image || "/img/user-avatar.svg"}
          alt={craftsman.name || "حرفي"}
          className="w-full h-full object-cover"
          placeholderClassName="w-full h-full bg-gray-200 animate-pulse"
          onError={() => {
            console.log("Error in CraftsmanInfo image:", craftsman.image);
          }}
        />
      </div>
      <div className="p-4">
        <h1
          className={`text-2xl font-bold mb-1 ${
            darkMode ? "text-indigo-300" : "text-indigo-800"
          } transition-colors duration-300`}
        >
          {craftsman.name}
        </h1>
        <div
          className={`${
            darkMode ? "text-indigo-400" : "text-indigo-600"
          } mb-4 transition-colors duration-300`}
        >
          {craftsman.professions && craftsman.professions.length > 0 ? (
            <div className="space-y-2">
              {craftsman.professions.map((profession, index) => {
                // البحث عن التخصصات المرتبطة بهذه المهنة
                let relatedSpecializations = [];

                // إذا كانت التخصصات موجودة، نعرضها
                if (
                  craftsman.specializations &&
                  craftsman.specializations.length > 0
                ) {
                  relatedSpecializations = craftsman.specializations;
                }

                return (
                  <div key={index} className="flex flex-col">
                    <div
                      className={`font-medium ${
                        darkMode ? "text-indigo-300" : "text-indigo-700"
                      }`}
                    >
                      {profession}
                    </div>
                    <div className="mr-4 text-sm">
                      {relatedSpecializations.length > 0
                        ? relatedSpecializations.join(", ")
                        : "لا توجد تخصصات"}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : craftsman.profession ? (
            <div className="flex flex-col">
              <div
                className={`font-medium ${
                  darkMode ? "text-indigo-300" : "text-indigo-700"
                }`}
              >
                {craftsman.profession}
              </div>
              {craftsman.specialization && (
                <div className="mr-4 text-sm">{craftsman.specialization}</div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500">لم يتم تحديد مهنة</div>
          )}
        </div>

        <div className="flex items-center mb-4">
          <Star size={20} className="text-indigo-500 fill-indigo-500" />
          <span className="mr-1 text-lg">{craftsman.rating}</span>
          <span
            className={`mr-2 ${
              darkMode ? "text-indigo-400" : "text-indigo-500"
            } transition-colors duration-300`}
          >
            (12 تقييم)
          </span>
        </div>

        <div className="flex items-center mb-4">
          <MapPin
            size={20}
            className={`${
              darkMode ? "text-indigo-400" : "text-indigo-500"
            } transition-colors duration-300`}
          />
          <span
            className={`mr-1 ${
              darkMode ? "text-indigo-300" : "text-indigo-700"
            } transition-colors duration-300`}
          >
            نطاق العمل: {craftsman.workRadius} كم
          </span>
        </div>

        <div className="flex items-center mb-4">
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              craftsman.available
                ? "bg-indigo-200 text-green-80"
                : "bg-red-100 text-red-800"
            }`}
          >
            {craftsman.available ? "متاح الآن" : "غير متاح حالياً"}
          </span>
        </div>

        <div className="flex flex-col space-y-2">
          {isLoggedIn ? (
            <Button
              variant="primary"
              className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-2 px-4 ${
                darkMode
                  ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              }`}
              onClick={() =>
                craftsman.phone
                  ? window.open(`tel:${craftsman.phone}`)
                  : alert("رقم الهاتف غير متوفر")
              }
            >
              <span className="relative z-10 flex items-center">
                <Phone size={18} className="ml-2" />
                اتصل الآن
              </span>
              <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            </Button>
          ) : (
            <Link to="/login" className="w-full">
              <Button
                variant="primary"
                className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-2 px-4 w-full ${
                  darkMode
                    ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                }`}
              >
                <span className="relative z-10 flex items-center">
                  <Phone size={18} className="ml-2" />
                  سجل دخول للاتصال
                </span>
                <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </Button>
            </Link>
          )}

          {isLoggedIn ? (
            <Button
              variant="primary"
              className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-2 px-4 ${
                darkMode
                  ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              }`}
              onClick={onBookingClick}
              disabled={!craftsman.available}
            >
              <span className="relative z-10 flex items-center">
                <Calendar size={18} className="ml-2" />
                احجز موعداً
              </span>
              <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            </Button>
          ) : (
            <div className="w-full">
              <Link to="/login" className="w-full">
                <Button
                  variant="primary"
                  className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-2 px-4 w-full ${
                    darkMode
                      ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                      : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                  }`}
                >
                  <span className="relative z-10 flex items-center">
                    <Calendar size={18} className="ml-2" />
                    سجل دخول للحجز
                  </span>
                  <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                </Button>
              </Link>
              <div
                className={`flex items-center mt-2 text-sm ${
                  darkMode ? "text-yellow-300" : "text-yellow-600"
                }`}
              >
                <AlertCircle size={16} className="ml-1" />
                <span>يجب تسجيل الدخول لحجز موعد مع الحرفي</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CraftsmanInfo;
