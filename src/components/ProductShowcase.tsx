import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Home, CheckCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductShowcase = () => {
  const products = [
    {
      id: 1,
      name: "Generac 18KW Standby",
      category: "Residential",
      power: "18kW",
      price: "$5,200",
      priceNote: "Equipment Only",
      icon: Home,
      features: ["Automatic Start", "Quiet Operation", "10-Year Warranty", "WiFi Monitoring"],
      image: "/1.jpg",
      badge: "In Stock",
      popular: false
    },
    {
      id: 2,
      name: "Generac 22KW Standby",
      category: "Residential",
      power: "22kW",
      price: "$5,600",
      priceNote: "Equipment Only",
      icon: Home,
      features: ["Whole Home Power", "Natural Gas/Propane", "Mobile App Control", "Weather Resistant"],
      image: "/2.jpg",
      badge: "Popular",
      popular: true
    },
    {
      id: 3,
      name: "Generac 24KW Standby",
      category: "Residential",
      power: "24kW",
      price: "$6,000",
      priceNote: "Equipment Only",
      icon: Home,
      features: ["Extended Coverage", "Automatic Transfer", "5-Year Warranty", "Professional Install"],
      image: "/1.jpg",
      badge: "New",
      popular: false
    },
    {
      id: 4,
      name: "Generac 26KW Standby",
      category: "Residential",
      power: "26kW",
      price: "$6,500",
      priceNote: "Equipment Only",
      icon: Home,
      features: ["Maximum Coverage", "200 Amp Ready", "Premium Features", "Best Value"],
      image: "/2.jpg",
      badge: "Summer Special",
      popular: false,
      specialPrice: "$10,250",
      specialNote: "Installed Package"
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <Badge variant="outline" className="mb-3 sm:mb-4 text-accent border-accent text-sm sm:text-base px-3 sm:px-4 py-1 sm:py-2">
            Generac Home Generators - In Stock Now!
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4 sm:mb-6 text-balance">
            Brand New Generac Generators
          </h2>
          <p className="text-lg sm:text-xl text-steel-600 max-w-3xl mx-auto px-4 sm:px-0">
            Whole home backup power for Houston & surrounding areas. Professional installation 
            available with 3-5 hour setup and 5-year manufacturer warranty.
          </p>
        </div>

        {/* Product Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12">
          {products.map((product, index) => {
            const IconComponent = product.icon;
            return (
              <Card 
                key={product.id} 
                className={`bg-white border border-steel-200 shadow-md rounded-xl group hover:shadow-lg transition-all duration-300 animate-fade-in overflow-hidden ${product.popular ? 'ring-2 ring-accent' : ''}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-40 sm:h-48 bg-white overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                    <Badge className={`${product.badge === 'Summer Special' ? 'bg-red-500 hover:bg-red-500' : 'bg-accent hover:bg-accent'} text-white text-xs sm:text-sm`}>
                      {product.badge}
                    </Badge>
                  </div>
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-orange-100 p-1.5 sm:p-2 rounded-lg">
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  </div>
                  {product.popular && (
                    <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4">
                      <div className="flex items-center bg-accent/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white fill-current mr-1" />
                        <span className="text-xs sm:text-sm font-medium text-white">Most Popular</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4 sm:p-6">
                  <div className="mb-3">
                    <Badge variant="outline" className="text-xs mb-2 text-steel-700">
                      {product.category}
                    </Badge>
                    <h3 className="text-lg sm:text-xl font-bold text-steel-900 mb-2">{product.name}</h3>
                    <p className="text-accent font-semibold text-base sm:text-lg">{product.power}</p>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-xl sm:text-2xl font-bold text-steel-800">{product.price}</div>
                    <div className="text-xs sm:text-sm text-steel-700">{product.priceNote}</div>
                    {product.specialPrice && (
                      <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                        <div className="text-base sm:text-lg font-bold text-red-600">{product.specialPrice}</div>
                        <div className="text-xs text-red-500">{product.specialNote}</div>
                      </div>
                    )}
                  </div>
                  
                  <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-steel-800 flex items-center">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-accent mr-2 sm:mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-300 touch-manipulation h-10 sm:h-auto"
                    asChild
                  >
                    <Link to="/get-quote">
                      Get Quote
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Section - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="text-center p-4 sm:p-6 bg-steel-50 rounded-lg">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 text-accent rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-lg sm:text-xl">
              ✅
            </div>
            <h3 className="font-bold text-steel-900 mb-2 text-base sm:text-lg">Brand New Units</h3>
            <p className="text-steel-800 text-sm">Not refurbished - genuine Generac generators with full warranty</p>
          </div>
          
          <div className="text-center p-4 sm:p-6 bg-steel-50 rounded-lg">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 text-accent rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-lg sm:text-xl">
              🛠️
            </div>
            <h3 className="font-bold text-steel-900 mb-2 text-base sm:text-lg">Licensed & Insured</h3>
            <p className="text-steel-800 text-sm">Professional installation by certified Houston Generator Pros</p>
          </div>
          
          <div className="text-center p-4 sm:p-6 bg-steel-50 rounded-lg">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 text-accent rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-lg sm:text-xl">
              ⚡
            </div>
            <h3 className="font-bold text-steel-900 mb-2 text-base sm:text-lg">Fast Setup</h3>
            <p className="text-steel-800 text-sm">Complete installation in just 3 to 5 hours</p>
          </div>
        </div>

        {/* CTA Section - Mobile Optimized */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-lg mx-auto">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-steel-700 text-white px-6 sm:px-8 touch-manipulation h-12 sm:h-auto flex-1 sm:flex-none"
              asChild
            >
              <Link to="/products">
                View All Products
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-accent text-accent hover:bg-accent hover:text-white px-6 sm:px-8 touch-manipulation h-12 sm:h-auto flex-1 sm:flex-none"
              asChild
            >
              <Link to="/get-quote">
                Message for Free Quote
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
