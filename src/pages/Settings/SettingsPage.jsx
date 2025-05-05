import React, { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../../components/layout/Layout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import useUserStore from "../../store/userStore";
import useThemeStore from "../../store/themeStore";
import useLanguageStore from "../../store/languageStore";
import LoginRedirect from "../../components/auth/LoginRedirect";
import { Lock, LogOut, Trash2, Globe, Bell, Moon } from "lucide-react";
import settingsTranslations from "../../translations/settingsTranslations";

const SettingsPage = () => {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const [notifications, setNotifications] = useState(true);
  const darkMode = useThemeStore((state) => state.darkMode);
  const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);

  // Get translations based on current language
  const t = settingsTranslations[language];
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleNotificationsToggle = () => {
    setNotifications(!notifications);
  };

  const handleDarkModeToggle = () => {
    toggleDarkMode();
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });

    // Clear error when user types
    if (passwordErrors[name]) {
      setPasswordErrors({
        ...passwordErrors,
        [name]: "",
      });
    }
  };

  const validatePasswordForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = t.currentPasswordRequired;
      isValid = false;
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = t.newPasswordRequired;
      isValid = false;
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = t.passwordMinLength;
      isValid = false;
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = t.confirmPasswordRequired;
      isValid = false;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = t.passwordsNotMatch;
      isValid = false;
    }

    setPasswordErrors(newErrors);
    return isValid;
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (validatePasswordForm()) {
      // In a real app, this would send the data to the server
      // For now, we'll just simulate a successful password change

      // Close modal and reset form
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Show success message (in a real app)
      alert(t.passwordChangeSuccess);
    }
  };

  if (!user) {
    return <LoginRedirect />;
  }

  return (
    <Layout user={user} onLogout={logout}>
      <div
        className={`${
          darkMode
            ? "bg-gray-900 text-white"
            : "bg-gradient-to-br from-blue-50 to-indigo-100 text-black"
        } min-h-screen py-12 transition-colors duration-300`}
      >
        <div className="container mx-auto px-4">
          <motion.h1
            className="text-4xl font-bold mb-8 relative inline-block"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="relative z-10">{t.pageTitle}</span>
            <span className="absolute bottom-0 left-0 right-0 h-3 bg-indigo-500 opacity-30 transform -rotate-1 z-0"></span>
          </motion.h1>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Language Settings */}
            <Card
              className={`p-6 ${
                darkMode ? "bg-gray-800 text-gray-200" : "bg-green-50"
              } shadow-md hover:shadow-lg transition-all duration-300`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-full ${
                    darkMode
                      ? "bg-indigo-900 text-indigo-300"
                      : "bg-indigo-100 text-indigo-600"
                  } flex items-center justify-center`}
                >
                  <Globe size={20} />
                </div>
                <h2 className="text-xl font-bold">{t.languageTitle}</h2>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  {t.chooseLanguage}
                </label>
                <select
                  value={language}
                  onChange={handleLanguageChange}
                  className="input"
                >
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              </div>
              <p
                className={`${
                  darkMode ? "text-gray-400" : "text-gray-500"
                } text-sm`}
              >
                {t.languageChangeNote}
              </p>
            </Card>

            {/* Notification Settings */}
            <Card
              className={`p-6 ${
                darkMode ? "bg-gray-800 text-gray-200" : "bg-blue-50"
              } shadow-md hover:shadow-lg transition-all duration-300`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-full ${
                    darkMode
                      ? "bg-indigo-900 text-indigo-300"
                      : "bg-indigo-100 text-indigo-600"
                  } flex items-center justify-center`}
                >
                  <Bell size={20} />
                </div>
                <h2 className="text-xl font-bold">{t.notificationsTitle}</h2>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  {t.enableNotifications}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={handleNotificationsToggle}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300/20 rounded-full peer peer-checked:after:translate-x-[0.4rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              <p
                className={`${
                  darkMode ? "text-gray-400" : "text-gray-500"
                } text-sm`}
              >
                {t.notificationsNote}
              </p>
            </Card>

            {/* Appearance Settings */}
            <Card
              className={`p-6 ${
                darkMode ? "bg-gray-800 text-gray-200" : "bg-purple-50"
              } shadow-md hover:shadow-lg transition-all duration-300`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-full ${
                    darkMode
                      ? "bg-indigo-900 text-indigo-300"
                      : "bg-indigo-100 text-indigo-600"
                  } flex items-center justify-center`}
                >
                  <Moon size={20} />
                </div>
                <h2 className="text-xl font-bold">{t.appearanceTitle}</h2>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  {t.darkMode}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={handleDarkModeToggle}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300/20 rounded-full peer peer-checked:after:translate-x-[0.4rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              <p
                className={`${
                  darkMode ? "text-gray-400" : "text-gray-500"
                } text-sm`}
              >
                {t.appearanceNote}
              </p>
            </Card>

            {/* Security Settings */}
            <Card
              className={`p-6 ${
                darkMode ? "bg-gray-800 text-gray-200" : "bg-indigo-50"
              } shadow-md hover:shadow-lg transition-all duration-300`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-full ${
                    darkMode
                      ? "bg-indigo-900 text-indigo-300"
                      : "bg-indigo-100 text-indigo-600"
                  } flex items-center justify-center`}
                >
                  <Lock size={20} />
                </div>
                <h2 className="text-xl font-bold">{t.securityTitle}</h2>
              </div>
              <div className="mb-4">
                <Button
                  variant="primary"
                  className="bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group text-lg py-3 px-6"
                  onClick={() => setShowPasswordModal(true)}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Lock size={18} />
                    {t.changePassword}
                  </span>
                  <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                </Button>
              </div>
              <div className="mb-4">
                <Button
                  variant="primary"
                  className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group text-lg py-3 px-6"
                  onClick={logout}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <LogOut size={18} />
                    {t.logout}
                  </span>
                  <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                </Button>
              </div>
              <p
                className={`${
                  darkMode ? "text-gray-400" : "text-gray-500"
                } text-sm`}
              >
                {t.securityNote}
              </p>
            </Card>

            {/* Account Settings */}
            <Card
              className={`p-6 ${
                darkMode ? "bg-gray-800 text-gray-200" : "bg-red-50"
              } shadow-md hover:shadow-lg transition-all duration-300 md:col-span-2`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-full ${
                    darkMode
                      ? "bg-red-900 text-red-300"
                      : "bg-red-100 text-red-600"
                  } flex items-center justify-center`}
                >
                  <Trash2 size={20} />
                </div>
                <h2 className="text-xl font-bold">{t.accountSettingsTitle}</h2>
              </div>
              <div className="mb-4">
                <Button
                  variant="primary"
                  className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group text-lg py-3 px-6"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Trash2 size={18} />
                    {t.deleteAccount}
                  </span>
                  <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                </Button>
              </div>
              <p
                className={`${
                  darkMode ? "text-gray-400" : "text-gray-500"
                } text-sm`}
              >
                {t.deleteAccountWarning}
              </p>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <motion.div
            className={`${
              darkMode ? "bg-gray-800 text-white" : "bg-white"
            } rounded-lg shadow-lg w-full max-w-md`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{t.passwordModalTitle}</h2>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="text-gray-500 hover:text-gray-700"
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

              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    {t.currentPassword} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange}
                    className={`input ${
                      passwordErrors.currentPassword
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    required
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {passwordErrors.currentPassword}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    {t.newPassword} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    className={`input ${
                      passwordErrors.newPassword
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    required
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {passwordErrors.newPassword}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    {t.confirmNewPassword}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    className={`input ${
                      passwordErrors.confirmPassword
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    required
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {passwordErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-2 px-4"
                    onClick={() => setShowPasswordModal(false)}
                  >
                    <span className="relative z-10">{t.cancel}</span>
                    <span className="absolute inset-0 bg-gray-200 opacity-0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full group-hover:opacity-20 transition-all duration-700"></span>
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-2 px-4"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Lock size={16} />
                      {t.changePassword}
                    </span>
                    <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </Layout>
  );
};

export default SettingsPage;
