import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// استيراد المكونات
import Layout from "../../components/layout/Layout";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import CraftsmanInfo from "./components/CraftsmanInfo";
import CraftsmanContactInfo from "./components/CraftsmanContactInfo";
import CraftsmanBio from "./components/CraftsmanBio";
import CraftsmanGallery from "./components/CraftsmanGallery";
import ProfileLocation from "./components/ProfileLocation";
import CraftsmanSpecializations from "./components/CraftsmanSpecializations";
import CraftsmanReviews from "./components/CraftsmanReviews";
import BookingModal from "./components/BookingModal";

// استيراد المتاجر والخدمات
import useUserStore from "../../store/userStore";
import useCraftsmenStore from "../../store/craftsmenStore";
import useBookingStore from "../../store/bookingStore";
import useReviewStore from "../../store/reviewStore";
import useThemeStore from "../../store/themeStore";
import { calculateAverageRating } from "../../utils/ratingUtils";

const CraftsmanProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const darkMode = useThemeStore((state) => state.darkMode);
  const user = useUserStore((state) => state.user);
  const craftsmen = useCraftsmenStore((state) => state.craftsmen);
  const fetchCraftsman = useCraftsmenStore((state) => state.fetchCraftsman);
  const createBooking = useBookingStore((state) => state.createBooking);
  const getCraftsmanReviews = useReviewStore(
    (state) => state.getCraftsmanReviews
  );

  // حالة المكون
  const [craftsman, setCraftsman] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [craftsmanReviews, setCraftsmanReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    description: "",
  });
  const [bookingErrors, setBookingErrors] = useState({});
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  // تحميل بيانات الحرفي
  useEffect(() => {
    const loadCraftsman = async () => {
      try {
        setLoading(true);
        setError(null);

        // البحث عن الحرفي في المتجر أولاً
        let craftsmanData = craftsmen.find((c) => c.id === id || c._id === id);

        // إذا لم يتم العثور عليه، جلبه من الخادم
        if (!craftsmanData) {
          craftsmanData = await fetchCraftsman(id);
        }

        if (!craftsmanData) {
          throw new Error("لم يتم العثور على الحرفي");
        }

        // طباعة بيانات الصورة للتصحيح
        console.log("Original image data:", {
          image: craftsmanData.image,
          user: craftsmanData.user,
          userImage: craftsmanData.user ? craftsmanData.user.image : null,
          userProfilePicture: craftsmanData.user
            ? craftsmanData.user.profilePicture
            : null,
          profilePicture: craftsmanData.profilePicture,
        });

        // تعيين صورة الحرفي
        // استخدام الصورة من البيانات إذا كانت موجودة، وإلا استخدام الصورة الافتراضية
        if (
          !craftsmanData.image ||
          craftsmanData.image === "" ||
          (craftsmanData.user &&
            (!craftsmanData.user.profilePicture ||
              craftsmanData.user.profilePicture === ""))
        ) {
          craftsmanData.image = "/img/user-avatar.svg";
        } else if (craftsmanData.image.startsWith("/uploads/")) {
          // إذا كان المسار يبدأ بـ /uploads/، أضف عنوان الخادم الافتراضي
          craftsmanData.image = `https://jobscope-8t58.onrender.com${craftsmanData.image}`;
        }

        // طباعة مسار الصورة النهائي للتصحيح
        console.log("Final image path:", craftsmanData.image);

        // إذا كان الهاتف غير موجود، استخدم هاتف المستخدم إذا كان متاحاً
        if (
          !craftsmanData.phone &&
          craftsmanData.user &&
          craftsmanData.user.phone
        ) {
          craftsmanData.phone = craftsmanData.user.phone;
        }

        // طباعة بيانات الحرفي للتصحيح
        console.log("Craftsman data loaded:", craftsmanData);

        setCraftsman(craftsmanData);
        setLoading(false);
      } catch (err) {
        console.error("Error loading craftsman:", err);
        setError(err.message || "حدث خطأ أثناء تحميل بيانات الحرفي");
        setLoading(false);
      }
    };

    loadCraftsman();
  }, [id, craftsmen, fetchCraftsman]);

  // تحميل تقييمات الحرفي
  useEffect(() => {
    if (craftsman && craftsman.id) {
      // استخدام getCraftsmanReviews بدلاً من fetchReviews
      const reviews = getCraftsmanReviews(craftsman.id);
      setCraftsmanReviews(reviews || []);
    }
  }, [craftsman, getCraftsmanReviews]);

  // حساب متوسط التقييم
  useEffect(() => {
    if (craftsmanReviews.length > 0) {
      const avgRating = calculateAverageRating(craftsmanReviews);
      setAverageRating(avgRating);
    }
  }, [craftsmanReviews]);

  // معالجة تغيير حقول الحجز
  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // إزالة رسالة الخطأ عند تغيير القيمة
    if (bookingErrors[name]) {
      setBookingErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // التحقق من صحة بيانات الحجز
  const validateBookingData = () => {
    const errors = {};
    const today = new Date().toISOString().split("T")[0];

    if (!bookingData.startDate) {
      errors.startDate = "يرجى تحديد تاريخ البداية";
    } else if (bookingData.startDate < today) {
      errors.startDate = "لا يمكن اختيار تاريخ في الماضي";
    }

    if (!bookingData.endDate) {
      errors.endDate = "يرجى تحديد تاريخ النهاية";
    } else if (bookingData.endDate < bookingData.startDate) {
      errors.endDate = "يجب أن يكون تاريخ النهاية بعد تاريخ البداية";
    }

    if (!bookingData.startTime) {
      errors.startTime = "يرجى تحديد وقت البداية";
    }

    if (!bookingData.endTime) {
      errors.endTime = "يرجى تحديد وقت النهاية";
    } else if (
      bookingData.startDate === bookingData.endDate &&
      bookingData.endTime <= bookingData.startTime
    ) {
      errors.endTime = "يجب أن يكون وقت النهاية بعد وقت البداية";
    }

    if (!bookingData.description.trim()) {
      errors.description = "يرجى إدخال وصف للمشكلة";
    } else if (bookingData.description.trim().length < 10) {
      errors.description = "يجب أن يكون الوصف 10 أحرف على الأقل";
    }

    return errors;
  };

  // معالجة إرسال طلب الحجز
  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    // التحقق من تسجيل الدخول
    if (!user) {
      navigate("/login", { state: { from: `/craftsman/${id}` } });
      return;
    }

    // التحقق من صحة البيانات
    const validationErrors = validateBookingData();
    if (Object.keys(validationErrors).length > 0) {
      setBookingErrors(validationErrors);
      return;
    }

    try {
      setBookingSubmitting(true);

      // إنشاء طلب الحجز
      await createBooking({
        craftsmanId: craftsman.id,
        userId: user.id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        description: bookingData.description,
        status: "pending",
      });

      // إعادة تعيين البيانات وإغلاق النافذة
      setBookingSuccess(true);
      setBookingData({
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        description: "",
      });
      setShowBookingModal(false);

      // إظهار رسالة النجاح لمدة 3 ثوانٍ
      setTimeout(() => {
        setBookingSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error creating booking:", err);
      setBookingErrors({
        general: err.message || "حدث خطأ أثناء إنشاء الحجز",
      });
    } finally {
      setBookingSubmitting(false);
    }
  };

  // تسجيل الخروج
  const logout = () => {
    useUserStore.getState().logout();
    navigate("/logout-redirect");
  };

  // عرض حالة التحميل
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-50 to-indigo-100 text-black"
      } transition-colors duration-300`}>
        <LoadingState darkMode={darkMode} />
      </div>
    );
  }

  // عرض حالة الخطأ
  if (error || !craftsman) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-50 to-indigo-100 text-black"
      } transition-colors duration-300`}>
        <ErrorState error={error} darkMode={darkMode} />
      </div>
    );
  }

  return (
    <Layout user={user} onLogout={logout}>
      <div className="container mx-auto px-4 py-8">
        {/* رسالة نجاح الحجز */}
        {bookingSuccess && (
          <div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-md shadow-lg ${
              darkMode ? "bg-green-900/90" : "bg-green-100"
            } ${
              darkMode ? "text-green-200" : "text-green-700"
            } text-center transition-colors duration-300 max-w-md w-full`}
          >
            <h3 className="font-bold mb-1">تم إرسال طلب الحجز بنجاح!</h3>
            <p>سيتم إشعارك عندما يقوم الحرفي بالرد على طلبك.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* الشريط الجانبي */}
          <div className="md:col-span-1">
            {/* معلومات الحرفي */}
            <CraftsmanInfo
              craftsman={craftsman}
              darkMode={darkMode}
              onBookingClick={() => setShowBookingModal(true)}
            />

            {/* معلومات الاتصال */}
            <CraftsmanContactInfo craftsman={craftsman} darkMode={darkMode} />
          </div>

          {/* المحتوى الرئيسي */}
          <div className="md:col-span-2">
            {/* نبذة عن الحرفي */}
            <CraftsmanBio craftsman={craftsman} darkMode={darkMode} />

            {/* معرض الأعمال */}
            <CraftsmanGallery craftsman={craftsman} darkMode={darkMode} />

            {/* الموقع ونطاق العمل */}
            <ProfileLocation
              location={craftsman.location}
              workRadius={craftsman.workRadius}
              isEditing={false}
              streetsInWorkRange={craftsman.streetsInWorkRange || []}
              hospitalsInWorkRange={craftsman.hospitalsInWorkRange || []}
              mosquesInWorkRange={craftsman.mosquesInWorkRange || []}
            />

            {/* التخصصات */}
            <CraftsmanSpecializations
              craftsman={craftsman}
              darkMode={darkMode}
            />

            {/* التقييمات */}
            <CraftsmanReviews reviews={craftsmanReviews} darkMode={darkMode} />
          </div>
        </div>

        {/* نافذة الحجز */}
        {showBookingModal && (
          <BookingModal
            darkMode={darkMode}
            bookingData={bookingData}
            bookingErrors={bookingErrors}
            onClose={() => setShowBookingModal(false)}
            onInputChange={handleBookingInputChange}
            onSubmit={handleBookingSubmit}
          />
        )}
      </div>
    </Layout>
  );
};

export default CraftsmanProfilePage;
