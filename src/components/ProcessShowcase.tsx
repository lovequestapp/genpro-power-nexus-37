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
  const glyphs = '01⎇⎈⎊⎋⎌⎍⎎⎏⎐⎑⎒⎓⎔⎕⎖⎗⎘⎙⎚⎛⎜⎝⎞⎟⎠';
  const [glyphMatrix, setGlyphMatrix] = useState(() =>
    Array.from({ length: columns }, () =>
      Array.from({ length: rows }, () => glyphs[Math.floor(Math.random() * glyphs.length)])
    )
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setGlyphMatrix(matrix =>
        matrix.map(col =>
          col.map(() => glyphs[Math.floor(Math.random() * glyphs.length)])
        )
      );
    }, 400);
    return () => clearInterval(interval);
  }, []);
  return (
    <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ opacity: 0.14 }}>
      {glyphMatrix.map((col, colIdx) =>
        col.map((glyph, rowIdx) => (
          <text
            key={colIdx + '-' + rowIdx}
            x={`${(colIdx + 0.5) * (100 / columns)}vw`}
            y={`${(rowIdx + 1) * 10 + (mouse.y - 0.5) * 10}%`}
            fontSize="1.1em"
            fill={rowIdx % 2 === 0 ? '#00ff99' : '#ff9900'}
            style={{
              fontFamily: 'monospace',
              opacity: 0.5 + 0.5 * Math.sin(Date.now() / 1200 + colIdx + rowIdx),
              filter: 'blur(0.5px) drop-shadow(0 0 4px #00ff99)',
              willChange: 'opacity, filter',
            }}
          >
            {glyph}
          </text>
        ))
      )}
    </svg>
  );
});

// Animated grid overlay
const MatrixGrid = ({ mouse }) => (
  <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ opacity: 0.12 }}>
    {[...Array(12)].map((_, i) => (
      <motion.line
        key={'h' + i}
        x1={0}
        y1={i * 80 + 40 + (mouse.y - 0.5) * 40}
        x2={1000}
        y2={i * 80 + 40 - (mouse.y - 0.5) * 40}
        stroke="#00ff99"
        strokeOpacity={0.18}
        strokeWidth={1.5}
      />
    ))}
    {[...Array(24)].map((_, i) => (
      <motion.line
        key={'v' + i}
        x1={i * 40 + 20 + (mouse.x - 0.5) * 20}
        y1={0}
        x2={i * 40 + 20 - (mouse.x - 0.5) * 20}
        y2={1000}
        stroke="#ff9900"
        strokeOpacity={0.12}
        strokeWidth={1}
      />
    ))}
  </svg>
);

