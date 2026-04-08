import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    
  const baseStyles = 'inline-flex items-center justify-center font-black rounded-full transition-all focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed border-4 relative';
    
    const variants = {
      primary: 'bg-[#ff7b00] border-[#cc6200] text-white shadow-[0_6px_0_#cc6200] hover:shadow-[0_8px_0_#cc6200] hover:-translate-y-1 active:shadow-[0_0px_0_#cc6200] active:translate-y-[6px]',
      secondary: 'bg-[#007bff] border-[#0056b3] text-white shadow-[0_6px_0_#0056b3] hover:shadow-[0_8px_0_#0056b3] hover:-translate-y-1 active:shadow-[0_0px_0_#0056b3] active:translate-y-[6px]',
      ghost: 'bg-transparent border-transparent text-[#007bff] hover:bg-blue-100/50 hover:border-blue-200 focus:ring-blue-300',
      outline: 'bg-white border-[#0056b3] text-[#0056b3] hover:bg-blue-50 shadow-[0_6px_0_#0056b3] hover:shadow-[0_8px_0_#0056b3] hover:-translate-y-1 active:shadow-[0_0px_0_#0056b3] active:translate-y-[6px]',
    };
    
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
