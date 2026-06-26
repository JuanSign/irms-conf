import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import Welcome from '@/components/home/Welcome';
import KeynoteSpeakers from '@/components/home/KeynoteSpeakers';
import Timeline from '@/components/home/Timeline';
import WorkshopSection from '@/components/home/WorkshopSection';
import Topics from '@/components/home/Topics';
import CommitteeSection from '@/components/home/CommitteeSection';
import SponsorsSection from '@/components/home/SponsorsSection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <Welcome />
      <KeynoteSpeakers />
      <Timeline />
      <WorkshopSection />
      <Topics />
      <CommitteeSection />
      <SponsorsSection />
    </main>
  );
}