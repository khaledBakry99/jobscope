import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Star, MapPin } from "lucide-react";
import Layout from "../../components/layout/Layout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import LazyImage from "../../components/common/LazyImage";
import useUserStore from "../../store/userStore";
import useCraftsmenStore from "../../store/craftsmenStore";
import useBookingStore from "../../store/bookingStore";
import useThemeStore from "../../store/themeStore";
import LoginRedirect from "../../components/auth/LoginRedirect";
import BookingDetailsModal from "../../components/bookings/BookingDetailsModal";

const HomePage = () => {
  const user = useUserStore((state) => state.user);
  const userType = useUserStore((state) => state.userType);
  const logout = useUserStore((state) => state.logout);
  const darkMode = useThemeStore((state) => state.darkMode);

  const { craftsmen, fetchCraftsmen } = useCraftsmenStore();
  const { getUserBookings } = useBookingStore();

  const [userBookings, setUserBookings] = useState([]);
  const [recommendedCraftsmen, setRecommendedCraftsmen] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Función para formatear la hora en formato de 12 horas con indicador AM/PM en árabe
  const formatTime = (timeString) => {
    // Convertir el formato de 24 horas a formato de 12 horas con indicador AM/PM en árabe
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "م" : "ص"; // م para PM, ص para AM
    const hour12 = hour % 12 || 12; // Convertir 0 a 12
    return `${hour12}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    // Fetch craftsmen once when component mounts
    fetchCraftsmen();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Remove dependencies to prevent multiple calls

  // التحقق من حالة تسجيل الدخول باستخدام localStorage
  const isTokenExist = localStorage.getItem("token") !== null;

  // إذا لم يكن هناك رمز مميز في localStorage ولكن هناك مستخدم في المتجر، قم بتسجيل الخروج
  useEffect(() => {
    if (!isTokenExist && user) {
      // تسجيل الخروج من المتجر
      logout();
    }
  }, [isTokenExist, user, logout]);

  useEffect(() => {
    // Get user bookings when user changes
    if (user) {
      const bookings = getUserBookings(user.id, userType);
      setUserBookings(bookings);
    }

    // Set recommended craftsmen when craftsmen data changes
    if (craftsmen.length > 0) {
      setRecommendedCraftsmen(craftsmen.slice(0, 3));
    }
  }, [user, userType, craftsmen, getUserBookings]);

  if (!user) {
    return <LoginRedirect />;
  }

  return (
    <Layout user={user} onLogout={logout}>
      <div
        className={`min-h-screen ${
          darkMode
            ? "bg-gray-900"
            : "bg-gradient-to-br from-blue-50 to-indigo-100"
        } transition-colors duration-300`}
      >
        {/* Welcome Banner */}
        <section
          className={`${
            darkMode
              ? "bg-gradient-to-r from-gray-800 to-gray-700"
              : "bg-gradient-to-r from-blue-600 to-indigo-800"
          } text-white py-8 shadow-lg transition-colors duration-300`}
        >
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold mb-2 relative inline-block">
              <span className="relative z-10">مرحباً، {user.name}!</span>
              <span
                className={`absolute bottom-0 left-0 right-0 h-2 ${
                  darkMode ? "bg-indigo-500" : "bg-indigo-300"
                } opacity-30 transform -rotate-1 z-0`}
              ></span>
            </h1>
            <p className="text-lg">
              {userType === "client"
                ? "ابحث عن أفضل الحرفيين في منطقتك"
                : "استعرض طلبات العمل وأدر ملفك الشخصي"}
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Quick Actions */}
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className={`flex flex-col items-center p-6 text-center ${
                    darkMode
                      ? "bg-gray-800 text-gray-200"
                      : "bg-gradient-to-br from-blue-50 to-indigo-100"
                  } shadow-lg transition-colors duration-300`}
                >
                  <div
                    className={`w-16 h-16 ${
                      darkMode
                        ? "bg-indigo-900 text-indigo-300"
                        : "bg-indigo-200 text-indigo-700"
                    } rounded-full flex items-center justify-center mb-4 shadow-md transition-colors duration-300`}
                  >
                    <Search size={32} />
                  </div>
                  <h3
                    className={`text-xl font-bold mb-2 ${
                      darkMode ? "text-indigo-300" : "text-indigo-800"
                    } relative inline-block transition-colors duration-300`}
                  >
                    <span className="relative z-10">البحث عن حرفي</span>
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-2 ${
                        darkMode ? "bg-indigo-500" : "bg-indigo-300"
                      } opacity-40 transform -rotate-1 z-0`}
                    ></span>
                  </h3>
                  <p
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } mb-4 transition-colors duration-300`}
                  >
                    ابحث عن الحرفي المناسب في منطقتك
                  </p>
                  <Link to="/search" className="mt-auto">
                    <Button
                      variant="primary"
                      className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200  relative overflow-hidden group py-2 px-4 ${
                        darkMode
                          ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                          : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                      }`}
                    >
                      <span className="relative z-10">ابحث الآن</span>
                      <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    </Button>
                  </Link>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card
                  className={`flex flex-col items-center p-6 text-center ${
                    darkMode
                      ? "bg-gray-800 text-gray-200"
                      : "bg-gradient-to-br from-blue-50 to-indigo-100"
                  } shadow-lg transition-colors duration-300`}
                >
                  <div
                    className={`w-16 h-16 ${
                      darkMode
                        ? "bg-indigo-900 text-indigo-300"
                        : "bg-indigo-200 text-indigo-700"
                    } rounded-full flex items-center justify-center mb-4 shadow-md transition-colors duration-300`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
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
                  </div>
                  <h3
                    className={`text-xl font-bold mb-2 ${
                      darkMode ? "text-indigo-300" : "text-indigo-800"
                    } relative inline-block transition-colors duration-300`}
                  >
                    <span className="relative z-10">طلباتي</span>
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-2 ${
                        darkMode ? "bg-indigo-500" : "bg-indigo-300"
                      } opacity-40 transform -rotate-1 z-0`}
                    ></span>
                  </h3>
                  <p
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } mb-4 transition-colors duration-300`}
                  >
                    استعرض طلباتك السابقة والحالية
                  </p>
                  <Link to="/bookings" className="mt-auto">
                    <Button
                      variant="secondary"
                      className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200  relative overflow-hidden group py-2 px-4 ${
                        darkMode
                          ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                          : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                      }`}
                    >
                      <span className="relative z-10">عرض الطلبات</span>
                      <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    </Button>
                  </Link>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card
                  className={`flex flex-col items-center p-6 text-center ${
                    darkMode
                      ? "bg-gray-800 text-gray-200"
                      : "bg-gradient-to-br from-blue-50 to-indigo-100"
                  } shadow-lg transition-colors duration-300`}
                >
                  <div
                    className={`w-16 h-16 ${
                      darkMode
                        ? "bg-indigo-900 text-indigo-300"
                        : "bg-indigo-200 text-indigo-700"
                    } rounded-full flex items-center justify-center mb-4 shadow-md transition-colors duration-300`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
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
                  </div>
                  <h3
                    className={`text-xl font-bold mb-2 ${
                      darkMode ? "text-indigo-300" : "text-indigo-800"
                    } relative inline-block transition-colors duration-300`}
                  >
                    <span className="relative z-10">ملفي الشخصي</span>
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-2 ${
                        darkMode ? "bg-indigo-500" : "bg-indigo-300"
                      } opacity-40 transform -rotate-1 z-0`}
                    ></span>
                  </h3>
                  <p
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } mb-4 transition-colors duration-300`}
                  >
                    عرض وتعديل معلومات ملفك الشخصي
                  </p>
                  <Link to="/profile/my" className="mt-auto">
                    <Button
                      variant="secondary"
                      className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200  relative overflow-hidden group py-2 px-4 ${
                        darkMode
                          ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                          : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                      }`}
                    >
                      <span className="relative z-10">عرض الملف</span>
                      <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            </div>
          </section>

          {/* Recent Bookings */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2
                className={`text-2xl font-bold ${
                  darkMode ? "text-indigo-300" : "text-indigo-800"
                } relative inline-block transition-colors duration-300`}
              >
                <span className="relative z-10">طلباتي الأخيرة</span>
                <span
                  className={`absolute bottom-0 left-0 right-0 h-2 ${
                    darkMode ? "bg-indigo-500" : "bg-indigo-300"
                  } opacity-40 transform -rotate-1 z-0`}
                ></span>
              </h2>
              <Link
                to="/bookings"
                className={`${
                  darkMode
                    ? "text-indigo-400 hover:text-indigo-300"
                    : "text-indigo-600 hover:text-indigo-800"
                } font-medium transition-colors duration-200`}
              >
                عرض الكل
              </Link>
            </div>

            {userBookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                {userBookings.slice(0, 2).map((booking) => (
                  <Card
                    key={booking.id}
                    className={`p-4 ${
                      darkMode
                        ? "bg-gray-800 text-gray-200"
                        : "bg-gradient-to-br from-[#E2E9FF] to-[#DCE4FC]"
                    } shadow-md transition-colors duration-300`}
                  >
                    <div className="flex flex-col h-full ">
                      {/* Encabezado con nombre y fecha */}
                      <div className="mb-2">
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
                          className={`${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          } transition-colors duration-300`}
                        >
                          {new Date(booking.date).toLocaleDateString("ar-SY")} -{" "}
                          {formatTime(booking.time)}
                        </p>
                      </div>

                      {/* Descripción con scroll */}
                      <div className="mb-2 flex-grow">
                        <div
                          className={`p-2 rounded-md ${
                            darkMode
                              ? "bg-gray-700/50"
                              : "bg-gradient-to-br from-[#E2E9FF] to-[#E6EDFF] shadow-md border border-indigo-200"
                          } max-h-16 overflow-y-auto`}
                        >
                          <p
                            className={`${
                              darkMode ? "text-gray-300" : ""
                            } break-words text-sm`}
                          >
                            {booking.description}
                          </p>
                        </div>
                      </div>

                      {/* Pie con estado y botón */}
                      <div className="flex justify-between items-center mt-auto">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            booking.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.status === "completed"
                            ? "مكتمل"
                            : booking.status === "pending"
                            ? "قيد الانتظار"
                            : "ملغي"}
                        </span>

                        <Button
                          variant="secondary"
                          className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group text-sm py-2 px-4 ${
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
                ))}
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
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } mb-4 transition-colors duration-300`}
                >
                  ليس لديك أي طلبات حتى الآن
                </p>
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
              </Card>
            )}
          </section>

          {/* Recommended Craftsmen */}
          {userType === "client" && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2
                  className={`text-2xl font-bold ${
                    darkMode ? "text-indigo-300" : "text-indigo-800"
                  } relative inline-block transition-colors duration-300`}
                >
                  <span className="relative z-10">حرفيون موصى بهم</span>
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-2 ${
                      darkMode ? "bg-indigo-500" : "bg-indigo-300"
                    } opacity-40 transform -rotate-1 z-0`}
                  ></span>
                </h2>
                <Link
                  to="/search"
                  className={`${
                    darkMode
                      ? "text-indigo-400 hover:text-indigo-300"
                      : "text-indigo-600 hover:text-indigo-800"
                  } font-medium transition-colors duration-200`}
                >
                  عرض المزيد
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedCraftsmen.map((craftsman) => (
                  <motion.div
                    key={craftsman.id}
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className={`overflow-hidden ${
                        darkMode
                          ? "bg-gray-800 text-gray-200"
                          : "bg-gradient-to-br from-blue-50 to-indigo-100"
                      } shadow-md transition-colors duration-300`}
                    >
                      <div className="h-40 overflow-hidden">
                        <LazyImage
                          src={craftsman.image}
                          alt={craftsman.name}
                          className="w-full h-full object-cover"
                          placeholderClassName="w-full h-full bg-gray-200 animate-pulse"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1">
                          {craftsman.name}
                        </h3>
                        <p
                          className={`${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          } mb-2 transition-colors duration-300`}
                        >
                          {craftsman.profession} - {craftsman.specialization}
                        </p>
                        <div className="flex items-center mb-2">
                          <Star
                            size={16}
                            className={`${
                              darkMode
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-accent fill-accent"
                            }`}
                          />
                          <span
                            className={`mr-1 ${
                              darkMode ? "text-gray-300" : ""
                            }`}
                          >
                            {craftsman.rating}
                          </span>
                        </div>
                        <div className="flex items-center mb-4">
                          <MapPin
                            size={16}
                            className={`${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          />
                          <span
                            className={`mr-1 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            } transition-colors duration-300`}
                          >
                            نطاق العمل: {craftsman.workRadius} كم
                          </span>
                        </div>
                        <Link to={`/profile/craftsman/${craftsman.id}`}>
                          <Button
                            variant="primary"
                            fullWidth
                            className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200  relative overflow-hidden group py-2 px-4 ${
                              darkMode
                                ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                                : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                            }`}
                          >
                            <span className="relative z-10">عرض الملف</span>
                            <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
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
            if (user) {
              const bookings = getUserBookings(user.id, userType);
              setUserBookings(bookings);
            }
          }}
          userType={userType}
        />
      )}
    </Layout>
  );
};

export default HomePage;
