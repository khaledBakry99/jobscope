import React, { useState } from "react";
import Button from "../../common/Button";
import Input from "../../common/Input";
import { Eye, EyeOff } from "lucide-react";
import useThemeStore from "../../../store/themeStore";
import useAdminStore from "../../../store/adminStore";

const EditProfileSection = ({ admin }) => {
  const darkMode = useThemeStore((state) => state.darkMode);
  const updateAdminProfile = useAdminStore((state) => state.updateAdminProfile);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: admin?.name || "",
    email: admin?.email || "admin@jobscope.com",
    phone: admin?.phone || "",
    password: "",
    confirmPassword: "",
    image: admin?.image || "",
  });

  // حالة لإظهار/إخفاء كلمة المرور
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    // التحقق من الحقول المطلوبة
    if (!formData.name || formData.name.trim() === '') {
      setErrorMessage("الاسم مطلوب");

      // التمرير إلى حقل الاسم
      setTimeout(() => {
        const nameField = document.querySelector('input[name="name"]');
        if (nameField) {
          nameField.scrollIntoView({ behavior: "smooth", block: "center" });
          nameField.focus();
          nameField.classList.add("error-flash");
          setTimeout(() => {
            nameField.classList.remove("error-flash");
          }, 2000);
        }
      }, 100);

      return;
    }

    if (!formData.email || formData.email.trim() === '') {
      setErrorMessage("البريد الإلكتروني مطلوب");

      // التمرير إلى حقل البريد الإلكتروني
      setTimeout(() => {
        const emailField = document.querySelector('input[name="email"]');
        if (emailField) {
          emailField.scrollIntoView({ behavior: "smooth", block: "center" });
          emailField.focus();
          emailField.classList.add("error-flash");
          setTimeout(() => {
            emailField.classList.remove("error-flash");
          }, 2000);
        }
      }, 100);

      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage("يرجى إدخال بريد إلكتروني صالح");

      // التمرير إلى حقل البريد الإلكتروني
      setTimeout(() => {
        const emailField = document.querySelector('input[name="email"]');
        if (emailField) {
          emailField.scrollIntoView({ behavior: "smooth", block: "center" });
          emailField.focus();
          emailField.classList.add("error-flash");
          setTimeout(() => {
            emailField.classList.remove("error-flash");
          }, 2000);
        }
      }, 100);

      return;
    }

    // التحقق من تطابق كلمات المرور
    if (formData.password && formData.password !== formData.confirmPassword) {
      setErrorMessage("كلمات المرور غير متطابقة");

      // التمرير إلى حقل تأكيد كلمة المرور
      setTimeout(() => {
        const confirmPasswordField = document.querySelector('input[name="confirmPassword"]');
        if (confirmPasswordField) {
          confirmPasswordField.scrollIntoView({ behavior: "smooth", block: "center" });
          confirmPasswordField.focus();
          confirmPasswordField.classList.add("error-flash");
          setTimeout(() => {
            confirmPasswordField.classList.remove("error-flash");
          }, 2000);
        }
      }, 100);

      return;
    }

    // إعداد البيانات المحدثة
    const updatedData = {
      name: formData.name,
      email: formData.email,
      image: formData.image,
    };

    // إضافة رقم الهاتف إذا كان موجودًا
    if (formData.phone) {
      updatedData.phone = formData.phone;
    }

    // تحديث البيانات
    try {
      updateAdminProfile(updatedData);
      setSuccessMessage("تم تحديث البيانات بنجاح");

      // إعادة تعيين حقول كلمة المرور
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } catch (error) {
      setErrorMessage("حدث خطأ أثناء تحديث البيانات");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3
          className={`text-xl font-bold ${
            darkMode ? "text-indigo-300" : "text-indigo-800"
          } relative`}
        >
          <span className="relative z-10">تعديل البيانات الشخصية</span>
          <span
            className={`absolute bottom-0 left-0 right-0 h-2 ${
              darkMode ? "bg-indigo-500" : "bg-indigo-300"
            } opacity-40 transform -rotate-1 z-0`}
          ></span>
        </h3>
      </div>

      <div
        className={`p-6 rounded-lg ${
          darkMode ? "bg-gray-700" : "bg-gradient-to-br from-white to-indigo-50"
        } border ${
          darkMode ? "border-gray-600" : "border-indigo-100"
        } shadow-md`}
      >
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* قسم الصورة الشخصية */}
          <div className="col-span-1 flex flex-col items-center">
            <div className="mb-4 relative">
              <img
                src={formData.image}
                alt={formData.name}
                className="w-32 h-32 rounded-full border-4 border-indigo-300 object-cover"
              />
              <label
                htmlFor="image-upload"
                className={`absolute bottom-0 right-0 p-2 rounded-full ${
                  darkMode
                    ? "bg-gray-800"
                    : "bg-gradient-to-br from-white to-blue-50"
                } border ${
                  darkMode ? "border-gray-700" : "border-indigo-200"
                } shadow-md cursor-pointer hover:bg-indigo-100 transition-colors duration-200`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${
                    darkMode ? "text-indigo-300" : "text-indigo-600"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              } mb-2 text-center`}
            >
              انقر على الأيقونة لتغيير الصورة الشخصية
            </p>
          </div>

          {/* قسم البيانات الشخصية */}
          <div className="col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="الاسم"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={`w-full p-2 rounded-md ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-800"
                } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200`}
              />

              <Input
                label="البريد الإلكتروني"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={`w-full p-2 rounded-md ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-800"
                } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200`}
              />

              <Input
                label="رقم الهاتف"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full p-2 rounded-md ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-800"
                } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200`}
              />
            </div>

            <div
              className={`p-4 rounded-md ${
                darkMode
                  ? "bg-gray-800"
                  : "bg-gradient-to-r from-indigo-50 to-blue-50"
              } border ${
                darkMode ? "border-gray-700" : "border-indigo-100"
              } mb-4`}
            >
              <h4
                className={`font-bold mb-3 ${
                  darkMode ? "text-indigo-300" : "text-indigo-700"
                }`}
              >
                تغيير كلمة المرور
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    label="كلمة المرور الجديدة"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full p-2 rounded-md ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gradient-to-r from-white to-blue-50/50 border-blue-200 text-gray-800"
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 pl-10`}
                  />
                  <button
                    type="button"
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 mt-2 p-1 rounded-full ${
                      darkMode
                        ? "text-gray-400 hover:text-gray-300"
                        : "text-gray-500 hover:text-gray-700"
                    } focus:outline-none transition-colors duration-200`}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="تأكيد كلمة المرور"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full p-2 rounded-md ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gradient-to-r from-white to-indigo-50/50 border-indigo-200 text-gray-800"
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 pl-10`}
                  />
                  <button
                    type="button"
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 mt-2 p-1 rounded-full ${
                      darkMode
                        ? "text-gray-400 hover:text-gray-300"
                        : "text-gray-500 hover:text-gray-700"
                    } focus:outline-none transition-colors duration-200`}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
              <p
                className={`text-xs mt-2 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                اترك الحقول فارغة إذا كنت لا ترغب في تغيير كلمة المرور
              </p>
            </div>

            {/* رسائل النجاح والخطأ */}
            {successMessage && (
              <div className="mb-4 p-3 rounded-md bg-green-100 border border-green-300 text-green-700">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-300 text-red-700">
                {errorMessage}
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                className={`${
                  darkMode
                    ? "bg-gradient-to-r from-[#3730A3] to-[#4238C8] hover:from-[#322e92] hover:to-[#3b32b4]"
                    : "bg-gradient-to-r from-[#4238C8] to-[#3730A3] hover:from-[#3b32b4] hover:to-[#322e92]"
                } text-white transition-all duration-200 shadow-md hover:shadow-lg relative overflow-hidden group`}
              >
                <span className="relative z-10">حفظ التغييرات</span>
                <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileSection;
