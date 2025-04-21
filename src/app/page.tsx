import HeroSection from "@/components/home/HeroSection";
import CategoryNav from "@/components/home/CategoryNav";
import PromptsAndTags from "@/components/home/PromptsAndTags";
import Testimonials from "@/components/home/Testimonials";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow">
        <HeroSection />
        <CategoryNav />
        <PromptsAndTags />
        <Testimonials />
      </main>
    </div>
  );
}
