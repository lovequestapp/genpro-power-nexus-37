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
function getPointOnPath(path, t) {
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

const AnimatedBackground = ({ mouse }) => (
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
  const frame = useRef();
  useEffect(() => {
    const handle = (e) => {
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

// Matrix-style falling glyphs background (optimized)
const MatrixGlyphs: React.FC<MouseProps> = React.memo(({ mouse }) => {
  const columns = 16; // reduced for perf
  const rows = 8;
  const glyphs = '01⎇⎈⎊⎋⎌⎍⎎⎏⎐⎑
