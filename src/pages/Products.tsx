import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowRight, 
  Phone, 
  MessageSquare,
  Zap,
  Shield,
  Settings,
  Home,
  Building,
  Truck,
  Fuel,
  CheckCircle,
  Star,
  Award,
  Download
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const products = [
    {
      id: 1,
      name: "Industrial Diesel Series",
      category: "Commercial",
      power: "50kW - 2MW",
      fuel: "Diesel",
      description: "Heavy-duty generators for industrial applications.",
      icon: Building,
      features: ["Continuous Power", "Weather Resistant", "Remote Monitoring", "Automatic Transfer Switch"],
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Most Popular",
      rating: 4.8,
      price: "$15,000 - $150,000"
    },
    {
      id: 2,
      name: "Residential Standby",
      category: "Residential",
      power: "7.5kW - 26kW",
      fuel: "Natural Gas/Propane",
      description: "Reliable backup power for homes and small businesses.",
      icon: Home,
      features: ["Automatic Start", "Quiet Operation", "10-Year Warranty", "Mobile App Monitoring"],
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Premium",
      rating: 4.6,
      price: "$3,000 - $12,000"
    },
    {
      id: 3,
      name: "Portable Power Pro",
      category: "Portable",
      power: "2kW - 15kW",
      fuel: "Gasoline/Propane",
      description: "Versatile and mobile generators for on-the-go power needs.",
      icon: Zap,
      features: ["Ultra Portable", "Multi-Fuel", "Parallel Capable", "Inverter Technology"],
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Versatile",
      rating: 4.4,
      price: "$500 - $3,000"
    },
    {
      id: 4,
      name: "Natural Gas Solutions",
      category: "Eco-Friendly",
      power: "10kW - 150kW",
      fuel: "Natural Gas",
      description: "Clean and efficient generators for environmentally conscious users.",
      icon: Fuel,
      features: ["Clean Burning", "Cost Effective", "Low Maintenance", "Low Emissions"],
      image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Eco-Smart",
      rating: 4.7,
      price: "$8,000 - $80,000"
    },
    {
      id: 5,
      name: "Mobile Generator Units",
      category: "Commercial",
      power: "20kW - 500kW",
      fuel: "Diesel",
      description: "Trailer-mounted generators for construction sites and events.",
      icon: Truck,
      features: ["Easy Transport", "Quick Setup", "Weather Protection", "Sound Attenuation"],
      image: "https://images.unsplash.com/photo-1617196009584-98c946894597?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "On-Site Power",
      rating: 4.5,
      price: "$12,000 - $120,000"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products', icon: Shield },
    { id: 'residential', name: 'Residential', icon: Home },
    { id: 'commercial', name: 'Commercial', icon: Building },
    { id: 'portable', name: 'Portable', icon: Zap },
    { id: 'eco-friendly', name: 'Eco-Friendly', icon: Fuel }
  ];

  const specifications = [
    { model: 'HG2500i', power: '2500W', fuel: 'Gasoline', runtime: '11 hrs', noise: '52 dB', warranty: '3 Years' },
    { model: 'HG5500', power: '5500W', fuel: 'Gasoline', runtime: '10 hrs', noise: '68 dB', warranty: '2 Years' },
    { model: 'HG7500', power: '7500W', fuel: 'Gasoline/Propane', runtime: '8/7 hrs', noise: '72 dB', warranty: '2 Years' },
    { model: 'HG12000', power: '12000W', fuel: 'Gasoline', runtime: '8 hrs', noise: '74 dB', warranty: '1 Year' },
    { model: 'HGD15', power: '15kW', fuel: 'Diesel', runtime: '24 hrs', noise: '65 dB', warranty: '3 Years' },
    { model: 'HGN20', power: '20kW', fuel: 'Natural Gas', runtime: 'Continuous', noise: '62 dB', warranty: '5 Years' }
  ];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section - Added more top padding */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary via-steel-800 to-steel-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-accent text-white border-accent px-4 py-2">
              Premium Generator Solutions
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              Power That Never
              <span className="block text-accent">Lets You Down</span>
            </h1>
            <p className="text-xl text-steel-200 mb-10 leading-relaxed max-w-3xl mx-auto">
              From residential standby units to industrial powerhouses, discover our comprehensive 
              range of generators engineered for Houston's demanding climate and power needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-accent hover:bg-orange-600 text-white px-8 py-4">
                <Phone className="w-5 h-5 mr-2" />
                Get Quote Today
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4">
                <Download className="w-5 h-5 mr-2" />
                Product Catalog
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-6">Complete Generator Lineup</h2>
            <p className="text-xl text-steel-600 max-w-3xl mx-auto">
              Engineered for reliability, built for performance. Every generator backed by our comprehensive warranty and expert Houston service team.
            </p>
          </div>

          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-12 h-auto">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="flex items-center gap-2 text-sm p-4"
                  >
                    <IconComponent className="w-4 h-4" />
                    {category.name}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value={activeCategory} className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product, index) => {
                  const IconComponent = product.icon;
                  return (
                    <Card 
                      key={product.id} 
                      className="group hover:shadow-xl transition-all duration-300 border-steel-200 hover:border-accent/30 overflow-hidden"
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
                        <div className="absolute bottom-4 right-4">
                          <div className="flex items-center bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-sm font-medium text-steel-800">{product.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <CardContent className="p-6">
                        <CardHeader className="p-0 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="text-xs">
                              {product.category}
                            </Badge>
                            <span className="text-sm text-steel-500">{product.fuel}</span>
                          </div>
                          <CardTitle className="text-xl text-primary mb-2">{product.name}</CardTitle>
                          <p className="text-accent font-bold text-2xl">{product.power}</p>
                        </CardHeader>
                        
                        <p className="text-steel-600 mb-4 text-sm">{product.description}</p>
                        
                        <ul className="space-y-2 mb-6">
                          {product.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="text-sm text-steel-600 flex items-center">
                              <CheckCircle className="w-4 h-4 text-accent mr-3 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        
                        <div className="space-y-3">
                          <div className="text-2xl font-bold text-primary">{product.price}</div>
                          <div className="flex flex-col gap-2">
                            <Button className="bg-primary hover:bg-steel-700 text-white w-full">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Get Quote
                            </Button>
                            <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white w-full">
                              <ArrowRight className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Specifications Section */}
      <section className="py-20 bg-steel-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-6">Technical Specifications</h2>
            <p className="text-xl text-steel-600 max-w-3xl mx-auto">
              Detailed specifications and performance data for our most popular generator models.
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg border border-steel-200">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Model</th>
                  <th className="px-6 py-4 text-left font-semibold">Power Output</th>
                  <th className="px-6 py-4 text-left font-semibold">Fuel Type</th>
                  <th className="px-6 py-4 text-left font-semibold">Runtime</th>
                  <th className="px-6 py-4 text-left font-semibold">Noise Level</th>
                  <th className="px-6 py-4 text-left font-semibold">Warranty</th>
                </tr>
              </thead>
              <tbody>
                {specifications.map((spec, index) => (
                  <tr key={index} className="border-b border-steel-100 hover:bg-steel-50">
                    <td className="px-6 py-4 font-medium text-primary">{spec.model}</td>
                    <td className="px-6 py-4 text-steel-700">{spec.power}</td>
                    <td className="px-6 py-4 text-steel-700">{spec.fuel}</td>
                    <td className="px-6 py-4 text-steel-700">{spec.runtime}</td>
                    <td className="px-6 py-4 text-steel-700">{spec.noise}</td>
                    <td className="px-6 py-4 text-steel-700">{spec.warranty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-6">Why Choose HOU GEN PROS?</h2>
            <p className="text-xl text-steel-600 max-w-3xl mx-auto">
              More than just generators - we're your complete power solution partner in Houston.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardContent className="p-8">
                <Award className="w-16 h-16 text-accent mx-auto mb-6" />
                <h3 className="font-bold text-primary mb-4 text-xl">Certified Excellence</h3>
                <p className="text-steel-600">Licensed, bonded, and insured with all major manufacturer certifications and Houston electrical permits.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardContent className="p-8">
                <Shield className="w-16 h-16 text-accent mx-auto mb-6" />
                <h3 className="font-bold text-primary mb-4 text-xl">Comprehensive Warranty</h3>
                <p className="text-steel-600">Industry-leading warranties with 24/7 emergency support and maintenance programs available.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardContent className="p-8">
                <Settings className="w-16 h-16 text-accent mx-auto mb-6" />
                <h3 className="font-bold text-primary mb-4 text-xl">Expert Installation</h3>
                <p className="text-steel-600">Professional installation, setup, and training by certified technicians with 15+ years experience.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Power Up?</h2>
          <p className="text-xl text-steel-200 mb-10 max-w-3xl mx-auto">
            Get expert consultation and competitive pricing on the perfect generator solution for your Houston property.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-accent hover:bg-orange-600 text-white px-8 py-4">
              <Phone className="w-5 h-5 mr-2" />
              Call (832) 555-POWER
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4">
              <MessageSquare className="w-5 h-5 mr-2" />
              Request Free Quote
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;
