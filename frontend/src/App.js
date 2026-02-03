import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ThreeFocusSection from "./components/ThreeFocusSection";
import AboutSection from "./components/AboutSection";
import PhilosophySection from "./components/PhilosophySection";
import ServicesSection from "./components/ServicesSection";
import BlogSection from "./components/BlogSection";
import FinalCtaSection from "./components/FinalCtaSection";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Navbar />
      <HeroSection />
      <ThreeFocusSection />
      <AboutSection />
      <PhilosophySection />
      <ServicesSection />
      <BlogSection />
      <FinalCtaSection />
      <Footer />
    </div>
  );
}

export default App;
