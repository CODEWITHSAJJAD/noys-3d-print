'use client';

import React, { useEffect } from 'react';
import { cn } from './Button';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div 
        className={cn(
          'relative w-full max-w-md bg-white rounded-[2rem] border-4 border-[#1a4073] shadow-[12px_12px_0px_#1a4073] overflow-hidden transform transition-all',
          className
        )}
      >
        <div className="flex justify-between items-center p-5 border-b-4 border-[#1a4073] bg-blue-100">
          {title && <h2 className="text-2xl font-black text-[#0c2a50]">{title}</h2>}
          <button 
            onClick={onClose}
            className="text-[#1a4073] hover:text-white hover:bg-red-500 rounded-full p-1 focus:outline-none transition-all border-2 border-transparent hover:border-[#1a4073] hover:shadow-[2px_2px_0px_#1a4073]"
          >
            <X size={24} className="stroke-[3px]" />
          </button>
        </div>
        
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
