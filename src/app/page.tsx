import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import Welcome from '@/components/home/Welcome';
import Timeline from '@/components/home/Timeline';
import Topics from '@/components/home/Topics';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <Welcome />
      <Timeline />
      <Topics />
    </main>
  );
}