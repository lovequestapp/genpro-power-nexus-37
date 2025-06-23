import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  schema?: object;
  pageType?: 'website' | 'article' | 'product' | 'service';
  serviceArea?: string[];
  phoneNumber?: string;
  address?: {
    street?: string;
    city: string;
    state: string;
    zipCode?: string;
  };
}

const SEO = ({ 
  title, 
  description, 
  keywords, 
  canonical, 
  ogImage = "/lovable-uploads/88ddb435-9c39-49ed-a7b8-65d77830affa.png",
  schema,
  pageType = 'website',
  serviceArea = ['Houston', 'Katy', 'Sugar Land', 'The Woodlands', 'Spring', 'Cypress', 'Pearland', 'League City', 'Baytown', 'Pasadena', 'Conroe', 'Tomball', 'Magnolia', 'Richmond', 'Rosenberg', 'Missouri City', 'Stafford', 'Bellaire', 'West University Place', 'Memorial', 'River Oaks', 'Heights', 'Montrose', 'Midtown', 'Downtown Houston'],
  phoneNumber = "+1-281-XXX-XXXX",
  address = {
    city: "Houston",
    state: "TX"
  }
}: SEOProps) => {
  const baseUrl = "https://www.hougenpros.com";
  const fullCanonical = canonical ? `${baseUrl}${canonical}` : baseUrl;
  
  // Default schema for generator business
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "HOU GEN PROS",
    "description": "Houston's premier generator installation and sales company specializing in Generac whole home backup power solutions",
    "url": baseUrl,
    "telephone": phoneNumber,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": address.city,
      "addressRegion": address.state,
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 29.7604,
      "longitude": -95.3698
    },
    "openingHours": "Mo-Su 00:00-23:59",
    "serviceArea": serviceArea.map(city => ({
      "@type": "City",
      "name": city
    })),
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
    }
  };

  const finalSchema = schema || defaultSchema;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content="HOU GEN PROS" />
      
      {/* Geographic targeting */}
      <meta name="geo.region" content="US-TX" />
      <meta name="geo.placename" content="Houston" />
      <meta name="geo.position" content="29.7604;-95.3698" />
      <meta name="ICBM" content="29.7604, -95.3698" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonical} />
      
      {/* Open Graph */}
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={pageType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="HOU GEN PROS" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@hougenpros" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Robots */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchema)}
      </script>
    </Helmet>
  );
};

export default SEO; 