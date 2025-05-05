import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Star,
  Edit,
} from "lucide-react";
import Button from "../common/Button";
import LazyImage from "../common/LazyImage";
import useThemeStore from "../../store/themeStore";
import useBookingStore from "../../store/bookingStore";
import useReviewStore from "../../store/reviewStore";
import BookingEditForm from "./BookingEditForm";

const BookingDetailsModal = ({
  booking,
  onClose,
  userType,
  showEditForm,
  setShowEditForm,
}) => {
  const darkMode = useThemeStore((state) => state.darkMode);
  const { updateBookingStatus } = useBookingStore();
  const getReviewById = useReviewStore((state) => state.getReviewById);

  const [canEdit, setCanEdit] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  // مرجع للشاشة المنبثقة
  const modalRef = useRef(null);

  // إضافة مستمع للنقرات خارج الشاشة
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    // إضافة مستمع الأحداث
    document.addEventListener("mousedown", handleClickOutside);

    // إزالة مستمع الأحداث عند إزالة المكون
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Obtener la valoración si existe
  const review = booking.reviewId ? getReviewById(booking.reviewId) : null;

  // Función para verificar si una reserva pendiente ha expirado
  const checkBookingExpired = () => {
    if (booking.status !== "pending") return false;

    const bookingDate = new Date(`${booking.date}T${booking.time}`);
    const now = new Date();

    // Si la fecha y hora de la reserva ya pasaron
    return now > bookingDate;
  };

  // Verificar si el booking puede ser editado (dentro de los primeros 5 minutos) y si ha expirado
  useEffect(() => {
    const checkEditabilityAndExpiration = () => {
      // Verificar si la reserva ha expirado
      if (checkBookingExpired()) {
        console.log(
          `La reserva #${booking.id} ha expirado. Cancelando automáticamente.`
        );
        updateBookingStatus(booking.id, "cancelled");
        onClose(); // Cerrar el modal
        return;
      }

      if (booking.status !== "pending") {
        setCanEdit(false);
        return;
      }

      const createdAt = new Date(booking.createdAt);
      const now = new Date();
      const diffInMinutes = (now - createdAt) / (1000 * 60);

      if (diffInMinutes <= 5) {
        setCanEdit(true);

        // Calcular tiempo restante
        const timeLeftInSeconds = Math.max(0, 5 * 60 - diffInMinutes * 60);
        const minutes = Math.floor(timeLeftInSeconds / 60);
        const seconds = Math.floor(timeLeftInSeconds % 60);
        setTimeLeft(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
      } else {
        setCanEdit(false);
      }
    };

    checkEditabilityAndExpiration();
    const timer = setInterval(checkEditabilityAndExpiration, 1000);

    return () => clearInterval(timer);
  }, [booking, updateBookingStatus, onClose]);

  const handleStatusChange = (status) => {
    updateBookingStatus(booking.id, status);
    onClose();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SY");
  };

  const formatTime = (timeString) => {
    // Convertir el formato de 24 horas a formato de 12 horas con indicador AM/PM en árabe
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "م" : "ص"; // م para PM, ص para AM
    const hour12 = hour % 12 || 12; // Convertir 0 a 12
    return `${hour12}:${minutes} ${ampm}`;
  };

  const isClient = userType === "client";
  const isCraftsman = userType === "craftsman";
  const otherPartyName = isClient ? booking.craftsmanName : booking.clientName;
  // Siempre mostrar el número del artesano, independientemente de quién esté viendo
  const craftsmanPhone = booking.craftsmanPhone || "";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <motion.div
        ref={modalRef}
        className={`${
          darkMode
            ? "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200"
            : "bg-gradient-to-br from-white to-indigo-50"
        } rounded-lg shadow-xl w-full max-w-2xl transition-colors duration-300 border ${
          darkMode ? "border-indigo-800/30" : "border-indigo-200"
        }`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="p-6">
          {/* Header with close button */}
          <div className="flex justify-between items-center mb-6">
            <h2
              className={`text-xl font-bold ${
                darkMode ? "text-indigo-300" : "text-indigo-800"
              } relative inline-block transition-colors duration-300`}
            >
              <span className="relative z-10">تفاصيل الطلب</span>
              <span
                className={`absolute bottom-0 left-0 right-0 h-2 ${
                  darkMode ? "bg-indigo-500" : "bg-indigo-300"
                } opacity-40 transform -rotate-1 z-0`}
              ></span>
            </h2>
            <button
              onClick={onClose}
              className={`${
                darkMode
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-500 hover:text-gray-700"
              } transition-colors duration-300 p-1 rounded-full hover:bg-gray-100/10`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Booking details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div
              className={`px-3 py-2 rounded-md shadow-sm ${
                darkMode
                  ? "bg-gray-700/80 border border-gray-600"
                  : "bg-white/80 border border-indigo-100"
              } transition-colors duration-300`}
            >
              <div className="flex items-center">
                <Calendar
                  size={20}
                  className={`${
                    darkMode ? "text-indigo-400" : "text-indigo-500"
                  } ml-2`}
                />
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-indigo-300" : "text-indigo-500"
                    } transition-colors duration-300`}
                  >
                    التاريخ
                  </p>
                  <p
                    className={`font-medium ${
                      darkMode ? "text-indigo-200" : "text-indigo-700"
                    } transition-colors duration-300`}
                  >
                    {booking.endDate
                      ? `${formatDate(booking.date)} - ${formatDate(
                          booking.endDate
                        )}`
                      : formatDate(booking.date)}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`px-3 py-2 rounded-md shadow-sm ${
                darkMode
                  ? "bg-gray-700/80 border border-gray-600"
                  : "bg-white/80 border border-indigo-100"
              } transition-colors duration-300`}
            >
              <div className="flex items-center">
                <Clock
                  size={20}
                  className={`${
                    darkMode ? "text-indigo-400" : "text-indigo-500"
                  } ml-2`}
                />
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-indigo-300" : "text-indigo-500"
                    } transition-colors duration-300`}
                  >
                    الوقت
                  </p>
                  <p
                    className={`font-medium ${
                      darkMode ? "text-indigo-200" : "text-indigo-700"
                    } transition-colors duration-300`}
                  >
                    {booking.endTime
                      ? `${formatTime(booking.time)} - ${formatTime(
                          booking.endTime
                        )}`
                      : formatTime(booking.time)}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`px-3 py-2 rounded-md shadow-sm ${
                darkMode
                  ? "bg-gray-700/80 border border-gray-600"
                  : "bg-white/80 border border-indigo-100"
              } transition-colors duration-300`}
            >
              <div className="flex items-center">
                <User
                  size={20}
                  className={`${
                    darkMode ? "text-indigo-400" : "text-indigo-500"
                  } ml-2`}
                />
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-indigo-300" : "text-indigo-500"
                    } transition-colors duration-300`}
                  >
                    {isClient ? "الحرفي" : "العميل"}
                  </p>
                  <p
                    className={`font-medium ${
                      darkMode ? "text-indigo-200" : "text-indigo-700"
                    } transition-colors duration-300`}
                  >
                    {otherPartyName}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`px-3 py-2 rounded-md shadow-sm ${
                darkMode
                  ? "bg-gray-700/80 border border-gray-600"
                  : "bg-white/80 border border-indigo-100"
              } transition-colors duration-300`}
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${
                    darkMode ? "text-indigo-400" : "text-indigo-500"
                  } ml-2`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-indigo-300" : "text-indigo-500"
                    } transition-colors duration-300`}
                  >
                    رقم هاتف الحرفي
                  </p>
                  <p
                    className={`font-medium ${
                      darkMode ? "text-indigo-200" : "text-indigo-700"
                    } transition-colors duration-300`}
                  >
                    {craftsmanPhone
                      ? craftsmanPhone
                      : "لم يتم توفير رقم الهاتف"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3
              className={`font-bold mb-2 ${
                darkMode ? "text-indigo-300" : "text-indigo-700"
              } transition-colors duration-300 flex items-center`}
            >
              <FileText size={18} className="ml-1" />
              وصف المشكلة
            </h3>
            <div
              className={`p-3 rounded-md shadow-sm ${
                darkMode
                  ? "bg-gray-700/80 border border-gray-600 text-gray-300"
                  : "bg-white/80 border border-indigo-100 text-gray-700"
              } transition-colors duration-300 max-h-40 overflow-y-auto`}
            >
              <p className="leading-relaxed break-words">
                {booking.description}
              </p>
            </div>
          </div>

          {/* Action buttons for pending bookings */}
          {booking.status === "pending" && isCraftsman && (
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              <Button
                variant="primary"
                onClick={() => handleStatusChange("completed")}
                className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-2 px-6 ${
                  darkMode
                    ? "bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                }`}
              >
                <span className="relative z-10 flex items-center">
                  <CheckCircle size={18} className="ml-1" />
                  موافقة على الطلب
                </span>
                <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </Button>

              <Button
                variant="outline"
                onClick={() => handleStatusChange("cancelled")}
                className={`flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-2 px-6 ${
                  darkMode
                    ? "bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white"
                    : "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white"
                }`}
              >
                <span className="relative z-10 flex items-center">
                  <XCircle size={18} className="ml-1" />
                  رفض الطلب
                </span>
                <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </Button>
            </div>
          )}

          {/* Review section for completed bookings */}
          {booking.status === "completed" && review && (
            <div className="mt-6">
              <h3
                className={`font-bold mb-3 ${
                  darkMode ? "text-indigo-300" : "text-indigo-700"
                } transition-colors duration-300 flex items-center`}
              >
                <Star
                  size={18}
                  className={`ml-1 ${
                    darkMode ? "text-yellow-400" : "text-yellow-500"
                  }`}
                />
                التقييم
              </h3>

              <div
                className={`p-4 rounded-md shadow-sm ${
                  darkMode
                    ? "bg-gray-700/80 border border-gray-600"
                    : "bg-white/80 border border-indigo-100"
                } transition-colors duration-300`}
              >
                {/* Overall rating */}
                <div className="flex items-center mb-4">
                  <div className="flex ml-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={20}
                        className={`${
                          star <= review.overallRating
                            ? `${
                                darkMode
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-yellow-500 fill-yellow-500"
                              }`
                            : `${darkMode ? "text-gray-600" : "text-gray-300"}`
                        } transition-colors duration-300`}
                      />
                    ))}
                  </div>
                  <span
                    className={`font-bold ${
                      darkMode ? "text-yellow-400" : "text-yellow-600"
                    } transition-colors duration-300`}
                  >
                    {review.overallRating}/5
                  </span>
                </div>

                {/* Detailed ratings */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div
                    className={`flex flex-col p-2 rounded-md ${
                      darkMode ? "bg-gray-800/50" : "bg-indigo-50/70"
                    } transition-colors duration-300`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        darkMode ? "text-indigo-300" : "text-indigo-600"
                      } transition-colors duration-300 mb-1`}
                    >
                      جودة العمل
                    </span>
                    <div className="flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={`${
                              star <= review.qualityRating
                                ? `${
                                    darkMode
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-yellow-500 fill-yellow-500"
                                  }`
                                : `${
                                    darkMode ? "text-gray-600" : "text-gray-300"
                                  }`
                            } transition-colors duration-300`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`flex flex-col p-2 rounded-md ${
                      darkMode ? "bg-gray-800/50" : "bg-indigo-50/70"
                    } transition-colors duration-300`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        darkMode ? "text-indigo-300" : "text-indigo-600"
                      } transition-colors duration-300 mb-1`}
                    >
                      الالتزام بالوقت
                    </span>
                    <div className="flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={`${
                              star <= review.punctualityRating
                                ? `${
                                    darkMode
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-yellow-500 fill-yellow-500"
                                  }`
                                : `${
                                    darkMode ? "text-gray-600" : "text-gray-300"
                                  }`
                            } transition-colors duration-300`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`flex flex-col p-2 rounded-md ${
                      darkMode ? "bg-gray-800/50" : "bg-indigo-50/70"
                    } transition-colors duration-300`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        darkMode ? "text-indigo-300" : "text-indigo-600"
                      } transition-colors duration-300 mb-1`}
                    >
                      القيمة مقابل السعر
                    </span>
                    <div className="flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={`${
                              star <= review.priceRating
                                ? `${
                                    darkMode
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-yellow-500 fill-yellow-500"
                                  }`
                                : `${
                                    darkMode ? "text-gray-600" : "text-gray-300"
                                  }`
                            } transition-colors duration-300`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`flex flex-col p-2 rounded-md ${
                      darkMode ? "bg-gray-800/50" : "bg-indigo-50/70"
                    } transition-colors duration-300`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        darkMode ? "text-indigo-300" : "text-indigo-600"
                      } transition-colors duration-300 mb-1`}
                    >
                      التواصل
                    </span>
                    <div className="flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={`${
                              star <= review.communicationRating
                                ? `${
                                    darkMode
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-yellow-500 fill-yellow-500"
                                  }`
                                : `${
                                    darkMode ? "text-gray-600" : "text-gray-300"
                                  }`
                            } transition-colors duration-300`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comment */}
                <div
                  className={`p-3 rounded-md ${
                    darkMode ? "bg-gray-800/70" : "bg-white/90"
                  } transition-colors duration-300`}
                >
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } transition-colors duration-300 leading-relaxed`}
                  >
                    {review.comment}
                  </p>
                </div>

                {/* Images */}
                {review.images && review.images.length > 0 && (
                  <div className="mt-4">
                    <h4
                      className={`font-bold mb-2 ${
                        darkMode ? "text-indigo-300" : "text-indigo-700"
                      } transition-colors duration-300 flex items-center`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ml-1 ${
                          darkMode ? "text-indigo-400" : "text-indigo-500"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      صور الأعمال المنجزة
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {review.images.map((image, index) => (
                        <div
                          key={index}
                          className="rounded-md overflow-hidden h-24 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                          <LazyImage
                            src={image}
                            alt={`صورة ${index + 1}`}
                            className="w-full h-full object-cover"
                            placeholderClassName="w-full h-full bg-gray-200 animate-pulse"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Edit button for pending bookings within 5 minutes */}
          {booking.status === "pending" && canEdit && userType === "client" && (
            <div className="mb-6">
              <div
                className={`p-4 rounded-md mb-4 ${
                  darkMode
                    ? "bg-indigo-900/30 border border-indigo-800"
                    : "bg-indigo-50 border border-indigo-100"
                }`}
              >
                <p
                  className={`text-sm ${
                    darkMode ? "text-indigo-300" : "text-indigo-700"
                  }`}
                >
                  <span className="font-bold">ملاحظة:</span> يمكنك تعديل طلبك أو
                  إلغاؤه خلال 5 دقائق فقط من وقت تقديمه. الوقت المتبقي:
                  {timeLeft}
                </p>
              </div>

              <Button
                variant="primary"
                className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-2 px-4 w-full ${
                  darkMode
                    ? "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
                    : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                }`}
                onClick={() => setShowEditForm(true)}
              >
                <span className="relative z-10 flex items-center">
                  <Edit size={18} className="ml-1" />
                  تعديل الطلب
                </span>
                <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Renderizar el formulario de edición fuera del modal principal
const BookingDetailsModalWithEdit = (props) => {
  const [showEditForm, setShowEditForm] = useState(false);

  return (
    <>
      <BookingDetailsModal
        {...props}
        showEditForm={showEditForm}
        setShowEditForm={setShowEditForm}
      />

      {showEditForm && (
        <BookingEditForm
          booking={props.booking}
          onClose={() => setShowEditForm(false)}
          onSave={() => {
            setShowEditForm(false);
            props.onClose();
          }}
        />
      )}
    </>
  );
};

export default BookingDetailsModalWithEdit;
