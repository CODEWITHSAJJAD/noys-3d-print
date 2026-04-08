'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const COOKIE_KEY = 'noys_cookie_accepted';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const accepted = localStorage.getItem(COOKIE_KEY);
    if (!accepted) {

      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, 'true');
    setVisible(false);
  };

  if (!visible || pathname?.startsWith('/admin')) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[200] w-[calc(100%-2rem)] max-w-xl
                 bg-[#0a2342]/95 backdrop-blur-md text-white rounded-2xl shadow-2xl
                 border border-sky-700/50 px-5 py-4 flex flex-col sm:flex-row
                 items-center gap-4 animate-in slide-in-from-bottom-4 duration-500"
    >
      <p className="text-sm font-semibold text-sky-100 text-center sm:text-left flex-1 leading-relaxed">
        🍪 We use cookies to improve your experience.{' '}
        <Link
          href="/cookie-policy"
          className="text-[#ff7b00] underline hover:text-orange-300 transition-colors"
        >
          Learn more
        </Link>
      </p>
      <button
        onClick={accept}
        className="shrink-0 bg-[#ff7b00] hover:bg-[#cc6200] text-white font-black text-sm
                   uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all duration-200
                   hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/30"
      >
        Accept
      </button>
    </div>
  );
}
