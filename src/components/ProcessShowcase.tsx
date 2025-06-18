
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import {
  Wrench,
  ClipboardCheck,
  Truck,
  Settings,
  Shield,
  Star,
  Zap,
  ThumbsUp,
  Award,
  BadgeCheck,
  Search,
  BarChart3,
  Cog,
  Check,
  Home,
  DollarSign,
  ShoppingCart,
  Clock,
  HardHat,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const processSteps = [
  {
    id: 'assessment',
    icon: Search,
    color: 'from-blue-500 to-blue-600',
    title: 'Initial Assessment',
    description: 'We evaluate your power needs and recommend the perfect generator solution.',
    features: [
      {
        label: 'Power Requirements',
        icon: Zap,
        tooltip: 'Calculate your home\'s power needs'
      },
      {
        label: 'Space Analysis',
        icon: Home,
        tooltip: 'Determine optimal generator placement'
      },
      {
        label: 'Budget Planning',
        icon: DollarSign,
        tooltip: 'Explore financing options'
      }
    ],
    form: [
      {
        name: 'squareFootage',
        label: 'Home Square Footage',
        type: 'number',
        required: true
      },
      {
        name: 'powerNeeds',
        label: 'Estimated Power Needs (kW)',
        type: 'number',
        required: true
      }
    ]
  },
  {
    id: 'selection',
    icon: ShoppingCart,
    color: 'from-green-500 to-green-600',
    title: 'Generator Selection',
    description: 'Choose from our range of high-quality Generac generators.',
    features: [
      {
        label: 'Model Comparison',
        icon: BarChart3,
        tooltip: 'Compare different generator models'
      },
      {
        label: 'Warranty Info',
        icon: Shield,
        tooltip: 'View warranty coverage details'
      },
      {
        label: 'Installation Time',
        icon: Clock,
        tooltip: 'Estimated installation duration'
      }
    ],
    form: [
      {
        name: 'selectedModel',
        label: 'Preferred Generator Model',
        type: 'select',
        required: true
      },
      {
        name: 'installationDate',
        label: 'Preferred Installation Date',
        type: 'date',
        required: true
      }
    ]
  },
  {
    id: 'installation',
    icon: Wrench,
    color: 'from-orange-500 to-orange-600',
    title: 'Professional Installation',
    description: 'Our certified technicians handle the complete installation process.',
    features: [
      {
        label: 'Site Preparation',
        icon: HardHat,
        tooltip: 'Prepare installation area'
      },
      {
        label: 'Safety Checks',
        icon: Shield,
        tooltip: 'Ensure safe installation'
      },
      {
        label: 'Quality Testing',
        icon: CheckCircle,
        tooltip: 'Verify proper operation'
      }
    ],
    form: [
      {
        name: 'contactName',
        label: 'Contact Person',
        type: 'text',
        required: true
      },
      {
        name: 'contactPhone',
        label: 'Contact Phone',
        type: 'tel',
        required: true
      }
    ]
  }
];

const whyChoose = [
  { icon: <ThumbsUp className="w-6 h-6 text-cyan-400" />, label: '5-Star Community Trust' },
  { icon: <Award className="w-6 h-6 text-yellow-400" />, label: 'Award-Winning Service' },
  { icon: <BadgeCheck className="w-6 h-6 text-green-400" />, label: 'Certified Technicians' },
  { icon: <Zap className="w-6 h-6 text-pink-400" />, label: 'Rapid Response' }
];

const nodePositions = [100, 300, 500, 700, 900];
const circuitPath = "M 100 300 Q 300 100 500 300 T 900 300";

const featureIcons = [
  [<Search className="w-5 h-5 text-orange-500" />, 'We visit your site to assess every detail.'],
  [<BarChart3 className="w-5 h-5 text-orange-500" />, 'We calculate your exact energy needs.'],
  [<Cog className="w-5 h-5 text-orange-500" />, 'We design a system just for you.']
];

// Helper to get point on SVG path at t (0-1)
function getPointOnPath(path: string, t: number) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  tempPath.setAttribute('d', path);
  svg.appendChild(tempPath);
  document.body.appendChild(svg);
  const len = tempPath.getTotalLength();
  const pt = tempPath.getPointAtLength(t * len);
  document.body.removeChild(svg);
  return pt;
}

