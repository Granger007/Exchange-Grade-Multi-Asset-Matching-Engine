import React, { useState } from 'react';
import { Button } from './Button';

export interface MatchingEngineToggleProps {
  onEngineChange?: (engine: 'FIFO' | 'PRO_RATA') => void;
  className?: string;
}

export const MatchingEngineToggle: React.FC<MatchingEngineToggleProps> = ({
  onEngineChange,
  className = ''
}) => {
  const [selectedEngine, setSelectedEngine] = useState<'FIFO' | 'PRO_RATA'>('FIFO');
  const [showToast, setShowToast] = useState(false);

  const handleFIFOClick = () => {
    setSelectedEngine('FIFO');
    onEngineChange?.('FIFO');
  };

  const handleProRataClick = () => {
    // Show toast notification for Pro-rata
    setShowToast(true);
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Toggle Buttons */}
      <div className="flex bg-white/5 rounded-lg p-1">
        <button
          onClick={handleFIFOClick}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            selectedEngine === 'FIFO'
              ? 'bg-primary-blue text-white shadow-lg'
              : 'text-white/50 hover:text-white'
          }`}
        >
          FIFO
        </button>
        <button
          onClick={handleProRataClick}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            selectedEngine === 'PRO_RATA'
              ? 'bg-primary-blue text-white shadow-lg'
              : 'text-white/50 hover:text-white opacity-60'
          }`}
          disabled={true}
          title="Pro-rata matching not yet implemented"
        >
          Pro-rata
        </button>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-yellow-500/90 text-black px-4 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          <div className="flex items-center space-x-2">
            <span className="font-medium">Coming soon:</span>
            <span>Pro-rata matching</span>
          </div>
        </div>
      )}

      {/* Status Indicator */}
      <div className="flex items-center space-x-2 text-xs text-white/50">
        <div className={`w-2 h-2 rounded-full ${
          selectedEngine === 'FIFO' ? 'bg-primary-green' : 'bg-yellow-500'
        }`} />
        <span>Active: {selectedEngine}</span>
      </div>
    </div>
  );
};
