import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Topics from '@/components/Topics';
import Timeline from '@/components/Timeline';
import Welcome from '@/components/Welcome';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <Hero />
      <About />
      <Welcome />
      <Timeline />
      <Topics />

      <footer className="bg-irms-blue text-white py-8 text-center">
        <p className="text-sm opacity-80">
          © 2026 IRMS Conference. All rights reserved.
        </p>
        <p className="text-xs opacity-60 mt-2">
          Jakarta, Indonesia
        </p>
      </footer>
    </main>
  );
}