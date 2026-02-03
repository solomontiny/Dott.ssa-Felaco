import React from 'react';
import { Button } from './ui/button';
import { heroData } from '../mock/data';

const HeroSection = () => {
  const scrollToSection = (section) => {
    const element = document.querySelector(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroData.backgroundImage}
          alt="Nutrition and wellness"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-2xl">
          <p className="text-teal-600 font-medium tracking-wider text-sm mb-4">
            {heroData.subtitle}
          </p>
          <h1 className="text-6xl md:text-7xl font-serif mb-6">
            <span className="text-teal-600 italic">{heroData.title}</span>
            <br />
            <span className="text-gray-900">{heroData.titleHighlight}</span>
          </h1>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            <span className="font-semibold">Qui troverai tre focus principali,</span> volti a
            incuriosire e stimolare Mente e Corpo, per una soluzione di ristrutturazione globale a
            lungo termine
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => scrollToSection('#metodo')}
              className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 rounded-full text-base font-medium transition-all duration-300 hover:shadow-lg"
            >
              {heroData.primaryButton}
            </Button>
            <Button
              onClick={() => scrollToSection('#about')}
              variant="outline"
              className="border-2 border-teal-500 text-teal-700 hover:bg-teal-50 px-8 py-6 rounded-full text-base font-medium transition-all duration-300"
            >
              {heroData.secondaryButton}
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-teal-500 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-teal-500 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;