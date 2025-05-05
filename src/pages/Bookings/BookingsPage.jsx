import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../../components/layout/Layout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import useUserStore from "../../store/userStore";
import useBookingStore from "../../store/bookingStore";
import useThemeStore from "../../store/themeStore";
import { Link } from "react-router-dom";
import LoginRedirect from "../../components/auth/LoginRedirect";
import BookingDetailsModal from "../../components/bookings/BookingDetailsModal";

const BookingsPage = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const userType = useUserStore((state) => state.userType);
  const logout = useUserStore((state) => state.logout);
  const darkMode = useThemeStore((state) => state.darkMode);

  const { getUserBookings, updateBookingStatus } = useBookingStore();
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // all, pending, completed, cancelled
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // إعدادات ترقيم الصفحات
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // عدد العناصر في كل صفحة

  // Función para formatear la hora en formato de 12 horas con indicador AM/PM en árabe
  const formatTime = (timeString) => {
    // Convertir el formato de 24 horas a formato de 12 horas con indicador AM/PM en árabe
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "م" : "ص"; // م para PM, ص para AM
    const hour12 = hour % 12 || 12; // Convertir 0 a 12
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Función para verificar si una reserva pendiente ha expirado
  const checkBookingExpired = (booking) => {
    if (booking.status !== "pending") return false;

    const bookingDate = new Date(`${booking.date}T${booking.time}`);
    const now = new Date();

    // Si la fecha y hora de la reserva ya pasaron
    return now > bookingDate;
  };

  // Función para cancelar automáticamente las reservas expiradas
  const cancelExpiredBookings = (userBookings) => {
    let hasChanges = false;

    userBookings.forEach((booking) => {
      if (checkBookingExpired(booking)) {
        console.log(
          `Cancelando automáticamente la reserva #${booking.id} por expiración de tiempo`
        );
        updateBookingStatus(booking.id, "cancelled");
        hasChanges = true;
      }
    });

    return hasChanges;
  };

  useEffect(() => {
    if (user) {
      // Get user bookings
      const userBookings = getUserBookings(user.id, userType);

      // Verificar y cancelar reservas expiradas
      const hasChanges = cancelExpiredBookings(userBookings);

      // Si hubo cambios, obtener las reservas actualizadas
      if (hasChanges) {
        const updatedBookings = getUserBookings(user.id, userType);
        setBookings(updatedBookings);
      } else {
        setBookings(userBookings);
      }
    }
  }, [user, userType, getUserBookings, updateBookingStatus]);

  if (!user) {
    return <LoginRedirect />;
  }

  // Filter bookings based on active tab
  // Las reservas ya vienen ordenadas por fecha de creación desde el store
  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "all") return true;
    return booking.status === activeTab;
  });

  // حساب إجمالي عدد الصفحات
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  // الحصول على الطلبات للصفحة الحالية
  const currentBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // التأكد من أن الصفحة الحالية ضمن النطاق المسموح به
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [activeTab, totalPages, currentPage]);

  // دالة للانتقال إلى صفحة محددة
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    // التمرير إلى أعلى الصفحة
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
          <div className="mb-8">
            <h1
              className={`text-3xl font-bold mb-2 ${
                darkMode ? "text-indigo-300" : "text-indigo-800"
              } relative inline-block transition-colors duration-300`}
            >
              <span className="relative z-10">طلباتي</span>
              <span
                className={`absolute bottom-0 left-0 right-0 h-2 ${
                  darkMode ? "bg-indigo-500" : "bg-indigo-300"
                } opacity-40 transform -rotate-1 z-0`}
              ></span>
            </h1>
            <p
              className={`${
                darkMode ? "text-indigo-400" : "text-indigo-600"
              } transition-colors duration-300`}
            >
              {userType === "client"
                ? "إدارة طلبات الخدمة الخاصة بك"
                : "إدارة طلبات الخدمة المقدمة إليك"}
            </p>
          </div>

          {/* Tabs and Items Per Page */}
          <div className="mb-6 flex flex-wrap justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === "all"
                    ? `bg-gradient-to-r ${
                        darkMode
                          ? "from-indigo-700 to-purple-800"
                          : "from-blue-500 to-indigo-500"
                      } text-white shadow-md`
                    : `${
                        darkMode
                          ? "bg-gray-800 text-indigo-300 hover:bg-gray-700"
                          : "bg-white text-indigo-700 hover:bg-indigo-50"
                      }`
                }`}
              >
                الكل ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === "pending"
                    ? `bg-gradient-to-r ${
                        darkMode
                          ? "from-yellow-600 to-amber-700"
                          : "from-yellow-400 to-amber-500"
                      } text-white shadow-md`
                    : `${
                        darkMode
                          ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                          : "bg-white text-yellow-700 hover:bg-yellow-50"
                      }`
                }`}
              >
                قيد الانتظار (
                {bookings.filter((b) => b.status === "pending").length})
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === "completed"
                    ? `bg-gradient-to-r ${
                        darkMode
                          ? "from-green-600 to-emerald-700"
                          : "from-green-500 to-emerald-600"
                      } text-white shadow-md`
                    : `${
                        darkMode
                          ? "bg-gray-800 text-green-400 hover:bg-gray-700"
                          : "bg-white text-green-700 hover:bg-green-50"
                      }`
                }`}
              >
                مكتمل ({bookings.filter((b) => b.status === "completed").length}
                )
              </button>
              <button
                onClick={() => setActiveTab("cancelled")}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === "cancelled"
                    ? `bg-gradient-to-r ${
                        darkMode
                          ? "from-red-600 to-rose-700"
                          : "from-red-500 to-rose-600"
                      } text-white shadow-md`
                    : `${
                        darkMode
                          ? "bg-gray-800 text-red-400 hover:bg-gray-700"
                          : "bg-white text-red-700 hover:bg-red-50"
                      }`
                }`}
              >
                ملغي ({bookings.filter((b) => b.status === "cancelled").length})
              </button>
            </div>

            {/* خيار تغيير عدد العناصر في كل صفحة */}
            {filteredBookings.length > 5 && (
              <div
                className={`flex items-center gap-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <span className="text-sm">عدد الطلبات في الصفحة:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1); // إعادة تعيين الصفحة الحالية عند تغيير عدد العناصر
                  }}
                  className={`rounded-md border px-2 py-1 text-sm ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-700"
                  }`}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
              </div>
            )}
          </div>

          {/* Bookings List */}
          {filteredBookings.length > 0 ? (
            <div className="space-y-4">
              {currentBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className={`p-6 ${
                      darkMode
                        ? "bg-gray-800 text-gray-200"
                        : "bg-gradient-to-br from-blue-50 to-indigo-100"
                    } shadow-md hover:shadow-lg transition-all duration-300`}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="flex-1 w-full overflow-hidden">
                        <div className="flex items-center mb-2">
                          <h3
                            className={`text-xl font-bold ${
                              darkMode ? "text-indigo-300" : "text-indigo-800"
                            } ml-2 transition-colors duration-300`}
                          >
                            {userType === "client"
                              ? booking.craftsmanName
                              : booking.clientName}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${
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

                        <div className="mb-4 flex flex-wrap gap-4">
                          <div
                            className={`px-3 py-2 rounded-md shadow-sm ${
                              darkMode
                                ? "bg-gray-700/80 border border-gray-600"
                                : "bg-white/80 border border-indigo-100"
                            } transition-colors duration-300`}
                          >
                            <span
                              className={`block text-sm ${
                                darkMode ? "text-indigo-300" : "text-indigo-500"
                              } transition-colors duration-300`}
                            >
                              التاريخ
                            </span>
                            <span
                              className={`font-medium ${
                                darkMode ? "text-indigo-200" : "text-indigo-700"
                              } transition-colors duration-300`}
                            >
                              {booking.endDate
                                ? `${new Date(booking.date).toLocaleDateString(
                                    "ar-SY"
                                  )} - ${new Date(
                                    booking.endDate
                                  ).toLocaleDateString("ar-SY")}`
                                : new Date(booking.date).toLocaleDateString(
                                    "ar-SY"
                                  )}
                            </span>
                          </div>

                          <div
                            className={`px-3 py-2 rounded-md shadow-sm ${
                              darkMode
                                ? "bg-gray-700/80 border border-gray-600"
                                : "bg-white/80 border border-indigo-100"
                            } transition-colors duration-300`}
                          >
                            <span
                              className={`block text-sm ${
                                darkMode ? "text-indigo-300" : "text-indigo-500"
                              } transition-colors duration-300`}
                            >
                              الوقت
                            </span>
                            <span
                              className={`font-medium ${
                                darkMode ? "text-indigo-200" : "text-indigo-700"
                              } transition-colors duration-300`}
                            >
                              {booking.endTime
                                ? `${formatTime(booking.time)} - ${formatTime(
                                    booking.endTime
                                  )}`
                                : formatTime(booking.time)}
                            </span>
                          </div>

                          <div
                            className={`px-3 py-2 rounded-md shadow-sm ${
                              darkMode
                                ? "bg-gray-700/80 border border-gray-600"
                                : "bg-white/80 border border-indigo-100"
                            } transition-colors duration-300`}
                          >
                            <span
                              className={`block text-sm ${
                                darkMode ? "text-indigo-300" : "text-indigo-500"
                              } transition-colors duration-300`}
                            >
                              تاريخ تقديم الطلب
                            </span>
                            <span
                              className={`font-medium ${
                                darkMode ? "text-indigo-200" : "text-indigo-700"
                              } transition-colors duration-300`}
                            >
                              {new Date(booking.createdAt).toLocaleDateString(
                                "ar-SY"
                              )}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`p-3 rounded-md shadow-sm mb-4 ${
                            darkMode
                              ? "bg-gray-700/80 border border-gray-600"
                              : "bg-white/80 border border-indigo-100"
                          } transition-colors duration-300`}
                        >
                          <span
                            className={`block text-sm mb-1 ${
                              darkMode ? "text-indigo-300" : "text-indigo-500"
                            } transition-colors duration-300`}
                          >
                            وصف المشكلة
                          </span>
                          <div className="max-h-24 overflow-y-auto">
                            <p
                              className={`${
                                darkMode ? "text-indigo-200" : "text-indigo-700"
                              } transition-colors duration-300 break-words`}
                            >
                              {booking.description}
                            </p>
                          </div>
                        </div>

                        {booking.review && (
                          <div
                            className={`p-3 rounded-md shadow-sm ${
                              darkMode
                                ? "bg-yellow-900/30 border border-yellow-800"
                                : "bg-yellow-50 border border-yellow-200"
                            } transition-colors duration-300`}
                          >
                            <span
                              className={`block text-sm mb-1 ${
                                darkMode ? "text-yellow-400" : "text-yellow-700"
                              } transition-colors duration-300`}
                            >
                              التقييم
                            </span>
                            <div className="flex items-center mb-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  xmlns="http://www.w3.org/2000/svg"
                                  className={`h-4 w-4 ${
                                    star <= booking.review.rating
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-gray-300"
                                  }`}
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
                              ))}
                              <span
                                className={`mr-2 ${
                                  darkMode
                                    ? "text-indigo-300"
                                    : "text-indigo-700"
                                } transition-colors duration-300`}
                              >
                                {booking.review.rating}/5
                              </span>
                            </div>
                            <p
                              className={`${
                                darkMode ? "text-indigo-200" : "text-indigo-700"
                              } transition-colors duration-300`}
                            >
                              {booking.review.comment}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="md:self-center mt-2 md:mt-0">
                        <Button
                          variant="primary"
                          className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-2 px-4 ${
                            darkMode
                              ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                              : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                          }`}
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowDetailsModal(true);
                          }}
                        >
                          <span className="relative z-10">عرض التفاصيل</span>
                          <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex flex-col items-center">
                  {/* معلومات الصفحة */}
                  <div
                    className={`mb-3 text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    عرض {(currentPage - 1) * itemsPerPage + 1} إلى{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredBookings.length
                    )}{" "}
                    من أصل {filteredBookings.length} طلب
                  </div>

                  {/* أزرار التنقل بين الصفحات */}
                  <div
                    className={`flex items-center gap-2 rounded-lg p-2 ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    } shadow-md`}
                  >
                    {/* زر الصفحة السابقة */}
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
                        currentPage === 1
                          ? `${
                              darkMode
                                ? "bg-gray-700 text-gray-500"
                                : "bg-gray-100 text-gray-400"
                            } cursor-not-allowed`
                          : `${
                              darkMode
                                ? "bg-gray-700 text-white hover:bg-gray-600"
                                : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                            }`
                      }`}
                      aria-label="الصفحة السابقة"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {/* أزرار الصفحات */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // حساب أرقام الصفحات التي سيتم عرضها
                      let pageNum;
                      if (totalPages <= 5) {
                        // إذا كان إجمالي الصفحات 5 أو أقل، عرض جميع الصفحات
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        // إذا كانت الصفحة الحالية في البداية
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        // إذا كانت الصفحة الحالية في النهاية
                        pageNum = totalPages - 4 + i;
                      } else {
                        // إذا كانت الصفحة الحالية في المنتصف
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
                            currentPage === pageNum
                              ? `${
                                  darkMode
                                    ? "bg-indigo-600 text-white"
                                    : "bg-indigo-500 text-white"
                                }`
                              : `${
                                  darkMode
                                    ? "bg-gray-700 text-white hover:bg-gray-600"
                                    : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                                }`
                          }`}
                          aria-label={`الصفحة ${pageNum}`}
                          aria-current={
                            currentPage === pageNum ? "page" : undefined
                          }
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {/* زر الصفحة التالية */}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
                        currentPage === totalPages
                          ? `${
                              darkMode
                                ? "bg-gray-700 text-gray-500"
                                : "bg-gray-100 text-gray-400"
                            } cursor-not-allowed`
                          : `${
                              darkMode
                                ? "bg-gray-700 text-white hover:bg-gray-600"
                                : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                            }`
                      }`}
                      aria-label="الصفحة التالية"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 transform rotate-180"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Card
              className={`p-6 text-center ${
                darkMode
                  ? "bg-gray-800 text-gray-200"
                  : "bg-gradient-to-br from-blue-50 to-indigo-100"
              } shadow-md transition-colors duration-300`}
            >
              <p
                className={`${
                  darkMode ? "text-indigo-400" : "text-indigo-600"
                } mb-4 transition-colors duration-300`}
              >
                {activeTab === "all"
                  ? "ليس لديك أي طلبات حتى الآن"
                  : activeTab === "pending"
                  ? "ليس لديك طلبات قيد الانتظار"
                  : activeTab === "completed"
                  ? "ليس لديك طلبات مكتملة"
                  : "ليس لديك طلبات ملغية"}
              </p>
              {activeTab === "all" && userType === "client" && (
                <Link to="/search">
                  <Button
                    variant="primary"
                    className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200  relative overflow-hidden group py-2 px-4 ${
                      darkMode
                        ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                        : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                    }`}
                  >
                    <span className="relative z-10">ابحث عن حرفي</span>
                    <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  </Button>
                </Link>
              )}
            </Card>
          )}
        </div>
      </div>

      {/* Modal de detalles del pedido */}
      {showDetailsModal && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedBooking(null);
            // Actualizar la lista de pedidos después de cerrar el modal
            const userBookings = getUserBookings(user.id, userType);
            setBookings(userBookings);
          }}
          userType={userType}
        />
      )}
    </Layout>
  );
};

export default BookingsPage;
