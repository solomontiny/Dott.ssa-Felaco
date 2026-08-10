import React from "react";
import "./App.css";
import "./i18n/config";
import { HashRouter, Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ThreeFocusSection from "./components/ThreeFocusSection";
import AboutSection from "./components/AboutSection";
import PhilosophySection from "./components/PhilosophySection";
import WhatWeDoSection from "./components/WhatWeDoSection";
import ServicesSection from "./components/ServicesSection";
import QASection from "./components/QASection";
import ConsultationForm from "./components/ConsultationForm";
import TestimonialsSection from "./components/TestimonialsSection";
import AppointmentBooking from "./components/AppointmentBooking";
import ContactSection from "./components/ContactSection";
import FinalCtaSection from "./components/FinalCtaSection";
import Footer from "./components/Footer";
import WhatsAppWidget from "./components/WhatsAppWidget";
import BlogSection from "./components/BlogSection";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import AdminLogin from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { AuthProvider } from "./hooks/useAuth";

import { useHomepage } from "./hooks/useHomepage";

function MainWebsite() {
  const { sections, fetchSections } = useHomepage();
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    fetchSections("it");
  }, [fetchSections]);

  React.useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      const scrollToSection = () => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          // If not found yet, wait for dynamic loading
          setTimeout(scrollToSection, 500);
        }
      };
      scrollToSection();
    }
  }, [searchParams, sections]);

  console.log('MainWebsite sections:', sections);

  const SECTION_COMPONENTS = {
    hero: HeroSection,
    three_focus: ThreeFocusSection,
    about: AboutSection,
    philosophy: PhilosophySection,
    what_we_do: WhatWeDoSection,
    services: ServicesSection,
    qa: QASection,
    consultation: ConsultationForm,
    testimonials: TestimonialsSection,
    appointment: AppointmentBooking,
    blog: BlogSection,
    contact: ContactSection,
    final_cta: FinalCtaSection,
  };

  const SECTION_ORDER = [
    'hero', 'three_focus', 'about', 'philosophy', 'what_we_do',
    'services', 'qa', 'consultation', 'testimonials', 'appointment',
    'blog', 'contact', 'final_cta'
  ];

  return (
    <>
      <Navbar />
      {SECTION_ORDER.map((sectionKey) => {
        const Component = SECTION_COMPONENTS[sectionKey];
        if (!Component) return null;
        const dbSection = sections.find(s => s.section_key === sectionKey);
        return <Component key={sectionKey} content={dbSection?.content} />;
      })}
      <Footer />
      <WhatsAppWidget />
    </>
  );
}

function App() {
  const isPasswordRecovery = new URLSearchParams(window.location.search).has("reset-password");

  return (
    <HashRouter>
      <AuthProvider>
        {isPasswordRecovery ? <ResetPasswordPage /> : <Routes>
          <Route path="/" element={<MainWebsite />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:id" element={<ArticleDetailPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/admin/reset-password" element={<ResetPasswordPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>}
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
