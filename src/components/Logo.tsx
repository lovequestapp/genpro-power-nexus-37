import React from 'react';
import { Zap } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
      <span className="text-3xl font-extrabold tracking-tighter">h</span>
      <div className="relative inline-block w-6 h-6 align-bottom">
        <div className="absolute inset-0 bg-black rounded-full" />
        <Zap className="absolute inset-0.5 text-white" strokeWidth={2.5} />
      </div>
      <span className="text-3xl font-extrabold tracking-tighter">u</span>
      <span className="text-3xl font-extrabold tracking-tighter text-gray-800">genpros</span>
    </div>
  );
} 