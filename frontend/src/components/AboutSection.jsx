import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutSection = () => {
  const { t } = useTranslation();
  
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal-100 rounded-full opacity-20 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-100 rounded-full opacity-20 blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image with professional effects */}
          <div className="relative group">
            {/* Decorative frame elements */}
            <div className="absolute -top-6 -left-6 w-full h-full border-2 border-teal-200 rounded-3xl -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500" />
            <div className="absolute -bottom-6 -right-6 w-full h-full bg-gradient-to-br from-teal-100 to-teal-200 rounded-3xl -z-20" />
            
            {/* Main image container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              {/* Soft overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-teal-900/10 via-transparent to-white/5 z-10" />
              
              {/* Image with professional effects */}
              <img
                src="https://customer-assets.emergentagent.com/job_80398c3c-4f8a-434b-b923-133758dd4592/artifacts/jujn0nki_WhatsApp%20Image%202026-02-03%20at%206.37.43%20PM.jpeg"
                alt="Dott.ssa Felaco Giuseppina"
                className="w-full h-[650px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                style={{ 
                  filter: 'contrast(1.05) saturate(1.1) brightness(1.02)',
                  imageRendering: 'crisp-edges'
                }}
              />
              
              {/* Subtle vignette effect */}
              <div className="absolute inset-0 shadow-inner pointer-events-none" 
                   style={{ 
                     boxShadow: 'inset 0 0 60px rgba(0,0,0,0.1)' 
                   }} 
              />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Certified</p>
                  <p className="text-xs text-gray-600">Nutritionist</p>
                </div>
              </div>
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

            {/* Elegant quotes */}
            <div className="relative pl-8 py-6 mt-8">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-400 via-teal-500 to-teal-600 rounded-full" />
              <div className="space-y-4">
                <blockquote className="text-xl italic text-gray-700 font-serif">
                  "{t('about.quote1')}"
                </blockquote>
                <blockquote className="text-xl italic text-teal-700 font-serif font-medium">
                  "{t('about.quote2')}"
                </blockquote>
              </div>
            </div>

            {/* Call to action */}
            <div className="pt-6">
              <button
                onClick={() => {
                  const element = document.querySelector('#consultation');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group inline-flex items-center space-x-3 bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <span>Prenota una Consulenza</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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