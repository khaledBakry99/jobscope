// نظرًا لوجود مشكلة في الاتصال بـ Mailgun، سنستخدم محاكاة للإرسال لأغراض الاختبار

const mailgunService = {
  /**
   * محاكاة إرسال بريد إلكتروني للتحقق
   * @param {string} email - البريد الإلكتروني للمستلم
   * @param {string} verificationCode - رمز التحقق
   * @returns {Promise<Object>} - نتيجة الإرسال
   */
  sendVerificationEmail: async (email, verificationCode) => {
    try {
      console.log(`محاكاة إرسال بريد التحقق إلى ${email} مع الرمز ${verificationCode}`);

      // محاكاة تأخير الشبكة
      await new Promise(resolve => setTimeout(resolve, 1500));

      // عرض الرمز في وحدة التحكم للاختبار
      console.log(`رمز التحقق للبريد ${email} هو: ${verificationCode}`);

      // في بيئة الإنتاج، سنستخدم خدمة بريد حقيقية هنا

      return {
        success: true,
        message: 'تم إرسال رمز التحقق بنجاح (وضع المحاكاة)',
        // في وضع المحاكاة، نعرض الرمز في الواجهة للتسهيل على المستخدم
        mockCode: verificationCode
      };
    } catch (error) {
      console.error('خطأ في إرسال بريد التحقق:', error);
      return {
        success: false,
        message: 'فشل في إرسال رمز التحقق',
        error: error.message
      };
    }
  },

  /**
   * Generar código de verificación aleatorio de 6 dígitos
   * @returns {string} - Código de verificación
   */
  generateVerificationCode: () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
};

export default mailgunService;
