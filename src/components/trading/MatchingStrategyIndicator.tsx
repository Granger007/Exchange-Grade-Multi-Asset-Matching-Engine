'use client';

import React, { useState } from 'react';

export const MatchingStrategyIndicator = () => {
  const [strategy, setStrategy] = useState<"FIFO" | "PRO_RATA">("FIFO");

  return (
    <div className="mt-4 mx-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg px-3 py-3 flex flex-col">
      <span className="text-white/50 text-[10px] uppercase tracking-wider mb-2 text-center">
        Matching Engine
      </span>
      <div className="flex rounded-lg bg-black/20 p-1 border border-white/5">
        <button
          onClick={() => setStrategy("FIFO")}
          className={`flex-1 text-xs font-semibold py-1.5 rounded-md transition-all duration-300 ${
            strategy === "FIFO" 
              ? "bg-primary-blue/20 text-primary-blue shadow" 
              : "text-white/40 hover:text-white/70"
          }`}
          title="Orders are matched in time priority"
        >
          FIFO
        </button>
        <button
          onClick={() => setStrategy("PRO_RATA")}
          className={`flex-1 text-xs font-semibold py-1.5 rounded-md transition-all duration-300 ${
            strategy === "PRO_RATA" 
              ? "bg-primary-purple/20 text-primary-purple shadow" 
              : "text-white/40 hover:text-white/70"
          }`}
          title="Orders are matched proportionally by size"
        >
          Pro-rata
        </button>
      </div>
    </div>
  );
};
