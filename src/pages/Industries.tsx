
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Phone, 
  MessageSquare,
  Building2,
  Hospital,
  Factory,
  GraduationCap,
  ShoppingCart,
  Home,
  Shield,
  Zap,
  Clock,
  Users,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Industries = () => {
  const industries = [
    {
      id: 'healthcare',
      title: 'Healthcare & Medical',
      icon: Hospital,
      description: 'Mission-critical power solutions for hospitals, clinics, and medical facilities.',
      requirements: [
        'UPS and battery backup systems',
        'Emergency lighting compliance',
        'Life safety system support',
        'Redundant power configurations',
        'NFPA 99 compliance',
        '24/7 monitoring and support'
      ],
      powerRange: '50kW - 3MW',
      applications: ['Hospitals', 'Surgery Centers', 'Dialysis Centers', 'Nursing Homes', 'Medical Labs'],
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      caseStudy: 'Houston Methodist Hospital - 2MW redundant power system'
    },
    {
      id: 'commercial',
      title: 'Commercial Buildings',
      icon: Building2,
      description: 'Reliable backup power for office buildings, retail centers, and commercial complexes.',
      requirements: [
        'Automatic transfer switches',
        'Load management systems',
        'Fire pump power backup',
        'Elevator emergency power',
        'HVAC system support',
        'Tenant notification systems'
      ],
      powerRange: '25kW - 1MW',
      applications: ['Office Buildings', 'Shopping Centers', 'Hotels', 'Restaurants', 'Banks'],
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      caseStudy: 'Galleria Office Complex - 500kW seamless backup power'
    },
    {
      id: 'industrial',
      title: 'Industrial & Manufacturing',
      icon: Factory,
      description: 'Heavy-duty power solutions for manufacturing plants and industrial facilities.',
      requirements: [
        'High-capacity generators',
        'Load sequencing systems',
        'Paralleling switchgear',
        'Process continuity protection',
        'Motor starting capability',
        'Environmental compliance'
      ],
      powerRange: '100kW - 5MW',
      applications: ['Chemical Plants', 'Refineries', 'Manufacturing', 'Warehouses', 'Data Centers'],
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      caseStudy: 'Exxon Baytown Refinery - 3MW industrial backup system'
    },
    {
      id: 'education',
      title: 'Educational Institutions',
      icon: GraduationCap,
      description: 'Comprehensive power solutions for schools, universities, and research facilities.',
      requirements: [
        'Campus-wide power distribution',
        'Emergency evacuation lighting',
        'HVAC system continuity',
        'IT infrastructure protection',
        'Laboratory equipment backup',
        'Student safety systems'
      ],
      powerRange: '30kW - 2MW',
      applications: ['Universities', 'K-12 Schools', 'Research Labs', 'Libraries', 'Student Housing'],
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      caseStudy: 'Rice University Campus - 1.5MW distributed power network'
    },
    {
      id: 'retail',
      title: 'Retail & Hospitality',
      icon: ShoppingCart,
      description: 'Keeping businesses operational during outages to protect revenue and customer experience.',
      requirements: [
        'POS system continuity',
        'Refrigeration backup',
        'Security system power',
        'Customer safety lighting',
        'WiFi and communications',
        'Quick startup capability'
      ],
      powerRange: '10kW - 500kW',
      applications: ['Grocery Stores', 'Restaurants', 'Gas Stations', 'Pharmacies', 'Car Dealerships'],
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      caseStudy: 'HEB Supermarket Chain - 200+ locations with backup power'
    },
    {
      id: 'residential',
      title: 'Residential Communities',
      icon: Home,
      description: 'Protecting homes and families with reliable residential generator solutions.',
      requirements: [
        'Whole house coverage',
        'Essential circuits backup',
        'Quiet operation',
        'Weather protection',
        'Smart home integration',
        'Automatic operation'
      ],
      powerRange: '7.5kW - 60kW',
      applications: ['Single Family Homes', 'Townhomes', 'Luxury Estates', 'Senior Communities', 'Condominiums'],
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      caseStudy: 'River Oaks Estate - 60kW whole-house generator system'
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Business Continuity',
      description: 'Minimize downtime and protect revenue during power outages'
    },
    {
      icon: Clock,
      title: 'Rapid Response',
      description: 'Automatic startup within 10 seconds of power loss'
    },
    {
      icon: Users,
      title: 'Safety Compliance',
      description: 'Meet OSHA, NFPA, and industry-specific safety requirements'
    },
    {
      icon: TrendingUp,
      title: 'ROI Protection',
      description: 'Protect investments and maintain operational efficiency'
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
              Industry-Specific Power Solutions
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Powering Houston's
              <span className="block text-accent">Leading Industries</span>
            </h1>
            <p className="text-xl text-steel-200 mb-8 leading-relaxed">
              From Fortune 500 corporations to local businesses, we deliver tailored generator 
              solutions that meet the unique power requirements of every industry sector.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent hover:bg-orange-600 text-white">
                <Phone className="w-5 h-5 mr-2" />
                Discuss Your Industry Needs
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <MessageSquare className="w-5 h-5 mr-2" />
                Request Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Industry Expertise</h2>
            <p className="text-steel-600 max-w-2xl mx-auto">
              Specialized power solutions designed for the unique requirements of Houston's diverse business landscape.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {industries.map((industry, index) => {
              const IconComponent = industry.icon;
              return (
                <Card 
                  key={industry.id} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-48">
                    <img 
                      src={industry.image} 
                      alt={industry.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />
                    <div className="absolute top-6 left-6">
                      <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-2">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <Badge className="bg-white/20 text-white border-white/30">
                        {industry.powerRange}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-xl text-primary mb-2">
                        {industry.title}
                      </CardTitle>
                      <p className="text-steel-600">{industry.description}</p>
                    </CardHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Key Requirements:</h4>
                        <div className="grid grid-cols-1 gap-1">
                          {industry.requirements.slice(0, 3).map((req, idx) => (
                            <div key={idx} className="flex items-center text-sm text-steel-600">
                              <CheckCircle className="w-3 h-3 text-accent mr-2 flex-shrink-0" />
                              {req}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Applications:</h4>
                        <div className="flex flex-wrap gap-1">
                          {industry.applications.slice(0, 3).map((app, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {app}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <p className="text-xs text-steel-500 mb-3">
                          <strong>Case Study:</strong> {industry.caseStudy}
                        </p>
                        <Button className="w-full bg-primary hover:bg-steel-700 text-white">
                          Learn More About {industry.title}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-steel-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Why Industries Choose HOU GEN PROS</h2>
            <p className="text-steel-600 max-w-2xl mx-auto">
              Experience the advantages of working with Houston's most trusted industrial power specialists.
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
          <h2 className="text-3xl font-bold mb-4">Ready to Protect Your Operations?</h2>
          <p className="text-xl text-steel-200 mb-8 max-w-2xl mx-auto">
            Let our industry experts design a custom power solution for your specific business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-accent hover:bg-orange-600 text-white">
              <Phone className="w-5 h-5 mr-2" />
              (832) 555-POWER
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <MessageSquare className="w-5 h-5 mr-2" />
              Industry Consultation
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Industries;
