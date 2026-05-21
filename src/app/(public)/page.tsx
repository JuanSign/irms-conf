import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import Welcome from '@/components/home/Welcome';
import KeynoteSpeakers from '@/components/home/KeynoteSpeakers';
import Timeline from '@/components/home/Timeline';
import Topics from '@/components/home/Topics';
import SponsorsSection from '@/components/home/SponsorsSection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <Welcome />
      <KeynoteSpeakers />
      <Timeline />
      <Topics />
      <SponsorsSection />
    </main>
  );
}