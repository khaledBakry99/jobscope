import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/Welcome/WelcomePage";
import LoginPage from "./pages/Login/LoginPage";
import CraftsmanRegisterPage from "./pages/Register/CraftsmanRegisterPage";
import ClientRegisterPage from "./pages/Register/ClientRegisterPage";
import HomePage from "./pages/Home/HomePage";
import SearchPage from "./pages/Search/SearchPage";
import CraftsmanProfilePage from "./pages/Profile/CraftsmanProfilePage";
import MyProfilePage from "./pages/Profile/MyProfilePage";
import SettingsPage from "./pages/Settings/SettingsPage";
import BookingPage from "./pages/Booking/BookingPage";
import BookingsPage from "./pages/Bookings/BookingsPage";
import NotificationsPage from "./pages/Notifications/NotificationsPage";
import AdminMockPage from "./pages/Admin/AdminMockPage";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProtectedRoute from "./components/auth/AdminProtectedRoute";
import LogoutRedirectPage from "./pages/Auth/LogoutRedirectPage";
import useThemeStore from "./store/themeStore";

function App() {
  const darkMode = useThemeStore((state) => state.darkMode);

  // Apply dark mode class to body when component mounts or darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen font-sans ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-blue-50 to-indigo-100 text-black"
      } transition-colors duration-300`}
    >
      <Routes>
        {/* مسارات المستخدمين العاديين */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/craftsman" element={<CraftsmanRegisterPage />} />
        <Route path="/register/client" element={<ClientRegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route
          path="/profile/craftsman/:id"
          element={<CraftsmanProfilePage />}
        />
        <Route path="/profile/my" element={<MyProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/logout-redirect" element={<LogoutRedirectPage />} />

        {/* مسارات الأدمن */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminMockPage />} />

        {/* مسارات الأدمن المحمية */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* يمكن إضافة المزيد من المسارات المحمية للأدمن هنا */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
