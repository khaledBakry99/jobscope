import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set) => ({
      darkMode: false,
      
      toggleDarkMode: () => set((state) => {
        const newDarkMode = !state.darkMode;
        
        // Apply dark mode to the document body
        if (newDarkMode) {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
        
        return { darkMode: newDarkMode };
      }),
      
      setDarkMode: (value) => set(() => {
        // Apply dark mode to the document body
        if (value) {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
        
        return { darkMode: value };
      }),
    }),
    {
      name: 'jobscope-theme-storage',
    }
  )
);

// Initialize dark mode based on stored preference
if (typeof window !== 'undefined') {
  const isDarkMode = useThemeStore.getState().darkMode;
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

export default useThemeStore;
