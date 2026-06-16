import Hero from "@/components/Hero";
import QuickServices from "@/components/QuickServices";
import Demographics from "@/components/Demographics";
import LatestNews from "@/components/LatestNews";

export default function Home() {
  return (
    <div>
      <Hero />
      <QuickServices />
      <Demographics />
      <LatestNews />
    </div>
  );
}
