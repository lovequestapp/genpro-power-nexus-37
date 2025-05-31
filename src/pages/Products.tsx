
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowRight, 
  Download, 
  Phone, 
  MessageSquare,
  Fuel, 
  Home, 
  Building, 
  Zap,
  Wrench,
  Shield,
  Clock,
  Award,
  CheckCircle
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const productCategories = [
    { id: 'all', name: 'All Products', icon: Zap },
    { id: 'commercial', name: 'Commercial', icon: Building },
    { id: 'residential', name: 'Residential', icon: Home },
    { id: 'portable', name: 'Portable', icon: Zap },
    { id: 'industrial', name: 'Industrial', icon: Fuel }
  ];

  const products = [
    {
      id: 1,
      name: "Generac QT Series",
      category: "residential",
      power: "22kW - 60kW",
      fuelType: "Natural Gas / Propane",
      price: "Starting at $4,999",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: ["Automatic Transfer Switch", "Mobile Link Remote Monitoring", "True Power Technology", "10-Year Limited Warranty"],
      specs: {
        "Electrical": "Single/Three Phase",
        "Fuel Tank": "External Connection",
        "Noise Level": "62 dB(A) @ 23 ft",
        "Enclosure": "All-Weather Steel"
      },
      badge: "Best Seller",
      description: "Premium residential standby generators designed for ultimate home protection with quiet operation and seamless power transfer."
    },
    {
      id: 2,
      name: "Caterpillar C9 Series",
      category: "commercial",
      power: "200kW - 500kW",
      fuelType: "Diesel",
      price: "Starting at $45,000",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: ["Advanced Digital Control", "Remote Monitoring", "Dual Voltage Options", "Enhanced Fuel Efficiency"],
      specs: {
        "Configuration": "V8 Diesel Engine",
        "Fuel Tank": "500-2000 Gallon Options",
        "Cooling": "Radiator Cooled",
        "Alternator": "Industrial Grade"
      },
      badge: "Commercial Grade",
      description: "Heavy-duty commercial generators built to power critical business operations with unmatched reliability and performance."
    },
    {
      id: 3,
      name: "Kohler Industrial Series",
      category: "industrial",
      power: "800kW - 3MW",
      fuelType: "Diesel / Natural Gas",
      price: "Starting at $125,000",
      image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: ["Paralleling Capability", "Load Bank Testing", "Seismic Compliance", "Advanced Monitoring Systems"],
      specs: {
        "Engine": "Industrial V12/V16",
        "Control System": "PowerCommand 3201",
        "Enclosure": "Level 2 Sound Attenuation",
        "Fuel System": "Dual Tank Capability"
      },
      badge: "Industrial Power",
      description: "Mission-critical power solutions for large facilities, data centers, and industrial operations requiring maximum uptime."
    },
    {
      id: 4,
      name: "Champion Portable Pro",
      category: "portable",
      power: "3kW - 15kW",
      fuelType: "Gasoline / Propane",
      price: "Starting at $899",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: ["Dual Fuel Technology", "Electric Start", "Parallel Ready", "Wireless Remote"],
      specs: {
        "Runtime": "Up to 17 Hours",
        "Outlets": "Multiple 120V/240V",
        "Weight": "150-300 lbs",
        "Mobility": "Never-Flat Wheels"
      },
      badge: "Versatile",
      description: "Professional-grade portable generators perfect for construction sites, events, and emergency backup power needs."
    },
    {
      id: 5,
      name: "Cummins QuietConnect",
      category: "residential",
      power: "20kW - 50kW",
      fuelType: "Natural Gas / Propane",
      price: "Starting at $5,500",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: ["Ultra-Quiet Operation", "Smart Grid Ready", "Corrosion-Resistant", "Advanced Load Management"],
      specs: {
        "Sound Level": "58 dB(A) @ 23 ft",
        "Transfer Switch": "Service Entrance Rated",
        "Warranty": "5-Year Comprehensive",
        "Monitoring": "RS Remote System"
      },
      badge: "Quiet Tech",
      description: "Whisper-quiet residential generators that provide seamless backup power without disturbing your neighborhood."
    },
    {
      id: 6,
      name: "Generac Mobile Series",
      category: "portable",
      power: "25kW - 150kW",
      fuelType: "Diesel",
      price: "Starting at $18,000",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: ["Trailer Mounted", "Weather Protection", "Extended Runtime", "Fleet Management Ready"],
      specs: {
        "Mobility": "Highway Towable",
        "Fuel Tank": "150-500 Gallon",
        "Setup Time": "Under 10 Minutes",
        "Operation": "Unattended 500+ Hours"
      },
      badge: "Mobile Power",
      description: "Trailer-mounted generators designed for construction, events, and emergency response with maximum portability."
    }
  ];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  const benefits = [
    {
      icon: Shield,
      title: "Authorized Dealer Network",
      description: "Official partnerships with Generac, Caterpillar, Kohler, and Cummins"
    },
    {
      icon: Wrench,
      title: "Complete Installation",
      description: "Professional installation by certified technicians with permits included"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock emergency service and technical support"
    },
    {
      icon: Award,
      title: "Industry Leading Warranties",
      description: "Extended warranty options up to 10 years on select models"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary via-steel-800 to-steel-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-accent text-white border-accent">
              Premium Generator Solutions
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Professional Grade
              <span className="block text-accent">Power Solutions</span>
            </h1>
            <p className="text-xl text-steel-200 mb-8 leading-relaxed">
              From residential backup power to industrial-scale solutions, discover our comprehensive 
              range of generators from industry-leading manufacturers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent hover:bg-orange-600 text-white">
                <Phone className="w-5 h-5 mr-2" />
                Get Expert Consultation
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <Download className="w-5 h-5 mr-2" />
                Download Catalog
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16 bg-steel-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Browse by Category</h2>
            <p className="text-steel-600 max-w-2xl mx-auto">
              Find the perfect generator solution for your specific needs across our comprehensive product lineup.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {productCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  className={`${
                    activeCategory === category.id 
                      ? "bg-accent text-white" 
                      : "border-steel-300 text-steel-700 hover:bg-accent hover:text-white"
                  } transition-all duration-300`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <Card 
                key={product.id} 
                className="group hover:shadow-2xl transition-all duration-500 border-steel-200 hover:border-accent/30 overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-accent text-white">
                      {product.badge}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl text-primary group-hover:text-accent transition-colors duration-300">
                    {product.name}
                  </CardTitle>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-accent">{product.price}</span>
                    <Badge variant="outline" className="text-xs">
                      {product.power}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-steel-600 text-sm leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-primary">Key Features:</div>
                    <ul className="space-y-1">
                      {product.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="text-sm text-steel-600 flex items-center">
                          <CheckCircle className="w-3 h-3 text-accent mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-4 space-y-3">
                    <Button 
                      className="w-full bg-primary hover:bg-steel-700 text-white group-hover:bg-accent group-hover:border-accent transition-all duration-300"
                    >
                      View Specifications
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-accent text-accent hover:bg-accent hover:text-white"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Request Quote
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-steel-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Why Choose HOU GEN PROS</h2>
            <p className="text-steel-600 max-w-2xl mx-auto">
              Experience the difference of working with Houston's premier generator specialists.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div 
                  key={index}
                  className="text-center group animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2">{benefit.title}</h3>
                  <p className="text-steel-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Secure Your Power?</h2>
          <p className="text-xl text-steel-200 mb-8 max-w-2xl mx-auto">
            Let our experts help you choose the perfect generator solution for your needs. 
            Get a free consultation and custom quote today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-accent hover:bg-orange-600 text-white">
              <Phone className="w-5 h-5 mr-2" />
              (832) 555-POWER
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <MessageSquare className="w-5 h-5 mr-2" />
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;
