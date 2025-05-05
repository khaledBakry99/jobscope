import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useLanguageStore = create(
  persist(
    (set) => ({
      language: 'ar', // Default language is Arabic
      
      setLanguage: (lang) => set({
        language: lang,
      }),
    }),
    {
      name: 'jobscope-language-storage',
    }
  )
);

export default useLanguageStore;
