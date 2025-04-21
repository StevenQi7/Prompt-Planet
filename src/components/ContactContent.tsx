'use client';

import React, { useState } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { FaEnvelope, FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function ContactContent() {
  const { t } = useTranslations();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面标题横幅 */}
      <div className="relative mb-8 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t('contact.title')}</h1>
            <p className="text-xl text-gray-100 mb-6">{t('contact.subtitle')}</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-600 text-center mb-12">{t('contact.description')}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 联系表单 */}
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
                <div className="mb-6">
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                    {t('contact.form.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('contact.form.namePlaceholder')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    {t('contact.form.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('contact.form.emailPlaceholder')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                    {t('contact.form.subject')}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={t('contact.form.subjectPlaceholder')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('contact.form.messagePlaceholder')}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-300 disabled:bg-indigo-400"
                >
                  {status === 'loading' ? '...' : t('contact.form.submit')}
                </button>

                {status === 'success' && (
                  <p className="mt-4 text-green-600 text-center">{t('contact.form.success')}</p>
                )}
                {status === 'error' && (
                  <p className="mt-4 text-red-600 text-center">{t('contact.form.error')}</p>
                )}
              </form>
            </div>

            {/* 其他联系方式 */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">{t('contact.otherChannels.title')}</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-gray-700 font-medium mb-2">{t('contact.otherChannels.email')}</h4>
                    <a href="mailto:contact@promptplanet.ai" className="text-indigo-600 hover:text-indigo-700 flex items-center">
                      <FaEnvelope className="mr-2" />
                      contact@promptplanet.ai
                    </a>
                  </div>

                  <div>
                    <h4 className="text-gray-700 font-medium mb-2">{t('contact.otherChannels.social')}</h4>
                    <div className="flex space-x-4">
                      <a href="https://github.com/promptplanet" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                        <FaGithub size={24} />
                      </a>
                      <a href="https://twitter.com/promptplanet" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                        <FaTwitter size={24} />
                      </a>
                      <a href="https://linkedin.com/company/promptplanet" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                        <FaLinkedin size={24} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 