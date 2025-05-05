import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import AdvancedChatbot from "../chatbot/AdvancedChatbot";
import useThemeStore from "../../store/themeStore";

const Layout = ({
  children,
  user,
  onLogout,
  hideFooter = false,
  hideHeader = false,
}) => {
  const darkMode = useThemeStore((state) => state.darkMode);

  return (
    <div
      className={`flex flex-col min-h-screen ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-blue-50 to-indigo-100 text-black"
      } transition-colors duration-300`}
    >
      {!hideHeader && <Header user={user} onLogout={onLogout} />}
      <main className="flex-grow">{children}</main>
      {!hideFooter && <Footer />}
      <AdvancedChatbot />
    </div>
  );
};

export default Layout;
