import React from 'react';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { platform: 'facebook', icon: Facebook, url: '#' },
    { platform: 'instagram', icon: Instagram, url: '#' },
    { platform: 'linkedin', icon: Linkedin, url: '#' }
  ];

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Il mio metodo', href: '#metodo' },
    { label: 'Chi sono', href: '#about' },
    { label: 'Articoli', href: '#articoli' },
    { label: 'Risorse', href: '#risorse' }
  ];

  const policies = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Cookie Policy', href: '#' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white rounded-full" />
              </div>
              <span className="text-xl font-serif italic">Dott.ssa Felaco</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Biologa nutrizionista dedicata al benessere psico-fisico attraverso alimentazione consapevole, educazione e movimento.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-teal-500 transition-colors duration-200"
                    aria-label={social.platform}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Link Utili</h3>
            <ul className="space-y-3">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-teal-400 transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contatti</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-5 h-5 text-teal-500" />
                <span>info@nutrizionistafelaco.it</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-5 h-5 text-teal-500" />
                <span>+39 XXX XXX XXXX</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-5 h-5 text-teal-500" />
                <span>Italia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2026 Dott.ssa Felaco Giuseppina. Tutti i diritti riservati.
            </p>
            <div className="flex space-x-6">
              {policies.map((policy, index) => (
                <a
                  key={index}
                  href={policy.href}
                  className="text-gray-400 hover:text-teal-400 text-sm transition-colors duration-200"
                >
                  {policy.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;