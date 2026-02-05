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

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('consultation.form.name')} *
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full"
                  placeholder="Mario Rossi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('consultation.form.email')} *
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full"
                  placeholder="mario@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('consultation.form.phone')} *
              </label>
              <PhoneInput
                country={'it'}
                value={formData.phone}
                onChange={handlePhoneChange}
                inputClass="w-full"
                containerClass="phone-input-container"
                preferredCountries={['it', 'fr', 'es', 'gb']}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('consultation.form.message')} *
              </label>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full"
                placeholder={t('consultation.form.message')}
              />
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
                className="mt-1"
                required
              />
              <label className="text-sm text-gray-600">
                {t('consultation.form.consent')} *
              </label>
            </div>

            {status.message && (
              <div className={`flex items-center space-x-2 p-4 rounded-lg ${
                status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span>{status.message}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-6 rounded-full text-lg font-medium flex items-center justify-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>{isSubmitting ? 'Invio in corso...' : t('consultation.form.submit')}</span>
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ConsultationForm;