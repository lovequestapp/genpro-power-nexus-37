import { Shield, Award, Star, Clock, Users, Zap, CheckCircle2, Building2, Factory, HeartPulse, HardHat, Landmark, Music2 } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

const HomeContent = () => {
  return (
    <div className="py-16 sm:py-24">
      {/* Why Choose Us Section */}
      <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 mb-20 overflow-visible">
        {/* Premium Light Gradient Background */}
        <div className="absolute inset-0 -z-10 premium-gradient animate-gradient-x" />
        {/* Animated Accent Glow */}
        <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-32 bg-accent/10 rounded-full blur-3xl animate-float" />
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-primary animate-fade-in">Why Choose HOU GEN PROS</h2>
          <p className="text-steel-600 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
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
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.04, boxShadow: '0 4px 32px 0 #f9731633' }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="relative group card-glass p-8 overflow-visible hover-lift"
            >
              {/* Animated Accent Glow */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-8 bg-accent/20 rounded-full blur-xl group-hover:opacity-80 opacity-60 transition-all duration-300 animate-float" />
              {/* Animated Icon Glow */}
              <div className="flex items-center justify-center mb-6">
                <span className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100">
                  <feature.icon className="w-8 h-8 text-accent" />
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-steel-900 animate-fade-in" style={{ animationDelay: '0.1s' }}>{feature.title}</h3>
              <p className="text-steel-800 animate-fade-in" style={{ animationDelay: '0.2s' }}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Our Process Section */}
      <section className="relative bg-steel-50 py-16 sm:py-24 mb-20 overflow-visible">
        {/* Subtle animated background gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/5 via-white to-steel-100 animate-gradient-x" />
        {/* Animated accent glow */}
        <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-80 h-24 bg-accent/10 rounded-full blur-2xl animate-float" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-primary animate-fade-in">Our Process</h2>
            <p className="text-steel-600 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              A streamlined approach to delivering exceptional generator solutions
            </p>
          </div>
          {/* Animated horizontal stepper */}
          <div className="relative flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-0">
            {/* Animated flow line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
              className="hidden lg:block absolute left-0 right-0 top-1/2 h-1 bg-gradient-to-r from-accent/30 via-orange-200/40 to-accent/30 rounded-full z-0 origin-left"
              style={{ width: '100%' }}
            />
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
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 + index * 0.15 }}
                viewport={{ once: true }}
                className="relative z-10 flex-1 max-w-xs mx-2 group"
              >
                {/* Animated accent glow */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-6 bg-accent/20 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-all duration-300 animate-float" />
                <div className="card-glass p-8 rounded-2xl shadow-xl hover-lift transition-all duration-300 group-hover:shadow-accent/30 group-hover:scale-105">
                  <div className="text-3xl font-extrabold text-accent/80 mb-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>{step.step}</div>
                  <h3 className="text-xl font-bold mb-2 text-primary animate-fade-in" style={{ animationDelay: '0.15s' }}>{step.title}</h3>
                  <p className="text-steel-700 animate-fade-in" style={{ animationDelay: '0.2s' }}>{step.description}</p>
                </div>
                {/* Animated connector dot */}
                {index < 3 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.15 }}
                    viewport={{ once: true }}
                    className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-accent rounded-full shadow-lg border-4 border-white z-20 animate-pulse-glow"
                  />
                )}
              </motion.div>
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