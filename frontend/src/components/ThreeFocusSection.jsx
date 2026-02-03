import React from 'react';
import { Brain, BookOpen, Activity } from 'lucide-react';

const ThreeFocusSection = () => {
  const focuses = [
    {
      number: 'UNO',
      title: 'Conoscenza',
      description: 'Conoscenza e consapevolezza del proprio corpo e della propria mente, in rapporto al cibo',
      icon: 'brain'
    },
    {
      number: 'DUE',
      title: 'Metodi',
      description: 'Metodi, strategie e training di lavoro, per arrivare ad una conoscenza propria e per avere percorsi individualizzati e personalizzati',
      icon: 'bookOpen'
    },
    {
      number: 'TRE',
      title: 'Movimento',
      description: 'Movimento, attività fisica e sport volti a stabilire una connessione fisica e mentale, per un benessere esterno ma anche interno, migliorando in questo modo la concentrazione e l\'accettazione del proprio corpo',
      icon: 'activity'
    }
  ];

  const getIcon = (iconName) => {
    if (iconName === 'brain') return Brain;
    if (iconName === 'bookOpen') return BookOpen;
    if (iconName === 'activity') return Activity;
    return Brain;
  };

  return (
    <section id="metodo" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-teal-600 font-medium tracking-wider text-sm mb-4">
            Il mio approccio
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900">
            Tre focus principali
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {focuses.map((focus, index) => {
            const IconComponent = getIcon(focus.icon);
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="mb-6">
                  <p className="text-xs font-bold tracking-widest text-teal-500 mb-4">
                    {focus.number}
                  </p>
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center group-hover:bg-teal-500 transition-colors duration-300">
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