import { Shield, Award, Star, Clock, Users, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

const HomeContent = () => {
  return (
    <div className="py-16 sm:py-24">
      {/* Why Choose Us Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose HOU GEN PROS</h2>
          <p className="text-steel-600 max-w-2xl mx-auto">
            Experience the difference of working with Houston's premier generator solutions provider
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: "Licensed & Insured",
              description: "Full coverage and professional certification for your peace of mind"
            },
            {
              icon: Award,
              title: "Generac Authorized",
              description: "Official partnership with the industry's leading manufacturer"
            },
            {
              icon: Star,
              title: "500+ Happy Customers",
              description: "Trusted by businesses and homeowners across Texas"
            },
            {
              icon: Clock,
              title: "24/7 Emergency Service",
              description: "Round-the-clock support when you need it most"
            },
            {
              icon: Users,
              title: "Expert Team",
              description: "Certified technicians with years of experience"
            },
            {
              icon: Zap,
              title: "Premium Solutions",
              description: "State-of-the-art equipment and cutting-edge technology"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <feature.icon className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-steel-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Process Section */}
      <section className="bg-steel-50 py-16 sm:py-24 mb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Process</h2>
            <p className="text-steel-600 max-w-2xl mx-auto">
              A streamlined approach to delivering exceptional generator solutions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Consultation",
                description: "We assess your needs and recommend the perfect solution"
              },
              {
                step: "02",
                title: "Design",
                description: "Customized plans tailored to your specific requirements"
              },
              {
                step: "03",
                title: "Installation",
                description: "Professional setup by our certified technicians"
              },
              {
                step: "04",
                title: "Support",
                description: "Ongoing maintenance and 24/7 emergency service"
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="text-4xl font-bold text-accent/20 mb-4">{step.step}</div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-steel-600">{step.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-accent/20"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Industries We Serve</h2>
          <p className="text-steel-600 max-w-2xl mx-auto">
            Comprehensive power solutions for businesses across all sectors
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Healthcare",
              description: "Critical power systems for hospitals and medical facilities"
            },
            {
              title: "Construction",
              description: "Temporary and permanent power solutions for job sites"
            },
            {
              title: "Real Estate",
              description: "Backup power systems for commercial and residential properties"
            },
            {
              title: "Government",
              description: "Reliable power solutions for public facilities"
            },
            {
              title: "Events",
              description: "Temporary power for concerts, festivals, and special events"
            },
            {
              title: "Manufacturing",
              description: "Industrial-grade power systems for production facilities"
            }
          ].map((industry, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold mb-2">{industry.title}</h3>
              <p className="text-steel-600 mb-4">{industry.description}</p>
              <Link to="/industries" className="text-accent hover:text-accent/80 font-medium inline-flex items-center">
                Learn More
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Quality Guarantee */}
      <section className="bg-primary text-white py-16 sm:py-24 mb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Our Quality Guarantee</h2>
              <p className="text-steel-300 mb-8 text-lg">
                We stand behind every installation and service with our comprehensive quality guarantee. 
                Your satisfaction is our top priority.
              </p>
              <div className="space-y-4">
                {[
                  "Certified technicians",
                  "Premium equipment",
                  "Comprehensive warranty",
                  "24/7 support",
                  "Regular maintenance",
                  "Emergency response"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden">
                <img 
                  src="/images/quality-guarantee.jpg" 
                  alt="Quality Guarantee" 
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute inset-0 bg-accent/20 rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-accent/5 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Power Your Future?</h2>
          <p className="text-steel-600 max-w-2xl mx-auto mb-8">
            Get in touch with our team to discuss your power needs and discover how we can help
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/free-estimate">Get Free Estimate</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeContent; 