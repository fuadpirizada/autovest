import React from "react";
import HeroSection from "@/components/home/hero-section";
import FeaturesSection from "@/components/home/features-section";
import PackagesSection from "@/components/home/packages-section";
import CalculatorSection from "@/components/home/calculator-section";
import DashboardPreview from "@/components/home/dashboard-preview";

const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <PackagesSection />
      <CalculatorSection />
      <DashboardPreview />
    </div>
  );
};

export default HomePage;
