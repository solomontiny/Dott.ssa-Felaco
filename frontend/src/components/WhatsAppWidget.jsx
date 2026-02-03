import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  
  // Default WhatsApp number - can be configured
  const whatsappNumber = '+393334567890';
  
  const getWhatsAppMessage = () => {
    const messages = {
      it: 'Ciao! Vorrei ricevere informazioni sui servizi di nutrizione.',
      en: 'Hello! I would like to receive information about nutrition services.',
      fr: 'Bonjour! Je voudrais recevoir des informations sur les services de nutrition.',
      es: 'Hola! Me gustaría recibir información sobre los servicios de nutrición.'
    };
    return messages[i18n.language] || messages.it;
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(getWhatsAppMessage());
    window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleWhatsAppClick}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 group"
          aria-label="Contact on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="hidden group-hover:inline-block font-medium pr-2 whitespace-nowrap">
            WhatsApp
          </span>
        </button>
      </div>
    </>
  );
};

export default WhatsAppWidget;