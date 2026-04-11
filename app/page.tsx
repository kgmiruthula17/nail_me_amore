import HeroSection from "./components/HeroSection";
import FeaturedProducts from "./components/FeaturedProducts";
import WhyChooseUs from "./components/WhyChooseUs";
import Testimonials from "./components/Testimonials";
import CTASection from "./components/CTASection";
import CustomNailSection from "./components/CustomNailSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <CustomNailSection />
      <WhyChooseUs />
      <Testimonials />
      <CTASection />
    </>
  );
}