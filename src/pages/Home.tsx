import { Suspense } from 'react';
import SEO from '../components/SEO';
import HeroSection from '../components/HeroSection';
import ProductShowcase from '../components/ProductShowcase';
import QualityGuarantee from '../components/QualityGuarantee';
import WhyChooseUs from '../components/WhyChooseUs';
import ProcessShowcase from '../components/ProcessShowcase';

const Home = () => {
  return (
    <div>
      <SEO 
        title="Houston Generator Installation & Sales | HOU GEN PROS | Generac Authorized Dealer"
        description="Houston's #1 Generac generator installation company. Professional whole home backup power solutions, emergency generators, and 24/7 service. Licensed, insured, and trusted by 500+ Houston homeowners. Same-day installation available."
        keywords="Houston generators, Generac installation Houston, whole home backup power Houston, emergency generators Houston, generator installation Texas, Houston power outage solutions, residential generators Houston, commercial generators Houston, standby generators Houston, portable generators Houston, generator repair Houston, generator maintenance Houston, backup power Houston, power outage protection Houston"
        canonical="/"
        pageType="website"
        schema={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "HOU GEN PROS",
          "description": "Houston's premier generator installation and sales company specializing in Generac whole home backup power solutions",
          "url": "https://www.hougenpros.com",
          "telephone": "+1-281-XXX-XXXX",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Houston",
            "addressRegion": "TX",
            "addressCountry": "US"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 29.7604,
            "longitude": -95.3698
          },
          "openingHours": "Mo-Su 00:00-23:59",
          "serviceArea": [
            {"@type": "City", "name": "Houston"},
            {"@type": "City", "name": "Katy"},
            {"@type": "City", "name": "Sugar Land"},
            {"@type": "City", "name": "The Woodlands"},
            {"@type": "City", "name": "Spring"},
            {"@type": "City", "name": "Cypress"},
            {"@type": "City", "name": "Pearland"},
            {"@type": "City", "name": "League City"},
            {"@type": "City", "name": "Baytown"},
            {"@type": "City", "name": "Pasadena"},
            {"@type": "City", "name": "Conroe"},
            {"@type": "City", "name": "Tomball"},
            {"@type": "City", "name": "Magnolia"},
            {"@type": "City", "name": "Richmond"},
            {"@type": "City", "name": "Rosenberg"},
            {"@type": "City", "name": "Missouri City"},
            {"@type": "City", "name": "Stafford"},
            {"@type": "City", "name": "Bellaire"},
            {"@type": "City", "name": "West University Place"},
            {"@type": "City", "name": "Memorial"},
            {"@type": "City", "name": "River Oaks"},
            {"@type": "City", "name": "Heights"},
            {"@type": "City", "name": "Montrose"},
            {"@type": "City", "name": "Midtown"},
            {"@type": "City", "name": "Downtown Houston"}
          ],
          "priceRange": "$$",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5.0",
            "reviewCount": "500"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Generator Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Generac Generator Installation",
                  "description": "Professional whole home backup power installation"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Emergency Generator Service",
                  "description": "24/7 emergency generator repair and maintenance"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Generator Maintenance",
                  "description": "Regular maintenance and service for all generator brands"
                }
              }
            ]
          },
          "sameAs": [
            "https://www.facebook.com/hougenpros",
            "https://www.linkedin.com/company/hougenpros",
            "https://www.instagram.com/hougenpros"
          ]
        }}
      />
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