// Matrix-style animated headline
const MatrixHeadline = ({ text }) => {
  const [display, setDisplay] = useState('');
  useEffect(() => {
    let i = 0;
    let interval = setInterval(() => {
      setDisplay(text.slice(0, i) + (i < text.length ? '█' : ''));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, [text]);
  return (
    <h2 className="text-5xl md:text-7xl font-extrabold text-white text-center drop-shadow-[0_4px_32px_#00ff99] mb-8 tracking-tight font-mono select-none">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-white to-orange-400 animate-pulse">
        {display}
      </span>
    </h2>
  );
};

// Simple static generator visualization
const GeneratorVisual: React.FC<{ activeStep: number }> = React.memo(({ activeStep }) => (
  <div className="relative flex items-center justify-center">
    <div className="relative w-48 h-48">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-4 border-accent/30" />
      
      {/* Inner ring */}
      <div className="absolute inset-4 rounded-full border-2 border-accent/20" />
      
      {/* Core circle */}
      <div className="absolute inset-8 rounded-full bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20" />
      
      {/* Active step indicator */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(
            from ${activeStep * 60}deg,
            transparent 0deg,
            #ff9900 60deg,
            transparent 120deg
          )`
        }}
      />
      
      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Zap className="w-12 h-12 text-accent" />
      </div>
    </div>
  </div>
));

const AnimatedCircuit = ({ activeStep, prevStep, pulseProgress }) => (
  <svg viewBox="0 0 1000 400" className="w-full h-64 md:h-80 lg:h-96">
    {/* Circuit Path */}
    <motion.path
      d={circuitPath}
      fill="none"
      stroke="#ff9900"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ filter: 'drop-shadow(0 0 16px #ff9900)' }}
    />
    {/* Electric Pulse */}
    {typeof pulseProgress === 'number' && (
      <motion.circle
        r="18"
        fill="url(#pulseGradient)"
        cx={(() => {
          const t = prevStep < activeStep
            ? prevStep / (processSteps.length - 1) + (pulseProgress * (activeStep - prevStep) / (processSteps.length - 1))
            : prevStep / (processSteps.length - 1) - (pulseProgress * (prevStep - activeStep) / (processSteps.length - 1));
          return 100 + 800 * t;
        })()}
        cy={(() => {
          // Quadratic Bezier: y = (1-t)^2*300 + 2*(1-t)*t*100 + t^2*300
          const t = prevStep < activeStep
            ? prevStep / (processSteps.length - 1) + (pulseProgress * (activeStep - prevStep) / (processSteps.length - 1))
            : prevStep / (processSteps.length - 1) - (pulseProgress * (prevStep - activeStep) / (processSteps.length - 1));
          return (1 - t) * (1 - t) * 300 + 2 * (1 - t) * t * 100 + t * t * 300;
        })()}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
        style={{ filter: 'drop-shadow(0 0 24px #fffbe6)' }}
      />
    )}
    <defs>
      <radialGradient id="pulseGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff" stopOpacity="1" />
        <stop offset="100%" stopColor="#ff9900" stopOpacity="0.7" />
      </radialGradient>
    </defs>
    {/* Nodes */}
    {nodePositions.map((x, i) => (
      <motion.circle
        key={i}
        cx={x}
        cy={300}
        r={activeStep === i ? 32 : 22}
        fill={activeStep === i ? 'url(#pulseGradient)' : '#18181b'}
        stroke="#ff9900"
        strokeWidth={activeStep === i ? 7 : 3}
        animate={activeStep === i ? { scale: [1, 1.15, 1] } : { scale: 1 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
        style={{ filter: activeStep === i ? 'drop-shadow(0 0 32px #ff9900)' : 'drop-shadow(0 0 8px #ff9900)', cursor: 'pointer' }}
      />
    ))}
    {/* Energy rings and sparks on active node */}
    {nodePositions.map((x, i) => activeStep === i && (
      <g key={i}>
        {[...Array(2)].map((_, j) => (
          <motion.circle
            key={j}
            cx={x}
            cy={300}
            r={38 + j * 8}
            fill="none"
            stroke="#fffbe6"
            strokeWidth="2"
            animate={{ opacity: [0.7, 0, 0.7], scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 + j * 0.5, ease: 'easeInOut', delay: j * 0.2 }}
            style={{ filter: 'drop-shadow(0 0 16px #fffbe6)' }}
          />
        ))}
        {/* Sparks */}
        {[...Array(8)].map((_, k) => (
          <motion.circle
            key={k}
            cx={x + Math.cos((k / 8) * 2 * Math.PI) * 44}
            cy={300 + Math.sin((k / 8) * 2 * Math.PI) * 44}
            r={2 + Math.random() * 2}
            fill="#fffbe6"
            animate={{ opacity: [1, 0, 1], scale: [1, 1.5, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 + Math.random(), delay: k * 0.1 }}
          />
        ))}
      </g>
    ))}
  </svg>
);

const AnimatedFeatureChip = ({ icon, text, tooltip, delay }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100/80 to-white/80 border-2 border-orange-400 shadow-lg cursor-pointer group"
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: 'spring' }}
      whileHover={{ scale: 1.08, boxShadow: '0 0 24px 8px #ff9900' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="font-semibold text-orange-900">{text}</span>
      {/* Energy ring */}
      <motion.span
        className="absolute inset-0 rounded-full border-2 border-orange-300 pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0.3, scale: hovered ? 1.15 : 1 }}
        transition={{ duration: 0.3 }}
        style={{ boxShadow: hovered ? '0 0 24px 8px #ff9900' : '0 0 8px 2px #ff9900' }}
      />
      {/* Spark */}
      {hovered && (
        <motion.span
          className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-orange-400 animate-pulse"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1], opacity: [1, 0.7, 0] }}
          transition={{ duration: 0.5 }}
        />
      )}
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm shadow-xl z-20 whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            {tooltip}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AnimatedInput = ({ field, value, onChange, error }) => (
  <motion.div className="w-full mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
    <label className="block mb-2 text-orange-900 font-semibold text-lg drop-shadow-sm" htmlFor={field.name}>{field.label}{field.required && <span className="text-orange-500">*</span>}</label>
    <motion.input
      id={field.name}
      name={field.name}
      type={field.type}
      value={value}
      onChange={onChange}
      required={field.required}
      className={`w-full px-5 py-3 rounded-xl bg-white/80 border-2 ${error ? 'border-red-500' : 'border-orange-300'} text-orange-900 text-lg font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300`}
      whileFocus={{ scale: 1.03, boxShadow: '0 0 16px 4px #ff9900' }}
      autoComplete="off"
    />
    {error && <div className="text-red-500 text-sm mt-1 animate-pulse">{error}</div>}
  </motion.div>
);

const FloatingInfoPanel = ({ step, active, style, formData, setFormData, errors, setErrors, onNext, onBack, isLast, isFirst, isValid, submitting, completed }) => {
  const [showPanel, setShowPanel] = useState(false);
  useEffect(() => { setShowPanel(active); }, [active]);
  return (
    <AnimatePresence>
      {showPanel && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.8, filter: 'blur(16px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: 40, scale: 0.8, filter: 'blur(16px)' }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="absolute left-1/2 -translate-x-1/2 top-10 sm:top-16 z-20 w-full max-w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-xl"
          style={style}
        >
          <motion.div
            className="bg-gradient-to-br from-orange-500/90 to-white/80 rounded-3xl shadow-2xl px-4 py-6 sm:px-8 sm:py-10 flex flex-col items-center border-4 border-white/30 backdrop-blur-2xl relative overflow-hidden min-w-0 max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.7, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.7 }}
          >
            <motion.div
              className="absolute left-1/2 top-1/2 w-72 h-72 sm:w-96 sm:h-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-200/30 pointer-events-none"
              initial={{ scale: 0, opacity: 0.7 }}
              animate={{ scale: [0, 1.2, 1], opacity: [0.7, 0.2, 0] }}
              transition={{ duration: 0.7 }}
            />
            <div className="mb-4 text-3xl sm:text-4xl text-orange-600 animate-pulse z-10">{step.icon}</div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-orange-900 mb-2 text-center drop-shadow-lg z-10">{step.title}</h3>
            <p className="text-base sm:text-lg text-orange-900/90 mb-4 text-center font-light z-10">{step.description}</p>
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center mt-4 z-10 mb-6">
              {step.features.map((f, i) => (
                <AnimatedFeatureChip
                  key={i}
                  icon={f.icon}
                  text={f.label}
                  tooltip={f.tooltip}
                  delay={0.3 + i * 0.15}
                />
              ))}
            </div>
            {/* Step Form */}
            <form className="w-full max-w-full flex flex-col items-center" onSubmit={e => { e.preventDefault(); onNext(); }}>
              {step.form && step.form.map((field, i) => (
                <AnimatedInput
                  key={field.name}
                  field={field}
                  value={formData[field.name] || ''}
                  onChange={e => setFormData(d => ({ ...d, [field.name]: e.target.value }))}
                  error={errors[field.name]}
                />
              ))}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 w-full justify-between">
                {!isFirst && (
                  <motion.button
                    type="button"
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-orange-200 to-orange-400 text-orange-900 font-bold shadow hover:scale-105 transition-all border-2 border-orange-300 w-full sm:w-auto"
                    whileHover={{ scale: 1.08 }}
                    onClick={onBack}
                  >
                    Back
                  </motion.button>
                )}
                <motion.button
                  type="submit"
                  className={`px-8 py-3 rounded-full bg-gradient-to-r from-orange-400 via-white to-orange-400 text-orange-900 font-extrabold shadow-[0_0_32px_4px_#ff9900] border-2 border-white/30 transition-all relative w-full sm:w-auto ${!isValid || submitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
                  whileHover={isValid && !submitting ? { scale: 1.12 } : {}}
                  disabled={!isValid || submitting}
                >
                  {isLast ? (submitting ? 'Finishing...' : 'Finish') : (submitting ? 'Loading...' : 'Next')}
                  <motion.span
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                  >
                    <Zap className="w-5 h-5 text-orange-500" />
                  </motion.span>
                </motion.button>
              </div>
            </form>
            {completed && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-3xl z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
              >
                <div className="text-5xl text-orange-600 mb-4 animate-pulse"><Zap /></div>
                <h4 className="text-2xl font-bold text-orange-900 mb-2">All Steps Complete!</h4>
                <p className="text-lg text-orange-900/80 mb-4">Thank you for completing the process. Our team will contact you soon.</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProcessShowcase = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [prevStep, setPrevStep] = useState(0);
  const [pulseProgress, setPulseProgress] = useState(null);
  const mouse = useThrottledMouse();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Animate electric pulse on step change
  useEffect(() => {
    if (activeStep !== prevStep) {
      setPulseProgress(0);
      const timer = setTimeout(() => {
        setPulseProgress(1);
        setTimeout(() => setPulseProgress(null), 1000);
      }, 100);
      setPrevStep(activeStep);
      return () => clearTimeout(timer);
    }
  }, [activeStep, prevStep]);

  // Progress bar
  const progress = (activeStep + (completed ? 1 : 0)) / processSteps.length;

  return (
    <section className="relative min-h-screen py-20 px-2 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden flex flex-col items-center justify-center">
      {/* Matrix-style background */}
      <MatrixGlyphs mouse={mouse} />
      <MatrixGrid mouse={mouse} />
      <AnimatedBackground mouse={mouse} />
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">
        {/* Enhanced Luxury Title */}
        <div className="relative mb-8">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-white via-accent to-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block">Premium</span>{" "}
            <span className="inline-block text-accent">Generator</span>{" "}
            <span className="inline-block">Solutions</span>
          </motion.h1>
          <motion.div 
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-accent to-transparent"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "8rem", opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
          <motion.div 
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent blur-sm"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "6rem", opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          />
        </div>

        {/* Progress Indicator - Enhanced */}
        <div className="w-full max-w-2xl mb-12">
          <div className="relative h-2 rounded-full bg-accent/10 overflow-hidden backdrop-blur-sm">
            <motion.div
              className="absolute left-0 top-0 h-2 bg-gradient-to-r from-accent/80 via-white to-accent/80 rounded-full"
              style={{ width: `${progress * 100}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.7 }}
            />
            <motion.div
              className="absolute left-0 top-0 h-2 bg-gradient-to-r from-accent/40 via-white/40 to-accent/40 rounded-full blur-md"
              style={{ width: `${progress * 100}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.7 }}
            />
          </div>
        </div>

        {/* Process Steps - Enhanced */}
        <div className="w-full max-w-4xl mx-auto">
          <AnimatedCircuit activeStep={activeStep} prevStep={prevStep} pulseProgress={pulseProgress} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.id}
                className={`relative p-5 rounded-xl border transition-all duration-300 backdrop-blur-sm ${
                  index === activeStep
                    ? 'border-accent/50 bg-accent/5 shadow-[0_0_32px_-8px_rgba(255,153,0,0.3)]'
                    : index < activeStep
                    ? 'border-green-500/30 bg-green-500/5 shadow-[0_0_24px_-8px_rgba(34,197,94,0.2)]'
                    : 'border-gray-700/30 bg-gray-800/30 shadow-[0_0_24px_-8px_rgba(0,0,0,0.2)]'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: index === activeStep 
                    ? '0 0 40px -8px rgba(255,153,0,0.4)'
                    : index < activeStep
                    ? '0 0 32px -8px rgba(34,197,94,0.3)'
                    : '0 0 32px -8px rgba(0,0,0,0.3)'
                }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    index === activeStep
                      ? 'bg-accent text-black shadow-[0_0_16px_-4px_rgba(255,153,0,0.5)]'
                      : index < activeStep
                      ? 'bg-green-500/80 text-white shadow-[0_0_16px_-4px_rgba(34,197,94,0.3)]'
                      : 'bg-gray-700/50 text-gray-400'
                  }`}>
                    {index < activeStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-base font-bold">{index + 1}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold mb-1.5 text-white/90">{step.title}</h3>
                    <p className="text-sm text-gray-400/80 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons - Enhanced */}
        <div className="flex gap-4 mt-10">
          <Button
            variant="outline"
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            className="border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/50 transition-all duration-300"
          >
            Previous
          </Button>
          <Button
            onClick={() => {
              if (activeStep === processSteps.length - 1) {
                setCompleted(true);
              } else {
                setActiveStep(Math.min(processSteps.length - 1, activeStep + 1));
              }
            }}
            className="bg-accent/90 text-black hover:bg-accent shadow-[0_0_24px_-8px_rgba(255,153,0,0.4)] hover:shadow-[0_0_32px_-4px_rgba(255,153,0,0.6)] transition-all duration-300"
          >
            {activeStep === processSteps.length - 1 ? 'Complete' : 'Next'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProcessShowcase; 