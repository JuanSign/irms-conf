import Footer from "@/components/Footer";
import OverlayNav from "@/components/OverlayNav";
import ProgramOutline from "@/components/ProgramOutline";
import Keynote from "@/components/Keynote";

export default function Home() {
  return (
    <main>
      <OverlayNav />
      <ProgramOutline />
      <Keynote /> 
      <Footer />  
    </main>
  );
}
