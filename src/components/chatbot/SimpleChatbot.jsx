import React, { useState, useRef, useEffect } from "react";
import {
  BotMessageSquare,
  X,
  Send,
  Search,
  ClipboardList,
  Home,
  Settings,
  MessageCircle,
} from "lucide-react";
import useThemeStore from "../../store/themeStore";
import useLanguageStore from "../../store/languageStore";
import useUserStore from "../../store/userStore";
import { useNavigate } from "react-router-dom";
import { analyzeQuery } from "../../services/nlpService";

import botAvatar from "../../../public/img/11zon_cropped.png";
import userAvatar from "../../../public/img/user-avatar.svg";

// قاعدة بيانات الأسئلة والإجابات
const faqDatabase = {
  "كيف يمكنني التسجيل كحرفي؟":
    'يمكنك التسجيل كحرفي من خلال النقر على زر "تسجيل كحرفي" في الصفحة الرئيسية، ثم ملء النموذج بمعلوماتك الشخصية ومعلومات عملك.',
  "كيف يمكنني حجز خدمة؟":
    'يمكنك حجز خدمة من خلال البحث عن الحرفي المناسب، ثم النقر على زر "حجز" في صفحة الملف الشخصي للحرفي، وملء نموذج الحجز بالتفاصيل المطلوبة.',
  "كيف يمكنني تعديل معلومات ملفي الشخصي؟":
    'يمكنك تعديل معلومات ملفك الشخصي من خلال الانتقال إلى صفحة "الملف الشخصي" ثم النقر على زر "تعديل".',
  "كيف يمكنني تغيير كلمة المرور؟":
    'يمكنك تغيير كلمة المرور من خلال الانتقال إلى صفحة "الإعدادات" ثم النقر على زر "تغيير كلمة المرور".',
  "كيف يمكنني إلغاء طلب؟":
    'يمكنك إلغاء طلب من خلال الانتقال إلى صفحة "طلباتي" ثم النقر على "عرض التفاصيل" للطلب المراد إلغاؤه، ثم النقر على زر "تعديل الطلب" ثم "الغاء الطلب" لكن لن يتم الغاء الطلب اذا مر على تقديمة أكثر من "5 دقائق".',
};

// قائمة الاقتراحات السريعة
const quickSuggestions = [
  "كيف يمكنني التسجيل كحرفي؟",
  "كيف يمكنني حجز خدمة؟",
  "كيف يمكنني تعديل معلومات ملفي الشخصي؟",
  "كيف يمكنني تغيير كلمة المرور؟",
  "كيف يمكنني إلغاء طلب؟",
];

// سنستخدم قائمة المهن من خدمة NLP

// مكون الرسالة
const ChatMessage = ({ message, isUser, darkMode }) => {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div className="flex items-start max-w-[80%]">
        {!isUser && (
          <img
            src={botAvatar}
            alt="Bot"
            className="w-10 h-10 rounded-full mr-2 mt-1 object-contain"
          />
        )}
        <div
          className={`px-4 py-2 rounded-lg ${
            isUser
              ? darkMode
                ? "bg-indigo-600 text-white"
                : "bg-indigo-500 text-white"
              : darkMode
              ? "bg-gray-700 text-white"
              : "bg-white text-gray-800 border border-gray-200"
          }`}
        >
          {message}
        </div>
        {isUser && (
          <img
            src={userAvatar}
            alt="User"
            className="w-8 h-8 rounded-full ml-2 mt-1"
          />
        )}
      </div>
    </div>
  );
};

// مكون الاقتراحات السريعة
const QuickSuggestions = ({ suggestions, onSelect, darkMode }) => {
  return (
    <div className="flex flex-wrap gap-2 my-3 justify-center">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          className={`px-3 py-1.5 text-sm rounded-full ${
            darkMode
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
          } transition-colors duration-200 text-right shadow-sm hover:shadow-md border ${
            darkMode ? "border-gray-600" : "border-indigo-200"
          } cursor-pointer flex items-center gap-1`}
        >
          <MessageCircle
            size={14}
            className={darkMode ? "text-gray-300" : "text-indigo-500"}
          />
          <span>{suggestion}</span>
        </button>
      ))}
    </div>
  );
};

