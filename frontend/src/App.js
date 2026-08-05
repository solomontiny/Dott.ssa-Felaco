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

  React.useEffect(() => {
    fetchSections("it");
  }, [fetchSections]);

  const SECTION_COMPONENTS = {
    hero: HeroSection,
    three_focus: ThreeFocusSection,
    about: AboutSection,
    philosophy: PhilosophySection,
    what_we_do: WhatWeDoSection,
    qa: QASection,
    consultation: ConsultationForm,
    testimonials: TestimonialsSection,
    appointment: AppointmentBooking,
    blog: BlogSection,
    contact: ContactSection,
    final_cta: FinalCtaSection,
  };

  return (
    <>
      <Navbar />
      {sections.length > 0 ? (
        sections.map((section) => {
          const Component = SECTION_COMPONENTS[section.section_key];
          if (!Component) return null;
          return <Component key={section.id} content={section.content} />;
        })
      ) : (
        <>
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
        </>
      )}
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
