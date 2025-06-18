import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Zap, Clock, Phone, Star, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-steel-50 via-white to-steel-100 pt-20 sm:pt-24 lg:pt-28 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmMWY1ZjkiIGZpbGwtb3BhY2l0eT0iMC4zIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
        <div className="absolute top-20 left-10 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-accent/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 sm:right-20 w-64 h-64 sm:w-96 sm:h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-6xl mx-auto">
          {/* Premium Badge */}
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white/90 backdrop-blur-md border border-steel-200/60 rounded-full mb-6 sm:mb-8 animate-fade-in hover-lift group shadow-lg">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-accent mr-2 sm:mr-3 group-hover:animate-pulse-glow flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-steel-700 text-center">Houston's Premier Generator Installation Experts</span>
            <div className="ml-2 sm:ml-3 flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>

          {/* Enhanced Main Headline */}
          <h1 className="font-display font-bold text-primary mb-6 sm:mb-8 leading-tight animate-fade-in text-balance text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            Whole Home Backup Power
            <br />
            <span className="text-gradient bg-gradient-to-r from-accent to-orange-600 bg-clip-text text-transparent">When Houston Needs It Most</span>
          </h1>

          {/* Enhanced Subheadline */}
          <p className="text-lg sm:text-xl lg:text-2xl text-steel-600 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in font-medium text-balance px-4 sm:px-0" style={{ animationDelay: '0.2s' }}>
            Professional Generac generator installation in 3-5 hours. Licensed, insured, and trusted by Houston homeowners for reliable backup power solutions.
          </p>

          {/* Enhanced CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-20 animate-fade-in px-4 sm:px-0" style={{ animationDelay: '0.4s' }}>
            <Link to="/get-quote" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="accent-gradient text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold shadow-premium hover:shadow-glow transition-all duration-300 hover-lift w-full sm:w-auto touch-manipulation hover:scale-105"
              >
                <Phone className="w-5 h-5 mr-2" />
                Get Free Estimate
              </Button>
            </Link>
            <Link to="/products" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold premium-border hover-lift transition-all duration-300 w-full sm:w-auto touch-manipulation bg-white"
              >
                View Generators
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Enhanced Value Props */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-5xl mx-auto px-4 sm:px-0 mb-12">
            {[
              { 
                icon: Clock,
                value: "3-5 Hours", 
                label: "Professional Installation", 
                delay: "0.6s",
                description: "Same-day service available"
              },
              { 
                icon: CheckCircle,
                value: "In Stock", 
                label: "Brand New Generac Units", 
                delay: "0.8s",
                description: "18KW to 26KW models ready"
              },
              { 
                icon: Shield,
                value: "Licensed", 
                label: "Insured & Certified", 
                delay: "1s",
                description: "Full warranty coverage"
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="text-center animate-fade-in hover-lift group p-4 sm:p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-steel-200/40 transition-all duration-300 shadow-sm hover:shadow-lg"
                style={{ animationDelay: item.delay }}
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                  {item.value}
                </div>
                <div className="text-steel-700 font-semibold text-sm sm:text-base lg:text-lg mb-1">
                  {item.label}
                </div>
                <div className="text-steel-500 text-xs sm:text-sm">
                  {item.description}
                </div>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-steel-500 text-sm animate-fade-in" style={{ animationDelay: '1.2s' }}>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Licensed & Insured</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>500+ Installations</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              <span>Generac Authorized</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator - Hidden on Mobile */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
        <div className="w-6 h-10 border-2 border-steel-400 rounded-full flex justify-center hover:border-accent transition-colors duration-300">
          <div className="w-1 h-3 bg-steel-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
