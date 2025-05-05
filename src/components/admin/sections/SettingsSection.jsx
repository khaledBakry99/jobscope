import React, { useState, useRef } from "react";
import Button from "../../common/Button";
import useThemeStore from "../../../store/themeStore";
import useSiteSettingsStore from "../../../store/siteSettingsStore";
import { X, Upload } from "lucide-react";

const SettingsSection = () => {
  const darkMode = useThemeStore((state) => state.darkMode);
  const [showSiteSettings, setShowSiteSettings] = useState(false);

  // استخدام متجر إعدادات الموقع
  const { siteSettings, updateSiteSettings } = useSiteSettingsStore();
  const [localSettings, setLocalSettings] = useState({ ...siteSettings });
  const fileInputRef = useRef(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // تحديث الإعدادات المحلية عند فتح النموذج
  React.useEffect(() => {
    if (showSiteSettings) {
      setLocalSettings({ ...siteSettings });
      setLogoPreview(null);
    }
  }, [showSiteSettings, siteSettings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // إنشاء URL للصورة المحملة
      const imageUrl = URL.createObjectURL(file);
      setLogoPreview(imageUrl);

      // قراءة الملف كـ Data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalSettings((prev) => ({
          ...prev,
          siteLogo: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // تحديث إعدادات الموقع في المتجر
    updateSiteSettings(localSettings);
    setShowSiteSettings(false);
    // إظهار رسالة نجاح
    alert("تم حفظ إعدادات الموقع بنجاح!");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3
          className={`text-xl font-bold ${
            darkMode ? "text-indigo-300" : "text-indigo-800"
          } relative`}
        >
          <span className="relative z-10">إعدادات النظام</span>
          <span
            className={`absolute bottom-0 left-0 right-0 h-2 ${
              darkMode ? "bg-indigo-500" : "bg-indigo-300"
            } opacity-40 transform -rotate-1 z-0`}
          ></span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div
          className={`p-4 rounded-lg ${
            darkMode
              ? "bg-gray-700"
              : "bg-gradient-to-br from-white to-indigo-100/40"
          } border ${
            darkMode ? "border-gray-600" : "border-indigo-200"
          } shadow-md`}
        >
          <h4
            className={`font-bold mb-3 ${
              darkMode ? "text-indigo-300" : "text-indigo-700"
            }`}
          >
            إعدادات الموقع
          </h4>
          <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            تعديل الإعدادات العامة للموقع مثل اسم الموقع وشعاره.
          </p>
          <Button
            variant="primary"
            className={`${
              darkMode
                ? "bg-gradient-to-r from-[#3730A3] to-[#4238C8] hover:from-[#322e92] hover:to-[#3b32b4]"
                : "bg-gradient-to-r from-[#4238C8] to-[#3730A3] hover:from-[#3b32b4] hover:to-[#322e92]"
            } text-white transition-all duration-200 shadow-sm hover:shadow-md relative overflow-hidden group`}
            onClick={() => setShowSiteSettings(true)}
          >
            <span className="relative z-10">تعديل الإعدادات</span>
            <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
          </Button>
        </div>

        <div
          className={`p-4 rounded-lg ${
            darkMode
              ? "bg-gray-700"
              : "bg-gradient-to-br from-white to-indigo-100/40"
          } border ${
            darkMode ? "border-gray-600" : "border-indigo-200"
          } shadow-md`}
        >
          <h4
            className={`font-bold mb-3 ${
              darkMode ? "text-indigo-300" : "text-indigo-700"
            }`}
          >
            إعدادات الأمان
          </h4>
          <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            تعديل إعدادات الأمان وصلاحيات المستخدمين.
          </p>
          <Button
            variant="primary"
            className={`${
              darkMode
                ? "bg-gradient-to-r from-[#3730A3] to-[#4238C8] hover:from-[#322e92] hover:to-[#3b32b4]"
                : "bg-gradient-to-r from-[#4238C8] to-[#3730A3] hover:from-[#3b32b4] hover:to-[#322e92]"
            } text-white transition-all duration-200 shadow-sm hover:shadow-md relative overflow-hidden group`}
          >
            <span className="relative z-10">إدارة الأمان</span>
            <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
          </Button>
        </div>
      </div>

      <div
        className={`p-4 rounded-lg ${
          darkMode
            ? "bg-gray-700"
            : "bg-gradient-to-br from-white to-indigo-100/40"
        } border ${
          darkMode ? "border-gray-600" : "border-indigo-200"
        } shadow-md`}
      >
        <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          هنا يمكنك تعديل إعدادات النظام والتكوين.
        </p>
        <div
          className={`p-4 rounded-lg ${
            darkMode
              ? "bg-indigo-900/30 border border-indigo-800"
              : "bg-gradient-to-r from-indigo-50/70 to-indigo-100/50 border border-indigo-200"
          }`}
        >
          <p className={`${darkMode ? "text-indigo-300" : "text-indigo-700"}`}>
            هذا القسم قيد التطوير. سيتم إضافة وظائف إدارة الإعدادات قريبًا.
          </p>
        </div>
      </div>

      {/* نموذج تعديل إعدادات الموقع */}
      {showSiteSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl ${
              darkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-indigo-200"
            } p-6`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3
                className={`text-xl font-bold ${
                  darkMode ? "text-indigo-300" : "text-indigo-800"
                }`}
              >
                تعديل إعدادات الموقع
              </h3>
              <button
                className={`p-1 rounded-full ${
                  darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } transition-colors`}
                onClick={() => setShowSiteSettings(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label
                    className={`block mb-2 text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    اسم الموقع
                  </label>
                  <input
                    type="text"
                    name="siteName"
                    value={localSettings.siteName}
                    onChange={handleInputChange}
                    className={`w-full p-2 rounded-md ${
                      darkMode
                        ? "bg-gray-700 border border-gray-600 text-white"
                        : "bg-white border border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    required
                  />
                </div>

                <div>
                  <label
                    className={`block mb-2 text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="siteEmail"
                    value={localSettings.siteEmail}
                    onChange={handleInputChange}
                    className={`w-full p-2 rounded-md ${
                      darkMode
                        ? "bg-gray-700 border border-gray-600 text-white"
                        : "bg-white border border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    required
                  />
                </div>

                <div>
                  <label
                    className={`block mb-2 text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    رقم الهاتف
                  </label>
                  <input
                    type="text"
                    name="sitePhone"
                    value={localSettings.sitePhone}
                    onChange={handleInputChange}
                    className={`w-full p-2 rounded-md ${
                      darkMode
                        ? "bg-gray-700 border border-gray-600 text-white"
                        : "bg-white border border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                </div>

                <div>
                  <label
                    className={`block mb-2 text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    العنوان
                  </label>
                  <input
                    type="text"
                    name="siteAddress"
                    value={localSettings.siteAddress}
                    onChange={handleInputChange}
                    className={`w-full p-2 rounded-md ${
                      darkMode
                        ? "bg-gray-700 border border-gray-600 text-white"
                        : "bg-white border border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                </div>

                <div>
                  <label
                    className={`block mb-2 text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    ساعات العمل
                  </label>
                  <input
                    type="text"
                    name="siteWorkingHours"
                    value={localSettings.siteWorkingHours}
                    onChange={handleInputChange}
                    className={`w-full p-2 rounded-md ${
                      darkMode
                        ? "bg-gray-700 border border-gray-600 text-white"
                        : "bg-white border border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                </div>

                <div>
                  <label
                    className={`block mb-2 text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    شعار الموقع
                  </label>
                  <div className="space-y-2">
                    {/* عرض الشعار الحالي أو المعاينة */}
                    <div className="flex items-center justify-center p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                      <img
                        src={logoPreview || localSettings.siteLogo}
                        alt="شعار الموقع"
                        className="max-h-20 max-w-full"
                      />
                    </div>

                    {/* زر تحميل صورة جديدة */}
                    <div className="flex space-x-2 space-x-reverse">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className={`${
                          darkMode
                            ? "border-indigo-600 text-indigo-300 hover:bg-indigo-900/30"
                            : "border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                        } transition-colors flex items-center`}
                        onClick={() => fileInputRef.current.click()}
                      >
                        <Upload size={16} className="ml-2" />
                        تحميل صورة
                      </Button>

                      {/* حقل إدخال رابط الشعار */}
                      <input
                        type="text"
                        name="siteLogo"
                        value={localSettings.siteLogo}
                        onChange={handleInputChange}
                        placeholder="أو أدخل رابط الصورة"
                        className={`flex-1 p-2 rounded-md ${
                          darkMode
                            ? "bg-gray-700 border border-gray-600 text-white"
                            : "bg-white border border-gray-300 text-gray-900"
                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label
                  className={`block mb-2 text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  وصف الموقع
                </label>
                <textarea
                  name="siteDescription"
                  value={localSettings.siteDescription}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full p-2 rounded-md ${
                    darkMode
                      ? "bg-gray-700 border border-gray-600 text-white"
                      : "bg-white border border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 space-x-reverse">
                <Button
                  type="button"
                  variant="outline"
                  className={`${
                    darkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  } transition-colors`}
                  onClick={() => setShowSiteSettings(false)}
                >
                  إلغاء
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  className={`${
                    darkMode
                      ? "bg-gradient-to-r from-[#3730A3] to-[#4238C8] hover:from-[#322e92] hover:to-[#3b32b4]"
                      : "bg-gradient-to-r from-[#4238C8] to-[#3730A3] hover:from-[#3b32b4] hover:to-[#322e92]"
                  } text-white transition-all duration-200 relative overflow-hidden group`}
                >
                  <span className="relative z-10">حفظ التغييرات</span>
                  <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsSection;
