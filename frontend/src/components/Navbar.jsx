import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { Button } from './ui/button';
import { navigationLinks } from '../mock/data';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white rounded-full" />
            </div>
            <span className="text-xl font-serif italic text-gray-800">
              Dott.ssa Felaco
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-teal-600 transition-colors">
              <Globe className="w-4 h-4" />
              <span className="font-medium">IT</span>
            </button>
            <Button className="bg-teal-500 hover:bg-teal-600 text-white px-6 rounded-full">
              Prenota
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;