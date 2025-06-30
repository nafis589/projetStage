import Header from "@/components/header/Header";
import HeroSection from "@/components/HeroSection/HeroSection";
import LoginActivitySection from "@/components/loginActivity/LoginActivitySection";
import SuggestionsSection from "@/components/suggestion/SuggestionSection";

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <SuggestionsSection />
      <LoginActivitySection />
    </>
  );
}
