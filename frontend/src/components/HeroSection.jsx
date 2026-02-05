import React from 'react';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t } = useTranslation();
  
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
          src="https://customer-assets.emergentagent.com/job_80398c3c-4f8a-434b-b923-133758dd4592/artifacts/fhkv7are_43f0764f-4653-4733-9f19-e168d39d573d.jpeg"
          alt="Nutrition and wellness"
          className="w-full h-full object-cover object-center"
          style={{ imageRendering: 'crisp-edges' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
        <div className="max-w-3xl">
          <p className="text-teal-600 font-semibold tracking-wider text-sm mb-6 uppercase">
            {t('hero.subtitle')}
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="block text-gray-900">{t('hero.title')}</span>
            <span className="block text-teal-600">{t('hero.titleHighlight')}</span>
          </h1>
          <p className="text-xl text-gray-700 mb-10 leading-relaxed max-w-2xl">
            {t('hero.description')}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => scrollToSection('#metodo')}
              className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 rounded-full text-base font-medium transition-all duration-300 hover:shadow-lg"
            >
              {t('hero.cta1')}
            </Button>
            <Button
              onClick={() => scrollToSection('#about')}
              variant="outline"
              className="border-2 border-teal-500 text-teal-700 hover:bg-teal-50 px-8 py-6 rounded-full text-base font-medium transition-all duration-300"
            >
              {t('hero.cta2')}
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