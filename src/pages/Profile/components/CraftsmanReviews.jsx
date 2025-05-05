import React from "react";
import Card from "../../../components/common/Card";
import DetailedReviewsList from "../../../components/reviews/DetailedReviewsList";

const CraftsmanReviews = ({ reviews, darkMode }) => {
  return (
    <Card
      className={`p-6 ${
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
        <span className="relative z-10">التقييمات</span>
        <span
          className={`absolute bottom-0 left-0 right-0 h-2 ${
            darkMode ? "bg-indigo-500" : "bg-indigo-300"
          } opacity-40 transform -rotate-1 z-0`}
        ></span>
      </h2>
      {reviews.length > 0 ? (
        <DetailedReviewsList reviews={reviews} />
      ) : (
        <p
          className={`text-center p-3 rounded-md border ${
            darkMode
              ? "text-indigo-400 bg-gray-700 border-gray-600"
              : "text-indigo-500 bg-indigo-50 border-indigo-100"
          } transition-colors duration-300`}
        >
          لا توجد تقييمات بعد
        </p>
      )}
    </Card>
  );
};

export default CraftsmanReviews;
