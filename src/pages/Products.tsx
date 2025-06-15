import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';

interface GeneratorProduct {
  id: string;
  model: string;
  type: 'Residential';
  powerKW: string;
  price: number;
  installedPrice?: number;
  features: string[];
  image: string;
  badge?: {
    text: string;
    variant: 'default' | 'destructive' | 'outline' | 'secondary';
  };
}

const generators: GeneratorProduct[] = [
  {
    id: 'gen-18kw',
    model: 'Generac 18KW Standby',
    type: 'Residential',
    powerKW: '18kW',
    price: 5200,
    features: [
      'Automatic Start',
      'Quiet Operation',
      '10-Year Warranty',
      'WiFi Monitoring'
    ],
    image: '/1.jpg',
    badge: {
      text: 'In Stock',
      variant: 'default'
    }
  },
  {
    id: 'gen-22kw',
    model: 'Generac 22KW Standby',
    type: 'Residential',
    powerKW: '22kW',
    price: 5600,
    features: [
      'Whole Home Power',
      'Natural Gas/Propane',
      'Mobile App Control',
      'Weather Resistant'
    ],
    image: '/2.jpg',
    badge: {
      text: 'Most Popular',
      variant: 'secondary'
    }
  },
  {
    id: 'gen-24kw',
    model: 'Generac 24KW Standby',
    type: 'Residential',
    powerKW: '24kW',
    price: 6000,
    features: [
      'Extended Coverage',
      'Automatic Transfer',
      '5-Year Warranty',
      'Professional Install'
    ],
    image: '/1.jpg',
    badge: {
      text: 'New',
      variant: 'outline'
    }
  },
  {
    id: 'gen-26kw',
    model: 'Generac 26KW Standby',
    type: 'Residential',
    powerKW: '26kW',
    price: 6500,
    installedPrice: 10250,
    features: [
      'Maximum Coverage',
      '200 Amp Ready',
      'Premium Features',
      'Best Value'
    ],
    image: '/2.jpg',
    badge: {
      text: 'Summer Special',
      variant: 'destructive'
    }
  }
];

const ProductCard = ({ product }: { product: GeneratorProduct }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-lg shadow-lg overflow-hidden group"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.model}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {product.badge && (
          <Badge
            variant={product.badge.variant}
            className="absolute top-4 left-4 shadow-lg"
          >
            {product.badge.text}
          </Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <Badge variant="outline" className="mb-2">
            {product.type}
          </Badge>
          <h3 className="text-2xl font-bold text-steel-800">
            {product.model}
          </h3>
          <div className="text-xl font-semibold text-accent mt-1">
            {product.powerKW}
          </div>
        </div>

        <div className="mb-6">
          <div className="text-3xl font-bold text-steel-800">
            ${product.price.toLocaleString()}
          </div>
          <div className="text-steel-500 text-sm">
            Equipment Only
          </div>
          {product.installedPrice && (
            <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
              <div className="text-2xl font-bold text-red-600">
                ${product.installedPrice.toLocaleString()}
              </div>
              <div className="text-red-600 text-sm">
                Installed Package
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3 mb-6">
          {product.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-steel-600">
              <Check className="w-5 h-5 text-accent flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <Button 
          className="w-full justify-center group"
          variant="outline"
        >
          <span>Get Quote</span>
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </motion.div>
  );
};

const Products = () => {
  return (
    <div className="section-padding bg-white">
      <div className="container mx-auto container-padding">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-6 text-accent border-accent">
              Generac Home Generators - In Stock Now!
            </Badge>
            <h1 className="text-gradient mb-6">
              Brand New Generac Generators
            </h1>
            <p className="text-xl text-steel-600">
              Whole home backup power for Houston & surrounding areas. Professional installation available with 3-5 hour setup and 5-year manufacturer warranty.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {generators.map((generator) => (
            <ProductCard key={generator.id} product={generator} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-steel-800 mb-4">
              Need Help Choosing?
            </h3>
            <p className="text-steel-600 mb-8">
              Our experts are here to help you select the perfect generator for your home. Contact us for a free consultation.
            </p>
            <Button 
              size="lg"
              className="accent-gradient text-white px-8"
            >
              Schedule a Consultation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Products;