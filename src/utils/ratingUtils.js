/**
 * حساب متوسط التقييم من مجموعة تقييمات
 * @param {Array} reviews - مصفوفة من التقييمات
 * @returns {number} متوسط التقييم
 */
export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  
  // حساب مجموع التقييمات
  const sum = reviews.reduce((total, review) => {
    // إذا كان هناك تقييم متعدد المعايير
    if (review.qualityRating && review.timelinessRating && 
        review.priceRating && review.communicationRating) {
      // حساب متوسط المعايير الأربعة
      const avgRating = (
        review.qualityRating + 
        review.timelinessRating + 
        review.priceRating + 
        review.communicationRating
      ) / 4;
      return total + avgRating;
    }
    // إذا كان هناك تقييم عام فقط
    return total + (review.rating || 0);
  }, 0);
  
  // حساب المتوسط
  return sum / reviews.length;
};

/**
 * تحويل التقييم إلى نجوم
 * @param {number} rating - التقييم (1-5)
 * @returns {string} نجوم التقييم
 */
export const ratingToStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  return "★".repeat(fullStars) + (halfStar ? "½" : "") + "☆".repeat(emptyStars);
};
