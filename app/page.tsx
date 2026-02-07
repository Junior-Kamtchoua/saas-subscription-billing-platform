import Header from "../components/Header";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import PricingSection from "../components/landing/PricingSection";
import FinalCTA from "../components/landing/FinalCTA";
import Footer from "../components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <FinalCTA />
      <Footer />
    </>
  );
}
