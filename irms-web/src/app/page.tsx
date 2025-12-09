import SpeechSection from "@/components/SpeechSection";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen w-full bg-black">
      <div className="font-black text-center text-white">Sect 1</div>
      <div className="font-black text-center text-white">Sect 2</div>
      <SpeechSection/>
    </div>
  );
}
