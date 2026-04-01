import React from "react";
import "./App.css";
import "./i18n/config";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ThreeFocusSection from "./components/ThreeFocusSection";
import AboutSection from "./components/AboutSection";
import PhilosophySection from "./components/PhilosophySection";
import WhatWeDoSection from "./components/WhatWeDoSection";
import QASection from "./components/QASection";
import ConsultationForm from "./components/ConsultationForm";
import TestimonialsSection from "./components/TestimonialsSection";
import AppointmentBooking from "./components/AppointmentBooking";
import ContactSection from "./components/ContactSection";
import FinalCtaSection from "./components/FinalCtaSection";
import Footer from "./components/Footer";
import WhatsAppWidget from "./components/WhatsAppWidget";
import BlogSection from "./components/BlogSection";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

function MainWebsite() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ThreeFocusSection />
      <AboutSection />
      <PhilosophySection />
      <WhatWeDoSection />
      <QASection />
      <ConsultationForm />
      <TestimonialsSection />
      <AppointmentBooking />
      <BlogSection />
      <ContactSection />
      <FinalCtaSection />
      <Footer />
      <WhatsAppWidget />
    </>
  );
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainWebsite />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;