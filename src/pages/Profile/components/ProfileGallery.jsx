import React from "react";
import { motion } from "framer-motion";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import LazyImage from "../../../components/common/LazyImage";
import useThemeStore from "../../../store/themeStore";

const ProfileGallery = ({
  gallery = [],
  isEditing,
  onAddImage,
  onRemoveImage,
}) => {
  const darkMode = useThemeStore((state) => state.darkMode);
  const fileInputRef = React.useRef(null);

  const handleAddClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0 && onAddImage) {
      // Convert FileList to Array
      const filesArray = Array.from(files);
      const imageUrls = [];
      let loadedCount = 0;

      // Process all files and collect their URLs
      filesArray.forEach((file) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          imageUrls.push(reader.result);
          loadedCount++;

          // When all files are loaded, add them all at once
          if (loadedCount === filesArray.length) {
            onAddImage(imageUrls);
          }
        };

        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <Card
      className={`p-6 mb-6 ${
        darkMode
          ? "bg-gray-800 text-gray-200 border-gray-700"
          : "bg-gradient-to-br from-blue-50 to-indigo-100 border-indigo-200"
      } shadow-md border transition-colors duration-300`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2
          className={`text-xl font-bold ${
            darkMode ? "text-indigo-300" : "text-indigo-800"
          } relative inline-block transition-colors duration-300`}
        >
          <span className="relative z-10">معرض الأعمال</span>
          <span
            className={`absolute bottom-0 left-0 right-0 h-2 ${
              darkMode ? "bg-indigo-500" : "bg-indigo-300"
            } opacity-40 transform -rotate-1 z-0`}
          ></span>
        </h2>
        {isEditing && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="hidden"
            />
            <Button
              variant="secondary"
              onClick={handleAddClick}
              className={`text-sm text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-2 px-4 rounded-md ${
                darkMode
                  ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              }`}
            >
              <span className="relative z-10 font-bold text-white">
                إضافة صور
              </span>
              <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            </Button>
          </>
        )}
      </div>

      {gallery.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {gallery.map((image, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="relative h-40 rounded-lg overflow-hidden"
            >
              <LazyImage
                src={image}
                alt={`عمل ${index + 1}`}
                className="w-full h-full object-cover"
                placeholderClassName="w-full h-full bg-gray-200 animate-pulse"
              />
              {isEditing && (
                <button
                  onClick={() => onRemoveImage(index)}
                  className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
                >
                  ×
                </button>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <p
          className={`text-center p-3 rounded-md inline-block ${
            darkMode
              ? "text-indigo-300 bg-indigo-900 border-indigo-700"
              : "text-indigo-500 bg-indigo-50 border-indigo-100"
          } transition-colors duration-300`}
        >
          لا توجد صور في المعرض
        </p>
      )}
    </Card>
  );
};

export default ProfileGallery;
