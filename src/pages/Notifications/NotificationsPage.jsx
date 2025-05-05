import React, { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../../components/layout/Layout";
import Card from "../../components/common/Card";
import useUserStore from "../../store/userStore";
import useNotificationStore from "../../store/notificationStore";
import useThemeStore from "../../store/themeStore";
import { NOTIFICATION_TYPES } from "../../services/notificationService";
import {
  Bell,
  CheckCircle,
  XCircle,
  CheckSquare,
  XSquare,
  ClipboardList,
  ClipboardCheck,
  Star,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoginRedirect from "../../components/auth/LoginRedirect";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const darkMode = useThemeStore((state) => state.darkMode);

  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotificationStore();

  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // التحقق من تسجيل الدخول
  if (!user) {
    return <LoginRedirect />;
  }

  // تصفية الإشعارات حسب النوع
  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !notification.read;

    // تصفية حسب نوع الإشعار
    switch (activeFilter) {
      case "bookings":
        return [
          NOTIFICATION_TYPES.BOOKING_CREATED,
          NOTIFICATION_TYPES.BOOKING_ACCEPTED,
          NOTIFICATION_TYPES.BOOKING_REJECTED,
          NOTIFICATION_TYPES.BOOKING_COMPLETED,
          NOTIFICATION_TYPES.BOOKING_CANCELLED,
        ].includes(notification.type);
      case "reviews":
        return notification.type === NOTIFICATION_TYPES.REVIEW_RECEIVED;
      case "system":
        return notification.type === NOTIFICATION_TYPES.SYSTEM;
      default:
        return true;
    }
  });

  // حساب عدد الصفحات
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);

  // الحصول على الإشعارات للصفحة الحالية
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // تحديد الأيقونة المناسبة
  const getIcon = (icon) => {
    switch (icon) {
      case "check-circle":
        return <CheckCircle size={18} className="text-green-500" />;
      case "x-circle":
        return <XCircle size={18} className="text-red-500" />;
      case "check-square":
        return <CheckSquare size={18} className="text-green-500" />;
      case "x-square":
        return <XSquare size={18} className="text-red-500" />;
      case "clipboard-list":
        return <ClipboardList size={18} className="text-indigo-500" />;
      case "clipboard-check":
        return <ClipboardCheck size={18} className="text-indigo-500" />;
      case "star":
        return <Star size={18} className="text-yellow-500" />;
      default:
        return <Bell size={18} className="text-indigo-500" />;
    }
  };

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SY", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // معالجة النقر على الإشعار
  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);

    // التنقل إلى الصفحة المناسبة بناءً على نوع الإشعار
    if (notification.data?.bookingId) {
      navigate(`/booking/${notification.data.bookingId}`);
    }
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
              <span className="relative z-10">الإشعارات</span>
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
              إدارة جميع الإشعارات والتنبيهات الخاصة بك
            </p>
          </div>

          {/* أزرار التصفية */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => {
                setActiveFilter("all");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-md transition-all duration-200 ${
                activeFilter === "all"
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
              الكل ({notifications.length})
            </button>
            <button
              onClick={() => {
                setActiveFilter("unread");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-md transition-all duration-200 ${
                activeFilter === "unread"
                  ? `bg-gradient-to-r ${
                      darkMode
                        ? "from-blue-700 to-indigo-800"
                        : "from-blue-500 to-indigo-500"
                    } text-white shadow-md`
                  : `${
                      darkMode
                        ? "bg-gray-800 text-blue-300 hover:bg-gray-700"
                        : "bg-white text-blue-700 hover:bg-blue-50"
                    }`
              }`}
            >
              غير مقروءة ({notifications.filter((n) => !n.read).length})
            </button>
            <button
              onClick={() => {
                setActiveFilter("bookings");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-md transition-all duration-200 ${
                activeFilter === "bookings"
                  ? `bg-gradient-to-r ${
                      darkMode
                        ? "from-indigo-700 to-blue-800"
                        : "from-indigo-500 to-blue-500"
                    } text-white shadow-md`
                  : `${
                      darkMode
                        ? "bg-gray-800 text-indigo-300 hover:bg-gray-700"
                        : "bg-white text-indigo-700 hover:bg-indigo-50"
                    }`
              }`}
            >
              الحجوزات
            </button>
            <button
              onClick={() => {
                setActiveFilter("reviews");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-md transition-all duration-200 ${
                activeFilter === "reviews"
                  ? `bg-gradient-to-r ${
                      darkMode
                        ? "from-yellow-700 to-amber-800"
                        : "from-yellow-500 to-amber-500"
                    } text-white shadow-md`
                  : `${
                      darkMode
                        ? "bg-gray-800 text-yellow-300 hover:bg-gray-700"
                        : "bg-white text-yellow-700 hover:bg-yellow-50"
                    }`
              }`}
            >
              التقييمات
            </button>
            <button
              onClick={() => {
                setActiveFilter("system");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-md transition-all duration-200 ${
                activeFilter === "system"
                  ? `bg-gradient-to-r ${
                      darkMode
                        ? "from-indigo-600 to-indigo-800"
                        : "from-indigo-500 to-indigo-800"
                    } text-white shadow-md`
                  : `${
                      darkMode
                        ? "bg-gray-800 text-purple-300 hover:bg-indigo-900/30"
                        : "bg-white text-purple-700 hover:bg-indigo-100"
                    }`
              }`}
            >
              النظام
            </button>

            {/* زر حذف جميع الإشعارات */}
            {notifications.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm("هل أنت متأكد من حذف جميع الإشعارات؟")) {
                    clearAllNotifications();
                  }
                }}
                className="flex items-center gap-1 text-white hover:text-white transition-all duration-200 hover:scale-105 transform border border-transparent bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-3 py-2 rounded-md relative overflow-hidden group shadow-md hover:shadow-lg mr-auto"
              >
                <span className="relative z-10 flex items-center gap-1">
                  <Trash2 size={18} />
                  <span>حذف الكل</span>
                </span>
                <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </button>
            )}
          </div>

          {/* قائمة الإشعارات */}
          {filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {paginatedNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className={`p-4 ${
                      notification.read
                        ? darkMode
                          ? "bg-gray-800 text-gray-200"
                          : "bg-white"
                        : darkMode
                        ? "bg-gray-700 text-gray-200 border-r-4 border-indigo-500"
                        : "bg-blue-50 border-r-4 border-indigo-500"
                    } shadow-md hover:shadow-lg transition-all duration-300`}
                  >
                    <div className="flex justify-between">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start">
                          <div className="ml-3 mt-1">
                            {getIcon(notification.icon)}
                          </div>
                          <div>
                            <h3
                              className={`font-bold ${
                                darkMode ? "text-indigo-300" : "text-indigo-800"
                              } transition-colors duration-300`}
                            >
                              {notification.title}
                            </h3>
                            <p
                              className={`${
                                darkMode ? "text-gray-300" : "text-gray-700"
                              } transition-colors duration-300 mb-2`}
                            >
                              {notification.message}
                            </p>
                            <p
                              className={`text-xs ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              } transition-colors duration-300`}
                            >
                              {formatDate(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className={`p-2 rounded-full ${
                              darkMode
                                ? "hover:bg-gray-700 text-gray-300"
                                : "hover:bg-gray-100 text-gray-600"
                            } transition-colors`}
                            title="تحديد كمقروء"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className={`p-2 rounded-full ${
                            darkMode
                              ? "hover:bg-red-900/50 text-gray-300 hover:text-red-400"
                              : "hover:bg-red-100 text-gray-600 hover:text-red-600"
                          } transition-all duration-200 group`}
                          title="حذف"
                        >
                          <Trash2
                            size={18}
                            className="transition-transform group-hover:scale-110"
                          />
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}

              {/* ترقيم الصفحات */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <div
                    className={`flex items-center gap-2 rounded-lg p-2 ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    } shadow-md`}
                  >
                    {/* زر الصفحة السابقة */}
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
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
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
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
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
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
                darkMode ? "bg-gray-800 text-gray-200" : "bg-white"
              } shadow-md transition-colors duration-300`}
            >
              <p
                className={`${
                  darkMode ? "text-indigo-400" : "text-indigo-600"
                } mb-4 transition-colors duration-300`}
              >
                لا توجد إشعارات{" "}
                {activeFilter !== "all" ? "مطابقة للتصفية المحددة" : ""}
              </p>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NotificationsPage;
