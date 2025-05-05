import React, { useState } from "react";
import { Star, Upload, X } from "lucide-react";
import Button from "../common/Button";
import useThemeStore from "../../store/themeStore";

const DetailedReviewForm = ({ onSubmit, onCancel }) => {
  const darkMode = useThemeStore((state) => state.darkMode);

  const [reviewData, setReviewData] = useState({
    qualityRating: 5,
    punctualityRating: 5,
    priceRating: 5,
    communicationRating: 5,
    overallRating: 5,
    comment: "",
    images: [],
  });

  const [errors, setErrors] = useState({});
  const [previewImages, setPreviewImages] = useState([]);

  // Calcular la calificación general basada en los otros criterios
  const calculateOverallRating = (data) => {
    const {
      qualityRating,
      punctualityRating,
      priceRating,
      communicationRating,
    } = data;
    return Math.round(
      (qualityRating + punctualityRating + priceRating + communicationRating) /
        4
    );
  };

  const handleRatingChange = (criterion, value) => {
    const newData = { ...reviewData, [criterion]: value };

    // Actualizar automáticamente la calificación general
    if (criterion !== "overallRating") {
      newData.overallRating = calculateOverallRating(newData);
    }

    setReviewData(newData);
  };

  const handleCommentChange = (e) => {
    setReviewData({ ...reviewData, comment: e.target.value });

    // Limpiar error cuando el usuario escribe
    if (errors.comment) {
      setErrors({ ...errors, comment: "" });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Limitar a 5 imágenes
    const totalImages = previewImages.length + files.length;
    if (totalImages > 5) {
      setErrors({ ...errors, images: "يمكنك تحميل 5 صور كحد أقصى" });
      return;
    }

    // Crear URLs para vista previa
    const newPreviewImages = [...previewImages];
    const newImages = [...reviewData.images];

    files.forEach((file) => {
      // Verificar el tamaño del archivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          images: "يجب أن يكون حجم الصورة أقل من 5 ميجابايت",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviewImages.push(e.target.result);
        setPreviewImages(newPreviewImages);
      };
      reader.readAsDataURL(file);

      // En una aplicación real, aquí se cargarían las imágenes a un servidor
      // Para esta demostración, simplemente almacenamos los objetos File
      newImages.push(file);
    });

    setReviewData({ ...reviewData, images: newImages });
    setErrors({ ...errors, images: "" });
  };

  const removeImage = (index) => {
    const newPreviewImages = [...previewImages];
    const newImages = [...reviewData.images];

    newPreviewImages.splice(index, 1);
    newImages.splice(index, 1);

    setPreviewImages(newPreviewImages);
    setReviewData({ ...reviewData, images: newImages });
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!reviewData.comment) {
      newErrors.comment = "التعليق مطلوب";
      isValid = false;
    } else if (reviewData.comment.length < 10) {
      newErrors.comment = "يجب أن يكون التعليق 10 أحرف على الأقل";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Convertir las imágenes a URLs para la demostración
      // En una aplicación real, aquí se enviarían las imágenes a un servidor
      const imageUrls = previewImages;

      onSubmit({
        ...reviewData,
        images: imageUrls,
      });
    }
  };

  // Componente para mostrar las estrellas de calificación
  const RatingStars = ({ criterion, label, value }) => (
    <div className="mb-4">
      <label
        className={`block font-medium mb-2 ${
          darkMode ? "text-gray-300" : "text-gray-700"
        } transition-colors duration-300`}
      >
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(criterion, star)}
            className="ml-1 focus:outline-none"
          >
            <Star
              size={28}
              className={`${
                star <= value
                  ? `${
                      darkMode
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-yellow-500 fill-yellow-500"
                    }`
                  : `${darkMode ? "text-gray-600" : "text-gray-300"}`
              }`}
            />
          </button>
        ))}
        <span className={`mr-2 font-bold ${darkMode ? "text-gray-200" : ""}`}>
          {value}/5
        </span>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3
        className={`text-lg font-bold mb-4 ${
          darkMode ? "text-indigo-300" : "text-indigo-700"
        } transition-colors duration-300`}
      >
        تقييم الخدمة
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RatingStars
          criterion="qualityRating"
          label="جودة العمل"
          value={reviewData.qualityRating}
        />

        <RatingStars
          criterion="punctualityRating"
          label="الالتزام بالوقت"
          value={reviewData.punctualityRating}
        />

        <RatingStars
          criterion="priceRating"
          label="القيمة مقابل السعر"
          value={reviewData.priceRating}
        />

        <RatingStars
          criterion="communicationRating"
          label="التواصل"
          value={reviewData.communicationRating}
        />
      </div>

      <div className="border-t border-b py-4 my-4">
        <RatingStars
          criterion="overallRating"
          label="التقييم العام"
          value={reviewData.overallRating}
        />
      </div>

      <div className="mb-4">
        <label
          className={`block font-medium mb-2 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          } transition-colors duration-300`}
        >
          التعليق <span className="text-red-500">*</span>
        </label>
        <textarea
          value={reviewData.comment}
          onChange={handleCommentChange}
          placeholder="اكتب تعليقك هنا..."
          className={`input min-h-[100px] w-full ${
            darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
          } ${errors.comment ? "border-red-500 focus:ring-red-500" : ""}`}
          required
        ></textarea>
        {errors.comment && (
          <p className="text-red-500 text-sm mt-1">{errors.comment}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          className={`block font-medium mb-2 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          } transition-colors duration-300`}
        >
          صور الأعمال المنجزة (اختياري)
        </label>
        <div
          className={`border-2 border-dashed rounded-md p-4 text-center ${
            darkMode
              ? "border-gray-600 hover:border-gray-500"
              : "border-gray-300 hover:border-gray-400"
          } transition-colors duration-300`}
        >
          <input
            type="file"
            id="image-upload"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center justify-center"
          >
            <Upload
              size={32}
              className={`mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            />
            <p
              className={`${
                darkMode ? "text-gray-300" : "text-gray-700"
              } transition-colors duration-300`}
            >
              انقر لتحميل الصور
            </p>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              } transition-colors duration-300`}
            >
              الحد الأقصى: 5 صور، بحجم أقصى 5 ميجابايت لكل صورة
            </p>
          </label>
        </div>
        {errors.images && (
          <p className="text-red-500 text-sm mt-1">{errors.images}</p>
        )}

        {/* Vista previa de imágenes */}
        {previewImages.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {previewImages.map((src, index) => (
              <div
                key={index}
                className="relative rounded-md overflow-hidden h-24"
              >
                <img
                  src={src}
                  alt={`صورة ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className={`absolute top-1 left-1 rounded-full p-1 ${
                    darkMode
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 space-x-reverse">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="ml-2"
        >
          إلغاء
        </Button>
        <Button type="submit" variant="primary">
          إرسال التقييم
        </Button>
      </div>
    </form>
  );
};

export default DetailedReviewForm;
