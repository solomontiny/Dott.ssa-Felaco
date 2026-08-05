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

const WhatWeDoSection = ({ content }) => {
  const { t } = useTranslation();
  
  const label = content?.label || t('whatWeDo.label');
  const title = content?.title || t('whatWeDo.title');
  const subtitle = content?.subtitle || t('whatWeDo.subtitle');
  const cta = content?.cta || t('whatWeDo.cta');
  const button = content?.button || t('whatWeDo.button');

  const services = [
    {
      icon: Scale,
      title: content?.services?.overweight?.title || t('services.overweight.title'),
      description: content?.services?.overweight?.description || t('services.overweight.description')
    },
    {
      icon: Heart,
      title: content?.services?.eatingDisorders?.title || t('services.eatingDisorders.title'),
      description: content?.services?.eatingDisorders?.description || t('services.eatingDisorders.description')
    },
    {
      icon: Droplets,
      title: content?.services?.diabetes?.title || t('services.diabetes.title'),
      description: content?.services?.diabetes?.description || t('services.diabetes.description')
    },
    {
      icon: Activity,
      title: content?.services?.metabolic?.title || t('services.metabolic.title'),
      description: content?.services?.metabolic?.description || t('services.metabolic.description')
    },
    {
      icon: HeartPulse,
      title: content?.services?.hypertension?.title || t('services.hypertension.title'),
      description: content?.services?.hypertension?.description || t('services.hypertension.description')
    },
    {
      icon: Shield,
      title: content?.services?.renal?.title || t('services.renal.title'),
      description: content?.services?.renal?.description || t('services.renal.description')
    },
    {
      icon: Baby,
      title: content?.services?.childhoodObesity?.title || t('services.childhoodObesity.title'),
      description: content?.services?.childhoodObesity?.description || t('services.childhoodObesity.description')
    },
    {
      icon: Sparkles,
      title: content?.services?.autoimmune?.title || t('services.autoimmune.title'),
      description: content?.services?.autoimmune?.description || t('services.autoimmune.description')
    },
    {
      icon: AlertCircle,
      title: content?.services?.intolerances?.title || t('services.intolerances.title'),
      description: content?.services?.intolerances?.description || t('services.intolerances.description')
    },
    {
      icon: Users,
      title: content?.services?.pregnancy?.title || t('services.pregnancy.title'),
      description: content?.services?.pregnancy?.description || t('services.pregnancy.description')
    },
    {
      icon: Moon,
      title: content?.services?.menopause?.title || t('services.menopause.title'),
      description: content?.services?.menopause?.description || t('services.menopause.description')
    },
    {
      icon: Stethoscope,
      title: content?.services?.oncological?.title || t('services.oncological.title'),
      description: content?.services?.oncological?.description || t('services.oncological.description')
    },
    {
      icon: Trophy,
      title: content?.services?.sports?.title || t('services.sports.title'),
      description: content?.services?.sports?.description || t('services.sports.description')
    },
    {
      icon: Leaf,
      title: content?.services?.vegetarian?.title || t('services.vegetarian.title'),
      description: content?.services?.vegetarian?.description || t('services.vegetarian.description')
    }
  ];

  return (
    <section id="what-we-do" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-teal-600 font-medium tracking-wider text-sm mb-4">
            {label}
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
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
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors duration-300">
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
            {cta}
          </p>
          <button
            onClick={() => {
              const element = document.querySelector('#consultation');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-blue-500 hover:bg-teal-600 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:shadow-lg"
          >
            {button}
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;