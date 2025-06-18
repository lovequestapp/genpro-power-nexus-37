import { Suspense } from 'react';
import HeroSection from '../components/HeroSection';
import ProductShowcase from '../components/ProductShowcase';
import QualityGuarantee from '../components/QualityGuarantee';
import WhyChooseUs from '../components/WhyChooseUs';
import ProcessShowcase from '../components/ProcessShowcase';

const Home = () => {
  return (
    <div>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <HeroSection />
        <ProductShowcase />
        <QualityGuarantee />
        <WhyChooseUs />
        <ProcessShowcase />
      </Suspense>
    </div>
  );
};

export default Home;
