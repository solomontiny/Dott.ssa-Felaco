import React from 'react';
import { Button } from './ui/button';

const HeroSection = () => {
  const scrollToSection = (section) => {
    const element = document.querySelector(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1757332334664-83bff99e7a43?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwzfHxudXRyaXRpb24lMjB2ZWdldGFibGVzfGVufDB8fHx8MTc3MDExNjk4N3ww&ixlib=rb-4.1.0&q=85"
          alt="Nutrition and wellness"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-2xl">
          <p className="text-teal-600 font-medium tracking-wider text-sm mb-4">
            BIOLOGA NUTRIZIONISTA
          </p>
          <h1 className="text-6xl md:text-7xl font-serif mb-6">
            <span className="text-teal-600 italic">Benvenuti</span>
            <br />
            <span className="text-gray-900">nel mio mondo</span>
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
              Scopri il mio metodo
            </Button>
            <Button
              onClick={() => scrollToSection('#about')}
              variant="outline"
              className="border-2 border-teal-500 text-teal-700 hover:bg-teal-50 px-8 py-6 rounded-full text-base font-medium transition-all duration-300"
            >
              Chi sono
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-teal-500 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-teal-500 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;