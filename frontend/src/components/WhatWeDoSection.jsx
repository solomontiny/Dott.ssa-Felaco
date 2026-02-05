import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Scale, 
  Heart, 
  Activity, 
  Droplets, 
  HeartPulse, 
  Shield, 
  Baby, 
  Sparkles,
  AlertCircle,
  Users,
  Moon,
  Stethoscope,
  Trophy,
  Leaf
} from 'lucide-react';

const WhatWeDoSection = () => {
  const { t } = useTranslation();
  
  const services = [
    {
      icon: Scale,
      title: t('services.overweight.title'),
      description: t('services.overweight.description')
    },
    {
      icon: Heart,
      title: t('services.eatingDisorders.title'),
      description: t('services.eatingDisorders.description')
    },
    {
      icon: Droplets,
      title: t('services.diabetes.title'),
      description: t('services.diabetes.description')
    },
    {
      icon: Activity,
      title: t('services.metabolic.title'),
      description: t('services.metabolic.description')
    },
    {
      icon: HeartPulse,
      title: t('services.hypertension.title'),
      description: t('services.hypertension.description')
    },
    {
      icon: Shield,
      title: t('services.renal.title'),
      description: t('services.renal.description')
    },
    {
      icon: Baby,
      title: t('services.childhoodObesity.title'),
      description: t('services.childhoodObesity.description')
    },
    {
      icon: Sparkles,
      title: t('services.autoimmune.title'),
      description: t('services.autoimmune.description')
    },
    {
      icon: AlertCircle,
      title: t('services.intolerances.title'),
      description: t('services.intolerances.description')
    },
    {
      icon: Users,
      title: t('services.pregnancy.title'),
      description: t('services.pregnancy.description')
    },
    {
      icon: Moon,
      title: t('services.menopause.title'),
      description: t('services.menopause.description')
    },
    {
      icon: Stethoscope,
      title: t('services.oncological.title'),
      description: t('services.oncological.description')
    },
    {
      icon: Trophy,
      title: t('services.sports.title'),
      description: t('services.sports.description')
    },
    {
      icon: Leaf,
      title: t('services.vegetarian.title'),
      description: t('services.vegetarian.description')
    }
  ];

  return (
    <section id="what-we-do" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-teal-600 font-medium tracking-wider text-sm mb-4">
            {t('whatWeDo.label')}
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
            {t('whatWeDo.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('whatWeDo.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 hover:border-teal-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-500 transition-colors duration-300">
                  <IconComponent className="w-6 h-6 text-teal-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">
            {t('whatWeDo.cta')}
          </p>
          <button
            onClick={() => {
              const element = document.querySelector('#consultation');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:shadow-lg"
          >
            {t('whatWeDo.button')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;