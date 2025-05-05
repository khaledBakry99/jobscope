import React from "react";
import Card from "../../../components/common/Card";
import useThemeStore from "../../../store/themeStore";

const ProfileBio = ({ bio, isEditing, onBioChange }) => {
  const darkMode = useThemeStore((state) => state.darkMode);
  return (
    <Card
      className={`p-6 mb-6 ${
        darkMode
          ? "bg-gray-800 text-gray-200 border-gray-700"
          : "bg-gradient-to-br from-blue-50 to-indigo-100 border-indigo-200"
      } shadow-md border transition-colors duration-300`}
    >
      <h2
        className={`text-xl font-bold mb-4 ${
          darkMode ? "text-indigo-300" : "text-indigo-800"
        } relative inline-block transition-colors duration-300`}
      >
        <span className="relative z-10">نبذة عني</span>
        <span
          className={`absolute bottom-0 left-0 right-0 h-2 ${
            darkMode ? "bg-indigo-500" : "bg-indigo-300"
          } opacity-40 transform -rotate-1 z-0`}
        ></span>
      </h2>
      {isEditing ? (
        <textarea
          value={bio}
          onChange={(e) => onBioChange(e.target.value)}
          className="input min-h-[120px] w-full border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
          placeholder="اكتب نبذة قصيرة عن نفسك..."
        />
      ) : (
        <p
          className={`${
            darkMode ? "text-indigo-300" : "text-indigo-700"
          } leading-relaxed transition-colors duration-300`}
        >
          {bio || "لم يتم إضافة نبذة بعد."}
        </p>
      )}
    </Card>
  );
};

export default ProfileBio;
