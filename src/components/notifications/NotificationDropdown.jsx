import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle,
  XCircle,
  CheckSquare,
  XSquare,
  ClipboardList,
  ClipboardCheck,
  Star,
} from "lucide-react";
import useNotificationStore from "../../store/notificationStore";
import { NOTIFICATION_TYPES } from "../../services/notificationService";
import useThemeStore from "../../store/themeStore";

// مكون عنصر إشعار فردي
const NotificationItem = ({ notification, onRead, darkMode }) => {
  const navigate = useNavigate();

  // تحديد الأيقونة المناسبة
  const getIcon = () => {
    switch (notification.icon) {
      case "check-circle":
        return <CheckCircle size={16} className="text-green-500" />;
      case "x-circle":
        return <XCircle size={16} className="text-red-500" />;
      case "check-square":
        return <CheckSquare size={16} className="text-green-500" />;
      case "x-square":
        return <XSquare size={16} className="text-red-500" />;
      case "clipboard-list":
        return <ClipboardList size={16} className="text-indigo-500" />;
      case "clipboard-check":
        return <ClipboardCheck size={16} className="text-indigo-500" />;
      case "star":
        return <Star size={16} className="text-yellow-500" />;
      default:
        return <Bell size={16} className="text-indigo-500" />;
    }
  };

  // معالجة النقر على الإشعار
  const handleClick = () => {
    onRead(notification.id);

    // التنقل إلى الصفحة المناسبة بناءً على نوع الإشعار
    if (notification.data?.bookingId) {
      navigate(`/booking/${notification.data.bookingId}`);
    }
  };

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SY", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      onClick={handleClick}
      className={`p-3 border-b last:border-b-0 cursor-pointer transition-all duration-200 ${
        notification.read
          ? darkMode
            ? "bg-gray-800"
            : "bg-white"
          : darkMode
          ? "bg-indigo-900/30 border-r-2 border-indigo-500"
          : "bg-indigo-50 border-r-2 border-indigo-500"
      } hover:${darkMode ? "bg-indigo-900/20" : "bg-indigo-50/80"}`}
    >
      <div className="flex items-start">
        <div className="ml-3 mt-1">{getIcon()}</div>
        <div className="flex-1">
          <h4
            className={`font-bold text-sm ${
              darkMode ? "text-indigo-300" : "text-indigo-700"
            }`}
          >
            {notification.title}
          </h4>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {notification.message}
          </p>
          <span
            className={`text-xs ${
              darkMode ? "text-indigo-400/70" : "text-indigo-500/70"
            } mt-1 block`}
          >
            {formatDate(notification.timestamp)}
          </span>
        </div>
        {!notification.read && (
          <div
            className={`w-2 h-2 rounded-full mt-2 ${
              darkMode
                ? "bg-indigo-500 animate-pulse"
                : "bg-indigo-600 animate-pulse"
            }`}
          ></div>
        )}
      </div>
    </div>
  );
};

// مكون قائمة الإشعارات
const NotificationDropdown = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const darkMode = useThemeStore((state) => state.darkMode);
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();

  if (!isOpen) return null;

  return (
    <div
      className={`absolute left-0 mt-2 w-80 rounded-md shadow-xl z-50 ${
        darkMode
          ? "bg-gray-800 border border-indigo-700/50"
          : "bg-white border border-indigo-200"
      } overflow-hidden transition-all duration-300`}
    >
      <div
        className={`p-3 border-b flex justify-between items-center ${
          darkMode
            ? "border-indigo-700/30 bg-gradient-to-r from-indigo-900/50 to-gray-800"
            : "border-indigo-100 bg-gradient-to-r from-indigo-50 to-white"
        }`}
      >
        <h3
          className={`font-bold ${
            darkMode ? "text-indigo-300" : "text-indigo-700"
          }`}
        >
          الإشعارات
        </h3>
        <div className="flex gap-2">
          <button
            onClick={markAllAsRead}
            className={`text-xs px-2 py-1 rounded transition-all duration-200 ${
              darkMode
                ? "bg-indigo-700/50 text-indigo-300 hover:bg-indigo-700/70 hover:text-indigo-200"
                : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200 hover:text-indigo-700"
            }`}
          >
            تحديد الكل كمقروء
          </button>
          <button
            onClick={() => {
              onClose();
              navigate("/notifications");
            }}
            className={`text-xs px-2 py-1 rounded transition-all duration-200 ${
              darkMode
                ? "bg-gradient-to-r from-indigo-700 to-purple-800 text-white hover:from-indigo-800 hover:to-purple-900"
                : "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700"
            } shadow-sm hover:shadow-md`}
          >
            عرض الكل
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications
            .slice(0, 5)
            .map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={markAsRead}
                darkMode={darkMode}
              />
            ))
        ) : (
          <div
            className={`p-6 text-center ${
              darkMode ? "text-indigo-400" : "text-indigo-500"
            }`}
          >
            <div className="flex flex-col items-center">
              <Bell size={24} className="mb-2 opacity-50" />
              <p>لا توجد إشعارات جديدة</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
