// components/layout/Navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut, User } from 'lucide-react';
import { signOut } from 'next-auth/react';
import type { Session } from 'next-auth';

// Accept the session prop
const Navbar = ({ session }: { session: Session | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Schedule', href: '/schedule' },
    { name: 'Dashboard', href: '/dashboard' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10">
              <Image
                src="/logo/LOGO.png"
                alt="IRMS Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
            <span className="font-bold text-2xl text-irms-blue tracking-tighter hidden sm:block">
              IRMS <span className="text-irms-red">2026</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold uppercase tracking-wider transition-colors duration-200 ${
                    pathname === link.href ? 'text-irms-red' : 'text-slate-600 hover:text-irms-blue'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Auth Section Desktop */}
            <div className="border-l border-slate-200 pl-6 flex items-center h-8">
              {session?.user ? (
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <User size={16} className="text-irms-blue" />
                    <span className="max-w-[150px] truncate">{session.user.name}</span>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/dashboard/register' })}
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-irms-red transition-colors"
                    title="Sign Out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link
                  href="/dashboard/register"
                  className="text-sm font-semibold text-white bg-irms-blue px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-3 rounded-md text-base font-semibold text-slate-700 hover:bg-irms-light hover:text-irms-blue"
              >
                {link.name}
              </Link>
            ))}

            {/* Auth Section Mobile */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              {session?.user ? (
                <>
                  <div className="px-3 mb-3 text-sm text-slate-500">
                    Signed in as <span className="font-semibold text-slate-800">{session.user.name}</span>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/dashboard/register' })}
                    className="flex w-full items-center gap-2 px-3 py-3 rounded-md text-base font-semibold text-irms-red hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={20} />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/dashboard/register"
                  onClick={() => setIsOpen(false)}
                  className="block text-center w-full bg-irms-blue text-white px-4 py-3 rounded-md text-base font-semibold hover:bg-opacity-90 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;