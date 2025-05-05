import React from "react";
import { motion } from "framer-motion";
import Card from "../../../components/common/Card";
import LazyImage from "../../../components/common/LazyImage";

const CraftsmanGallery = ({ craftsman, darkMode }) => {
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
        <span className="relative z-10">معرض الأعمال</span>
        <span
          className={`absolute bottom-0 left-0 right-0 h-2 ${
            darkMode ? "bg-indigo-500" : "bg-indigo-300"
          } opacity-40 transform -rotate-1 z-0`}
        ></span>
      </h2>
      {craftsman.gallery && craftsman.gallery.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {craftsman.gallery.map((image, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="h-40 rounded-lg overflow-hidden"
            >
              <LazyImage
                src={image}
                alt={`عمل ${index + 1}`}
                className="w-full h-full object-cover"
                placeholderClassName="w-full h-full bg-gray-200 animate-pulse"
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <p
          className={`text-center p-3 rounded-md border ${
            darkMode
              ? "text-indigo-400 bg-gray-700 border-gray-600"
              : "text-indigo-500 bg-indigo-50 border-indigo-100"
          } transition-colors duration-300`}
        >
          لا توجد صور في المعرض
        </p>
      )}
    </Card>
  );
};

export default CraftsmanGallery;
