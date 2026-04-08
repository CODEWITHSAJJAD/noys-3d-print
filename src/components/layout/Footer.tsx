'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const legalLinks = [
  { name: 'Terms & Conditions', href: '/terms-and-conditions' },
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Shipping Policy', href: '/shipping-policy' },
  { name: 'Refund Policy', href: '/refund-policy' },
  { name: 'Cookie Policy', href: '/cookie-policy' },
];

export function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="relative z-10 bg-[#0a2342]/90 backdrop-blur-sm border-t border-sky-900/50 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {}
          <div className="text-center sm:text-left">
            <span className="font-black text-2xl tracking-tighter text-white">
              NOYS <span className="text-[#ff7b00] italic">3D</span>
            </span>
            <p className="text-xs text-sky-300 mt-1 font-medium">
              A World Made in Plastic
            </p>
          </div>

          {}
          <nav aria-label="Footer legal links">
            <ul className="flex flex-wrap justify-center sm:justify-end gap-x-5 gap-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs font-semibold uppercase tracking-wider text-sky-300 hover:text-[#ff7b00] transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {}
        <div className="border-t border-sky-800/50 mt-8 pt-6 text-center">
          <p className="text-xs text-sky-400 font-medium">
            &copy; {year} Noys 3D Prints. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
