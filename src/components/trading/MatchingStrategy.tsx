'use client';

import React from 'react';
import { Info } from 'lucide-react';

export const MatchingStrategy: React.FC = () => {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white text-sm">Active Strategy</h3>
        <div className="relative group">
          <Info size={16} className="text-white/50 hover:text-white cursor-help transition-colors" />
          <div className="absolute right-0 bottom-full mb-2 w-64 p-3 glass-card text-xs text-white/70 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            <strong>FIFO (First-In-First-Out):</strong> Orders at the same price level are executed based on the time they were received. The oldest order gets matched first.
          </div>
        </div>
      </div>
      
      <div className="mt-3 flex items-center space-x-2">
        <span className="px-2 py-1 rounded bg-primary-purple/20 text-primary-purple text-xs font-bold border border-primary-purple/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
          FIFO MATCHING
        </span>
        <span className="text-xs text-white/50">
          Engine Active
        </span>
      </div>
    </div>
  );
};
