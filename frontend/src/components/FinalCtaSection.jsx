import React from 'react';
import { Button } from './ui/button';

const FinalCtaSection = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1547592180-85f173990554?w=1920&h=800&fit=crop"
          alt="Healthy lifestyle"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 via-teal-800/70 to-teal-900/80" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-teal-200 font-medium tracking-wider text-sm mb-4">
          Non aspettare
        </p>
        <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
          Non esitare a sceglierti oggi
        </h2>
        <p className="text-xl text-white/95 italic mb-8">
          Perché domani non sarà prevenzione, ma cura!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button className="bg-white text-teal-700 hover:bg-gray-100 px-8 py-6 rounded-full text-base font-medium transition-all duration-300 hover:shadow-lg">
            Contattami ora
          </Button>
          <Button
            variant="outline"
            className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 rounded-full text-base font-medium transition-all duration-300"
          >
            Scopri di più
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FinalCtaSection;