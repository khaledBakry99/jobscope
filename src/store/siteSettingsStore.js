import { create } from "zustand";
import { persist } from "zustand/middleware";

const useSiteSettingsStore = create(
  persist(
    (set) => ({
      siteSettings: {
        siteName: "JobScope",
        siteDescription: "منصة للربط بين طالبي الخدمة والحرفيين",
        siteEmail: "info@jobscope.com",
        siteLogo: "/img/Favicon/favicon-96x96.png",
        sitePhone: "+963 912 345 678",
        siteAddress: "دمشق، سوريا",
        siteWorkingHours: "24/7",
      },
      updateSiteSettings: (newSettings) =>
        set((state) => ({
          siteSettings: { ...state.siteSettings, ...newSettings },
        })),
      updateSingleSetting: (key, value) =>
        set((state) => ({
          siteSettings: { ...state.siteSettings, [key]: value },
        })),
    }),
    {
      name: "site-settings-storage",
    }
  )
);

export default useSiteSettingsStore;
