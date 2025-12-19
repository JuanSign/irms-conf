import HeroSection from "@/components/HeroSection";
import DateSection from "@/components/DateSection";
import NewsRunningText from "@/components/NewsRunningText";
import OverlayNav from "@/components/OverlayNav";
import SpeechSection from "@/components/SpeechSection";
import SponsorSection from "@/components/SponsorSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <OverlayNav />
      <HeroSection />
      <DateSection />
      <NewsRunningText />
      <SpeechSection/>
      <SponsorSection/>
      <Footer/>
    </main>
  );
}
