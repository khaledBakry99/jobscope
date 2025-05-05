import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, X, Check, Phone, User } from "lucide-react";
import Button from "../common/Button";
import useThemeStore from "../../store/themeStore";
import useBookingStore from "../../store/bookingStore";

const BookingEditForm = ({ booking, onClose, onSave }) => {
  const darkMode = useThemeStore((state) => state.darkMode);
  const { updateBooking, updateBookingStatus } = useBookingStore();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // مرجع للشاشة المنبثقة
  const modalRef = useRef(null);

  // إضافة مستمع للنقرات خارج الشاشة
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    // إضافة مستمع الأحداث
    document.addEventListener("mousedown", handleClickOutside);

    // إزالة مستمع الأحداث عند إزالة المكون
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Función para verificar si una reserva pendiente ha expirado
  const checkBookingExpired = () => {
    if (booking.status !== "pending") return false;

    const bookingDate = new Date(`${booking.date}T${booking.time}`);
    const now = new Date();

    // Si la fecha y hora de la reserva ya pasaron
    return now > bookingDate;
  };

  // Verificar si la reserva ha expirado al cargar el componente
  useEffect(() => {
    if (checkBookingExpired()) {
      console.log(
        `La reserva #${booking.id} ha expirado. Cancelando automáticamente.`
      );
      updateBookingStatus(booking.id, "cancelled");
      onSave(); // Cerrar el formulario
    }
  }, [booking, updateBookingStatus, onSave]);

  const [formData, setFormData] = useState({
    startDate: booking.date,
    endDate: booking.endDate || "",
    startTime: booking.time,
    endTime: booking.endTime || "",
    description: booking.description,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.startDate) {
      newErrors.startDate = "تاريخ البداية مطلوب";
      isValid = false;
    }

    if (!formData.endDate) {
      newErrors.endDate = "تاريخ النهاية مطلوب";
      isValid = false;
    } else if (
      formData.startDate &&
      new Date(formData.endDate) < new Date(formData.startDate)
    ) {
      newErrors.endDate = "يجب أن يكون تاريخ النهاية بعد تاريخ البداية";
      isValid = false;
    }

    if (!formData.startTime) {
      newErrors.startTime = "وقت البداية مطلوب";
      isValid = false;
    }

    if (!formData.endTime) {
      newErrors.endTime = "وقت النهاية مطلوب";
      isValid = false;
    } else if (formData.startTime && formData.endTime < formData.startTime) {
      newErrors.endTime = "يجب أن يكون وقت النهاية بعد وقت البداية";
      isValid = false;
    }

    if (!formData.description) {
      newErrors.description = "وصف المشكلة مطلوب";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const updatedBooking = {
        date: formData.startDate,
        endDate: formData.endDate,
        time: formData.startTime,
        endTime: formData.endTime,
        description: formData.description,
        dateRange: `${formData.startDate} - ${formData.endDate}`,
        timeRange: `${formData.startTime} - ${formData.endTime}`,
      };

      updateBooking(booking.id, updatedBooking);
      onSave();
    }
  };

  const handleCancelBooking = () => {
    updateBookingStatus(booking.id, "cancelled");
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      {showCancelConfirm ? (
        <motion.div
          ref={modalRef}
          className={`${
            darkMode
              ? "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200"
              : "bg-gradient-to-br from-white to-indigo-50"
          } rounded-lg shadow-xl w-full max-w-md transition-colors duration-300 border ${
            darkMode ? "border-indigo-800/30" : "border-indigo-200"
          }`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-xl font-bold ${
                  darkMode ? "text-red-300" : "text-red-600"
                } relative inline-block transition-colors duration-300`}
              >
                <span className="relative z-10">تأكيد إلغاء الطلب</span>
                <span
                  className={`absolute bottom-0 left-0 right-0 h-2 ${
                    darkMode ? "bg-red-500" : "bg-red-300"
                  } opacity-40 transform -rotate-1 z-0`}
                ></span>
              </h2>
              <button
                onClick={() => setShowCancelConfirm(false)}
                className={`${
                  darkMode
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
                } transition-colors duration-300 p-1 rounded-full hover:bg-gray-100/10`}
              >
                <X size={20} />
              </button>
            </div>

            <div
              className={`p-4 mb-4 rounded-md ${
                darkMode
                  ? "bg-red-900/30 border border-red-800"
                  : "bg-red-50 border border-red-100"
              }`}
            >
              <p
                className={`text-sm ${
                  darkMode ? "text-red-300" : "text-red-700"
                }`}
              >
                <span className="font-bold">تنبيه:</span> هل أنت متأكد من رغبتك
                في إلغاء هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
            </div>

            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowCancelConfirm(false)}
                className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-3 px-6 ${
                  darkMode
                    ? "bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900"
                    : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700"
                }`}
              >
                <span className="relative z-10 flex items-center">
                  <X size={18} className="ml-1" />
                  تراجع
                </span>
                <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </Button>

              <Button
                type="button"
                variant="primary"
                onClick={handleCancelBooking}
                className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-3 px-6 ${
                  darkMode
                    ? "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
                    : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                }`}
              >
                <span className="relative z-10 flex items-center">
                  <Check size={18} className="ml-1" />
                  تأكيد الإلغاء
                </span>
                <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </Button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          ref={modalRef}
          className={`${
            darkMode
              ? "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200"
              : "bg-gradient-to-br from-white to-indigo-50"
          } rounded-lg shadow-xl w-full max-w-2xl transition-colors duration-300 border ${
            darkMode ? "border-indigo-800/30" : "border-indigo-200"
          }`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="p-6">
            {/* Header with close button */}
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-xl font-bold ${
                  darkMode ? "text-indigo-300" : "text-indigo-800"
                } relative inline-block transition-colors duration-300`}
              >
                <span className="relative z-10">تعديل الطلب</span>
                <span
                  className={`absolute bottom-0 left-0 right-0 h-2 ${
                    darkMode ? "bg-indigo-500" : "bg-indigo-300"
                  } opacity-40 transform -rotate-1 z-0`}
                ></span>
              </h2>
              <button
                onClick={onClose}
                className={`${
                  darkMode
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
                } transition-colors duration-300 p-1 rounded-full hover:bg-gray-100/10`}
              >
                <X size={20} />
              </button>
            </div>

            <div
              className={`p-4 mb-4 rounded-md ${
                darkMode
                  ? "bg-indigo-900/30 border border-indigo-800"
                  : "bg-indigo-50 border border-indigo-100"
              }`}
            >
              <p
                className={`text-sm ${
                  darkMode ? "text-indigo-300" : "text-indigo-700"
                }`}
              >
                <span className="font-bold">ملاحظة:</span> يمكنك تعديل أو إلغاء
                طلبك خلال 5 دقائق فقط من وقت تقديمه. بعد ذلك، لن تتمكن من تعديل
                أو إلغاء الطلب.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    className={`block ${
                      darkMode ? "text-indigo-300" : "text-indigo-800"
                    } font-medium mb-2 transition-colors duration-300`}
                  >
                    تاريخ البداية <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={`input w-full ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-indigo-400 focus:ring-indigo-400"
                        : "border-indigo-200 focus:border-indigo-500 focus:ring-indigo-200"
                    } focus:ring focus:ring-opacity-50 rounded-md shadow-sm ${
                      errors.startDate
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.startDate}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block ${
                      darkMode ? "text-indigo-300" : "text-indigo-800"
                    } font-medium mb-2 transition-colors duration-300`}
                  >
                    تاريخ النهاية <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className={`input w-full ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-indigo-400 focus:ring-indigo-400"
                        : "border-indigo-200 focus:border-indigo-500 focus:ring-indigo-200"
                    } focus:ring focus:ring-opacity-50 rounded-md shadow-sm ${
                      errors.endDate ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                    min={
                      formData.startDate ||
                      new Date().toISOString().split("T")[0]
                    }
                    required
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    className={`block ${
                      darkMode ? "text-indigo-300" : "text-indigo-800"
                    } font-medium mb-2 transition-colors duration-300`}
                  >
                    وقت البداية <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className={`input w-full ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-indigo-400 focus:ring-indigo-400"
                        : "border-indigo-200 focus:border-indigo-500 focus:ring-indigo-200"
                    } focus:ring focus:ring-opacity-50 rounded-md shadow-sm ${
                      errors.startTime
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    required
                  />
                  {errors.startTime && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.startTime}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block ${
                      darkMode ? "text-indigo-300" : "text-indigo-800"
                    } font-medium mb-2 transition-colors duration-300`}
                  >
                    وقت النهاية <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className={`input w-full ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-indigo-400 focus:ring-indigo-400"
                        : "border-indigo-200 focus:border-indigo-500 focus:ring-indigo-200"
                    } focus:ring focus:ring-opacity-50 rounded-md shadow-sm ${
                      errors.endTime ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                    required
                  />
                  {errors.endTime && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.endTime}
                    </p>
                  )}
                </div>
              </div>

              {/* Información del artesano */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div
                  className={`px-3 py-2 rounded-md shadow-sm ${
                    darkMode
                      ? "bg-gray-700/80 border border-gray-600"
                      : "bg-white/80 border border-indigo-100"
                  } transition-colors duration-300`}
                >
                  <div className="flex items-center">
                    <User
                      size={20}
                      className={`${
                        darkMode ? "text-indigo-400" : "text-indigo-500"
                      } ml-2`}
                    />
                    <div>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-indigo-300" : "text-indigo-500"
                        } transition-colors duration-300`}
                      >
                        الحرفي
                      </p>
                      <p
                        className={`font-medium ${
                          darkMode ? "text-indigo-200" : "text-indigo-700"
                        } transition-colors duration-300`}
                      >
                        {booking.craftsmanName}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`px-3 py-2 rounded-md shadow-sm ${
                    darkMode
                      ? "bg-gray-700/80 border border-gray-600"
                      : "bg-white/80 border border-indigo-100"
                  } transition-colors duration-300`}
                >
                  <div className="flex items-center">
                    <Phone
                      size={20}
                      className={`${
                        darkMode ? "text-indigo-400" : "text-indigo-500"
                      } ml-2`}
                    />
                    <div>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-indigo-300" : "text-indigo-500"
                        } transition-colors duration-300`}
                      >
                        رقم هاتف الحرفي
                      </p>
                      <p
                        className={`font-medium ${
                          darkMode ? "text-indigo-200" : "text-indigo-700"
                        } transition-colors duration-300`}
                      >
                        {booking.craftsmanPhone
                          ? booking.craftsmanPhone
                          : "لم يتم توفير رقم الهاتف"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label
                  className={`block ${
                    darkMode ? "text-indigo-300" : "text-indigo-800"
                  } font-medium mb-2 transition-colors duration-300`}
                >
                  وصف المشكلة <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="اكتب وصفاً مختصراً للمشكلة أو الخدمة المطلوبة..."
                  className={`input min-h-[100px] max-h-[200px] w-full overflow-y-auto ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-indigo-400 focus:ring-indigo-400"
                      : "border-indigo-200 focus:border-indigo-500 focus:ring-indigo-200"
                  } focus:ring focus:ring-opacity-50 rounded-md shadow-sm ${
                    errors.description
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  required
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowCancelConfirm(true)}
                    className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-3 px-6 ${
                      darkMode
                        ? "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
                        : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                    }`}
                  >
                    <span className="relative z-10 flex items-center">
                      <AlertTriangle size={18} className="ml-1" />
                      إلغاء الطلب
                    </span>
                    <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-3 px-6 ${
                      darkMode
                        ? "bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900"
                        : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700"
                    }`}
                  >
                    <span className="relative z-10 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      إغلاق
                    </span>
                    <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  </Button>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className={`text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group py-3 px-6 ${
                    darkMode
                      ? "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
                      : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                  }`}
                >
                  <span className="relative z-10 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    حفظ التغييرات
                  </span>
                  <span className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BookingEditForm;
