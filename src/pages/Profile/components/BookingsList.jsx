import React from "react";
import { Link } from "react-router-dom";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import useThemeStore from "../../../store/themeStore";

const BookingsList = ({ bookings, userType }) => {
  const darkMode = useThemeStore((state) => state.darkMode);

  // Función para formatear la hora en formato de 12 horas con indicador AM/PM en árabe
  const formatTime = (timeString) => {
    // Convertir el formato de 24 horas a formato de 12 horas con indicador AM/PM en árabe
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "م" : "ص"; // م para PM, ص para AM
    const hour12 = hour % 12 || 12; // Convertir 0 a 12
    return `${hour12}:${minutes} ${ampm}`;
  };
  return (
    <Card
      className={`p-6 mb-6 ${
        darkMode ? "bg-gray-800 text-gray-200" : "bg-blue-50"
      } shadow-md transition-colors duration-300`}
    >
      <h2
        className={`text-xl font-bold mb-4 ${
          darkMode ? "text-indigo-300" : "text-indigo-800"
        } relative inline-block transition-colors duration-300`}
      >
        <span className="relative z-10">طلباتي</span>
        <span
          className={`absolute bottom-0 left-0 right-0 h-2 ${
            darkMode ? "bg-indigo-500" : "bg-indigo-300"
          } opacity-40 transform -rotate-1 z-0`}
        ></span>
      </h2>

      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="border-b pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3
                    className={`font-bold text-lg mb-1 ${
                      darkMode ? "text-indigo-300" : ""
                    } transition-colors duration-300`}
                  >
                    {userType === "client"
                      ? booking.craftsmanName
                      : booking.clientName}
                  </h3>
                  <p
                    className={`mb-2 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } transition-colors duration-300`}
                  >
                    {new Date(booking.date).toLocaleDateString("ar-SY")} -{" "}
                    {formatTime(booking.time)}
                  </p>
                  <p className={`mb-2 ${darkMode ? "text-gray-300" : ""}`}>
                    {booking.description}
                  </p>
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium shadow-sm transition-all duration-200 ${
                        booking.status === "completed"
                          ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300"
                          : booking.status === "pending"
                          ? "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300"
                          : "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300"
                      }`}
                    >
                      {booking.status === "completed"
                        ? "مكتمل"
                        : booking.status === "pending"
                        ? "قيد الانتظار"
                        : "ملغي"}
                    </span>
                  </div>
                </div>
                <Link to={`/booking/${booking.id}`}>
                  <Button
                    variant="secondary"
                    className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200  relative overflow-hidden group text-sm py-2 px-4 ${
                      darkMode
                        ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                        : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                    }`}
                  >
                    <span className="relative z-10">التفاصيل</span>
                    <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p
          className={`text-center ${
            darkMode ? "text-gray-400" : "text-gray-500"
          } transition-colors duration-300`}
        >
          لا توجد طلبات حتى الآن
        </p>
      )}
    </Card>
  );
};

export default BookingsList;
