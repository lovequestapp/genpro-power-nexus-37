
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Fuel, Home, Building, Zap } from 'lucide-react';

const ProductShowcase = () => {
  const products = [
    {
      id: 1,
      name: "Industrial Diesel Series",
      category: "Commercial",
      power: "50kW - 2MW",
      icon: Building,
      features: ["Continuous Power", "Weather Resistant", "Remote Monitoring"],
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Most Popular"
    },
    {
      id: 2,
      name: "Residential Standby",
      category: "Residential",
      power: "7.5kW - 26kW",
      icon: Home,
      features: ["Automatic Start", "Quiet Operation", "10-Year Warranty"],
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Premium"
    },
    {
      id: 3,
      name: "Portable Power Pro",
      category: "Portable",
      power: "2kW - 15kW",
      icon: Zap,
      features: ["Ultra Portable", "Multi-Fuel", "Parallel Capable"],
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Versatile"
    },
    {
      id: 4,
      name: "Natural Gas Solutions",
      category: "Eco-Friendly",
      power: "10kW - 150kW",
      icon: Fuel,
      features: ["Clean Burning", "Cost Effective", "Low Maintenance"],
      image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Eco-Smart"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-accent border-accent">
            Premium Generator Solutions
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Engineered for Excellence
          </h2>
          <p className="text-xl text-steel-600 max-w-3xl mx-auto">
            From compact residential units to industrial powerhouses, our generator lineup 
            delivers unmatched reliability and performance across every application.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {products.map((product, index) => {
            const IconComponent = product.icon;
            return (
              <Card 
                key={product.id} 
                className="group hover:shadow-xl transition-all duration-300 border-steel-200 hover:border-accent/30 animate-fade-in overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48 bg-gradient-to-br from-steel-100 to-steel-200 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-accent hover:bg-accent text-white">
                      {product.badge}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg">
                    <IconComponent className="w-5 h-5 text-accent" />
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="mb-3">
                    <Badge variant="outline" className="text-xs mb-2">
                      {product.category}
                    </Badge>
                    <h3 className="text-xl font-bold text-primary mb-2">{product.name}</h3>
                    <p className="text-accent font-semibold text-lg">{product.power}</p>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-steel-600 flex items-center">
                        <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-300"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Button size="lg" className="bg-primary hover:bg-steel-700 text-white px-8">
            View All Products
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
