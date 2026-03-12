import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  accent?: 'green' | 'pink' | 'purple' | 'blue';
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  accent
}) => {
  const baseClasses = 'glass-card';
  const hoverClasses = hover ? 'glass-card-hover' : '';
  const accentClasses = accent ? `accent-${accent}` : '';
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${accentClasses} ${className}`}>
      {children}
    </div>
  );
};
