import React from 'react';
import { cn } from './Button';
import { Loader2 } from 'lucide-react';

export function Loader({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <div className={cn('flex justify-center items-center p-4', className)}>
      <Loader2 size={size} className="animate-spin text-primary" />
    </div>
  );
}

export function FullScreenLoader() {
  return (
    <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex flex-col justify-center items-center">
      <Loader size={48} />
      <p className="mt-4 font-bold text-gray-700 animate-pulse">Loading...</p>
    </div>
  );
}
