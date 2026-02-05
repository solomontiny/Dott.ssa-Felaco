import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

const ContactSection = () => {
  const { t } = useTranslation();
  
  const contactInfo = [
    {
      icon: Mail,
      label: t('contact.email.label'),
      value: 'dott.giuseppinafelaco@gmail.com',
      href: 'mailto:dott.giuseppinafelaco@gmail.com'
    },
    {
      icon: Phone,
      label: t('contact.phone.label'),
      value: '+39 345 050 3440',
      href: 'tel:+393450503440'
    },
    {
      icon: MapPin,
      label: t('contact.location.label'),
      value: t('contact.location.value'),
      href: '#'
    },
    {
      icon: Clock,
      label: t('contact.hours.label'),
      value: t('contact.hours.value'),
      href: '#'
    }
  ];

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-teal-600 font-medium tracking-wider text-sm mb-4">
            {t('contact.label')}
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
            {t('contact.title')}
          </h2>
          <p className="text-xl text-gray-600">{t('contact.subtitle')}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-serif text-gray-900 mb-6">
              {t('contact.infoTitle')}
            </h3>
            <div className="space-y-6">
              {contactInfo.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white transition-colors duration-200 group"
                  >
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-teal-500 transition-colors duration-300">
                      <IconComponent className="w-6 h-6 text-teal-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{item.label}</p>
                      <p className="text-gray-900 font-medium">{item.value}</p>
                    </div>
                  </a>
                );
              })}
            </div>

            <div className="mt-8 p-6 bg-teal-50 rounded-2xl border border-teal-100">
              <h4 className="font-semibold text-gray-900 mb-2">
                {t('contact.directContact')}
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                {t('contact.whatsappText')}
              </p>
              <button
                onClick={() => window.open('https://wa.me/393334567890', '_blank')}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-medium flex items-center justify-center space-x-2 transition-colors duration-200"
              >
                <Send className="w-5 h-5" />
                <span>{t('contact.whatsappButton')}</span>
              </button>
            </div>
          </div>

          {/* Quick Contact Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-2xl font-serif text-gray-900 mb-6">
              {t('contact.formTitle')}
            </h3>
            <form className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder={t('contact.form.name')}
                  className="w-full"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder={t('contact.form.email')}
                  className="w-full"
                />
              </div>
              <div>
                <Input
                  type="tel"
                  placeholder={t('contact.form.phone')}
                  className="w-full"
                />
              </div>
              <div>
                <Textarea
                  placeholder={t('contact.form.message')}
                  rows={4}
                  className="w-full"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-600 text-white py-6 rounded-full font-medium"
              >
                {t('contact.form.submit')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;