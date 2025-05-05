import React from "react";
import useThemeStore from "../../store/themeStore";

// استيراد المكونات بشكل مباشر (بدون Lazy Loading)
import HeroSection from "./components/HeroSection";
import ProfessionsSection from "./components/ProfessionsSection";
import StatsSection from "./components/StatsSection";
import HowItWorksSection from "./components/HowItWorksSection";
import CTASection from "./components/CTASection";
import WelcomeFooter from "./components/WelcomeFooter";

const WelcomePage = () => {
  const darkMode = useThemeStore((state) => state.darkMode);

  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <ProfessionsSection />
      <StatsSection />
      <HowItWorksSection />
      <CTASection />
      <WelcomeFooter />
    </div>
  );
};

export default WelcomePage;
