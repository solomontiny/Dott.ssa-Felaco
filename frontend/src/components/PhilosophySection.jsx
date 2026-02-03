import React from 'react';
import { philosophyData } from '../mock/data';

const PhilosophySection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-teal-500 to-teal-600 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-serif italic mb-8 leading-relaxed">
          {philosophyData.quote}
        </h2>
        <div className="h-1 w-24 bg-white/50 mx-auto mb-8" />
        <p className="text-xl mb-6 text-white/95">
          {philosophyData.text}
        </p>
        <p className="text-lg mb-6 text-white/90 leading-relaxed">
          {philosophyData.additionalText}
        </p>
        <p className="text-lg font-medium text-white italic">
          {philosophyData.finalText}
        </p>
      </div>
    </section>
  );
};

export default PhilosophySection;