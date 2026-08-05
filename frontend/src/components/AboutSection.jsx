import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutSection = ({ content }) => {
  const { t } = useTranslation();

  const label = content?.label || t('about.label');
  const title = content?.title || t('about.title');
  const titleHighlight = content?.titleHighlight || t('about.titleHighlight');
  const intro = content?.intro || t('about.intro');
  const text1 = content?.text1 || t('about.text1');
  const text2 = content?.text2 || t('about.text2');
  const text3 = content?.text3 || t('about.text3');
  const text4 = content?.text4 || t('about.text4');
  const quote1 = content?.quote1 || t('about.quote1');
  const quote2 = content?.quote2 || t('about.quote2');
  const imageUrl = content?.image_url || "https://customer-assets.emergentagent.com/job_80398c3c-4f8a-434b-b923-133758dd4592/artifacts/fc7j2qlu_WhatsApp_Image_2026-02-08_at_6.00.05_PM-removebg-preview.png";

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Professional Image with Frame */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-xl border-2 border-blue-100">
              <img
                src={imageUrl}
                alt="Dott.ssa Felaco Giuseppina - Nutritionist"
                className="w-full h-auto object-contain"
                style={{ 
                  filter: 'contrast(1.1) saturate(1.08) brightness(1.02) drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                  imageRendering: 'crisp-edges'
                }}
              />
            </div>
            
            {/* Professional label */}
            <div className="mt-6 text-center">
              <p className="text-sm font-medium text-blue-600 uppercase tracking-wider">
                Founder & Nutritionist
              </p>
              <p className="text-xl font-serif text-gray-900 mt-1">
                Dott.ssa Felaco Giuseppina
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div>
              <p className="text-blue-600 font-semibold tracking-wider text-sm mb-4 uppercase">
                {label}
              </p>
              <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">
                {title} <span className="text-blue-600 italic">{titleHighlight}</span>
              </h2>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed text-lg">
                <span className="font-semibold text-gray-900">{intro}</span> {text1}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {text2}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {text3}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {text4}
              </p>
            </div>

            {/* Clean quotes */}
            <div className="border-l-4 border-blue-500 pl-6 py-4 space-y-3 bg-blue-50 rounded-r-lg">
              <blockquote className="text-lg italic text-gray-700">
                "{quote1}"
              </blockquote>
              <blockquote className="text-lg italic text-blue-700 font-medium">
                "{quote2}"
              </blockquote>
            </div>

            {/* Call to action */}
            <div className="pt-4">
              <button
                onClick={() => {
                  const element = document.querySelector('#consultation');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:shadow-lg inline-flex items-center space-x-2"
              >
                <span>Prenota una Consulenza</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;