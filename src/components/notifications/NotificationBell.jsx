import React from "react";
import { Bell } from "lucide-react";
import useNotificationStore from "../../store/notificationStore";
import useThemeStore from "../../store/themeStore";

const NotificationBell = ({ onClick }) => {
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const darkMode = useThemeStore((state) => state.darkMode);

  return (
    <button
      onClick={onClick}
      className={`relative p-2 rounded-full transition-all duration-200 ${
        darkMode
          ? "hover:bg-indigo-700/50 text-yellow-300 hover:text-yellow-200"
          : "hover:bg-yellow-50 text-white hover:text-yellow-300"
      } transform hover:scale-105`}
      aria-label="الإشعارات"
    >
      <Bell size={20} className="transition-colors duration-200" />

      {unreadCount > 0 && (
        <span className="notification-badge ">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
