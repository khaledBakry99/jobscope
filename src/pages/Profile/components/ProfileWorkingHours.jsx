import React, { useState, useEffect } from "react";
import Card from "../../../components/common/Card";
import { Clock, Calendar } from "lucide-react";
import {
  getWorkingDaysText,
  getWorkingHoursText,
} from "../../../utils/availabilityUtils";

const ProfileWorkingHours = ({
  workingHours,
  isEditing,
  onWorkingHoursChange,
  darkMode,
}) => {
  // تعريف أيام الأسبوع بالعربية
  const daysMap = {
    saturday: "السبت",
    sunday: "الأحد",
    monday: "الاثنين",
    tuesday: "الثلاثاء",
    wednesday: "الأربعاء",
    thursday: "الخميس",
    friday: "الجمعة",
  };

  // حالة لتخزين أوقات العمل الموحدة
  const [uniformWorkTime, setUniformWorkTime] = useState({
    from: "09:00",
    to: "17:00",
  });

  // تحديث أوقات العمل الموحدة عند تحميل المكون
  useEffect(() => {
    // البحث عن أول يوم عمل للحصول على ساعات العمل
    const firstWorkingDay = Object.values(workingHours || {}).find(
      (day) => day?.isWorking
    );
    if (firstWorkingDay) {
      setUniformWorkTime({
        from: firstWorkingDay.from || "09:00",
        to: firstWorkingDay.to || "17:00",
      });
    }
  }, [workingHours]);

  // دالة لتحديث حالة يوم العمل (عامل/غير عامل)
  const handleDayToggle = (day) => {
    if (!onWorkingHoursChange) return;

    const updatedWorkingHours = {
      ...workingHours,
      [day]: {
        ...workingHours[day],
        isWorking: !workingHours[day]?.isWorking,
        from: uniformWorkTime.from,
        to: uniformWorkTime.to,
      },
    };

    onWorkingHoursChange(updatedWorkingHours);
  };

  // دالة لتحديث ساعات العمل الموحدة لجميع أيام العمل
  const handleUniformTimeChange = (field, value) => {
    if (!onWorkingHoursChange) return;

    // تحديث حالة أوقات العمل الموحدة
    setUniformWorkTime({
      ...uniformWorkTime,
      [field]: value,
    });

    // تحديث جميع أيام العمل بالوقت الجديد
    const updatedWorkingHours = { ...workingHours };

    Object.keys(updatedWorkingHours).forEach((day) => {
      if (updatedWorkingHours[day]?.isWorking) {
        updatedWorkingHours[day] = {
          ...updatedWorkingHours[day],
          [field]: value,
        };
      }
    });

    onWorkingHoursChange(updatedWorkingHours);
  };

  return (
    <Card
      className={`p-6 mb-6 ${
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
        <span className="relative z-10">أوقات الدوام</span>
        <span
          className={`absolute bottom-0 left-0 right-0 h-2 ${
            darkMode ? "bg-indigo-500" : "bg-indigo-300"
          } opacity-40 transform -rotate-1 z-0`}
        ></span>
      </h2>

      {isEditing ? (
        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* قسم أيام العمل */}
            <div
              className={`p-4 rounded-lg shadow-sm ${
                darkMode ? "bg-gray-700" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <h4
                  className={`font-medium ${
                    darkMode ? "text-indigo-300" : "text-indigo-600"
                  }`}
                >
                  أيام العمل
                </h4>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      // تحديد جميع الأيام
                      const updatedWorkingHours = { ...workingHours };
                      Object.keys(daysMap).forEach((day) => {
                        updatedWorkingHours[day] = {
                          ...updatedWorkingHours[day],
                          isWorking: true,
                          from: uniformWorkTime.from,
                          to: uniformWorkTime.to,
                        };
                      });

                      onWorkingHoursChange(updatedWorkingHours);
                    }}
                    className={`text-xs px-2 py-1 rounded-md ${
                      darkMode
                        ? "bg-indigo-700 text-white hover:bg-indigo-600"
                        : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                    } transition-colors duration-200`}
                  >
                    تحديد الكل
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      // إلغاء تحديد جميع الأيام
                      const updatedWorkingHours = { ...workingHours };
                      Object.keys(daysMap).forEach((day) => {
                        updatedWorkingHours[day] = {
                          ...updatedWorkingHours[day],
                          isWorking: false,
                        };
                      });

                      onWorkingHoursChange(updatedWorkingHours);
                    }}
                    className={`text-xs px-2 py-1 rounded-md ${
                      darkMode
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } transition-colors duration-200`}
                  >
                    إلغاء تحديد الكل
                  </button>
                </div>
              </div>

              {Object.entries(daysMap).map(([day, dayName]) => (
                <div key={day} className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id={`edit-working-${day}`}
                    checked={workingHours[day]?.isWorking || false}
                    onChange={() => handleDayToggle(day)}
                    className="w-5 h-5 accent-indigo-600 ml-2"
                  />
                  <label
                    htmlFor={`edit-working-${day}`}
                    className={`${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } cursor-pointer`}
                  >
                    {dayName}
                  </label>
                </div>
              ))}
            </div>

            {/* قسم ساعات العمل */}
            <div
              className={`p-4 rounded-lg shadow-sm ${
                darkMode ? "bg-gray-700" : "bg-white"
              }`}
            >
              <h4
                className={`font-medium mb-3 ${
                  darkMode ? "text-indigo-300" : "text-indigo-600"
                }`}
              >
                ساعات العمل
              </h4>

              {Object.values(workingHours || {}).some(
                (day) => day?.isWorking
              ) ? (
                <div className="mb-3">
                  <p
                    className={`text-sm mb-3 ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    حدد وقت العمل الموحد لجميع الأيام المختارة
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <span
                        className={`ml-2 ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        من
                      </span>
                      <input
                        type="time"
                        value={uniformWorkTime.from}
                        onChange={(e) =>
                          handleUniformTimeChange("from", e.target.value)
                        }
                        className={`p-1 rounded border ${
                          darkMode
                            ? "bg-gray-600 border-gray-500 text-gray-200"
                            : "bg-white border-gray-300"
                        }`}
                      />
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`ml-2 ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        إلى
                      </span>
                      <input
                        type="time"
                        value={uniformWorkTime.to}
                        onChange={(e) =>
                          handleUniformTimeChange("to", e.target.value)
                        }
                        className={`p-1 rounded border ${
                          darkMode
                            ? "bg-gray-600 border-gray-500 text-gray-200"
                            : "bg-white border-gray-300"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <h5
                      className={`text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      أيام العمل المختارة:
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(daysMap).map(
                        ([day, dayName]) =>
                          workingHours[day]?.isWorking && (
                            <span
                              key={`selected-${day}`}
                              className={`px-2 py-1 rounded-full text-xs ${
                                darkMode
                                  ? "bg-indigo-700 text-gray-200"
                                  : "bg-indigo-100 text-indigo-800"
                              }`}
                            >
                              {dayName}
                            </span>
                          )
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p
                  className={`text-center py-4 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  الرجاء تحديد أيام العمل أولاً
                </p>
              )}
            </div>
          </div>

          <div
            className={`mt-4 p-3 rounded-md ${
              darkMode ? "bg-gray-700" : "bg-indigo-50"
            }`}
          >
            <p
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-indigo-700"
              }`}
            >
              <span className="font-bold">ملاحظة:</span> سيتم استخدام أوقات
              الدوام لتحديد ما إذا كنت متاحاً للعمل في وقت معين.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* عرض أيام العمل */}
          <div className="flex items-center">
            <Calendar
              size={20}
              className={`ml-2 ${
                darkMode ? "text-indigo-300" : "text-indigo-600"
              }`}
            />
            <div className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              <span className="font-medium ml-1">أيام العمل:</span>
              <span>{getWorkingDaysText(workingHours)}</span>
            </div>
          </div>

          {/* عرض ساعات العمل */}
          <div className="flex items-center">
            <Clock
              size={20}
              className={`ml-2 ${
                darkMode ? "text-indigo-300" : "text-indigo-600"
              }`}
            />
            <div className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              <span className="font-medium ml-1">ساعات العمل:</span>
              <span>{getWorkingHoursText(workingHours)}</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ProfileWorkingHours;
