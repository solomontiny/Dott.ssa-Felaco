import React from 'react';
import { Brain, BookOpen, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ThreeFocusSection = () => {
  const { t } = useTranslation();
  
  const focuses = [
    {
      number: t('focus.one.number'),
      title: t('focus.one.title'),
      description: t('focus.one.description'),
      icon: Brain
    },
    {
      number: t('focus.two.number'),
      title: t('focus.two.title'),
      description: t('focus.two.description'),
      icon: BookOpen
    },
    {
      number: t('focus.three.number'),
      title: t('focus.three.title'),
      description: t('focus.three.description'),
      icon: Activity
    }
  ];

  return (
    <section id="metodo" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-teal-600 font-medium tracking-wider text-sm mb-4">
            {t('focus.sectionTitle')}
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900">
            {t('focus.mainTitle')}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {focuses.map((focus, index) => {
            const IconComponent = focus.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="mb-6">
                  <p className="text-xs font-bold tracking-widest text-blue-500 mb-4">
                    {focus.number}
                  </p>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
                    <IconComponent className="w-6 h-6 text-teal-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
                <h3 className="text-2xl font-serif text-gray-900 mb-4">{focus.title}</h3>
                <p className="text-gray-600 leading-relaxed">{focus.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ThreeFocusSection;