// المكون الرئيسي للشات بوت
const SimpleChatbot = () => {
  const [opened, setOpened] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState(quickSuggestions);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const darkMode = useThemeStore((state) => state.darkMode);
  const language = useLanguageStore((state) => state.language);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  // التمرير إلى آخر رسالة
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // إضافة رسالة ترحيبية عند فتح الشات
  useEffect(() => {
    if (opened && messages.length === 0) {
      setMessages([
        {
          text: "مرحباً بك في منصة JobScope! كيف يمكنني مساعدتك اليوم؟",
          isUser: false,
        },
      ]);
    }

    if (opened) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [opened]);

  // التمرير إلى آخر رسالة عند إضافة رسالة جديدة
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // إرسال رسالة
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // إضافة رسالة المستخدم
    const userMessage = { text: inputValue, isUser: true };
    const userInput = inputValue; // حفظ قيمة الإدخال قبل إعادة تعيينها
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // معالجة الرسالة وإضافة رد البوت
    setTimeout(() => {
      const botResponse = processUserMessage(userInput);
      setMessages((prev) => [...prev, { text: botResponse, isUser: false }]);

      // إظهار الاقتراحات بعد الرد
      setShowSuggestions(true);

      // تحديث الاقتراحات بناءً على المحادثة
      const analysis = analyzeQuery(userInput);

      if (analysis.profession) {
        // إذا كان الاستفسار يتعلق بمهنة محددة
        setSuggestions([
          `كيف يمكنني حجز ${analysis.profession}؟`,
          `ما هي أسعار ${analysis.profession}؟`,
          `ما هي أفضل شركة ${analysis.profession}؟`,
          `كيف يمكنني تقييم ${analysis.profession}؟`,
          `كيف يمكنني التسجيل كحرفي؟`,
        ]);
      } else if (
        analysis.keywords.some((keyword) =>
          ["مصباح", "إضاءة", "كهرباء", "فيوز", "قاطع", "لمبة"].includes(keyword)
        )
      ) {
        // إذا كان الاستفسار يتعلق بمشكلة كهربائية
        setSuggestions([
          " كهربائي لإصلاح أريد ",
          "كيف يمكنني حجز كهربائي؟",
          "ما هي أسعار الكهربائيين؟",
          "كيف يمكنني تقييم كهربائي؟",
          "كيف يمكنني التسجيل كحرفي؟",
        ]);
      } else if (
        analysis.keywords.some((keyword) =>
          ["حنفية", "تسرب", "ماء", "مجاري", "صرف", "حمام", "مطبخ"].includes(
            keyword
          )
        )
      ) {
        // إذا كان الاستفسار يتعلق بمشكلة سباكة
        setSuggestions([
          " سباك لإصلاح تسرب أريد ",
          "كيف يمكنني حجز سباك؟",
          "ما هي أسعار السباكين؟",
          "كيف يمكنني تقييم سباك؟",
          "كيف يمكنني التسجيل كحرفي؟",
        ]);
      } else {
        // اقتراحات افتراضية
        setSuggestions(quickSuggestions);
      }
    }, 500);
  };

  // معالجة رسالة المستخدم باستخدام خدمة NLP
  const processUserMessage = (message) => {
    // تحليل الرسالة باستخدام خدمة NLP
    const analysis = analyzeQuery(message);
    console.log("تحليل الرسالة:", analysis);

    // البحث في قاعدة بيانات الأسئلة الشائعة أولاً
    for (const [question, answer] of Object.entries(faqDatabase)) {
      if (message.includes(question) || question.includes(message)) {
        return answer;
      }
    }

    // إذا تم العثور على مهنة
    if (analysis.profession) {
      return `يبدو أنك تبحث عن ${analysis.profession}. يمكنك الانتقال إلى صفحة البحث واستخدام البحث الذكي بكتابة: "أريد ${analysis.profession}".`;
    }

    // إذا تم العثور على مشكلة تتعلق بالكهرباء
    if (
      analysis.keywords.some((keyword) =>
        ["مصباح", "إضاءة", "كهرباء", "فيوز", "قاطع", "لمبة"].includes(keyword)
      )
    ) {
      return 'يبدو أنك تواجه مشكلة في الكهرباء. يمكنك البحث عن كهربائي من خلال صفحة البحث واستخدام البحث الذكي بكتابة: "أريد كهربائي".';
    }

    // إذا تم العثور على مشكلة تتعلق بالسباكة
    if (
      analysis.keywords.some((keyword) =>
        ["حنفية", "تسرب", "ماء", "مجاري", "صرف", "حمام", "مطبخ"].includes(
          keyword
        )
      )
    ) {
      return 'يبدو أنك تواجه مشكلة في السباكة. يمكنك البحث عن سباك من خلال صفحة البحث واستخدام البحث الذكي بكتابة: "أريد سباك".';
    }

    // إذا تم العثور على مشكلة تتعلق بالنجارة
    if (
      analysis.keywords.some((keyword) =>
        ["باب", "خزانة", "أثاث", "خشب", "نافذة", "طاولة"].includes(keyword)
      )
    ) {
      return 'يبدو أنك تواجه مشكلة في النجارة. يمكنك البحث عن نجار من خلال صفحة البحث واستخدام البحث الذكي بكتابة: "أريد نجار".';
    }

    // البحث عن كلمات مفتاحية
    if (message.includes("بحث") || message.includes("حرفي")) {
      return "يمكنك البحث عن الحرفيين من خلال صفحة البحث. هل تبحث عن مهنة محددة؟";
    }

    if (message.includes("تسجيل") || message.includes("حساب")) {
      return "يمكنك التسجيل كمستخدم عادي أو كحرفي من خلال الصفحة الرئيسية. هل تريد معلومات أكثر عن التسجيل كحرفي؟";
    }

    if (
      message.includes("دعم") ||
      message.includes("مساعدة") ||
      message.includes("تواصل")
    ) {
      return "يمكنك التواصل مع فريق الدعم عبر البريد الإلكتروني: support@jobscope.com أو الاتصال على الرقم: +963 11 123 4567";
    }

    // رد افتراضي
    return "عذراً، لم أفهم طلبك. الرجاء توضيح طلبك بشكل أكثر أو اختيار أحد الاقتراحات أدناه.";
  };

  // اختيار اقتراح
  const handleSelectSuggestion = (suggestion) => {
    // لا نضع النص في حقل الإدخال بعد الآن
    // setInputValue(suggestion);
    setShowSuggestions(false);

    // إضافة رسالة المستخدم
    const userMessage = { text: suggestion, isUser: true };
    setMessages((prev) => [...prev, userMessage]);

    // معالجة الرسالة وإضافة رد البوت
    setTimeout(() => {
      const botResponse = processUserMessage(suggestion);
      setMessages((prev) => [...prev, { text: botResponse, isUser: false }]);

      // إظهار الاقتراحات بعد الرد
      setShowSuggestions(true);

      // تحديث الاقتراحات بناءً على المحادثة
      const analysis = analyzeQuery(suggestion);
      if (analysis.profession) {
        // إذا كان الاقتراح يتعلق بمهنة محددة، نقترح أسئلة متعلقة بها
        setSuggestions([
          `كيف يمكنني حجز ${analysis.profession}؟`,
          `ما هي أسعار ${analysis.profession}؟`,
          `ما هي أفضل شركة ${analysis.profession}؟`,
          `كيف يمكنني تقييم ${analysis.profession}؟`,
          `كيف يمكنني التسجيل كحرفي؟`,
        ]);
      }
    }, 500);
  };

  // النصوص حسب اللغة
  const texts = {
    ar: {
      title: "مساعدك JobScope",
      placeholder: "اكتب رسالتك هنا...",
      send: "إرسال",
    },
    en: {
      title: "JobScope Assistant",
      placeholder: "Type your message here...",
      send: "Send",
    },
  };

  const t = texts[language];

  // لا يظهر الشات بوت إذا لم يكن المستخدم مسجل الدخول
  if (!isAuthenticated) return null;

  return (
    <>
      {/* زر فتح المحادثة */}
      {!opened && (
        <button
          onClick={() => setOpened(true)}
          className={`fixed bottom-6 left-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-[100] transition-all duration-200 hover:scale-105 ${
            darkMode
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-indigo-500 hover:bg-indigo-600"
          } animate-pulse-subtle`}
        >
          <BotMessageSquare size={24} className="text-white" />
        </button>
      )}

      {/* نافذة المحادثة */}
      {opened && (
        <div
          className={`fixed bottom-6 left-6 z-[100] shadow-xl rounded-lg overflow-hidden ${
            darkMode ? "border border-gray-700" : "border border-gray-200"
          } animate-fadeIn w-[350px]`}
        >
          {/* رأس المحادثة */}
          <div
            className={`p-3 ${
              darkMode ? "bg-indigo-700" : "bg-indigo-600"
            } text-white flex justify-between items-center`}
          >
            <h3 className="font-bold">{t.title}</h3>
            <button
              onClick={() => setOpened(false)}
              className="hover:bg-indigo-800 rounded-full p-1 transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* أزرار الإجراءات السريعة */}
          <div
            className={`p-2 flex justify-around items-center border-b ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-100 border-gray-200"
            }`}
          >
            <button
              onClick={() => {
                setOpened(false);
                navigate("/");
              }}
              className={`p-2 rounded-full flex flex-col items-center justify-center ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
              title="الصفحة الرئيسية"
            >
              <Home
                size={20}
                className={darkMode ? "text-white" : "text-gray-700"}
              />
              <span
                className={`text-xs mt-1 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                الرئيسية
              </span>
            </button>

            <button
              onClick={() => {
                setOpened(false);
                navigate("/search");
              }}
              className={`p-2 rounded-full flex flex-col items-center justify-center ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
              title="البحث عن حرفي"
            >
              <Search
                size={20}
                className={darkMode ? "text-white" : "text-gray-700"}
              />
              <span
                className={`text-xs mt-1 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                البحث
              </span>
            </button>

            <button
              onClick={() => {
                setOpened(false);
                navigate("/bookings");
              }}
              className={`p-2 rounded-full flex flex-col items-center justify-center ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
              title="طلباتي"
            >
              <ClipboardList
                size={20}
                className={darkMode ? "text-white" : "text-gray-700"}
              />
              <span
                className={`text-xs mt-1 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                طلباتي
              </span>
            </button>

            <button
              onClick={() => {
                setOpened(false);
                navigate("/settings");
              }}
              className={`p-2 rounded-full flex flex-col items-center justify-center ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
              title="الإعدادات"
            >
              <Settings
                size={20}
                className={darkMode ? "text-white" : "text-gray-700"}
              />
              <span
                className={`text-xs mt-1 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                الإعدادات
              </span>
            </button>
          </div>

          {/* جسم المحادثة */}
          <div
            className={`h-[350px] overflow-y-auto p-4 ${
              darkMode ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message.text}
                isUser={message.isUser}
                darkMode={darkMode}
              />
            ))}

            {showSuggestions && (
              <QuickSuggestions
                suggestions={suggestions}
                onSelect={handleSelectSuggestion}
                darkMode={darkMode}
              />
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* مدخل الرسائل */}
          <div
            className={`p-3 ${darkMode ? "bg-gray-900" : "bg-white"} border-t ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t.placeholder}
                className={`flex-grow p-2 rounded-l-md ${
                  darkMode
                    ? "bg-gray-800 text-white border-gray-700"
                    : "bg-gray-100 text-gray-900 border-gray-300"
                } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                dir={language === "ar" ? "rtl" : "ltr"}
              />

              <button
                type="submit"
                className={`p-2 rounded-r-md mr-2 ${
                  darkMode
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-indigo-500 hover:bg-indigo-600"
                } text-white transition-colors`}
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SimpleChatbot;
