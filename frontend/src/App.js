import React from "react";
import "./App.css";
import "./i18n/config";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

// Main Website Component
const MainWebsite = () => {
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
      <ContactSection />
      <FinalCtaSection />
      <Footer />
      <WhatsAppWidget />
    </>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Main Website */}
          <Route path="/" element={<MainWebsite />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          {/* Redirect /admin to /admin/login */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          
          {/* 404 - Redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
