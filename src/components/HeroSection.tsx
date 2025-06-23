
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Zap, Clock, Phone, Star, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-steel-50 via-white to-steel-100 pt-20 sm:pt-24 lg:pt-28 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmMWY1ZjkiIGZpbGwtb3BhY2l0eT0iMC4zIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
        {/* Improved mobile-friendly floating animations */}
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 lg:left-20 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-accent/10 rounded-full blur-2xl sm:blur-3xl animate-[float_6s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 lg:right-20 w-40 h-40 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-primary/5 rounded-full blur-2xl sm:blur-3xl animate-[float_8s_ease-in-out_infinite_2s]"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-6xl mx-auto">
          {/* Premium Badge - Enhanced mobile animations */}
          <div className="inline-flex items-center px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-white/90 backdrop-blur-md border border-steel-200/60 rounded-full mb-4 sm:mb-6 lg:mb-8 animate-[fadeInUp_0.8s_ease-out] hover:scale-105 transition-transform duration-300 group shadow-lg max-w-[90%] sm:max-w-none">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-accent mr-1 sm:mr-2 lg:mr-3 group-hover:animate-pulse flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-steel-700 text-center">Houston's Premier Generator Installation Experts</span>
            <div className="ml-1 sm:ml-2 lg:ml-3 flex space-x-0.5 sm:space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>

          {/* Enhanced Main Headline - Better mobile animations */}
          <h1 className="font-display font-bold text-primary mb-4 sm:mb-6 lg:mb-8 leading-tight animate-[fadeInUp_1s_ease-out_0.2s_both] text-balance text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl px-2 sm:px-0">
            Whole Home Backup Power
            <br />
            <span className="text-gradient bg-gradient-to-r from-accent to-orange-600 bg-clip-text text-transparent">When Houston Needs It Most</span>
          </h1>

          {/* Enhanced Subheadline - Mobile optimized */}
          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-steel-600 mb-6 sm:mb-8 lg:mb-12 max-w-4xl mx-auto leading-relaxed animate-[fadeInUp_1s_ease-out_0.4s_both] font-medium text-balance px-4 sm:px-2 lg:px-0">
            Professional Generac generator installation in 3-5 hours. Licensed, insured, and trusted by Houston homeowners for reliable backup power solutions.
          </p>

          {/* Enhanced CTAs - Better mobile experience */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 lg:mb-20 animate-[fadeInUp_1s_ease-out_0.6s_both] px-4 sm:px-0">
            <Link to="/get-quote" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="accent-gradient text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 text-sm sm:text-base lg:text-lg font-semibold shadow-premium hover:shadow-glow transition-all duration-300 hover:scale-105 w-full sm:w-auto touch-manipulation active:scale-95"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Get Free Estimate
              </Button>
            </Link>
            <Link to="/products" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 text-sm sm:text-base lg:text-lg font-semibold premium-border hover:scale-105 transition-all duration-300 w-full sm:w-auto touch-manipulation bg-white active:scale-95"
              >
                View Generators
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Enhanced Value Props - Mobile optimized animations */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-8 max-w-5xl mx-auto px-4 sm:px-2 lg:px-0 mb-8 sm:mb-12">
            {[
              { 
                icon: Clock,
                value: "3-5 Hours", 
                label: "Professional Installation", 
                delay: "0.8s",
                description: "Same-day service available"
              },
              { 
                icon: CheckCircle,
                value: "In Stock", 
                label: "Brand New Generac Units", 
                delay: "1s",
                description: "18KW to 26KW models ready"
              },
              { 
                icon: Shield,
                value: "Licensed", 
                label: "Insured & Certified", 
                delay: "1.2s",
                description: "Full warranty coverage"
              }
            ].map((item, index) => (
              <div 
                key={index}
                className={`text-center animate-[fadeInUp_1s_ease-out_${item.delay}_both] hover:scale-105 transition-all duration-300 group p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl bg-white/80 backdrop-blur-md border border-steel-200/40 shadow-sm hover:shadow-lg touch-manipulation active:scale-95`}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-2 sm:mb-3 bg-accent/10 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-accent" />
                </div>
                <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-primary mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                  {item.value}
                </div>
                <div className="text-steel-700 font-semibold text-xs sm:text-sm lg:text-base xl:text-lg mb-1">
                  {item.label}
                </div>
                <div className="text-steel-500 text-xs sm:text-sm">
                  {item.description}
                </div>
              </div>
            ))}
          </div>

          {/* Trust Indicators - Mobile friendly */}
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 lg:gap-8 text-steel-500 text-xs sm:text-sm animate-[fadeInUp_1s_ease-out_1.4s_both] px-4 sm:px-0">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
              <span>Licensed & Insured</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 flex-shrink-0" />
              <span>500+ Installations</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
              <span>Generac Authorized</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator - Hidden on Mobile */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-[bounce_2s_infinite] hidden sm:block">
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-steel-400 rounded-full flex justify-center hover:border-accent transition-colors duration-300">
          <div className="w-0.5 sm:w-1 h-2 sm:h-3 bg-steel-400 rounded-full mt-1.5 sm:mt-2 animate-[pulse_2s_infinite]"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
