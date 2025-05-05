import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

// مكون السؤال الشائع الفردي
const FAQItem = ({ question, darkMode, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(question)}
      className={`w-full text-right p-2 rounded-md mb-1 transition-colors flex items-center ${
        darkMode
          ? "bg-gray-700 hover:bg-gray-600 text-white"
          : "bg-indigo-50 hover:bg-indigo-100 text-gray-800"
      }`}
    >
      <HelpCircle
        size={16}
        className={darkMode ? "text-indigo-300 ml-2" : "text-indigo-500 ml-2"}
      />
      <span className="text-sm">{question}</span>
    </button>
  );
};

// مكون فئة الأسئلة الشائعة
const FAQCategory = ({
  title,
  questions,
  darkMode,
  onSelect,
  isExpanded,
  onToggle,
}) => {
  return (
    <div className="mb-3">
      <div
        className={`flex justify-between items-center p-2 rounded-md mb-2 cursor-pointer ${
          darkMode
            ? "bg-gray-700 text-white hover:bg-gray-600"
            : "bg-indigo-100 text-gray-800 hover:bg-indigo-200"
        }`}
        onClick={onToggle}
      >
        <div className="flex items-center">
          {isExpanded ? (
            <ChevronUp size={18} className="ml-1" />
          ) : (
            <ChevronDown size={18} className="ml-1" />
          )}
          <span className="font-semibold">{title}</span>
        </div>
      </div>
      {isExpanded && (
        <div className="pr-2">
          {questions.map((question, index) => (
            <FAQItem
              key={index}
              question={question}
              darkMode={darkMode}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// مكون الأسئلة الشائعة الرئيسي
const FrequentlyAskedQuestions = ({ darkMode, onSelectQuestion }) => {
  // تنظيم الأسئلة حسب الفئات
  const faqCategories = [
    {
      title: "التسجيل والحساب",
      questions: [
        "كيف يمكنني التسجيل كحرفي؟",
        "كيف يمكنني تغيير كلمة المرور؟",
        "كيف يمكنني تغيير رقم هاتفي؟",
        "كيف يمكنني تغيير بريدي الإلكتروني؟",
        "كيف يمكنني تغيير صورتي الشخصية؟",
      ],
    },
    {
      title: "البحث والحجز",
      questions: [
        "كيف يمكنني البحث عن حرفي؟",
        "كيف يمكنني حجز خدمة؟",
        "كيف يمكنني إلغاء طلب؟",
        "كيف يمكنني تعديل طلب؟",
        "كيف يمكنني معرفة حالة طلبي؟",
      ],
    },
    {
      title: "التقييم والمراجعات",
      questions: [
        "كيف يمكنني تقييم خدمة؟",
        "هل يمكنني تعديل تقييمي بعد إرساله؟",
        "كيف يتم احتساب تقييم الحرفيين؟",
      ],
    },
    {
      title: "الإعدادات والتخصيص",
      questions: [
        "كيف يمكنني تفعيل الوضع المظلم؟",
        "كيف يمكنني تغيير اللغة؟",
        "هل يمكنني استخدام المنصة بدون تسجيل؟",
      ],
    },
    {
      title: "الدعم والمساعدة",
      questions: [
        "كيف يمكنني التواصل مع الدعم؟",
        "ما هي مواعيد العمل؟",
        "هل هناك رسوم لاستخدام المنصة؟",
      ],
    },
  ];

  // لم نعد بحاجة إلى الأسئلة الأكثر شيوعًا

  // حالة توسيع/طي الفئات
  const [expandedCategories, setExpandedCategories] = useState({});

  // تبديل حالة توسيع/طي فئة
  const toggleCategory = (categoryTitle) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryTitle]: !prev[categoryTitle],
    }));
  };

  // توسيع الفئة الأولى افتراضيًا عند تحميل المكون
  useEffect(() => {
    setExpandedCategories((prev) => ({
      ...prev,
      [faqCategories[0].title]: true,
    }));
  }, []);

  return (
    <div className="w-full">
      <div className="mb-3">
        <h3
          className={`text-md font-bold mb-2 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          الأسئلة الشائعة
        </h3>

        {/* عرض الأسئلة حسب الفئات */}
        <div>
          {faqCategories.map((category, index) => (
            <FAQCategory
              key={index}
              title={category.title}
              questions={category.questions}
              darkMode={darkMode}
              onSelect={onSelectQuestion}
              isExpanded={expandedCategories[category.title] || false}
              onToggle={() => toggleCategory(category.title)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FrequentlyAskedQuestions;
