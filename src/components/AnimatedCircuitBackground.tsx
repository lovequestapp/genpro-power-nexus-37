import React from 'react';

const AnimatedCircuitBackground = () => (
  <div className="fixed inset-0 -z-20 w-full h-full pointer-events-none">
    <svg width="100%" height="100%" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute w-full h-full">
      {/* Circuit lines */}
      <g stroke="currentColor" strokeWidth="2" className="text-accent/30 dark:text-accent/40">
        <polyline points="100,200 400,200 400,600 800,600" className="animate-circuit" />
        <polyline points="300,400 700,400 700,900 1200,900" className="animate-circuit" />
        <polyline points="600,100 1000,100 1000,500 1600,500" className="animate-circuit" />
        <polyline points="1200,300 1500,300 1500,800 1800,800" className="animate-circuit" />
      </g>
      {/* Glowing particles */}
      <g>
        <circle cx="400" cy="200" r="8" className="fill-accent/60 animate-pulse-glow" />
        <circle cx="700" cy="400" r="6" className="fill-orange-400/60 animate-float" />
        <circle cx="1000" cy="100" r="10" className="fill-accent/70 animate-pulse-glow" />
        <circle cx="1500" cy="300" r="7" className="fill-orange-400/70 animate-float" />
        <circle cx="1600" cy="500" r="5" className="fill-accent/60 animate-pulse-glow" />
        <circle cx="1800" cy="800" r="9" className="fill-orange-400/60 animate-float" />
      </g>
      <style>{`
        .animate-circuit {
          stroke-dasharray: 12 8;
          stroke-dashoffset: 0;
          animation: dashmove 6s linear infinite;
        }
        @keyframes dashmove {
          to { stroke-dashoffset: -40; }
        }
      `}</style>
    </svg>
  </div>
);

export default AnimatedCircuitBackground; 