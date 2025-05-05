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
  Brain,
  Sparkles,
  HelpCircle,
  List,
} from "lucide-react";
import useThemeStore from "../../store/themeStore";
import useLanguageStore from "../../store/languageStore";
import useUserStore from "../../store/userStore";
import { useNavigate } from "react-router-dom";
import {
  analyzeIntent,
  analyzeContext,
  generateResponse,
} from "../../services/advancedNlpService";
import { predictIntent } from "../../services/intentClassifierService";
import conversationService from "../../services/conversationService";
import FrequentlyAskedQuestions from "./FrequentlyAskedQuestions";

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
  "كيف يمكنني تقييم خدمة؟":
    'يمكنك تقييم خدمة بعد اكتمالها من خلال الانتقال إلى صفحة "طلباتي" ثم النقر على "عرض التفاصيل" للطلب المكتمل، ثم النقر على زر "تقييم الخدمة" وملء نموذج التقييم.',
  "كيف يمكنني البحث عن حرفي؟":
    'يمكنك البحث عن حرفي من خلال الانتقال إلى صفحة "البحث" واستخدام خيارات البحث المختلفة مثل المهنة والموقع والتقييم.',
  "كيف يمكنني التواصل مع الدعم؟":
    "يمكنك التواصل مع فريق الدعم عبر البريد الإلكتروني: support@jobscope.com أو الاتصال على الرقم: +963 11 123 4567",
  "ما هي مواعيد العمل؟":
    "يمكنك استخدام المنصة على مدار الساعة، أما مواعيد عمل فريق الدعم فهي من الساعة 9 صباحاً حتى 5 مساءً من الأحد إلى الخميس.",
  "هل يمكنني استخدام المنصة بدون تسجيل؟":
    "يمكنك تصفح المنصة والبحث عن الحرفيين بدون تسجيل، ولكن يجب عليك إنشاء حساب لحجز خدمة أو التواصل مع الحرفيين.",
  "كيف يمكنني تغيير رقم هاتفي؟":
    'يمكنك تغيير رقم هاتفك من خلال الانتقال إلى صفحة "الملف الشخصي" ثم النقر على زر "تعديل"، ثم تغيير رقم الهاتف في الحقل المخصص والنقر على "حفظ".',
  "كيف يمكنني تغيير بريدي الإلكتروني؟":
    'يمكنك تغيير بريدك الإلكتروني من خلال الانتقال إلى صفحة "الملف الشخصي" ثم النقر على زر "تعديل"، ثم تغيير البريد الإلكتروني في الحقل المخصص والنقر على "حفظ".',
  "كيف يمكنني تغيير صورتي الشخصية؟":
    'يمكنك تغيير صورتك الشخصية من خلال الانتقال إلى صفحة "الملف الشخصي" ثم النقر على زر "تعديل"، ثم النقر على الصورة الحالية واختيار صورة جديدة.',
  "كيف يمكنني تفعيل الوضع المظلم؟":
    'يمكنك تفعيل الوضع المظلم من خلال النقر على أيقونة القمر في الشريط العلوي للموقع، أو من خلال الانتقال إلى صفحة "الإعدادات" وتفعيل خيار "الوضع المظلم".',
  "كيف يمكنني تغيير اللغة؟":
    'يمكنك تغيير لغة الموقع من خلال النقر على أيقونة اللغة في الشريط العلوي للموقع، أو من خلال الانتقال إلى صفحة "الإعدادات" واختيار اللغة المفضلة لديك.',
  "كيف يمكنني معرفة حالة طلبي؟":
    'يمكنك معرفة حالة طلبك من خلال الانتقال إلى صفحة "طلباتي" حيث ستجد قائمة بجميع طلباتك وحالة كل طلب (قيد الانتظار، مقبول، مكتمل، ملغي).',
  "كيف يمكنني تعديل طلب؟":
    'يمكنك تعديل طلب من خلال الانتقال إلى صفحة "طلباتي" ثم النقر على "عرض التفاصيل" للطلب المراد تعديله، ثم النقر على زر "تعديل الطلب". يمكنك تعديل الطلب فقط إذا كان في حالة "قيد الانتظار" ولم يمر على تقديمه أكثر من 5 دقائق.',
  "ما هي مدة الانتظار للحصول على رد؟":
    "تختلف مدة الانتظار للحصول على رد من الحرفي حسب توفره وجدول أعماله. عادةً ما يتم الرد على الطلبات خلال ساعات قليلة إلى يوم كامل.",
  "هل يمكنني حجز أكثر من خدمة في نفس الوقت؟":
    "نعم، يمكنك حجز أكثر من خدمة في نفس الوقت من حرفيين مختلفين أو من نفس الحرفي في أوقات مختلفة.",
  "كيف يمكنني الاتصال بالحرفي؟":
    'يمكنك الاتصال بالحرفي بعد قبوله لطلبك من خلال الانتقال إلى صفحة "طلباتي" ثم النقر على "عرض التفاصيل" للطلب المقبول، حيث ستجد معلومات الاتصال بالحرفي.',
  "هل هناك رسوم لاستخدام المنصة؟":
    "لا، استخدام منصة JobScope مجاني تماماً لطالبي الخدمة. يتم دفع رسوم الخدمة مباشرة للحرفي حسب الاتفاق بينكما.",
};

