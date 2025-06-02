
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Phone, 
  MessageSquare,
  Users,
  Award,
  MapPin,
  Calendar,
  Target,
  Heart,
  Shield,
  Star,
  Briefcase,
  GraduationCap,
  Zap,
  Building,
  CheckCircle
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const About = () => {
  const teamMembers = [
    {
      name: 'Jeff Ali',
      title: 'Founder & CEO',
      experience: '20+ Years',
      specialization: 'Commercial Power Systems',
      certifications: ['Master Electrician', 'Generac Elite', 'NECA Member'],
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Sarah Johnson',
      title: 'VP of Operations',
      experience: '15+ Years',
      specialization: 'Project Management',
      certifications: ['PMP Certified', 'OSHA 30', 'Quality Control'],
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b44b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Mike Thompson',
      title: 'Lead Service Technician',
      experience: '18+ Years',
      specialization: 'Emergency Response',
      certifications: ['Caterpillar Certified', 'Kohler Trained', 'EPA Certified'],
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ];

  const companyStats = [
    { number: '2008', label: 'Founded in Houston', icon: Calendar },
    { number: '500+', label: 'Projects Completed', icon: Briefcase },
    { number: '15+', label: 'Years of Excellence', icon: Award },
    { number: '24/7', label: 'Emergency Support', icon: Shield },
    { number: '99.9%', label: 'Customer Satisfaction', icon: Star },
    { number: '50+', label: 'Team Members', icon: Users }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Reliability',
      description: 'Delivering dependable power solutions that businesses can count on, every time.'
    },
    {
      icon: Heart,
      title: 'Community Focus',
      description: 'Proud to serve Houston and support our local businesses and families.'
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'Committed to the highest standards of quality, safety, and customer service.'
    },
    {
      icon: Users,
      title: 'Partnership',
      description: 'Building long-term relationships based on trust, expertise, and mutual success.'
    }
  ];

  const certifications = [
    'Texas Licensed Electrical Contractor (TECL #12345)',
    'NECA Member - National Electrical Contractors Association',
    'EGSA Member - Electrical Generating Systems Association',
    'Generac PowerPro Elite Dealer Network',
    'Caterpillar Authorized Service Dealer',
    'Kohler Certified Installation Partner',
    'Cummins Authorized Distributor',
    'OSHA 10 & 30 Hour Certified Team',
    'EPA Section 608 Certified',
    'Better Business Bureau A+ Rating'
  ];

  const milestones = [
    {
      year: '2008',
      title: 'Company Founded',
      description: 'Started as a small electrical contractor specializing in generator services'
    },
    {
      year: '2012',
      title: 'Commercial Expansion',
      description: 'Expanded to serve Fortune 500 companies across Houston'
    },
    {
      year: '2015',
      title: 'Hurricane Response',
      description: 'Provided critical emergency services during major Houston storms'
    },
    {
      year: '2018',
      title: 'Technology Integration',
      description: 'Implemented advanced monitoring and smart grid technologies'
    },
    {
      year: '2020',
      title: 'Regional Growth',
      description: 'Expanded service area to cover all of Greater Houston'
    },
    {
      year: '2024',
      title: 'Industry Leadership',
      description: 'Recognized as Houston\'s premier generator service provider'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-28 pb-20 bg-gradient-to-br from-primary via-steel-800 to-steel-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-accent text-white border-accent px-4 py-2">
              Since 2008 - Houston's Trusted Power Partner
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              Powering Houston's
              <span className="block text-accent">Success Stories</span>
            </h1>
            <p className="text-xl text-steel-200 mb-10 leading-relaxed max-w-3xl mx-auto">
              For over 15 years, HOU GEN PROS has been Houston's premier generator solutions provider, 
              delivering Fortune 500-level service to businesses and families across Greater Houston.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-accent hover:bg-orange-600 text-white px-8 py-4">
                <Phone className="w-5 h-5 mr-2" />
                Meet Our Team
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4">
                <MessageSquare className="w-5 h-5 mr-2" />
                Our Story
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-20 bg-steel-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
            {companyStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={index}
                  className="text-center animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-steel-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-primary mb-6">Our Houston Story</h2>
              <p className="text-xl text-steel-600 max-w-3xl mx-auto">
                Born and raised in Houston, we understand the unique power challenges our community faces.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Houston skyline"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
              
              <div className="space-y-8">
                <p className="text-lg text-steel-600 leading-relaxed">
                  Founded in 2008 by Master Electrician Jeff Ali, HOU GEN PROS began with a simple mission: 
                  provide Houston businesses and families with reliable, professional generator solutions they can trust.
                </p>
                
                <p className="text-lg text-steel-600 leading-relaxed">
                  From our humble beginnings as a small electrical contractor, we've grown into Houston's most trusted 
                  generator service provider, serving everyone from Fortune 500 corporations to local families.
                </p>
                
                <p className="text-lg text-steel-600 leading-relaxed">
                  Through hurricanes, winter storms, and summer blackouts, we've been there for our community, 
                  providing the power solutions that keep Houston running.
                </p>
                
                <div className="flex items-center space-x-4 pt-6">
                  <MapPin className="w-6 h-6 text-accent" />
                  <span className="text-steel-700 font-medium text-lg">Proudly serving Greater Houston since 2008</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 bg-steel-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-6">Our Journey</h2>
            <p className="text-xl text-steel-600 max-w-3xl mx-auto">
              Key milestones in our growth as Houston's premier generator service provider.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div 
                  key={index} 
                  className="flex items-start space-x-8 animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex-shrink-0 w-24 text-center">
                    <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {milestone.year}
                    </div>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-2xl font-bold text-primary mb-3">{milestone.title}</h3>
                    <p className="text-lg text-steel-600">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-6">Meet Our Leadership Team</h2>
            <p className="text-xl text-steel-600 max-w-3xl mx-auto">
              Experienced professionals dedicated to delivering exceptional generator solutions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {teamMembers.map((member, index) => (
              <Card 
                key={index} 
                className="text-center hover:shadow-xl transition-all duration-300 animate-fade-in border-0 shadow-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8">
                  <div className="relative mb-8">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-accent/20"
                    />
                    <Badge className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-accent text-white px-3 py-1">
                      {member.experience}
                    </Badge>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-primary mb-2">{member.name}</h3>
                  <p className="text-accent font-semibold mb-4 text-lg">{member.title}</p>
                  <p className="text-steel-600 mb-6">{member.specialization}</p>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-primary">Certifications:</h4>
                    {member.certifications.map((cert, idx) => (
                      <div key={idx} className="flex items-center justify-center text-sm text-steel-600">
                        <CheckCircle className="w-4 h-4 text-accent mr-2" />
                        {cert}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-steel-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-6">Our Core Values</h2>
            <p className="text-xl text-steel-600 max-w-3xl mx-auto">
              The principles that guide everything we do for our Houston community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div 
                  key={index}
                  className="text-center group animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-4">{value.title}</h3>
                  <p className="text-steel-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-6">Licenses & Certifications</h2>
            <p className="text-xl text-steel-600 max-w-3xl mx-auto">
              Fully licensed, bonded, and certified by leading industry organizations.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications.map((cert, index) => (
                <div 
                  key={index} 
                  className="flex items-center space-x-4 p-6 bg-steel-50 rounded-lg animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0" />
                  <span className="text-steel-700 text-lg">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience the HOU GEN PROS Difference?</h2>
          <p className="text-xl text-steel-200 mb-10 max-w-3xl mx-auto">
            Join hundreds of satisfied Houston customers who trust us with their power needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-accent hover:bg-orange-600 text-white px-8 py-4">
              <Phone className="w-5 h-5 mr-2" />
              (832) 555-POWER
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4">
              <MessageSquare className="w-5 h-5 mr-2" />
              Start Your Project
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
