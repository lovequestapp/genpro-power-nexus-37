
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Zap, Clock } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-steel-50 to-white pt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmMWY1ZjkiIGZpbGwtb3BhY2l0eT0iMC40Ij48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-8 animate-fade-in">
            <Shield className="w-4 h-4 text-accent mr-2" />
            <span className="text-sm font-medium text-accent">Fortune 500-Level Power Solutions</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6 leading-tight animate-fade-in">
            Powering Progress.
            <br />
            <span className="text-accent">Protecting Performance.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-steel-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            Premium generator solutions for commercial and residential clients. From emergency power to planned installations, 
            we deliver reliability when it matters most.
          </p>

          {/* Main CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
            <Button size="lg" className="bg-accent hover:bg-orange-600 text-white px-8 py-6 text-lg font-semibold">
              Explore Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 text-lg font-semibold">
              Emergency Power
              <Zap className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-steel-400 text-steel-700 hover:bg-steel-100 px-8 py-6 text-lg font-semibold">
              Get Quote
              <Clock className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center animate-slide-in">
              <div className="text-3xl font-bold text-accent mb-2">24/7</div>
              <div className="text-steel-600 font-medium">Emergency Support</div>
            </div>
            <div className="text-center animate-slide-in">
              <div className="text-3xl font-bold text-accent mb-2">500+</div>
              <div className="text-steel-600 font-medium">Projects Completed</div>
            </div>
            <div className="text-center animate-slide-in">
              <div className="text-3xl font-bold text-accent mb-2">99.9%</div>
              <div className="text-steel-600 font-medium">Uptime Reliability</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-steel-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-steel-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
