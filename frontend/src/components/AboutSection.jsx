import React from 'react';
import { aboutData } from '../mock/data';

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={aboutData.image}
                alt="Dott.ssa Felaco Giuseppina"
                className="w-full h-[600px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-teal-100 rounded-3xl -z-10" />
          </div>

          {/* Content */}
          <div>
            <p className="text-teal-600 font-medium tracking-wider text-sm mb-4">
              {aboutData.sectionLabel}
            </p>
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">
              {aboutData.title} <span className="text-teal-600 italic">{aboutData.titleHighlight}</span>
            </h2>

            <div className="space-y-4 mb-8">
              {aboutData.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed">
                  {index === 0 && <span className="font-semibold">Sono la dott.ssa Felaco Giuseppina,</span>}
                  {index === 0 ? paragraph.replace('Sono la dott.ssa Felaco Giuseppina,', '') : paragraph}
                  {index === 2 && paragraph.includes('Dono') && (
                    <span>
                      {' '}<span className="font-semibold">Dono con amore e piacere strumenti</span>
                      {paragraph.split('Dono con amore e piacere strumenti')[1]}
                    </span>
                  )}
                  {index === 3 && paragraph.includes('prevenzione e divulgazione') && (
                    <span className="font-semibold"> prevenzione e divulgazione</span>
                  )}
                </p>
              ))}
            </div>

            {/* Quotes */}
            <div className="border-l-4 border-teal-500 pl-6 space-y-4 mb-8">
              {aboutData.quotes.map((quote, index) => (
                <blockquote key={index} className="text-lg italic text-gray-600">
                  {quote}
                </blockquote>
              ))}
            </div>

            <p className="text-gray-700 leading-relaxed">
              {aboutData.additionalText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;