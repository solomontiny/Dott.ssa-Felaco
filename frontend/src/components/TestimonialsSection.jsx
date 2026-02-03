import React from 'react';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const { t } = useTranslation();
  
  const testimonials = [
    {
      id: 1,
      name: 'Maria Bianchi',
      location: 'Roma, Italia',
      rating: 5,
      text: 'La Dott.ssa Felaco ha cambiato completamente il mio rapporto con il cibo. Grazie al suo metodo ho perso 15kg in modo sano e sostenibile.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
    },
    {
      id: 2,
      name: 'Sophie Martin',
      location: 'Paris, France',
      rating: 5,
      text: 'Professional approach and personalized nutrition plan. I feel healthier and more energetic than ever. Highly recommended!',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
    },
    {
      id: 3,
      name: 'Carlos Rodriguez',
      location: 'Madrid, España',
      rating: 5,
      text: 'Excelente profesional. Me ayudó a mejorar mi rendimiento deportivo con un plan nutricional personalizado. Resultados increíbles.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop'
    },
    {
      id: 4,
      name: 'Laura Conti',
      location: 'Milano, Italia',
      rating: 5,
      text: 'Finalmente ho trovato un approccio che funziona! Non solo ho raggiunto il mio peso ideale, ma ho anche imparato a mangiare in modo consapevole.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop'
    },
    {
      id: 5,
      name: 'Emma Thompson',
      location: 'London, UK',
      rating: 5,
      text: 'Outstanding service! The online consultation was convenient and the nutritional guidance was exactly what I needed.',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop'
    },
    {
      id: 6,
      name: 'Pierre Dubois',
      location: 'Lyon, France',
      rating: 5,
      text: 'Approche holistique exceptionnelle. J\'ai non seulement perdu du poids mais aussi gagné en énergie et en bien-être général.',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-teal-600 font-medium tracking-wider text-sm mb-4">
            TESTIMONIANZE
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-xl text-gray-600">{t('testimonials.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
              
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-700 leading-relaxed italic">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;