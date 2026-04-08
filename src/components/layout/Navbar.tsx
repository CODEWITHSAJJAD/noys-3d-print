'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard, ShoppingBag, Image as ImageIcon, MessageSquare, Info, Star, CreditCard, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/lib/auth/useAuth';
import { useCart } from '@/lib/cart/CartContext';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Home', href: '/', icon: LayoutDashboard },
  { name: 'AI Generator', href: '/ai-generator', protected: true, icon: Star },
  { name: 'STL File Upload', href: '/stl-upload', protected: true, icon: ShoppingBag },
  { name: 'Pricing', href: '/pricing', icon: CreditCard },
  { name: 'Shop', href: '/shop', icon: ShoppingBag },
  { name: 'Gallery', href: '/gallery', icon: ImageIcon },
  { name: 'About Us', href: '/about', icon: Info },
  { name: 'Contact Us', href: '/contact', icon: MessageSquare },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] h-16 transition-all duration-300 ${
      isScrolled ? 'bg-sky-50/95 backdrop-blur-md shadow-sm border-b-2 border-blue-100/50' : 'bg-transparent'
    }`}>
      {}
      <nav className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-[#0a2342] hover:bg-white/10 rounded-xl transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`text-sm font-black tracking-wide uppercase transition-all duration-200 ${
                    isActive
                      ? 'text-primary'
                      : 'text-[#0a2342] hover:text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {}
        <div className="flex items-center gap-4">
          
          {}
          <Link href="/cart" className="relative p-2 text-[#0a2342] hover:text-primary transition-colors hover:scale-110 active:scale-95 duration-200">
            <ShoppingCart size={24} className="stroke-[2.5px]" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-in zoom-in-50 duration-300">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link href="/profile" className="hidden sm:block text-xs font-bold text-[#0a2342] hover:text-primary uppercase tracking-tighter">My Account</Link>
              <Link href="/profile/history" className="hidden sm:block text-xs font-bold text-[#0a2342] hover:text-primary uppercase tracking-tighter">My Generations</Link>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={handleLogout}
                className="font-black h-9 px-5 shadow-lg shadow-primary/20"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button 
                variant="primary" 
                size="sm" 
                className="font-black h-9 px-5 shadow-lg shadow-primary/20"
              >
                Sign In / Register
              </Button>
            </Link>
          )}
        </div>
      </nav>

      {}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-white z-[120] md:hidden flex flex-col p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-12">
                <span className="font-black text-2xl tracking-tighter text-[#0a2342]">NOYS <span className="text-primary italic">3D</span></span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full bg-gray-100 text-[#0a2342]"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-4 px-4 py-4 rounded-2xl text-xl font-black uppercase transition-all ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-[#0a2342] hover:bg-gray-50'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-auto pt-8 border-t border-gray-100 space-y-4">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <Link href="/profile" onClick={() => setIsOpen(false)} className="block">
                      <Button variant="outline" className="w-full font-bold border-gray-200">My Account</Button>
                    </Link>
                    <Link href="/profile/history" onClick={() => setIsOpen(false)} className="block">
                      <Button variant="outline" className="w-full font-bold border-gray-200 text-blue-600">My Generations</Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="w-full font-bold border-red-200 text-red-500 hover:bg-red-50"
                      onClick={() => { handleLogout(); setIsOpen(false); }}
                    >
                      Log Out
                    </Button>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setIsOpen(false)} className="block">
                    <Button variant="primary" className="w-full font-black">
                      Sign In / Register
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
