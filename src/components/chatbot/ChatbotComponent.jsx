import React, { useState } from "react";
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";
import { MessageSquare, X } from "lucide-react";
import useThemeStore from "../../store/themeStore";
import useLanguageStore from "../../store/languageStore";
import botAvatar from "../../img/bot-avatar.svg";
import userAvatar from "../../img/user-avatar.svg";

// مكون للتعامل مع البحث عن الحرفيين
const SearchHandler = (props) => {
  const { steps, triggerNextStep } = props;
  const profession = steps.profession.value;

  return (
    <div className="p-2 bg-indigo-50 rounded-md border border-indigo-200 my-2">
      <p className="mb-2">
        سأساعدك في البحث عن <strong>{profession}</strong>.
      </p>
      <p>
        يمكنك الانتقال إلى{" "}
        <a href="/search" className="text-indigo-600 underline">
          صفحة البحث
        </a>{" "}
        واستخدام البحث الذكي بكتابة:
      </p>
      <p className="bg-white p-2 rounded my-2 text-indigo-700 font-bold">
        أريد {profession}
      </p>
      <button
        onClick={() => triggerNextStep()}
        className="bg-indigo-500 text-white px-3 py-1 rounded-md hover:bg-indigo-600 transition-colors mt-2"
      >
        حسناً، شكراً لك
      </button>
    </div>
  );
};

// مكون للتعامل مع الأسئلة الشائعة
const FAQHandler = (props) => {
  const { steps, triggerNextStep } = props;
  const question = steps.faq.value;
  let answer = "";

  // إجابات الأسئلة الشائعة
  switch (question) {
    case "1":
      answer =
        'يمكنك التسجيل كحرفي من خلال النقر على زر "تسجيل كحرفي" في الصفحة الرئيسية، ثم ملء النموذج بمعلوماتك الشخصية ومعلومات عملك.';
      break;
    case "2":
      answer =
        'يمكنك حجز خدمة من خلال البحث عن الحرفي المناسب، ثم النقر على زر "حجز" في صفحة الملف الشخصي للحرفي، وملء نموذج الحجز بالتفاصيل المطلوبة.';
      break;
    case "3":
      answer =
        'يمكنك تعديل معلومات ملفك الشخصي من خلال الانتقال إلى صفحة "الملف الشخصي" ثم النقر على زر "تعديل".';
      break;
    case "4":
      answer =
        'يمكنك تغيير كلمة المرور من خلال الانتقال إلى صفحة "الإعدادات" ثم النقر على زر "تغيير كلمة المرور".';
      break;
    case "5":
      answer =
        'يمكنك إلغاء طلب من خلال الانتقال إلى صفحة "طلباتي" ثم النقر على "عرض التفاصيل" للطلب المراد إلغاؤه، ثم النقر على زر "تعديل الطلب" ثم "الغاء الطلب" لكن لن يتم الغاء الطلب اذا مر على تقديم الطلب أكثر من "5 دقائق".';      break;
    default:
      answer = "عذراً، لم أفهم سؤالك. يرجى اختيار سؤال من القائمة.";
  }

  return (
    <div className="p-2 bg-indigo-50 rounded-md border border-indigo-200 my-2">
      <p className="mb-2">{answer}</p>
      <button
        onClick={() => triggerNextStep()}
        className="bg-indigo-500 text-white px-3 py-1 rounded-md hover:bg-indigo-600 transition-colors mt-2"
      >
        شكراً لك
      </button>
    </div>
  );
};

