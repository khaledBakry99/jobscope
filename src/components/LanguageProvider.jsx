import React, { useEffect } from "react";
import useLanguageStore from "../store/languageStore";

const LanguageProvider = ({ children }) => {
  const language = useLanguageStore((state) => state.language);

  useEffect(() => {
    // Update HTML lang and dir attributes based on language
    const htmlElement = document.documentElement;

    if (language === "en") {
      htmlElement.setAttribute("lang", "en");
      htmlElement.setAttribute("dir", "ltr");
      // إزالة رسائل التصحيح من وحدة التحكم
      // console.log("Language changed to English, direction: LTR");
    } else {
      htmlElement.setAttribute("lang", "ar");
      htmlElement.setAttribute("dir", "rtl");
      // إزالة رسائل التصحيح من وحدة التحكم
      // console.log("Language changed to Arabic, direction: RTL");
    }
  }, [language]);

  return <>{children}</>;
};

export default LanguageProvider;
