import Link from 'next/link';

const Navbar = () => {
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Schedule', href: '/schedule' },
    { name: 'Submission', href: '/submission' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="shrink-0">
            <Link href="/" className="font-bold text-2xl text-irms-blue tracking-tighter">
              IRMS <span className="text-irms-red">2026</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-irms-blue font-medium transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          {/* Mobile Menu Button (Simple implementation) */}
          <div className="md:hidden">
             <span className="text-gray-500">☰</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;