// قائمة الاقتراحات السريعة
const quickSuggestions = [
  "كيف يمكنني التسجيل كحرفي؟",
  "كيف يمكنني حجز خدمة؟",
  "كيف يمكنني تعديل معلومات ملفي الشخصي؟",
  "كيف يمكنني تغيير كلمة المرور؟",
  "كيف يمكنني إلغاء طلب؟",
];

// مكون الرسالة
const ChatMessage = ({ message, isUser, darkMode, isThinking }) => {
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
          } ${isThinking ? "animate-pulse" : ""}`}
        >
          {isThinking ? (
            <div className="flex items-center">
              <span>جاري التفكير</span>
              <div className="ml-2 flex space-x-1">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          ) : (
            message
          )}
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

// المكون الرئيسي للشات بوت المتقدم
const AdvancedChatbot = () => {
  const [opened, setOpened] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState(quickSuggestions);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [modelInitialized, setModelInitialized] = useState(false);
  const [isInitializingModel, setIsInitializingModel] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const darkMode = useThemeStore((state) => state.darkMode);
  const language = useLanguageStore((state) => state.language);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  // إنشاء محادثة جديدة عند فتح الشات بوت
  useEffect(() => {
    if (opened && !conversation) {
      const newConversation = conversationService.createConversation();
      setConversation(newConversation);
    }
  }, [opened, conversation]);

  // التمرير إلى آخر رسالة
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // إضافة رسالة ترحيبية عند فتح الشات (فقط إذا لم يتم تهيئة النموذج)
  useEffect(() => {
    if (opened && messages.length === 0 && modelInitialized) {
      const welcomeMessage = {
        text:
          "مرحباً بك في منصة JobScope! أنا المساعد الذكي الخاص بك. كيف يمكنني مساعدتك اليوم؟",
        isUser: false,
      };

      setMessages([welcomeMessage]);

      if (conversation) {
        const updatedConversation = conversationService.addMessage(
          conversation,
          welcomeMessage
        );
        setConversation(updatedConversation);
      }
    } else if (
      opened &&
      messages.length === 0 &&
      !modelInitialized &&
      !isInitializingModel
    ) {
      // إذا لم يتم تهيئة النموذج بعد، نضيف رسالة بسيطة
      const simpleWelcomeMessage = {
        text:
          "مرحباً بك في منصة JobScope! جاري تحميل المساعد الذكي... هذا التحميل يحدث مرة واحدة فقط عند أول استخدام، وفي المرات القادمة سيكون المساعد جاهزاً فوراً.",
        isUser: false,
      };

      setMessages([simpleWelcomeMessage]);
    }

    if (opened) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [
    opened,
    conversation,
    messages.length,
    modelInitialized,
    isInitializingModel,
  ]);

  // التمرير إلى آخر رسالة عند إضافة رسالة جديدة
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // تهيئة نموذج التعرف على النوايا عند فتح الشات بوت
  useEffect(() => {
    // تهيئة النموذج فقط عند فتح الشات بوت وإذا لم يتم تهيئته من قبل
    if (opened && !modelInitialized && !isInitializingModel) {
      const initModel = async () => {
        try {
          setIsInitializingModel(true);
          console.log("جاري تهيئة نموذج التعرف على النوايا...");

          // إضافة رسالة تحميل للمستخدم
          const loadingMessage = {
            text:
              "جاري تحميل القدرات الذكية... سأكون جاهزًا للمساعدة خلال لحظات.",
            isUser: false,
          };
          setMessages((prev) => [...prev, loadingMessage]);

          // تهيئة النموذج
          await predictIntent("مرحبا");

          setModelInitialized(true);
          console.log("تم تهيئة نموذج التعرف على النوايا بنجاح");

          // إزالة رسالة التحميل وإضافة رسالة الترحيب
          setMessages([
            {
              text:
                "مرحباً بك في منصة JobScope! أنا المساعد الذكي الخاص بك. كيف يمكنني مساعدتك اليوم؟",
              isUser: false,
            },
          ]);
        } catch (error) {
          console.error("خطأ في تهيئة نموذج التعرف على النوايا:", error);

          // إضافة رسالة خطأ للمستخدم
          setMessages((prev) => [
            ...prev.filter(
              (msg) => !msg.text.includes("جاري تحميل القدرات الذكية")
            ),
            {
              text:
                "مرحباً بك! يمكنني مساعدتك بالإجابة على الأسئلة الشائعة. بعض الميزات المتقدمة قد لا تكون متاحة حاليًا.",
              isUser: false,
            },
          ]);
        } finally {
          setIsInitializingModel(false);
        }
      };

      initModel();
    }
  }, [opened, modelInitialized, isInitializingModel]);

  // إرسال رسالة
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // إضافة رسالة المستخدم
    const userMessage = { text: inputValue, isUser: true };
    const userInput = inputValue; // حفظ قيمة الإدخال قبل إعادة تعيينها
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setShowSuggestions(false);
    setIsThinking(true);

    // تحديث المحادثة
    if (conversation) {
      const updatedConversation = conversationService.addMessage(
        conversation,
        userMessage
      );
      setConversation(updatedConversation);
    }

    // معالجة الرسالة وإضافة رد البوت
    setTimeout(async () => {
      try {
        // البحث في قاعدة بيانات الأسئلة الشائعة أولاً
        let botResponse = null;
        let bestMatchScore = 0;
        let bestMatchAnswer = null;

        // تحويل النص إلى أحرف صغيرة وإزالة علامات الترقيم للمقارنة
        const normalizedInput = userInput.trim().replace(/[؟.,!]/g, "");

        for (const [question, answer] of Object.entries(faqDatabase)) {
          // تحويل السؤال إلى أحرف صغيرة وإزالة علامات الترقيم للمقارنة
          const normalizedQuestion = question.trim().replace(/[؟.,!]/g, "");

          // المطابقة المباشرة
          if (normalizedInput === normalizedQuestion) {
            botResponse = { text: answer, isUser: false };
            break;
          }

          // المطابقة الجزئية
          if (
            normalizedInput.includes(normalizedQuestion) ||
            normalizedQuestion.includes(normalizedInput)
          ) {
            // حساب درجة التطابق بناءً على طول النص المشترك
            const matchLength = Math.min(
              normalizedInput.length,
              normalizedQuestion.length
            );
            const score =
              matchLength /
              Math.max(normalizedInput.length, normalizedQuestion.length);

            if (score > bestMatchScore) {
              bestMatchScore = score;
              bestMatchAnswer = answer;
            }
          }
        }

        // إذا لم يتم العثور على مطابقة مباشرة ولكن هناك مطابقة جزئية جيدة
        if (!botResponse && bestMatchScore > 0.7) {
          botResponse = { text: bestMatchAnswer, isUser: false };
        }

        // إذا لم يتم العثور على إجابة في قاعدة البيانات، استخدم الذكاء الاصطناعي
        if (!botResponse) {
          // تحليل النية باستخدام الخدمة المتقدمة
          const intentAnalysis = analyzeIntent(userInput);

          // تحسين التحليل باستخدام سياق المحادثة
          const contextAnalysis = analyzeContext(messages, intentAnalysis);

          // استخدام نموذج التعرف على النوايا للتحقق (فقط إذا تم تهيئة النموذج)
          const tfPrediction = modelInitialized
            ? await predictIntent(userInput)
            : { intent: "unknown", confidence: 0 };

          // دمج النتائج (استخدام النتيجة ذات الثقة الأعلى)
          const finalAnalysis =
            tfPrediction.confidence > contextAnalysis.confidence
              ? {
                  ...contextAnalysis,
                  intent: tfPrediction.intent,
                  confidence: tfPrediction.confidence,
                }
              : contextAnalysis;

          // توليد الرد المناسب
          const response = generateResponse(finalAnalysis);

          botResponse = { text: response.text, isUser: false };
          setSuggestions(response.suggestions);

          // تحديث حالة المحادثة
          if (conversation) {
            const updatedState = conversationService.updateState(
              conversation,
              finalAnalysis.intent
            );
            const updatedContext = conversationService.updateContext(
              updatedState,
              {
                lastIntent: finalAnalysis.intent,
                profession: finalAnalysis.profession,
                city: finalAnalysis.city,
                hospital: finalAnalysis.hospital,
                mosque: finalAnalysis.mosque,
              }
            );
            setConversation(updatedContext);
          }
        }

        setIsThinking(false);
        setMessages((prev) => [...prev, botResponse]);
        setShowSuggestions(true);

        // تحديث المحادثة
        if (conversation) {
          const updatedConversation = conversationService.addMessage(
            conversation,
            botResponse
          );
          setConversation(updatedConversation);
        }
      } catch (error) {
        console.error("خطأ في معالجة الرسالة:", error);
        setIsThinking(false);
        setMessages((prev) => [
          ...prev,
          {
            text:
              "عذراً، حدث خطأ أثناء معالجة رسالتك. الرجاء المحاولة مرة أخرى.",
            isUser: false,
          },
        ]);
        setShowSuggestions(true);
      }
    }, 1000);
  };

  // معالجة اختيار سؤال من الأسئلة الشائعة
  const handleSelectFAQ = (question) => {
    // إغلاق قسم الأسئلة الشائعة
    setShowFAQ(false);

    // إضافة السؤال كرسالة من المستخدم
    const userMessage = { text: question, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setIsThinking(true);

    // تحديث المحادثة
    if (conversation) {
      const updatedConversation = conversationService.addMessage(
        conversation,
        userMessage
      );
      setConversation(updatedConversation);
    }

    // البحث عن الإجابة في قاعدة بيانات الأسئلة الشائعة
    let answer = null;
    for (const [faqQuestion, faqAnswer] of Object.entries(faqDatabase)) {
      if (faqQuestion === question) {
        answer = faqAnswer;
        break;
      }
    }

    // إضافة الإجابة كرسالة من البوت
    setTimeout(() => {
      const botMessage = {
        text: answer || "عذراً، لم أتمكن من العثور على إجابة لهذا السؤال.",
        isUser: false,
      };

      setIsThinking(false);
      setMessages((prev) => [...prev, botMessage]);
      setShowSuggestions(true);

      // تحديث المحادثة
      if (conversation) {
        const updatedConversation = conversationService.addMessage(
          conversation,
          botMessage
        );
        setConversation(updatedConversation);
      }
    }, 500);
  };

  // اختيار اقتراح
  const handleSelectSuggestion = (suggestion) => {
    setShowSuggestions(false);

    // إضافة رسالة المستخدم
    const userMessage = { text: suggestion, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setIsThinking(true);

    // تحديث المحادثة
    if (conversation) {
      const updatedConversation = conversationService.addMessage(
        conversation,
        userMessage
      );
      setConversation(updatedConversation);
    }

    // معالجة الرسالة وإضافة رد البوت
    setTimeout(async () => {
      try {
        // البحث في قاعدة بيانات الأسئلة الشائعة أولاً
        let botResponse = null;
        let bestMatchScore = 0;
        let bestMatchAnswer = null;

        // تحويل النص إلى أحرف صغيرة وإزالة علامات الترقيم للمقارنة
        const normalizedInput = suggestion.trim().replace(/[؟.,!]/g, "");

        for (const [question, answer] of Object.entries(faqDatabase)) {
          // تحويل السؤال إلى أحرف صغيرة وإزالة علامات الترقيم للمقارنة
          const normalizedQuestion = question.trim().replace(/[؟.,!]/g, "");

          // المطابقة المباشرة
          if (normalizedInput === normalizedQuestion) {
            botResponse = { text: answer, isUser: false };
            break;
          }

          // المطابقة الجزئية
          if (
            normalizedInput.includes(normalizedQuestion) ||
            normalizedQuestion.includes(normalizedInput)
          ) {
            // حساب درجة التطابق بناءً على طول النص المشترك
            const matchLength = Math.min(
              normalizedInput.length,
              normalizedQuestion.length
            );
            const score =
              matchLength /
              Math.max(normalizedInput.length, normalizedQuestion.length);

            if (score > bestMatchScore) {
              bestMatchScore = score;
              bestMatchAnswer = answer;
            }
          }
        }

        // إذا لم يتم العثور على مطابقة مباشرة ولكن هناك مطابقة جزئية جيدة
        if (!botResponse && bestMatchScore > 0.7) {
          botResponse = { text: bestMatchAnswer, isUser: false };
        }

        // إذا لم يتم العثور على إجابة في قاعدة البيانات، استخدم الذكاء الاصطناعي
        if (!botResponse) {
          // تحليل النية باستخدام الخدمة المتقدمة
          const intentAnalysis = analyzeIntent(suggestion);

          // تحسين التحليل باستخدام سياق المحادثة
          const contextAnalysis = analyzeContext(messages, intentAnalysis);

          // استخدام نموذج التعرف على النوايا للتحقق (فقط إذا تم تهيئة النموذج)
          const tfPrediction = modelInitialized
            ? await predictIntent(suggestion)
            : { intent: "unknown", confidence: 0 };

          // دمج النتائج (استخدام النتيجة ذات الثقة الأعلى)
          const finalAnalysis =
            tfPrediction.confidence > contextAnalysis.confidence
              ? {
                  ...contextAnalysis,
                  intent: tfPrediction.intent,
                  confidence: tfPrediction.confidence,
                }
              : contextAnalysis;

          // توليد الرد المناسب
          const response = generateResponse(finalAnalysis);

          botResponse = { text: response.text, isUser: false };
          setSuggestions(response.suggestions);

          // تحديث حالة المحادثة
          if (conversation) {
            const updatedState = conversationService.updateState(
              conversation,
              finalAnalysis.intent
            );
            const updatedContext = conversationService.updateContext(
              updatedState,
              {
                lastIntent: finalAnalysis.intent,
                profession: finalAnalysis.profession,
                city: finalAnalysis.city,
                hospital: finalAnalysis.hospital,
                mosque: finalAnalysis.mosque,
              }
            );
            setConversation(updatedContext);
          }
        }

        setIsThinking(false);
        setMessages((prev) => [...prev, botResponse]);
        setShowSuggestions(true);

        // تحديث المحادثة
        if (conversation) {
          const updatedConversation = conversationService.addMessage(
            conversation,
            botResponse
          );
          setConversation(updatedConversation);
        }
      } catch (error) {
        console.error("خطأ في معالجة الرسالة:", error);
        setIsThinking(false);
        setMessages((prev) => [
          ...prev,
          {
            text:
              "عذراً، حدث خطأ أثناء معالجة رسالتك. الرجاء المحاولة مرة أخرى.",
            isUser: false,
          },
        ]);
        setShowSuggestions(true);
      }
    }, 1000);
  };

  // النصوص حسب اللغة
  const texts = {
    ar: {
      title: "مساعدك   JobScope الذكي",
      placeholder: "اكتب رسالتك هنا...",
      send: "إرسال",
    },
    en: {
      title: "JobScope AI Assistant",
      placeholder: "Type your message here...",
      send: "Send",
    },
  };

  const t = texts[language];

  // لا يظهر الشات بوت إذا لم يكن المستخدم مسجل الدخول
  if (!isAuthenticated) return null;

  return (
    <>
      {/* طبقة تغطية الصفحة أثناء تحميل النموذج */}
      {opened && isInitializingModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[200] cursor-not-allowed flex items-center justify-center">
          <div
            className={`${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            } p-6 rounded-lg shadow-xl flex flex-col items-center`}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-lg font-semibold">جاري تحميل المساعد الذكي...</p>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-500"
              } mt-2`}
            >
              يرجى الانتظار قليلاً
            </p>
            <p
              className={`text-xs ${
                darkMode ? "text-gray-400" : "text-gray-600"
              } mt-3 text-center max-w-xs`}
            >
              هذا التحميل يحدث فقط عند أول استخدام للمساعد الذكي. في المرات
              القادمة، سيظهر المساعد فوراً دون انتظار.
            </p>
          </div>
        </div>
      )}

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
          <div className="relative">
            <BotMessageSquare size={24} className="text-white" />
            <div className="absolute -top-1 -right-1">
              <Sparkles
                size={12}
                className="text-yellow-300 animate-sparkle-spin"
              />
            </div>
          </div>
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
            <div className="flex items-center">
              <Brain size={18} className="mr-2 text-yellow-300" />
              <h3 className="font-bold">{t.title}</h3>
            </div>
            <div className="flex items-center">
              {/* زر الأسئلة الشائعة */}
              <button
                onClick={() => setShowFAQ(!showFAQ)}
                className={`hover:bg-indigo-800 rounded-full p-1 transition-colors mr-1 ${
                  showFAQ ? "bg-indigo-800" : ""
                }`}
                title={showFAQ ? "العودة إلى المحادثة" : "الأسئلة الشائعة"}
              >
                {showFAQ ? (
                  <MessageCircle size={20} className="text-white" />
                ) : (
                  <HelpCircle size={20} className="text-white" />
                )}
              </button>
              {/* زر الإغلاق */}
              <button
                onClick={() => setOpened(false)}
                className="hover:bg-indigo-800 rounded-full p-1 transition-colors"
                title="إغلاق"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
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
            {!showFAQ ? (
              // عرض المحادثة
              <>
                {messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    message={message.text}
                    isUser={message.isUser}
                    darkMode={darkMode}
                  />
                ))}

                {isThinking && (
                  <ChatMessage
                    message=""
                    isUser={false}
                    darkMode={darkMode}
                    isThinking={true}
                  />
                )}

                {showSuggestions && !isThinking && !isInitializingModel && (
                  <QuickSuggestions
                    suggestions={suggestions}
                    onSelect={handleSelectSuggestion}
                    darkMode={darkMode}
                  />
                )}

                {isInitializingModel && (
                  <div
                    className={`flex items-center justify-center p-4 ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mb-2"></div>
                      <p className="text-sm">جاري تحميل القدرات الذكية...</p>
                      <p className="text-xs mt-2 text-center max-w-xs opacity-80">
                        هذا التحميل يحدث مرة واحدة فقط. في المرات القادمة، سيكون
                        المساعد جاهزاً فوراً.
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // عرض الأسئلة الشائعة
              <FrequentlyAskedQuestions
                darkMode={darkMode}
                onSelectQuestion={handleSelectFAQ}
              />
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* مدخل الرسائل - يظهر فقط في وضع المحادثة */}
          {!showFAQ && (
            <div
              className={`p-3 ${
                darkMode ? "bg-gray-900" : "bg-white"
              } border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}
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
                  placeholder={
                    isInitializingModel
                      ? "جاري تحميل المساعد الذكي..."
                      : t.placeholder
                  }
                  className={`flex-grow p-2 rounded-l-md ${
                    darkMode
                      ? "bg-gray-800 text-white border-gray-700"
                      : "bg-gray-100 text-gray-900 border-gray-300"
                  } border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isInitializingModel ? "opacity-70" : ""
                  }`}
                  dir={language === "ar" ? "rtl" : "ltr"}
                  disabled={isThinking || isInitializingModel}
                />

                <button
                  type="submit"
                  className={`p-2 rounded-r-md mr-2 ${
                    darkMode
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-indigo-500 hover:bg-indigo-600"
                  } text-white transition-colors ${
                    isThinking || isInitializingModel
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={isThinking || isInitializingModel}
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AdvancedChatbot;
