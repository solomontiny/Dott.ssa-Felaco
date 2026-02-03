import React, { useState, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { t, i18n } = useTranslation();

  const navLinks = [
    { label: t('nav.home'), href: '#home' },
    { label: t('nav.about'), href: '#about' },
    { label: t('nav.services'), href: '#servizi' },
    { label: t('nav.consultation'), href: '#consultation' },
    { label: t('nav.blog'), href: '#articoli' }
  ];

  const languages = [
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setShowLangMenu(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white rounded-full" />
            </div>
            <span className="text-xl font-serif italic text-gray-800">
              Dott.ssa Felaco
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-teal-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <span className="text-lg">{currentLang.flag}</span>
                <span className="font-medium">{currentLang.code.toUpperCase()}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors ${
                        i18n.language === lang.code ? 'bg-teal-50 text-teal-700' : 'text-gray-700'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <Button
              onClick={() => scrollToSection('#appointment')}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 rounded-full"
            >
              {t('nav.appointment')}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;