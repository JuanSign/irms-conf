import HeroSection from "@/components/HeroSection";
import DateSection from "@/components/DateSection";
import NewsRunningText from "@/components/NewsRunningText";
import OverlayNav from "@/components/OverlayNav";

export default function Home() {
  return (
    <main>
      <OverlayNav />
      <HeroSection />
      <DateSection />
      <NewsRunningText />
    </main>
  );
}
