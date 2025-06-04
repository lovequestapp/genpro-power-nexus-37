
import { Badge } from '@/components/ui/badge';
import { Star, Shield, Award, Clock } from 'lucide-react';

const TrustIndicators = () => {
  const certifications = [
    { name: "Generac Authorized", logo: "🏭" },
    { name: "Caterpillar Certified", logo: "🐛" },
    { name: "Kohler Elite", logo: "⚡" },
    { name: "Cummins Partner", logo: "🔧" },
  ];

  const stats = [
    { number: "15+", label: "Years Experience", icon: Clock },
    { number: "500+", label: "Projects Completed", icon: Award },
    { number: "99.9%", label: "Uptime Achieved", icon: Shield },
    { number: "24/7", label: "Support Available", icon: Star },
  ];

  return (
    <section className="py-16 bg-white border-t border-steel-200">
      <div className="container mx-auto px-6">
        {/* Certifications */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-steel-600">
            Certified Excellence
          </Badge>
          <h3 className="text-2xl font-bold text-primary mb-8">
            Authorized by Industry Leaders
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {certifications.map((cert, index) => (
              <div 
                key={index}
                className="flex items-center space-x-3 text-steel-600 hover:text-accent transition-colors duration-300"
              >
                <span className="text-2xl">{cert.logo}</span>
                <span className="font-semibold">{cert.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="mb-3">
                  <IconComponent className="w-8 h-8 text-accent mx-auto mb-2" />
                </div>
                <div className="text-3xl font-bold text-primary mb-1">
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
  );
};

export default TrustIndicators;
