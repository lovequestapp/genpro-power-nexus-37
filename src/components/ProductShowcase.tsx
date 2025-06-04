
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Fuel, Home, Building, Zap, CheckCircle, Star } from 'lucide-react';

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
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Summer Special",
      popular: false,
      specialPrice: "$10,250",
      specialNote: "Installed Package"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-accent border-accent">
            Generac Home Generators - In Stock Now!
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Brand New Generac Generators
          </h2>
          <p className="text-xl text-steel-600 max-w-3xl mx-auto">
            Whole home backup power for Houston & surrounding areas. Professional installation 
            available with 3-5 hour setup and 5-year manufacturer warranty.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {products.map((product, index) => {
            const IconComponent = product.icon;
            return (
              <Card 
                key={product.id} 
                className={`group hover:shadow-xl transition-all duration-300 border-steel-200 hover:border-accent/30 animate-fade-in overflow-hidden ${product.popular ? 'ring-2 ring-accent' : ''}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48 bg-gradient-to-br from-steel-100 to-steel-200 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={`${product.badge === 'Summer Special' ? 'bg-red-500 hover:bg-red-500' : 'bg-accent hover:bg-accent'} text-white`}>
                      {product.badge}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg">
                    <IconComponent className="w-5 h-5 text-accent" />
                  </div>
                  {product.popular && (
                    <div className="absolute bottom-4 right-4">
                      <div className="flex items-center bg-accent/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 text-white fill-current mr-1" />
                        <span className="text-sm font-medium text-white">Most Popular</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <div className="mb-3">
                    <Badge variant="outline" className="text-xs mb-2">
                      {product.category}
                    </Badge>
                    <h3 className="text-xl font-bold text-primary mb-2">{product.name}</h3>
                    <p className="text-accent font-semibold text-lg">{product.power}</p>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-primary">{product.price}</div>
                    <div className="text-sm text-steel-500">{product.priceNote}</div>
                    {product.specialPrice && (
                      <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                        <div className="text-lg font-bold text-red-600">{product.specialPrice}</div>
                        <div className="text-xs text-red-500">{product.specialNote}</div>
                      </div>
                    )}
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-steel-600 flex items-center">
                        <CheckCircle className="w-4 h-4 text-accent mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-300"
                  >
                    Get Quote
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 bg-steel-50 rounded-lg">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              ✅
            </div>
            <h3 className="font-bold text-primary mb-2">Brand New Units</h3>
            <p className="text-steel-600 text-sm">Not refurbished - genuine Generac generators with full warranty</p>
          </div>
          
          <div className="text-center p-6 bg-steel-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              🛠️
            </div>
            <h3 className="font-bold text-primary mb-2">Licensed & Insured</h3>
            <p className="text-steel-600 text-sm">Professional installation by certified Houston Generator Pros</p>
          </div>
          
          <div className="text-center p-6 bg-steel-50 rounded-lg">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              ⚡
            </div>
            <h3 className="font-bold text-primary mb-2">Fast Setup</h3>
            <p className="text-steel-600 text-sm">Complete installation in just 3 to 5 hours</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Button size="lg" className="bg-primary hover:bg-steel-700 text-white px-8 mr-4">
            View All Products
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white px-8">
            Message for Free Quote
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
