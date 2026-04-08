'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, [removeToast]);

  const value = {
    toast: addToast,
    success: (msg: string) => addToast(msg, 'success'),
    error: (msg: string) => addToast(msg, 'error'),
    info: (msg: string) => addToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="pointer-events-auto shadow-2xl"
            >
              <ToastCard message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({ message, type, onClose }: { message: string, type: ToastType, onClose: () => void }) {
  let bgColors = '';
  let icon = null;

  switch (type) {
    case 'success':
      bgColors = 'bg-white border-4 border-green-400 text-green-800 shadow-[4px_4px_0px_#4ade80]';
      icon = <CheckCircle2 className="text-green-500 w-6 h-6 shrink-0" />;
      break;
    case 'error':
      bgColors = 'bg-white border-4 border-red-400 text-red-800 shadow-[4px_4px_0px_#f87171]';
      icon = <AlertCircle className="text-red-500 w-6 h-6 shrink-0" />;
      break;
    case 'info':
    default:
      bgColors = 'bg-white border-4 border-blue-400 text-blue-900 shadow-[4px_4px_0px_#60a5fa]';
      icon = <Info className="text-blue-500 w-6 h-6 shrink-0" />;
      break;
  }

  return (
    <div className={`p-4 rounded-2xl flex items-center gap-4 max-w-sm ${bgColors}`}>
      {icon}
      <p className="font-bold text-sm tracking-tight pr-6">{message}</p>
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition bg-transparent"
      >
        <X size={16} strokeWidth={4} />
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
