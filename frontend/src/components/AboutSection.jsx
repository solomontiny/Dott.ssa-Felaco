import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutSection = () => {
  const { t } = useTranslation();
  
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Clean, Professional Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-white p-1">
              <img
                src="https://customer-assets.emergentagent.com/job_80398c3c-4f8a-434b-b923-133758dd4592/artifacts/9d1ictl1_WhatsApp%20Image%202026-02-03%20at%206.37.43%20PM.jpg"
                alt="Dott.ssa Felaco Giuseppina - Nutritionist"
                className="w-full h-auto object-cover object-center rounded-xl"
                style={{ 
                  filter: 'contrast(1.08) saturate(1.05) brightness(1.03) sharpen(1)',
                  imageRendering: 'crisp-edges',
                  mixBlendMode: 'normal'
                }}
              />
            </div>
            
            {/* Simple owner label */}
            <div className="mt-6 text-center">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
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
              <p className="text-teal-600 font-semibold tracking-wider text-sm mb-4 uppercase">
                {t('about.label')}
              </p>
              <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">
                {t('about.title')} <span className="text-teal-600 italic">{t('about.titleHighlight')}</span>
              </h2>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed text-lg">
                <span className="font-semibold text-gray-900">{t('about.intro')}</span> {t('about.text1')}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {t('about.text2')}
              </p>
              <p className="text-gray-700 leading-relaxed">
                <span className="font-semibold text-gray-900">Dono con amore e piacere strumenti</span> metodologici ai miei studenti, al fine di poter dar loro degli input, che possano servir loro a migliorare la crescita con semplicità e serenità.
              </p>
              <p className="text-gray-700 leading-relaxed">
                {t('about.text4')}
              </p>
            </div>

            {/* Clean quotes */}
            <div className="border-l-4 border-teal-500 pl-6 py-4 space-y-3 bg-gray-50 rounded-r-lg">
              <blockquote className="text-lg italic text-gray-700">
                "{t('about.quote1')}"
              </blockquote>
              <blockquote className="text-lg italic text-teal-700 font-medium">
                "{t('about.quote2')}"
              </blockquote>
            </div>

            {/* Call to action */}
            <div className="pt-4">
              <button
                onClick={() => {
                  const element = document.querySelector('#consultation');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:shadow-lg inline-flex items-center space-x-2"
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