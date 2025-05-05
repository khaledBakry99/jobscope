import { useMemo } from 'react';
import useLanguageStore from '../store/languageStore';
import commonTranslations from '../translations/commonTranslations';
import settingsTranslations from '../translations/settingsTranslations';

// مجموعة الترجمات المتاحة
const translations = {
  common: commonTranslations,
  settings: settingsTranslations,
  // يمكن إضافة المزيد من ملفات الترجمة هنا
};

/**
 * Hook للترجمة يسمح باستخدام الترجمات في أي مكون
 * @param {string} namespace - اسم مجموعة الترجمة (common, settings, etc.)
 * @returns {object} - كائن يحتوي على دالة الترجمة t ومعلومات اللغة الحالية
 */
const useTranslation = (namespace = 'common') => {
  const language = useLanguageStore((state) => state.language);
  
  // الحصول على مجموعة الترجمات المطلوبة
  const translationSet = useMemo(() => {
    return translations[namespace] || commonTranslations;
  }, [namespace]);
  
  // الحصول على الترجمات للغة الحالية
  const currentTranslations = useMemo(() => {
    return translationSet[language] || translationSet.ar;
  }, [translationSet, language]);
  
  // دالة الترجمة
  const t = (key) => {
    return currentTranslations[key] || key;
  };
  
  return {
    t,
    language,
    isRTL: language === 'ar',
    isLTR: language === 'en'
  };
};

export default useTranslation;
