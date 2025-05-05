import React from "react";
import Card from "../../../components/common/Card";

const CraftsmanBio = ({ craftsman, darkMode }) => {
  return (
    <Card
      className={`p-6 mb-6 ${
        darkMode
          ? "bg-gray-800 text-gray-200"
          : "bg-gradient-to-br from-blue-50 to-indigo-100"
      } shadow-md transition-colors duration-300`}
    >
      <h2
        className={`text-xl font-bold mb-4 ${
          darkMode ? "text-indigo-300" : "text-indigo-800"
        } relative inline-block transition-colors duration-300`}
      >
        <span className="relative z-10">نبذة عن الحرفي</span>
        <span
          className={`absolute bottom-0 left-0 right-0 h-2 ${
            darkMode ? "bg-indigo-500" : "bg-indigo-300"
          } opacity-40 transform -rotate-1 z-0`}
        ></span>
      </h2>
      <p
        className={`${
          darkMode ? "text-gray-300" : "text-indigo-700"
        } leading-relaxed transition-colors duration-300`}
      >
        {craftsman.bio ||
          "خبرة 15 عام في مجال التمديدات الكهربائية المنزلية والصناعية. متخصص في تركيب وصيانة الأنظمة الكهربائية وحل المشاكل بسرعة واحترافية. حاصل على شهادات معتمدة في السلامة الكهربائية."}
      </p>
    </Card>
  );
};

export default CraftsmanBio;
