import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { CheckCircle, AlertCircle, Send } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ConsultationForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    consent: false
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({ ...prev, phone: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.consent) {
      setStatus({ type: 'error', message: 'Please accept the privacy policy' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await axios.post(`${BACKEND_URL}/api/consultation`, formData);
      
      if (response.data.success) {
        setStatus({ type: 'success', message: t('consultation.form.success') });
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          consent: false
        });
      }
    } catch (error) {
      setStatus({ type: 'error', message: t('consultation.form.error') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="consultation" className="py-24 bg-gradient-to-br from-teal-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
            {t('consultation.title')}
          </h2>
          <p className="text-xl text-teal-600 font-medium mb-4">{t('consultation.subtitle')}</p>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('consultation.intro')}
          </p>
        </div>

        {/* What's Included */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-serif text-gray-900 mb-6 text-center">
            {t('consultation.includesTitle')}
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {['assessment', 'habits', 'measurements', 'bmi', 'advice'].map((key) => (
              <div key={key} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {t(`consultation.includes.${key}.title`)}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {t(`consultation.includes.${key}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-6 italic">
            {t('consultation.cta')}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">\n          <form onSubmit={handleSubmit} className="space-y-6">\n            <div className="grid md:grid-cols-2 gap-6">\n              <div>\n                <label className="block text-sm font-medium text-gray-700 mb-2">\n                  {t('consultation.form.name')} *\n                </label>\n                <Input\n                  type="text"\n                  name="name"\n                  value={formData.name}\n                  onChange={handleChange}\n                  required\n                  className="w-full"\n                  placeholder="Mario Rossi"\n                />\n              </div>\n\n              <div>\n                <label className="block text-sm font-medium text-gray-700 mb-2">\n                  {t('consultation.form.email')} *\n                </label>\n                <Input\n                  type="email"\n                  name="email"\n                  value={formData.email}\n                  onChange={handleChange}\n                  required\n                  className="w-full"\n                  placeholder="mario@example.com"\n                />\n              </div>\n            </div>\n\n            <div>\n              <label className="block text-sm font-medium text-gray-700 mb-2">\n                {t('consultation.form.phone')} *\n              </label>\n              <PhoneInput\n                country={'it'}\n                value={formData.phone}\n                onChange={handlePhoneChange}\n                inputClass="w-full"\n                containerClass="phone-input-container"\n                preferredCountries={['it', 'fr', 'es', 'gb']}\n              />\n            </div>\n\n            <div>\n              <label className="block text-sm font-medium text-gray-700 mb-2">\n                {t('consultation.form.message')} *\n              </label>\n              <Textarea\n                name="message"\n                value={formData.message}\n                onChange={handleChange}\n                required\n                rows={5}\n                className="w-full"\n                placeholder={t('consultation.form.message')}\n              />\n            </div>\n\n            <div className="flex items-start space-x-2">\n              <input\n                type="checkbox"\n                name="consent"\n                checked={formData.consent}\n                onChange={handleChange}\n                className="mt-1"\n                required\n              />\n              <label className="text-sm text-gray-600">\n                {t('consultation.form.consent')} *\n              </label>\n            </div>\n\n            {status.message && (\n              <div className={`flex items-center space-x-2 p-4 rounded-lg ${\n                status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'\n              }`}>\n                {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}\n                <span>{status.message}</span>\n              </div>\n            )}\n\n            <Button\n              type="submit"\n              disabled={isSubmitting}\n              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-6 rounded-full text-lg font-medium flex items-center justify-center space-x-2"\n            >\n              <Send className="w-5 h-5" />\n              <span>{isSubmitting ? 'Invio in corso...' : t('consultation.form.submit')}</span>\n            </Button>\n          </form>\n        </div>
      </div>
    </section>
  );
};

export default ConsultationForm;