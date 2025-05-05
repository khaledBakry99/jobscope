import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import useThemeStore from "../../store/themeStore";
import useReviewStore from "../../store/reviewStore";
import Card from "../common/Card";
import SimpleReviewsList from "./SimpleReviewsList";

const DetailedReviewsList = ({ craftsmanId }) => {
  const darkMode = useThemeStore((state) => state.darkMode);
  const allReviews = useReviewStore((state) => state.reviews);

  const [reviews, setReviews] = useState([]);
  const [detailedRatings, setDetailedRatings] = useState({
    quality: 0,
    punctuality: 0,
    price: 0,
    communication: 0,
    overall: 0,
  });

  // Cargar las evaluaciones y calcular las calificaciones detalladas
  useEffect(() => {
    // Convertir a número para asegurar compatibilidad
    const craftId = Number(craftsmanId);

    // Filtrar las evaluaciones para este artesano
    const filteredReviews = allReviews.filter(
      (review) => review.craftsmanId === craftId
    );
    setReviews(filteredReviews);

    // Calcular las calificaciones detalladas
    if (filteredReviews.length > 0) {
      const quality =
        filteredReviews.reduce((acc, review) => acc + review.qualityRating, 0) /
        filteredReviews.length;
      const punctuality =
        filteredReviews.reduce(
          (acc, review) => acc + review.punctualityRating,
          0
        ) / filteredReviews.length;
      const price =
        filteredReviews.reduce((acc, review) => acc + review.priceRating, 0) /
        filteredReviews.length;
      const communication =
        filteredReviews.reduce(
          (acc, review) => acc + review.communicationRating,
          0
        ) / filteredReviews.length;
      const overall =
        filteredReviews.reduce((acc, review) => acc + review.overallRating, 0) /
        filteredReviews.length;

      setDetailedRatings({
        quality: quality.toFixed(1),
        punctuality: punctuality.toFixed(1),
        price: price.toFixed(1),
        communication: communication.toFixed(1),
        overall: overall.toFixed(1),
      });
    }
  }, [craftsmanId, allReviews]);

  // Componente para mostrar la barra de progreso de calificación
  const RatingBar = ({ label, rating, count, total }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (
      <div className="flex items-center mb-1">
        <span className="w-28 text-sm">{label}</span>
        <div
          className={`flex-1 h-2 ${
            darkMode ? "bg-gray-600" : "bg-gray-200"
          } rounded-full mx-2 transition-colors duration-300`}
        >
          <div
            className={`h-full ${
              darkMode ? "bg-indigo-500" : "bg-indigo-400"
            } rounded-full transition-colors duration-300`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className={`text-sm ${darkMode ? "text-gray-300" : ""}`}>
          {rating}
        </span>
      </div>
    );
  };

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
        <span className="relative z-10">التقييمات والمراجعات</span>
        <span
          className={`absolute bottom-0 left-0 right-0 h-2 ${
            darkMode ? "bg-indigo-500" : "bg-indigo-300"
          } opacity-40 transform -rotate-1 z-0`}
        ></span>
      </h2>

      {reviews.length > 0 ? (
        <>
          {/* Resumen de calificaciones */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <div className="flex items-center ml-4">
                <Star
                  size={24}
                  className={`${
                    darkMode
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-yellow-500 fill-yellow-500"
                  }`}
                />
                <span className="mr-1 text-2xl font-bold">
                  {detailedRatings.overall}
                </span>
              </div>
              <span
                className={`${
                  darkMode ? "text-indigo-400" : "text-indigo-500"
                } transition-colors duration-300`}
              >
                ({reviews.length} تقييم)
              </span>
            </div>

            {/* Barras de calificación detallada */}
            <div className="mt-4 mb-6">
              <RatingBar
                label="جودة العمل"
                rating={detailedRatings.quality}
                count={parseFloat(detailedRatings.quality) * reviews.length}
                total={5 * reviews.length}
              />
              <RatingBar
                label="الالتزام بالوقت"
                rating={detailedRatings.punctuality}
                count={parseFloat(detailedRatings.punctuality) * reviews.length}
                total={5 * reviews.length}
              />
              <RatingBar
                label="القيمة مقابل السعر"
                rating={detailedRatings.price}
                count={parseFloat(detailedRatings.price) * reviews.length}
                total={5 * reviews.length}
              />
              <RatingBar
                label="التواصل"
                rating={detailedRatings.communication}
                count={parseFloat(detailedRatings.communication) * reviews.length}
                total={5 * reviews.length}
              />
            </div>
          </div>

          {/* Lista de evaluaciones */}
          <SimpleReviewsList reviews={reviews} darkMode={darkMode} />
        </>
      ) : (
        <div className="text-center py-8">
          <div
            className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto mb-4 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            <h3
              className={`text-xl font-bold mb-2 ${
                darkMode ? "text-indigo-300" : "text-indigo-700"
              }`}
            >
              لا توجد تقييمات بعد
            </h3>
            <p
              className={`${
                darkMode ? "text-gray-400" : "text-gray-500"
              } max-w-md mx-auto`}
            >
              لم يتلق هذا الحرفي أي تقييمات بعد. بعد الانتهاء من الخدمة، يمكنك
              تقييم الحرفي لمساعدة الآخرين في اتخاذ قراراتهم.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default DetailedReviewsList;
