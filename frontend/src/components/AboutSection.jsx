import React from 'react';

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&h=800&fit=crop"
                alt="Dott.ssa Felaco Giuseppina"
                className="w-full h-[600px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-teal-100 rounded-3xl -z-10" />
          </div>

          <div>
            <p className="text-teal-600 font-medium tracking-wider text-sm mb-4">
              CHI SONO
            </p>
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">
              Dott.ssa Felaco <span className="text-teal-600 italic">Giuseppina</span>
            </h2>

            <div className="space-y-4 mb-8">
              <p className="text-gray-700 leading-relaxed">
                <span className="font-semibold">Sono la dott.ssa Felaco Giuseppina,</span> biologa nutrizionista, curiosa ricercatrice in ambito alimentare e della natura.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Insegno sostegno in una scuola secondaria di primo grado, sono un'amante spassionata per il metodo educativo didattico.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <span className="font-semibold">Dono con amore e piacere strumenti</span> metodologici ai miei studenti, al fine di poter dar loro degli input, che possano servir loro a migliorare la crescita con semplicità e serenità. In generale, utilizzo il mio lavoro in modo olistico, osservando, stimolando e ricavando risposte per poter dare altri stimoli.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Il mio modus operandi è quello di aiutare le persone a costruire il proprio benessere psico-fisico, ed è per questo che mi occupo di <span className="font-semibold">prevenzione e divulgazione</span> rivolta al prossimo sotto svariati aspetti: alimentare, didattico, emozionale e sportivo.
              </p>
            </div>

            <div className="border-l-4 border-teal-500 pl-6 space-y-4 mb-8">
              <blockquote className="text-lg italic text-gray-600">
                "La salute vien dalla conoscenza ed il sapere viene da una guida esterna."
              </blockquote>
              <blockquote className="text-lg italic text-gray-600">
                "Noi siamo ciò che mangiamo, diciamo e facciamo!"
              </blockquote>
            </div>

            <p className="text-gray-700 leading-relaxed">
              Tutto dipende dal nostro modo di vedere, sentire, toccare, odorare e gustare. Quest'ultima ha tutte le competenze per poter arrivare ai bisogni e alle esigenze delle persone, finanche a far arrivare alle persone stesse a costruire una guida interna, una volta che si è arrivati all'obiettivo desiderato. L'obiettivo desiderato è "raggiungere un benessere fisico, mentale e dinamico". Solo con "la conoscenza vera" si può veramente capire l'importanza della prevenzione!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;