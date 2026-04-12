import React from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  position?: 'right' | 'left' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  size = 'md'
}) => {
  const positionClasses = {
    right: 'fixed right-0 top-0 h-full w-80 transform translate-x-full',
    left: 'fixed left-0 top-0 h-full w-80 transform -translate-x-full',
    top: 'fixed top-0 left-0 right-0 w-full transform -translate-y-full',
    bottom: 'fixed bottom-0 left-0 right-0 w-full transform translate-y-full'
  };

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  const openClasses = isOpen ? 'translate-x-0 translate-y-0' : '';

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`
          ${positionClasses[position]}
          ${sizeClasses[size]}
          glass-card
          fixed
          z-50
          transition-transform duration-300 ease-in-out
          ${openClasses}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 text-white/50 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </>
  );
};
