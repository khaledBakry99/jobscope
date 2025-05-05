import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, Star, Image } from "lucide-react";
import Layout from "../../components/layout/Layout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import useUserStore from "../../store/userStore";
import useBookingStore from "../../store/bookingStore";
import useThemeStore from "../../store/themeStore";
import useReviewStore from "../../store/reviewStore";
import LoginRedirect from "../../components/auth/LoginRedirect";
import DetailedReviewForm from "../../components/reviews/DetailedReviewForm";

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = useUserStore((state) => state.user);
  const userType = useUserStore((state) => state.userType);
  const logout = useUserStore((state) => state.logout);
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

  const { getBookingById, updateBookingStatus, addReview } = useBookingStore();
  const getReviewById = useReviewStore((state) => state.getReviewById);

  const [booking, setBooking] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [review, setReview] = useState(null);

  // Función para verificar si una reserva pendiente ha expirado
  const checkBookingExpired = (booking) => {
    if (!booking || booking.status !== "pending") return false;

    const bookingDate = new Date(`${booking.date}T${booking.time}`);
    const now = new Date();

    // Si la fecha y hora de la reserva ya pasaron
    return now > bookingDate;
  };

  useEffect(() => {
    if (id) {
      try {
        const bookingId = parseInt(id);
        const foundBooking = getBookingById(bookingId);

        if (foundBooking) {
          console.log("Booking found:", foundBooking);

          // Verificar si la reserva ha expirado
          if (checkBookingExpired(foundBooking)) {
            console.log(
              `La reserva #${foundBooking.id} ha expirado. Cancelando automáticamente.`
            );
            updateBookingStatus(foundBooking.id, "cancelled");
            // Actualizar el estado local con la reserva cancelada
            setBooking({ ...foundBooking, status: "cancelled" });
          } else {
            setBooking(foundBooking);
          }

          // Si la reserva tiene una evaluación, obtenerla
          if (foundBooking.reviewId) {
            const foundReview = getReviewById(foundBooking.reviewId);
            if (foundReview) {
              console.log("Review found:", foundReview);
              setReview(foundReview);
            } else {
              console.log("Review not found with ID:", foundBooking.reviewId);
            }
          }
        } else {
          console.log("Booking not found with ID:", bookingId);
        }
      } catch (error) {
        console.error("Error loading booking:", error);
      }
    }
  }, [id, getBookingById, getReviewById, updateBookingStatus]);

  const handleStatusChange = (status) => {
    updateBookingStatus(parseInt(id), status);
    setBooking({
      ...booking,
      status,
    });
  };

  const handleReviewSubmit = (reviewData) => {
    try {
      // Añadir la evaluación detallada
      const bookingId = parseInt(id);
      const result = addReview(bookingId, reviewData);

      if (result) {
        console.log("Evaluación añadida correctamente:", result);

        // Actualizar el estado local
        setShowReviewModal(false);
        setReview(result);

        // Actualizar el estado de la reserva para mostrar que ya tiene una evaluación
        setBooking({
          ...booking,
          reviewId: result.id,
          status: "completed",
        });
      } else {
        console.error("No se pudo añadir la evaluación");
        alert(
          "Hubo un problema al añadir la evaluación. Por favor, inténtalo de nuevo."
        );
      }
    } catch (error) {
      console.error("Error al enviar la evaluación:", error);
      alert(
        "Hubo un error al enviar la evaluación. Por favor, inténtalo de nuevo."
      );
    }
  };

  if (!user) {
    return <LoginRedirect />;
  }

  if (!booking) {
    const darkMode = useThemeStore((state) => state.darkMode);
    return (
      <Layout user={user} onLogout={logout}>
        <div
          className={`min-h-screen py-16 ${
            darkMode
              ? "bg-gray-900"
              : "bg-gradient-to-br from-blue-50 to-indigo-100"
          } transition-colors duration-300`}
        >
          <div className="container mx-auto px-4 py-12 text-center">
            <div
              className={`max-w-md mx-auto p-8 rounded-lg shadow-lg ${
                darkMode ? "bg-gray-800" : "bg-white/90"
              } transition-colors duration-300`}
            >
              <div className="mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-20 w-20 mx-auto mb-4 ${
                    darkMode ? "text-indigo-400" : "text-indigo-500"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2
                className={`text-2xl font-bold mb-4 ${
                  darkMode ? "text-indigo-300" : "text-indigo-800"
                } relative inline-block transition-colors duration-300`}
              >
                <span className="relative z-10">لم يتم العثور على الطلب</span>
                <span
                  className={`absolute bottom-0 left-0 right-0 h-2 ${
                    darkMode ? "bg-indigo-500" : "bg-indigo-300"
                  } opacity-40 transform -rotate-1 z-0`}
                ></span>
              </h2>
              <p
                className={`mb-6 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                لم نتمكن من العثور على الطلب. قد يكون الطلب غير موجود أو تم
                حذفه.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate("/bookings")}
                className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-2 px-6 mx-auto ${
                  darkMode
                    ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                }`}
              >
                <span className="relative z-10 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  العودة إلى قسم طلباتي
                </span>
                <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const isClient = userType === "client";
  const isCraftsman = userType === "craftsman";
  const otherPartyName = isClient ? booking.craftsmanName : booking.clientName;

  return (
    <Layout user={user} onLogout={logout}>
      <div
        className={`min-h-screen py-8 ${
          darkMode
            ? "bg-gray-900"
            : "bg-gradient-to-br from-blue-50 to-indigo-100"
        } transition-colors duration-300`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1
              className={`text-3xl font-bold mb-2 ${
                darkMode ? "text-indigo-300" : "text-indigo-800"
              } relative inline-block transition-colors duration-300`}
            >
              <span className="relative z-10">تفاصيل الطلب</span>
              <span
                className={`absolute bottom-0 left-0 right-0 h-2 ${
                  darkMode ? "bg-indigo-500" : "bg-indigo-300"
                } opacity-40 transform -rotate-1 z-0`}
              ></span>
            </h1>
            <Button
              variant="secondary"
              onClick={() => navigate("/profile/my")}
              className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-2 px-4 ${
                darkMode
                  ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              }`}
            >
              <span className="relative z-10">العودة إلى ملفي الشخصي</span>
              <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Booking Details */}
            <div className="md:col-span-2">
              <Card
                className={`p-6 mb-6 overflow-hidden ${
                  darkMode
                    ? "bg-gray-800 text-gray-200"
                    : "bg-gradient-to-br from-blue-50 to-indigo-100"
                } shadow-lg transition-colors duration-300`}
              >
                <h2
                  className={`text-xl font-bold mb-4 ${
                    darkMode ? "text-indigo-300" : "text-indigo-800"
                  } relative inline-block transition-colors duration-300`}
                >
                  <span className="relative z-10">معلومات الطلب</span>
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-2 ${
                      darkMode ? "bg-indigo-500" : "bg-indigo-300"
                    } opacity-40 transform -rotate-1 z-0`}
                  ></span>
                </h2>

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
                          {new Date(booking.date).toLocaleDateString("ar-SY")}
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
                          {formatTime(booking.time)}
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
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
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-indigo-300" : "text-indigo-500"
                          } transition-colors duration-300`}
                        >
                          الحالة
                        </p>
                        <p
                          className={`font-medium ${
                            booking.status === "completed"
                              ? darkMode
                                ? "text-green-400"
                                : "text-green-600"
                              : booking.status === "pending"
                              ? darkMode
                                ? "text-yellow-400"
                                : "text-yellow-600"
                              : darkMode
                              ? "text-red-400"
                              : "text-red-600"
                          } transition-colors duration-300`}
                        >
                          {booking.status === "completed"
                            ? "مكتمل"
                            : booking.status === "pending"
                            ? "قيد الانتظار"
                            : "ملغي"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3
                    className={`font-bold mb-2 ${
                      darkMode ? "text-indigo-300" : "text-indigo-700"
                    } transition-colors duration-300 flex items-center`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
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

                {booking.status === "pending" && (
                  <div className="flex flex-wrap gap-2">
                    {isCraftsman && (
                      <Button
                        variant="primary"
                        onClick={() => handleStatusChange("completed")}
                        className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-2 px-4 ${
                          darkMode
                            ? "bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
                            : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        }`}
                      >
                        <span className="relative z-10 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 ml-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          تم إكمال العمل
                        </span>
                        <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange("cancelled")}
                      className={`flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-2 px-4 ${
                        darkMode
                          ? "bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white"
                          : "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white"
                      }`}
                    >
                      <span className="relative z-10 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-1"
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
                        إلغاء الطلب
                      </span>
                      <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    </Button>
                  </div>
                )}

                {booking.status === "completed" &&
                  isClient &&
                  !booking.reviewId && (
                    <Button
                      variant="primary"
                      onClick={() => setShowReviewModal(true)}
                      className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-2 px-4 ${
                        darkMode
                          ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                          : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                      }`}
                    >
                      <span className="relative z-10 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                        إضافة تقييم
                      </span>
                      <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    </Button>
                  )}

                {booking.status === "completed" &&
                  isClient &&
                  booking.reviewId && (
                    <div
                      className={`mt-4 p-3 rounded-md ${
                        darkMode ? "bg-green-800/30" : "bg-green-100"
                      } border ${
                        darkMode ? "border-green-700" : "border-green-300"
                      } shadow-sm`}
                    >
                      <p
                        className={`text-sm ${
                          darkMode ? "text-green-400" : "text-green-700"
                        } flex items-center`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        تم تقييم هذا الطلب بنجاح
                      </p>
                    </div>
                  )}
              </Card>

              {/* Review Section */}
              {review && (
                <Card
                  className={`p-6 overflow-hidden ${
                    darkMode
                      ? "bg-gray-800 text-gray-200"
                      : "bg-gradient-to-br from-blue-50 to-indigo-100"
                  } shadow-lg transition-colors duration-300`}
                >
                  <h2
                    className={`text-xl font-bold mb-4 ${
                      darkMode ? "text-indigo-300" : "text-indigo-800"
                    } relative inline-block transition-colors duration-300`}
                  >
                    <span className="relative z-10">التقييم</span>
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-2 ${
                        darkMode ? "bg-indigo-500" : "bg-indigo-300"
                      } opacity-40 transform -rotate-1 z-0`}
                    ></span>
                  </h2>

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
                              : `${
                                  darkMode ? "text-gray-600" : "text-gray-300"
                                }`
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

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div
                      className={`flex flex-col p-3 rounded-md shadow-sm ${
                        darkMode
                          ? "bg-gray-700/80 border border-gray-600"
                          : "bg-white/80 border border-indigo-100"
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
                                      darkMode
                                        ? "text-gray-600"
                                        : "text-gray-300"
                                    }`
                              } transition-colors duration-300`}
                            />
                          ))}
                        </div>
                        <span className="mr-1 text-sm font-medium">
                          {review.qualityRating}/5
                        </span>
                      </div>
                    </div>

                    <div
                      className={`flex flex-col p-3 rounded-md shadow-sm ${
                        darkMode
                          ? "bg-gray-700/80 border border-gray-600"
                          : "bg-white/80 border border-indigo-100"
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
                                      darkMode
                                        ? "text-gray-600"
                                        : "text-gray-300"
                                    }`
                              } transition-colors duration-300`}
                            />
                          ))}
                        </div>
                        <span className="mr-1 text-sm font-medium">
                          {review.punctualityRating}/5
                        </span>
                      </div>
                    </div>

                    <div
                      className={`flex flex-col p-3 rounded-md shadow-sm ${
                        darkMode
                          ? "bg-gray-700/80 border border-gray-600"
                          : "bg-white/80 border border-indigo-100"
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
                                      darkMode
                                        ? "text-gray-600"
                                        : "text-gray-300"
                                    }`
                              } transition-colors duration-300`}
                            />
                          ))}
                        </div>
                        <span className="mr-1 text-sm font-medium">
                          {review.priceRating}/5
                        </span>
                      </div>
                    </div>

                    <div
                      className={`flex flex-col p-3 rounded-md shadow-sm ${
                        darkMode
                          ? "bg-gray-700/80 border border-gray-600"
                          : "bg-white/80 border border-indigo-100"
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
                                      darkMode
                                        ? "text-gray-600"
                                        : "text-gray-300"
                                    }`
                              } transition-colors duration-300`}
                            />
                          ))}
                        </div>
                        <span className="mr-1 text-sm font-medium">
                          {review.communicationRating}/5
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-md shadow-sm ${
                      darkMode
                        ? "bg-gray-700/80 border border-gray-600"
                        : "bg-white/80 border border-indigo-100"
                    } transition-colors duration-300 mt-4`}
                  >
                    <div className="flex items-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ml-2 ${
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
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                      <span
                        className={`font-medium ${
                          darkMode ? "text-indigo-300" : "text-indigo-700"
                        } transition-colors duration-300`}
                      >
                        تعليق العميل
                      </span>
                    </div>
                    <p
                      className={`${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      } leading-relaxed transition-colors duration-300 mb-3 pr-2 border-r-2 ${
                        darkMode
                          ? "border-indigo-500/30"
                          : "border-indigo-300/50"
                      }`}
                    >
                      {review.comment}
                    </p>
                    <div className="flex items-center justify-end">
                      <Calendar
                        size={14}
                        className={`ml-1 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        } transition-colors duration-300`}
                      >
                        {new Date(review.createdAt).toLocaleDateString("ar-SY")}
                      </p>
                    </div>
                  </div>

                  {/* Imágenes de la evaluación */}
                  {review.images && review.images.length > 0 && (
                    <div
                      className={`mt-4 p-4 rounded-md shadow-sm ${
                        darkMode
                          ? "bg-gray-700/80 border border-gray-600"
                          : "bg-white/80 border border-indigo-100"
                      } transition-colors duration-300`}
                    >
                      <h3
                        className={`font-bold mb-3 ${
                          darkMode ? "text-indigo-300" : "text-indigo-700"
                        } transition-colors duration-300`}
                      >
                        <div className="flex items-center">
                          <Image
                            size={18}
                            className={`ml-1 ${
                              darkMode ? "text-indigo-400" : "text-indigo-500"
                            }`}
                          />
                          صور الأعمال المنجزة
                        </div>
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {review.images.map((image, index) => (
                          <div
                            key={index}
                            className="rounded-md overflow-hidden h-24 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                          >
                            <img
                              src={image}
                              alt={`صورة ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              )}
            </div>

            {/* Contact Information */}
            <div className="md:col-span-1">
              <Card
                className={`p-6 overflow-hidden ${
                  darkMode
                    ? "bg-gray-800 text-gray-200"
                    : "bg-gradient-to-br from-blue-50 to-indigo-100"
                } shadow-lg transition-colors duration-300`}
              >
                <h2
                  className={`text-xl font-bold mb-4 ${
                    darkMode ? "text-indigo-300" : "text-indigo-800"
                  } relative inline-block transition-colors duration-300`}
                >
                  <span className="relative z-10">معلومات الاتصال</span>
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-2 ${
                      darkMode ? "bg-indigo-500" : "bg-indigo-300"
                    } opacity-40 transform -rotate-1 z-0`}
                  ></span>
                </h2>

                <div
                  className={`mb-4 p-3 rounded-md shadow-sm ${
                    darkMode
                      ? "bg-gray-700/80 border border-gray-600"
                      : "bg-white/80 border border-indigo-100"
                  } transition-colors duration-300`}
                >
                  <h3
                    className={`font-bold mb-2 ${
                      darkMode ? "text-indigo-300" : "text-indigo-700"
                    } transition-colors duration-300 flex items-center`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ml-1 ${
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {isClient ? "الحرفي" : "العميل"}
                  </h3>
                  <p
                    className={`mb-1 ${
                      darkMode ? "text-indigo-200" : "text-indigo-800"
                    } font-medium transition-colors duration-300`}
                  >
                    {otherPartyName}
                  </p>
                  <p
                    className={`mb-4 flex items-center ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } transition-colors duration-300`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
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
                    {isClient ? booking.craftsmanPhone : booking.clientPhone}
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="primary"
                      className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-2 ${
                        darkMode
                          ? "bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
                          : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      }`}
                      onClick={() =>
                        window.open(
                          `tel:${
                            isClient
                              ? booking.craftsmanPhone
                              : booking.clientPhone
                          }`
                        )
                      }
                    >
                      <span className="relative z-10 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1"
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
                        اتصال
                      </span>
                      <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    </Button>

                    <Button
                      variant="secondary"
                      className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-2 ${
                        darkMode
                          ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                          : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                      }`}
                      onClick={() =>
                        window.open(
                          `sms:${
                            isClient
                              ? booking.craftsmanPhone
                              : booking.clientPhone
                          }`
                        )
                      }
                    >
                      <span className="relative z-10 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                        إرسال رسالة
                      </span>
                      <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    </Button>
                  </div>
                </div>

                <div
                  className={`mt-4 p-3 rounded-md shadow-sm ${
                    darkMode
                      ? "bg-gray-700/80 border border-gray-600"
                      : "bg-white/80 border border-indigo-100"
                  } transition-colors duration-300`}
                >
                  <h3
                    className={`font-bold mb-2 ${
                      darkMode ? "text-indigo-300" : "text-indigo-700"
                    } transition-colors duration-300 flex items-center`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ml-1 ${
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    تذكير
                  </h3>
                  <div
                    className={`p-2 rounded-md ${
                      darkMode ? "bg-indigo-900/30" : "bg-indigo-100/70"
                    } transition-colors duration-300`}
                  >
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      } transition-colors duration-300 leading-relaxed`}
                    >
                      يرجى الالتزام بالموعد المحدد. في حال الرغبة بتغيير الموعد،
                      يرجى التواصل مباشرة مع الطرف الآخر.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <motion.div
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
              <div className="flex justify-between items-center mb-6">
                <h2
                  className={`text-xl font-bold ${
                    darkMode ? "text-indigo-300" : "text-indigo-800"
                  } relative inline-block transition-colors duration-300`}
                >
                  <span className="relative z-10">إضافة تقييم</span>
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-2 ${
                      darkMode ? "bg-indigo-500" : "bg-indigo-300"
                    } opacity-40 transform -rotate-1 z-0`}
                  ></span>
                </h2>
                <button
                  onClick={() => setShowReviewModal(false)}
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

              <DetailedReviewForm
                onSubmit={handleReviewSubmit}
                onCancel={() => setShowReviewModal(false)}
              />
            </div>
          </motion.div>
        </div>
      )}
    </Layout>
  );
};

export default BookingPage;