const ChatbotComponent = () => {
  const [opened, setOpened] = useState(false);
  const darkMode = useThemeStore((state) => state.darkMode);
  const language = useLanguageStore((state) => state.language);

  // تعريف سمة الشات بوت
  const theme = {
    background: darkMode ? "#1F2937" : "#FFFFFF",
    fontFamily: "Arial, sans-serif",
    headerBgColor: darkMode ? "#4338CA" : "#4F46E5",
    headerFontColor: "#FFFFFF",
    headerFontSize: "16px",
    botBubbleColor: darkMode ? "#4338CA" : "#6366F1",
    botFontColor: "#FFFFFF",
    userBubbleColor: darkMode ? "#374151" : "#F3F4F6",
    userFontColor: darkMode ? "#FFFFFF" : "#111827",
    bubbleOptionStyle: {
      background: darkMode ? "#374151" : "#F3F4F6",
      color: darkMode ? "#FFFFFF" : "#111827",
      borderRadius: "8px",
      padding: "8px 12px",
      border: darkMode ? "1px solid #4B5563" : "1px solid #E5E7EB",
      transition: "all 0.3s ease",
    },
    bubbleOptionHoverStyle: {
      background: darkMode ? "#4B5563" : "#E5E7EB",
      color: darkMode ? "#FFFFFF" : "#111827",
    },
  };

  // تعريف خطوات المحادثة
  const steps = [
    {
      id: "welcome",
      message: "مرحباً بك في منصة JobScope! كيف يمكنني مساعدتك اليوم؟",
      trigger: "options",
    },
    {
      id: "options",
      options: [
        { value: "search", label: "البحث عن حرفي", trigger: "search" },
        { value: "faq", label: "أسئلة شائعة", trigger: "faq_options" },
        { value: "contact", label: "التواصل مع الدعم", trigger: "contact" },
      ],
    },
    {
      id: "search",
      message: "ما هي المهنة التي تبحث عنها؟ (مثال: كهربائي، سباك، نجار، ...)",
      trigger: "profession",
    },
    {
      id: "profession",
      user: true,
      trigger: "search_handler",
    },
    {
      id: "search_handler",
      component: <SearchHandler />,
      waitAction: true,
      trigger: "anything_else",
    },
    {
      id: "faq_options",
      message: "اختر سؤالاً من الأسئلة الشائعة:",
      trigger: "faq_list",
    },
    {
      id: "faq_list",
      options: [
        { value: "1", label: "كيف يمكنني التسجيل كحرفي؟", trigger: "faq" },
        { value: "2", label: "كيف يمكنني حجز خدمة؟", trigger: "faq" },
        {
          value: "3",
          label: "كيف يمكنني تعديل معلومات ملفي الشخصي؟",
          trigger: "faq",
        },
        { value: "4", label: "كيف يمكنني تغيير كلمة المرور؟", trigger: "faq" },
        { value: "5", label: "كيف يمكنني إلغاء طلب؟", trigger: "faq" },
      ],
    },
    {
      id: "faq",
      component: <FAQHandler />,
      waitAction: true,
      trigger: "anything_else",
    },
    {
      id: "contact",
      message:
        "يمكنك التواصل مع فريق الدعم عبر البريد الإلكتروني: support@jobscope.com أو الاتصال على الرقم: +963 11 123 4567",
      trigger: "anything_else",
    },
    {
      id: "anything_else",
      message: "هل هناك شيء آخر يمكنني مساعدتك به؟",
      trigger: "anything_else_options",
    },
    {
      id: "anything_else_options",
      options: [
        { value: "yes", label: "نعم", trigger: "options" },
        { value: "no", label: "لا، شكراً", trigger: "end" },
      ],
    },
    {
      id: "end",
      message: "شكراً لاستخدامك منصة JobScope! نتمنى لك يوماً سعيداً.",
      end: true,
    },
  ];

  // تعريف النصوص حسب اللغة
  const texts = {
    ar: {
      title: "مساعد JobScope",
      placeholder: "اكتب رسالتك هنا...",
      buttonText: "إرسال",
    },
    en: {
      title: "JobScope Assistant",
      placeholder: "Type your message here...",
      buttonText: "Send",
    },
  };

  const t = texts[language];

  return (
    <>
      {/* زر فتح المحادثة */}
      {!opened && (
        <button
          onClick={() => setOpened(true)}
          className={`fixed bottom-6 left-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-[100] transition-all duration-300 hover:scale-110 ${
            darkMode
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-indigo-500 hover:bg-indigo-600"
          } animate-pulse`}
        >
          <MessageSquare size={24} className="text-white" />
        </button>
      )}

      {/* نافذة المحادثة */}
      {opened && (
        <div
          className={`fixed bottom-6 left-6 z-[100] shadow-xl rounded-lg overflow-hidden ${
            darkMode ? "border border-gray-700" : "border border-gray-200"
          } animate-fadeIn`}
        >
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={() => setOpened(false)}
              className="bg-gray-200 hover:bg-gray-300 rounded-full p-1 transition-colors"
            >
              <X size={20} className="text-gray-700" />
            </button>
          </div>
          <ThemeProvider theme={theme}>
            <ChatBot
              steps={steps}
              headerTitle={t.title}
              placeholder={t.placeholder}
              submitButtonLabel={t.buttonText}
              width="350px"
              height="500px"
              enableSmoothScroll={true}
              hideUserAvatar={true}
              botAvatar={botAvatar}
              userAvatar={userAvatar}
              floating={false}
              enableMobileAutoFocus={true}
              style={{
                direction: language === "ar" ? "rtl" : "ltr",
              }}
            />
          </ThemeProvider>
        </div>
      )}
    </>
  );
};

export default ChatbotComponent;
