import React from "react";
import "./App.css";
import "./i18n/config";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ThreeFocusSection from "./components/ThreeFocusSection";
import AboutSection from "./components/AboutSection";
import PhilosophySection from "./components/PhilosophySection";
import ServicesSection from "./components/ServicesSection";
import ConsultationForm from "./components/ConsultationForm";
import TestimonialsSection from "./components/TestimonialsSection";
import AppointmentBooking from "./components/AppointmentBooking";
import BlogSection from "./components/BlogSection";
import FinalCtaSection from "./components/FinalCtaSection";
import Footer from "./components/Footer";
import WhatsAppWidget from "./components/WhatsAppWidget";

function App() {
  return (
    <div className="App">
      <Navbar />
      <HeroSection />
      <ThreeFocusSection />
      <AboutSection />
      <PhilosophySection />
      <ServicesSection />
      <ConsultationForm />
      <TestimonialsSection />
      <AppointmentBooking />
      <BlogSection />
      <FinalCtaSection />
      <Footer />
      <WhatsAppWidget />
    </div>
  );
}

export default App;
