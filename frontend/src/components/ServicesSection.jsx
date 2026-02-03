import React from 'react';
import { BookOpen, Heart, Dumbbell, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

const ServicesSection = () => {
  const services = [
    {
      icon: 'bookOpen',
      title: 'Training educativo alimentare',
      description: 'Cambiare attraverso la conoscenza del cibo'
    },
    {
      icon: 'heart',
      title: 'Training emotivo didattico',
      description: 'Cambiare mediante la consapevolezza emotiva'
    },
    {
      icon: 'dumbbell',
      title: 'Workout specifici',
      description: 'Cambiare con attività fisica individualizzata'
    }
  ];

  const getIcon = (iconName) => {
    if (iconName === 'bookOpen') return BookOpen;
    if (iconName === 'heart') return Heart;
    if (iconName === 'dumbbell') return Dumbbell;
    return BookOpen;
  };

  return (
    <section id="servizi" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-teal-600 font-medium tracking-wider text-sm mb-4">
            SERVIZI
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
            Cosa trovi qui
          </h2>
          <p className="text-xl text-gray-600">Benessere Bio-Psico-Sociale</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-serif text-gray-900 mb-2">Supporto</h3>
            <p className="text-gray-600 mb-8">Come "cambiare vita" partendo da tre concetti fondamentali:</p>

            <div className="space-y-6">
              {services.map((service, index) => {
                const IconComponent = getIcon(service.icon);
                return (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        {service.title}
                      </h4>
                      <p className="text-gray-600">{service.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl group">
              <img
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=700&fit=crop"
                alt="Healthy nutrition"
                className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <Button className="bg-teal-500 hover:bg-teal-600 text-white w-full py-6 rounded-full text-base font-medium flex items-center justify-center space-x-2 group">
                  <span>Vai agli articoli</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
            <div className="absolute -top-6 -left-6 w-40 h-40 bg-teal-100 rounded-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;