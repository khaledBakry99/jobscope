import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Layout from "../../components/layout/Layout";
import Button from "../../components/common/Button";
import LoadingButton from "../../components/common/LoadingButton";
import Input from "../../components/common/Input";
import LazyImage from "../../components/common/LazyImage";
import ProfessionSelector from "../../components/common/ProfessionSelector";
import useUserStore from "../../store/userStore";
import useThemeStore from "../../store/themeStore";
import { Link } from "react-router-dom";
import LoginRedirect from "../../components/auth/LoginRedirect";

// Import profile components
import ProfileHeader from "./components/ProfileHeader";
import ProfileInfo from "./components/ProfileInfo";
import ProfileBio from "./components/ProfileBio";
import ProfileGallery from "./components/ProfileGallery";
import ProfileLocation from "./components/ProfileLocation";
import ProfileWorkingHours from "./components/ProfileWorkingHours";

const MyProfilePage = () => {
  // const navigate = useNavigate(); // Used in handleSaveChanges
  const user = useUserStore((state) => state.user);
  const userType = useUserStore((state) => state.userType);
  const updateUser = useUserStore((state) => state.updateUser);
  const logout = useUserStore((state) => state.logout);
  const darkMode = useThemeStore((state) => state.darkMode);

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      // تحويل البيانات القديمة إلى التنسيق الجديد إذا لزم الأمر
      const updatedUser = { ...user };

      // التأكد من أن professions موجود كمصفوفة
      if (userType === "craftsman") {
        if (!updatedUser.professions) {
          // إذا كان هناك profession قديم، نضيفه إلى المصفوفة
          if (updatedUser.profession) {
            updatedUser.professions = [updatedUser.profession];
          } else {
            updatedUser.professions = [];
          }
        }

        // التأكد من أن specializations موجود كمصفوفة
        if (!updatedUser.specializations) {
          // إذا كان هناك specialization قديم، نضيفه إلى المصفوفة
          if (updatedUser.specialization) {
            updatedUser.specializations = [updatedUser.specialization];
          } else {
            updatedUser.specializations = [];
          }
        }
      }

      setEditedUser(updatedUser);
    }
  }, [user, userType]);

  if (!user || !editedUser) {
    return <LoginRedirect />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value,
    });
  };

  const handleProfessionChange = (field, value) => {
    setEditedUser({
      ...editedUser,
      [field]: value,
    });
  };

  const handleBioChange = (bio) => {
    setEditedUser({
      ...editedUser,
      bio,
    });
  };

  const handleLocationChange = (location) => {
    setEditedUser({
      ...editedUser,
      location,
    });
  };

  const handleRadiusChange = (workRadius) => {
    setEditedUser({
      ...editedUser,
      workRadius,
    });
  };

  const handleWorkingHoursChange = (workingHours) => {
    setEditedUser({
      ...editedUser,
      workingHours,
    });
  };

  const handleAvailabilityToggle = () => {
    setEditedUser({
      ...editedUser,
      available: !editedUser.available,
    });
  };

  const handleAddImage = (imageUrls) => {
    // Check if imageUrls is an array or a single URL
    const urlsArray = Array.isArray(imageUrls) ? imageUrls : [imageUrls];

    setEditedUser({
      ...editedUser,
      gallery: [...(editedUser.gallery || []), ...urlsArray],
    });
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // إنشاء كائن FormData لإرسال الصورة
        const formData = new FormData();
        formData.append('profileImage', file);

        // عرض معاينة محلية أثناء التحميل
        const reader = new FileReader();
        reader.onloadend = () => {
          setEditedUser({
            ...editedUser,
            image: reader.result, // معاينة محلية
          });
        };
        reader.readAsDataURL(file);

        // استيراد خدمة المستخدم إذا لم تكن متوفرة بعد
        const userService = (await import('../../services/api')).userService;

        // تحميل الصورة إلى الخادم
        const response = await userService.uploadProfileImage(formData);
        console.log('Image upload response:', response);

        // تحديث عنوان URL للصورة باستخدام عنوان URL الخادم
        if (response && response.imageUrl) {
          // استيراد SERVER_URL لبناء عنوان URL كامل
          const { SERVER_URL } = await import('../../services/config');
          const fullImageUrl = `${SERVER_URL}${response.imageUrl}`;
          console.log('Full image URL:', fullImageUrl);

          setEditedUser({
            ...editedUser,
            image: fullImageUrl,
            profilePicture: fullImageUrl // مهم: تحديث profilePicture أيضًا
          });
        }
      } catch (error) {
        console.error('Error uploading profile image:', error);
        // الاحتفاظ بالمعاينة المحلية في حالة حدوث خطأ
      }
    }
  };

  const handleRemoveImage = (index) => {
    const newGallery = [...(editedUser.gallery || [])];
    newGallery.splice(index, 1);
    setEditedUser({
      ...editedUser,
      gallery: newGallery,
    });
  };

  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    let firstErrorField = null;

    // التحقق من الاسم
    if (!editedUser.name || editedUser.name.trim() === "") {
      newErrors.name = "الاسم مطلوب";
      firstErrorField = firstErrorField || "name";
      isValid = false;
    }

    // التحقق من البريد الإلكتروني
    if (!editedUser.email || editedUser.email.trim() === "") {
      newErrors.email = "البريد الإلكتروني مطلوب";
      firstErrorField = firstErrorField || "email";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedUser.email)) {
      newErrors.email = "يرجى إدخال بريد إلكتروني صالح";
      firstErrorField = firstErrorField || "email";
      isValid = false;
    }

    // التحقق من رقم الهاتف
    if (!editedUser.phone || editedUser.phone.trim() === "") {
      newErrors.phone = "رقم الهاتف مطلوب";
      firstErrorField = firstErrorField || "phone";
      isValid = false;
    }

    // إذا كان المستخدم حرفي، تحقق من المهن والتخصصات
    if (userType === "craftsman") {
      if (!editedUser.professions || editedUser.professions.length === 0) {
        newErrors.professions = "يجب اختيار مهنة واحدة على الأقل";
        firstErrorField = firstErrorField || "professions";
        isValid = false;
      }

      if (!editedUser.specializations || editedUser.specializations.length === 0) {
        newErrors.specializations = "يجب اختيار تخصص واحد على الأقل";
        firstErrorField = firstErrorField || firstErrorField === "professions" ? "professions" : "specializations";
        isValid = false;
      }
    }

    setErrors(newErrors);

    // إذا كان هناك خطأ، قم بالتمرير إلى الحقل الذي يحتوي على الخطأ الأول
    if (!isValid && firstErrorField) {
      setTimeout(() => {
        // البحث عن الحقل بالاسم
        const errorElement = document.querySelector(`[name="${firstErrorField}"]`);

        if (errorElement) {
          // التمرير إلى الحقل
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
          // تركيز الحقل
          errorElement.focus();
          // إضافة تأثير وميض للحقل
          errorElement.classList.add("error-flash");
          // إزالة التأثير بعد ثانيتين
          setTimeout(() => {
            errorElement.classList.remove("error-flash");
          }, 2000);
        } else if (firstErrorField === "professions" || firstErrorField === "specializations") {
          // إذا كان الخطأ في المهن أو التخصصات، ابحث عن مكون ProfessionSelector
          const professionSelector = document.querySelector(".profession-selector");
          if (professionSelector) {
            professionSelector.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      }, 100);
    }

    return isValid;
  };

  const handleSaveChanges = async () => {
    // التحقق من صحة البيانات قبل الحفظ
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      // تنظيف البيانات القديمة قبل الحفظ
      const updatedUserData = { ...editedUser };

      // إزالة الحقول القديمة إذا كانت موجودة
      if (userType === "craftsman") {
        if (updatedUserData.profession) {
          delete updatedUserData.profession;
        }
        if (updatedUserData.specialization) {
          delete updatedUserData.specialization;
        }
      }

      // إذا كان هناك صورة جديدة، تأكد من تحديث حقل profilePicture
      if (updatedUserData.image && updatedUserData.image !== user.image) {
        updatedUserData.profilePicture = updatedUserData.image;
      }

      // استدعاء API لتحديث الملف الشخصي
      const userService = (await import('../../services/api')).userService;
      await userService.updateProfile(updatedUserData);

      // تحديث حالة المستخدم في المتجر
      updateUser(updatedUserData);
      setIsEditing(false);
      // إعادة تعيين الأخطاء بعد الحفظ بنجاح
      setErrors({});
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedUser({ ...user });
    setIsEditing(false);
    // إعادة تعيين الأخطاء عند إلغاء التعديل
    setErrors({});
  };

  return (
    <Layout user={user} onLogout={logout}>
      <div
        className={`min-h-screen py-8 ${
          darkMode
            ? "bg-gradient-to-b from-gray-900 to-gray-800"
            : "bg-gradient-to-br from-blue-50 to-indigo-100"
        } transition-colors duration-300`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1
              className={`text-3xl font-bold ${
                darkMode ? "text-indigo-300" : "text-indigo-800"
              } relative inline-block transition-colors duration-300`}
            >
              <span className="relative z-10">ملفي الشخصي</span>
              <span
                className={`absolute bottom-0 left-0 right-0 h-3 ${
                  darkMode ? "bg-indigo-500" : "bg-indigo-300"
                } opacity-40 transform -rotate-1 z-0`}
              ></span>
            </h1>
            {isEditing ? (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className={`transition-all duration-200 shadow-sm hover:shadow-md py-2 px-4 relative overflow-hidden group ${
                    darkMode
                      ? "border-gray-700 text-indigo-300 hover:bg-gray-700"
                      : "border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                  } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span className="relative z-10 font-bold">إلغاء</span>
                  <span
                    className={`absolute inset-0 ${
                      darkMode ? "bg-gray-600" : "bg-indigo-50"
                    } opacity-0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full group-hover:opacity-100 transition-all duration-700`}
                  ></span>
                </Button>
                <LoadingButton
                  variant="primary"
                  onClick={handleSaveChanges}
                  isLoading={isSaving}
                  loadingText="جاري حفظ التغييرات..."
                  className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-2 px-4 ${
                    darkMode
                      ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                      : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                  }`}
                >
                  <span className="relative z-10 font-bold text-white">
                    حفظ التغييرات
                  </span>
                  <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                </LoadingButton>
              </div>
            ) : (
              <Button
                variant="primary"
                onClick={() => setIsEditing(true)}
                className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-2 px-4 ${
                  darkMode
                    ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                }`}
              >
                <span className="relative z-10 font-bold text-white">
                  تعديل الملف
                </span>
                <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="md:col-span-1">
              <ProfileHeader user={editedUser} userType={userType} />

              {isEditing && userType === "craftsman" && (
                <div className="mt-4">
                  <Button
                    variant={editedUser.available ? "primary" : "secondary"}
                    fullWidth
                    onClick={handleAvailabilityToggle}
                    className={
                      editedUser.available
                        ? `text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-2 px-4 ${
                            darkMode
                              ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                              : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                          }`
                        : `flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-2 px-4 ${
                            darkMode
                              ? "bg-gray-800 border-gray-700 text-red-400 hover:bg-gray-700"
                              : "bg-white border border-red-300 text-red-700 hover:bg-gray-100"
                          }`
                    }
                  >
                    <span className="relative z-10 font-bold">
                      {editedUser.available ? "متاح الآن" : "غير متاح حالياً"}
                    </span>
                    <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  </Button>
                </div>
              )}

              <div className="mt-4">
                <ProfileInfo user={editedUser} />
              </div>

              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4"
                >
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-lg p-4 border border-indigo-200">
                    <h3 className="font-bold text-lg mb-4 text-indigo-800 relative inline-block">
                      <span className="relative z-10">
                        تعديل المعلومات الشخصية
                      </span>
                      <span
                        className={`absolute bottom-0 left-0 right-0 h-2 ${
                          darkMode ? "bg-indigo-500" : "bg-indigo-300"
                        } opacity-40 transform -rotate-1 z-0`}
                      ></span>
                    </h3>

                    <div className="mb-6">
                      <label className="block text-indigo-700 font-medium mb-2">
                        الصورة الشخصية
                      </label>
                      <div className="flex items-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-full overflow-hidden ml-4 border-2 border-indigo-200 shadow-md">
                          <LazyImage
                            src={editedUser.image}
                            alt={editedUser.name}
                            className="w-full h-full object-cover"
                            placeholderClassName="w-full h-full bg-gray-200 animate-pulse"
                          />
                        </div>
                        <div>
                          <input
                            type="file"
                            id="profileImage"
                            accept="image/*"
                            onChange={handleProfileImageChange}
                            className="hidden"
                          />
                          <label
                            htmlFor="profileImage"
                            className={`cursor-pointer text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-2 px-4 rounded-md mb-2 ${
                              darkMode
                                ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                                : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                            }`}
                          >
                            <span className="relative z-10 font-bold text-white">
                              تغيير الصورة
                            </span>
                            <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                          </label>
                          <p className="text-indigo-500 text-sm">
                            يفضل استخدام صورة مربعة بدقة عالية
                          </p>
                        </div>
                      </div>
                    </div>

                    <Input
                      label="الاسم الكامل"
                      name="name"
                      value={editedUser.name}
                      onChange={handleInputChange}
                      error={errors.name}
                      required
                    />

                    <Input
                      label="رقم الهاتف"
                      name="phone"
                      value={editedUser.phone}
                      onChange={handleInputChange}
                      error={errors.phone}
                      required
                    />

                    <Input
                      label="البريد الإلكتروني"
                      name="email"
                      value={editedUser.email}
                      onChange={handleInputChange}
                      error={errors.email}
                      required
                    />

                    {userType === "craftsman" && (
                      <ProfessionSelector
                        professions={editedUser.professions || []}
                        specializations={editedUser.specializations || []}
                        onChange={handleProfessionChange}
                        errors={errors}
                      />
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column */}
            <div className="md:col-span-2">
              {userType === "craftsman" && (
                <>
                  <ProfileBio
                    bio={editedUser.bio}
                    isEditing={isEditing}
                    onBioChange={handleBioChange}
                  />

                  <ProfileGallery
                    gallery={editedUser.gallery}
                    isEditing={isEditing}
                    onAddImage={handleAddImage}
                    onRemoveImage={handleRemoveImage}
                  />

                  <ProfileLocation
                    location={editedUser.location}
                    workRadius={editedUser.workRadius}
                    isEditing={isEditing}
                    onLocationChange={handleLocationChange}
                    onRadiusChange={handleRadiusChange}
                    streetsInWorkRange={editedUser.streetsInWorkRange || []}
                    hospitalsInWorkRange={editedUser.hospitalsInWorkRange || []}
                    mosquesInWorkRange={editedUser.mosquesInWorkRange || []}
                  />

                  <ProfileWorkingHours
                    workingHours={
                      editedUser.workingHours || {
                        saturday: {
                          isWorking: false,
                          from: "09:00",
                          to: "17:00",
                        },
                        sunday: {
                          isWorking: false,
                          from: "09:00",
                          to: "17:00",
                        },
                        monday: {
                          isWorking: false,
                          from: "09:00",
                          to: "17:00",
                        },
                        tuesday: {
                          isWorking: false,
                          from: "09:00",
                          to: "17:00",
                        },
                        wednesday: {
                          isWorking: false,
                          from: "09:00",
                          to: "17:00",
                        },
                        thursday: {
                          isWorking: false,
                          from: "09:00",
                          to: "17:00",
                        },
                        friday: {
                          isWorking: false,
                          from: "09:00",
                          to: "17:00",
                        },
                      }
                    }
                    isEditing={isEditing}
                    onWorkingHoursChange={handleWorkingHoursChange}
                    darkMode={darkMode}
                  />
                </>
              )}

              <div
                className={`p-6 mb-6 rounded-lg shadow-md ${
                  darkMode
                    ? "bg-gray-800 text-gray-200"
                    : "bg-gradient-to-br from-blue-50 to-indigo-100"
                } transition-colors duration-300`}
              >
                <h2
                  className={`text-xl font-bold mb-4 ${
                    darkMode ? "text-indigo-300" : "text-indigo-800"
                  } relative inline-block transition-colors duration-300`}
                >
                  <span className="relative z-10">طلباتي</span>
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-2 ${
                      darkMode ? "bg-indigo-500" : "bg-indigo-300"
                    } opacity-40 transform -rotate-1 z-0`}
                  ></span>
                </h2>
                <p
                  className={`${
                    darkMode ? "text-indigo-400" : "text-indigo-600"
                  } mb-4 transition-colors duration-300`}
                >
                  {userType === "client"
                    ? "يمكنك إدارة طلبات الخدمة الخاصة بك من صفحة الطلبات"
                    : "يمكنك إدارة طلبات الخدمة المقدمة إليك من صفحة الطلبات"}
                </p>
                <Link to="/bookings">
                  <Button
                    variant="primary"
                    className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-2 px-4 ${
                      darkMode
                        ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                        : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                    }`}
                  >
                    <span className="relative z-10 font-bold text-white">
                      عرض جميع الطلبات
                    </span>
                    <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyProfilePage;