const AnimatedBackground = ({ mouse }: { mouse: { x: number; y: number } }) => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    {/* Energy grid */}
    <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
      {[...Array(8)].map((_, i) => (
        <motion.line
          key={i}
          x1={0}
          y1={i * 80 + 40 + (mouse.y - 0.5) * 40}
          x2={1000}
          y2={i * 80 + 40 - (mouse.y - 0.5) * 40}
          stroke="#ff9900"
          strokeOpacity={0.08 + 0.04 * Math.sin(i + mouse.x * 4)}
          strokeWidth={2}
        />
      ))}
    </svg>
    {/* Parallax orbs */}
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-orange-400/30 blur-2xl"
        style={{ width: 60, height: 60, top: `${10 + i * 10}%`, left: `${i * 12}%` }}
        animate={{
          x: (mouse.x - 0.5) * 60,
          y: [0, 20, -20, 0]
        }}
        transition={{ repeat: Infinity, duration: 8 + i, ease: 'easeInOut' } as any}
      />
    ))}
  </div>
);

// Throttled mouse movement
const useThrottledMouse = () => {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const frame = useRef<number | null>(null);
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        setMouse({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight
        });
        frame.current = null;
      });
    };
    window.addEventListener('mousemove', handle);
    return () => {
      window.removeEventListener('mousemove', handle);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);
  return mouse;
};

// Add prop types
interface MouseProps {
  mouse: { x: number; y: number };
}
interface GeneratorGadgetProps extends MouseProps {
  activeStep: number;
}

interface PortalCircle {
  r: number;
  stroke: string;
  strokeWidth: number;
  dashArray: number;
  dashOffset: number;
  duration: number;
  opacity: number;
}

// Simplified matrix-style background with only energy symbols
const MatrixGlyphs: React.FC<MouseProps> = React.memo(({ mouse }) => {
  const columns = 12; // reduced for cleaner look
  const rows = 6;
  const energySymbols = '⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡'; // Only energy symbols
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
      {[...Array(columns)].map((_, col) => (
        <div
          key={col}
          className="absolute text-orange-500 font-mono text-lg"
          style={{
            left: `${(col / columns) * 100}%`,
            transform: `translateX(${(mouse.x - 0.5) * 15}px)`
          }}
        >
          {[...Array(rows)].map((_, row) => (
            <motion.span
              key={row}
              className="block h-8"
              animate={{
                opacity: [0, 0.8, 0],
                y: [0, 300]
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: 'linear'
              }}
            >
              {energySymbols[Math.floor(Math.random() * energySymbols.length)]}
            </motion.span>
          ))}
        </div>
      ))}
    </div>
  );
});

MatrixGlyphs.displayName = 'MatrixGlyphs';

const ProcessShowcase = () => {
  const mouse = useThrottledMouse();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-steel-900 via-primary to-steel-800 py-20 overflow-hidden">
      <AnimatedBackground mouse={mouse} />
      <MatrixGlyphs mouse={mouse} />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-6">
            Our Process
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto">
            From initial assessment to final installation, we guide you through every step
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 
                  cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-white/15
                  ${activeStep === index ? 'ring-2 ring-orange-500' : ''}`}
                onClick={() => setActiveStep(index)}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${step.color} 
                  flex items-center justify-center mb-4`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-white mb-4 leading-relaxed">{step.description}</p>
                
                {/* Features */}
                <div className="space-y-2">
                  {step.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-white">
                      <feature.icon className="w-4 h-4 mr-2 text-orange-400" />
                      <span className="text-sm text-white">{feature.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Why Choose Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-8">Why Choose Us?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {whyChoose.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center p-4 rounded-xl bg-white/10 backdrop-blur-sm"
                >
                  {item.icon}
                  <span className="text-white text-sm mt-2 text-center">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProcessShowcase;
