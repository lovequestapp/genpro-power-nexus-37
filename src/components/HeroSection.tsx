
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Zap, Clock, Phone } from 'lucide-react';

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
            <span className="text-sm font-medium text-accent">Houston Generator Pros - Your Trusted Generator Experts</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6 leading-tight animate-fade-in">
            Whole Home Backup Power.
            <br />
            <span className="text-accent">Houston & Surrounding Areas.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-steel-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            Brand new Generac generators in stock now! Professional installation in 3-5 hours. 
            Licensed, insured, and trusted by Houston homeowners.
          </p>

          {/* Main CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
            <Button size="lg" className="bg-accent hover:bg-orange-600 text-white px-8 py-6 text-lg font-semibold">
              <Phone className="w-5 h-5 mr-2" />
              Call for Free Quote
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 text-lg font-semibold">
              View Summer Special
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-steel-400 text-steel-700 hover:bg-steel-100 px-8 py-6 text-lg font-semibold">
              <Zap className="w-5 h-5 mr-2" />
              Emergency Power
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center animate-slide-in">
              <div className="text-3xl font-bold text-accent mb-2">3-5 Hours</div>
              <div className="text-steel-600 font-medium">Fast Installation</div>
            </div>
            <div className="text-center animate-slide-in">
              <div className="text-3xl font-bold text-accent mb-2">In Stock</div>
              <div className="text-steel-600 font-medium">Brand New Generac Units</div>
            </div>
            <div className="text-center animate-slide-in">
              <div className="text-3xl font-bold text-accent mb-2">5-Year</div>
              <div className="text-steel-600 font-medium">Manufacturer Warranty</div>
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
