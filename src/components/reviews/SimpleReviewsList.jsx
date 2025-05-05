import React, { useState } from "react";
import { Star, ChevronDown, ChevronUp, Calendar, User } from "lucide-react";
import Card from "../common/Card";
import Button from "../common/Button";

const SimpleReviewsList = ({ reviews, darkMode }) => {
  const [expandedReviews, setExpandedReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Mostrar solo las primeras 3 evaluaciones inicialmente
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const toggleReviewExpand = (reviewId) => {
    if (expandedReviews.includes(reviewId)) {
      setExpandedReviews(expandedReviews.filter((id) => id !== reviewId));
    } else {
      setExpandedReviews([...expandedReviews, reviewId]);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SY");
  };

  // Componente para mostrar las estrellas de calificación
  const RatingStars = ({ rating }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={`${
            star <= rating
              ? `${
                  darkMode
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-yellow-500 fill-yellow-500"
                }`
              : `${darkMode ? "text-gray-600" : "text-gray-300"}`
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {visibleReviews.map((review) => {
        const isExpanded = expandedReviews.includes(review.id);

        return (
          <div
            key={review.id}
            className={`border-b ${darkMode ? "border-gray-700" : ""} pb-4`}
          >
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full ml-3 bg-indigo-200 flex items-center justify-center">
                <User size={20} className="text-indigo-700" />
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <h4
                    className={`font-bold ml-2 ${
                      darkMode ? "text-gray-200" : ""
                    }`}
                  >
                    عميل
                  </h4>
                  <div className="flex items-center">
                    <RatingStars rating={review.overallRating} />
                    <span className="mr-2 text-sm">
                      {review.overallRating}/5
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-sm mb-2">
                  <Calendar size={14} className="ml-1" />
                  <span
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {formatDate(review.createdAt)}
                  </span>
                </div>

                <p
                  className={`${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  } mb-2`}
                >
                  {review.comment}
                </p>

                {/* Calificaciones detalladas (expandibles) */}
                {isExpanded && (
                  <div
                    className={`mt-3 p-3 rounded-md ${
                      darkMode ? "bg-gray-700" : "bg-white/80"
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <span
                          className={`ml-2 ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          جودة العمل:
                        </span>
                        <RatingStars rating={review.qualityRating} />
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`ml-2 ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          الالتزام بالوقت:
                        </span>
                        <RatingStars rating={review.punctualityRating} />
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`ml-2 ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          القيمة مقابل السعر:
                        </span>
                        <RatingStars rating={review.priceRating} />
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`ml-2 ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          التواصل:
                        </span>
                        <RatingStars rating={review.communicationRating} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Imágenes de la evaluación */}
                {review.images && review.images.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {review.images.map((image, index) => (
                      <div
                        key={index}
                        className="h-20 rounded-md overflow-hidden"
                      >
                        <img
                          src={image}
                          alt={`صورة التقييم ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Botón para expandir/colapsar */}
                <button
                  onClick={() => toggleReviewExpand(review.id)}
                  className={`mt-2 text-sm flex items-center ${
                    darkMode ? "text-indigo-400" : "text-indigo-600"
                  } hover:underline`}
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp size={16} className="ml-1" />
                      عرض أقل
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} className="ml-1" />
                      عرض التفاصيل
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Botón para mostrar más/menos evaluaciones */}
      {reviews.length > 3 && (
        <div className="text-center mt-4">
          <Button
            variant="secondary"
            onClick={() => setShowAllReviews(!showAllReviews)}
            className="text-sm"
          >
            {showAllReviews ? (
              <>
                <ChevronUp size={16} className="ml-1" />
                عرض أقل
              </>
            ) : (
              <>
                <ChevronDown size={16} className="ml-1" />
                عرض المزيد من التقييمات ({reviews.length - 3})
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SimpleReviewsList;
