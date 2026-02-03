import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { CheckCircle, AlertCircle, Calendar as CalendarIcon } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AppointmentBooking = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: new Date(),
    time: '',
    type: '',
    notes: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // Available time slots (9 AM - 6 PM, 30-minute intervals)
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({ ...prev, phone: value }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, date }));
    setShowCalendar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.time || !formData.type) {
      setStatus({ type: 'error', message: 'Please fill all required fields' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const appointmentData = {
        ...formData,
        date: formData.date.toISOString().split('T')[0]
      };
      
      const response = await axios.post(`${BACKEND_URL}/api/appointment`, appointmentData);
      
      if (response.data.success) {
        setStatus({ type: 'success', message: t('appointment.form.success') });
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: new Date(),
          time: '',
          type: '',
          notes: ''
        });
      }
    } catch (error) {
      setStatus({ type: 'error', message: t('appointment.form.error') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Disable weekends
  };

  return (
    <section id="appointment" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
            {t('appointment.title')}
          </h2>
          <p className="text-xl text-gray-600">{t('appointment.subtitle')}</p>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('appointment.form.name')} *
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('appointment.form.email')} *
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('appointment.form.phone')} *
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

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('appointment.form.date')} *
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="w-full flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-teal-500 transition-colors"
                  >
                    <CalendarIcon className="w-5 h-5 text-gray-500" />
                    <span>{formData.date.toLocaleDateString()}</span>
                  </button>
                  {showCalendar && (
                    <div className="absolute z-10 mt-2 bg-white shadow-lg rounded-lg p-2">
                      <Calendar
                        onChange={handleDateChange}
                        value={formData.date}
                        minDate={new Date()}
                        tileDisabled={({ date }) => isWeekend(date)}
                        className="border-0"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('appointment.form.time')} *
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">{t('appointment.form.time')}</option>
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('appointment.form.type')} *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">{t('appointment.form.type')}</option>
                <option value="initial">{t('appointment.form.types.initial')}</option>
                <option value="followup">{t('appointment.form.types.followup')}</option>
                <option value="nutrition">{t('appointment.form.types.nutrition')}</option>
                <option value="sports">{t('appointment.form.types.sports')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('appointment.form.notes')}
              </label>
              <Textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full"
              />
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
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-6 rounded-full text-lg font-medium"
            >
              {isSubmitting ? 'Prenotazione in corso...' : t('appointment.form.submit')}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AppointmentBooking;