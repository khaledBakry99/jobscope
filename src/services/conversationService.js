/**
 * خدمة إدارة المحادثات
 * تستخدم لتتبع سياق المحادثة وحالتها
 */

// حالات المحادثة
export const CONVERSATION_STATES = {
  INITIAL: "initial", // حالة البداية
  SEARCHING: "searching", // البحث عن حرفي
  BOOKING: "booking", // حجز خدمة
  PROFILE: "profile", // عرض/تعديل الملف الشخصي
  REQUESTS: "requests", // عرض الطلبات
  SETTINGS: "settings", // الإعدادات
  HELP: "help", // المساعدة
};

/**
 * إنشاء محادثة جديدة
 * @returns {Object} - كائن المحادثة الجديدة
 */
export const createConversation = () => {
  return {
    id: generateId(),
    state: CONVERSATION_STATES.INITIAL,
    context: {},
    history: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * إضافة رسالة إلى المحادثة
 * @param {Object} conversation - كائن المحادثة
 * @param {Object} message - الرسالة المراد إضافتها
 * @returns {Object} - كائن المحادثة بعد التحديث
 */
export const addMessage = (conversation, message) => {
  const updatedConversation = {
    ...conversation,
    history: [...conversation.history, message],
    updatedAt: new Date(),
  };
  return updatedConversation;
};

/**
 * تحديث حالة المحادثة
 * @param {Object} conversation - كائن المحادثة
 * @param {string} state - الحالة الجديدة
 * @returns {Object} - كائن المحادثة بعد التحديث
 */
export const updateState = (conversation, state) => {
  return {
    ...conversation,
    state,
    updatedAt: new Date(),
  };
};

/**
 * تحديث سياق المحادثة
 * @param {Object} conversation - كائن المحادثة
 * @param {Object} context - السياق الجديد
 * @returns {Object} - كائن المحادثة بعد التحديث
 */
export const updateContext = (conversation, context) => {
  return {
    ...conversation,
    context: { ...conversation.context, ...context },
    updatedAt: new Date(),
  };
};

/**
 * الحصول على آخر رسالة من المستخدم
 * @param {Object} conversation - كائن المحادثة
 * @returns {Object|null} - آخر رسالة من المستخدم أو null إذا لم توجد
 */
export const getLastUserMessage = (conversation) => {
  const userMessages = conversation.history.filter((message) => message.isUser);
  return userMessages.length > 0 ? userMessages[userMessages.length - 1] : null;
};

/**
 * الحصول على آخر رسالة من البوت
 * @param {Object} conversation - كائن المحادثة
 * @returns {Object|null} - آخر رسالة من البوت أو null إذا لم توجد
 */
export const getLastBotMessage = (conversation) => {
  const botMessages = conversation.history.filter((message) => !message.isUser);
  return botMessages.length > 0 ? botMessages[botMessages.length - 1] : null;
};

/**
 * تحديد ما إذا كانت المحادثة نشطة
 * @param {Object} conversation - كائن المحادثة
 * @param {number} timeoutMinutes - مدة المهلة بالدقائق
 * @returns {boolean} - true إذا كانت المحادثة نشطة، false خلاف ذلك
 */
export const isConversationActive = (conversation, timeoutMinutes = 30) => {
  const now = new Date();
  const lastUpdate = new Date(conversation.updatedAt);
  const diffMs = now - lastUpdate;
  const diffMinutes = Math.floor(diffMs / 60000);
  return diffMinutes < timeoutMinutes;
};

/**
 * توليد معرف فريد للمحادثة
 * @returns {string} - معرف فريد
 */
const generateId = () => {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export default {
  createConversation,
  addMessage,
  updateState,
  updateContext,
  getLastUserMessage,
  getLastBotMessage,
  isConversationActive,
  CONVERSATION_STATES,
};
