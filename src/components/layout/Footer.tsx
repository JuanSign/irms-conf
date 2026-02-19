import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-irms-dark text-white py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
        <div className="mb-8 relative w-48 h-20">
          <Image
            src="/logo/LOGO_WHITE.png"
            alt="IRMS Logo"
            fill
            className="object-contain"
          />
        </div>
        <h4 className="text-xl font-bold mb-2">Indonesian Rock Mechanics Society</h4>
        <p className="text-slate-400 text-center text-sm mb-8 max-w-md">
          Advancing rock mechanics and engineering practices in Indonesia through research, collaboration, and professional development.
        </p>
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm text-slate-400 mb-8 font-medium">
          <a href="mailto:secretariat@irms.id" className="hover:text-white transition">irms2026.secretariat@gmail.com</a>
          <span className="hidden md:inline text-slate-700">|</span>
          <span>Bandung, Indonesia</span>
        </div>
        <div className="border-t border-slate-800 pt-8 w-full text-center">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} IRMS Conference. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;