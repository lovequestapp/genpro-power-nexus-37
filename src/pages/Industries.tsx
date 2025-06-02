import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Phone, 
  MessageSquare,
  Building2,
  Home,
  Factory,
  ShoppingCart,
  GraduationCap,
  Activity,
  Wrench,
  CheckCircle,
  Shield,
  Clock,
  Users,
  Building,
  Stethoscope,
  TrendingUp
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Industries = () => {
  const industries = [
    {
      id: 'healthcare',
      name: 'Healthcare & Medical',
      icon: Stethoscope,
      description: 'Mission-critical power solutions for hospitals, clinics, and medical facilities.',
      requirements: [
        'UPS and battery backup systems',
        'Emergency lighting compliance',
        'Life safety system support',
        'Redundant power configurations',
        'NFPA 99 compliance',
        '24/7 monitoring and support'
      ],
      projects: 100,
      powerSize: '2MW',
      uptime: '99.9%',
      challenge: 'Power outages disrupt patient care and revenue.',
      solution: 'Customized generator solutions with 24/7 monitoring and support.',
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      caseStudy: 'Houston Methodist Hospital - 2MW redundant power system'
    },
    {
      id: 'commercial',
      name: 'Commercial Buildings',
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
      projects: 50,
      powerSize: '500kW',
      uptime: '99.9%',
      challenge: 'Power outages disrupt business operations and revenue.',
      solution: 'Customized generator solutions with 24/7 monitoring and support.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      caseStudy: 'Galleria Office Complex - 500kW seamless backup power'
    },
    {
      id: 'industrial',
      name: 'Industrial & Manufacturing',
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
      projects: 75,
      powerSize: '3MW',
      uptime: '99.9%',
      challenge: 'Power outages disrupt production and revenue.',
      solution: 'Customized generator solutions with 24/7 monitoring and support.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      caseStudy: 'Exxon Baytown Refinery - 3MW industrial backup system'
    },
    {
      id: 'education',
      name: 'Educational Institutions',
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
      projects: 25,
      powerSize: '1.5MW',
      uptime: '99.9%',
      challenge: 'Power outages disrupt learning and operations.',
      solution: 'Customized generator solutions with 24/7 monitoring and support.',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      caseStudy: 'Rice University Campus - 1.5MW distributed power network'
    },
    {
      id: 'retail',
      name: 'Retail & Hospitality',
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
      projects: 100,
      powerSize: '200kW',
      uptime: '99.9%',
      challenge: 'Power outages disrupt business operations and revenue.',
      solution: 'Customized generator solutions with 24/7 monitoring and support.',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      caseStudy: 'HEB Supermarket Chain - 200+ locations with backup power'
    },
    {
      id: 'residential',
      name: 'Residential Communities',
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
      projects: 50,
      powerSize: '60kW',
      uptime: '99.9%',
      challenge: 'Power outages disrupt home operations and safety.',
      solution: 'Customized generator solutions with 24/7 monitoring and support.',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      caseStudy: 'River Oaks Estate - 60kW whole-house generator system'
    }
  ];

  const caseStudies = [
    {
      id: 'hospital',
      title: 'Houston Methodist Hospital',
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      industry: 'Healthcare & Medical',
      challenge: 'Power outages disrupt patient care and revenue.',
      solution: 'Customized generator solutions with 24/7 monitoring and support.',
      powerSize: '2MW',
      uptime: '99.9%'
    },
    {
      id: 'galleria',
      title: 'Galleria Office Complex',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      industry: 'Commercial Buildings',
      challenge: 'Power outages disrupt business operations and revenue.',
      solution: 'Customized generator solutions with 24/7 monitoring and support.',
      powerSize: '500kW',
      uptime: '99.9%'
    },
    {
      id: 'exxon',
      title: 'Exxon Baytown Refinery',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      industry: 'Industrial & Manufacturing',
      challenge: 'Power outages disrupt production and revenue.',
      solution: 'Customized generator solutions with 24/7 monitoring and support.',
      powerSize: '3MW',
      uptime: '99.9%'
    },
    {
      id: 'rice',
      title: 'Rice University Campus',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      industry: 'Educational Institutions',
      challenge: 'Power outages disrupt learning and operations.',
      solution: 'Customized generator solutions with 24/7 monitoring and support.',
      powerSize: '1.5MW',
      uptime: '99.9%'
    },
    {
      id: 'heb',
      title: 'HEB Supermarket Chain',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      industry: 'Retail & Hospitality',
      challenge: 'Power outages disrupt business operations and revenue.',
      solution: 'Customized generator solutions with 24/7 monitoring and support.',
      powerSize: '200kW',
      uptime: '99.9%'
    },
    {
      id: 'riveroaks',
      title: 'River Oaks Estate',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      industry: 'Residential Communities',
      challenge: 'Power outages disrupt home operations and safety.',
      solution: 'Customized generator solutions with 24/7 monitoring and support.',
      powerSize: '60kW',
      uptime: '99.9%'
    }
  ];

  const solutions = [
    {
      id: 'basic',
      name: 'Basic Power Solution',
      icon: Activity,
      description: 'A comprehensive power solution for small to medium-sized businesses.',
      features: [
        'UPS and battery backup systems',
        'Automatic transfer switches',
        'Load management systems'
      ],
      startingPrice: '$10,000'
    },
    {
      id: 'premium',
      name: 'Premium Power Solution',
      icon: Wrench,
      description: 'A high-performance power solution for critical industrial applications.',
      features: [
        'High-capacity generators',
        'Load sequencing systems',
        'Paralleling switchgear',
        'Process continuity protection',
        'Motor starting capability',
        'Environmental compliance'
      ],
      startingPrice: '$50,000'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Power Solution',
      icon: Shield,
      description: 'A customized power solution tailored to meet the unique needs of your business.',
      features: [
        '24/7 monitoring and support',
        'Customized generator configurations',
        'Advanced safety features',
        'Integrated IT infrastructure protection'
      ],
      startingPrice: '$100,000'
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
      
      {/* Hero Section - Added more top padding */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary via-steel-800 to-steel-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-accent text-white border-accent px-4 py-2">
              Industry-Specific Power Solutions
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              Powering Houston's
              <span className="block text-accent">Critical Industries</span>
            </h1>
            <p className="text-xl text-steel-200 mb-10 leading-relaxed max-w-3xl mx-auto">
              Specialized generator solutions tailored for Houston's diverse business landscape. 
              From healthcare facilities to manufacturing plants, we ensure uninterrupted power when it matters most.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-accent hover:bg-orange-600 text-white px-8 py-4">
                <Phone className="w-5 h-5 mr-2" />
                Industry Consultation
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4">
                <MessageSquare className="w-5 h-5 mr-2" />
                Custom Solution Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-6">Industries We Serve</h2>
            <p className="text-xl text-steel-600 max-w-3xl mx-auto">
              Decades of experience serving Houston's most critical industries with reliable backup power solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => {
              const IconComponent = industry.icon;
              return (
                <Card 
                  key={industry.id} 
                  className="group hover:shadow-xl transition-all duration-300 border-steel-200 hover:border-accent/30 overflow-hidden"
                >
                  <div className="relative h-48 bg-gradient-to-br from-steel-100 to-steel-200 overflow-hidden">
                    <img 
                      src={industry.image} 
                      alt={industry.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-3">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <Badge className="bg-white/20 text-white border-white/30">
                        {industry.projects}+ Projects
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-xl text-primary mb-2">{industry.name}</CardTitle>
                      <p className="text-steel-600 text-sm">{industry.description}</p>
                    </CardHeader>
                    
                    <div className="space-y-3 mb-6">
                      <h4 className="font-semibold text-primary text-sm">Key Requirements:</h4>
                      <ul className="space-y-2">
                        {industry.requirements.map((req, idx) => (
                          <li key={idx} className="text-sm text-steel-600 flex items-center">
                            <CheckCircle className="w-4 h-4 text-accent mr-3 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-white">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-steel-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-6">Success Stories</h2>
            <p className="text-xl text-steel-600 max-w-3xl mx-auto">
              Real results from real Houston businesses. See how our power solutions have protected operations across industries.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {caseStudies.map((study, index) => (
              <Card key={index} className="overflow-hidden shadow-lg border-0">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative h-64 md:h-auto">
                    <img 
                      src={study.image} 
                      alt={study.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-accent text-white">
                        {study.industry}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-8">
                    <CardHeader className="p-0 mb-6">
                      <CardTitle className="text-xl text-primary mb-3">
                        {study.title}
                      </CardTitle>
                      <p className="text-steel-600 text-sm mb-4">{study.challenge}</p>
                      <p className="text-steel-700 font-medium">{study.solution}</p>
                    </CardHeader>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent">{study.powerSize}</div>
                        <div className="text-xs text-steel-500">Generator Size</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent">{study.uptime}</div>
                        <div className="text-xs text-steel-500">Uptime Achieved</div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                      Read Full Case Study
                    </Button>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Packages */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-6">Complete Solution Packages</h2>
            <p className="text-xl text-steel-600 max-w-3xl mx-auto">
              Comprehensive packages designed specifically for Houston's most demanding industries.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => {
              const IconComponent = solution.icon;
              return (
                <Card key={index} className="text-center hover:shadow-xl transition-shadow duration-300 border-steel-200 hover:border-accent/30">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-primary mb-4 text-xl">{solution.name}</h3>
                    <p className="text-steel-600 mb-6">{solution.description}</p>
                    
                    <ul className="space-y-3 mb-8 text-left">
                      {solution.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-steel-600 flex items-center">
                          <CheckCircle className="w-4 h-4 text-accent mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="text-3xl font-bold text-accent mb-6">{solution.startingPrice}</div>
                    
                    <Button className="w-full bg-primary hover:bg-steel-700 text-white">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Get Custom Quote
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Protect Your Houston Business</h2>
          <p className="text-xl text-steel-200 mb-10 max-w-3xl mx-auto">
            Don't let power outages disrupt your operations. Get a custom power solution designed for your industry's specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-accent hover:bg-orange-600 text-white px-8 py-4">
              <Phone className="w-5 h-5 mr-2" />
              Call (832) 555-POWER
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4">
              <MessageSquare className="w-5 h-5 mr-2" />
              Industry Assessment
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Industries;
