
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProductShowcase from '@/components/ProductShowcase';
import ServicesOverview from '@/components/ServicesOverview';
import TrustIndicators from '@/components/TrustIndicators';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <ProductShowcase />
      <ServicesOverview />
      <TrustIndicators />
      <Footer />
    </div>
  );
};

export default Index;
