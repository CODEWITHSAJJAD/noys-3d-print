'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import apiClient from '@/lib/api/client';
import { useToast } from '@/lib/toast/ToastContext';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.post('/contact', { name, email, message });
      success('Message sent successfully! We\'ll get back to you soon.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] p-8 max-w-3xl mx-auto flex flex-col items-center justify-center">
      <Card className="w-full border-t-8 border-t-blue-500 shadow-2xl">
        <CardContent className="p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-[#0c2a50] mb-2 text-center">Get in Touch</h1>
          <p className="text-center text-gray-500 mb-8">Have a question or custom project in mind?</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-300 text-blue-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-300 text-blue-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" placeholder="john@example.com" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Message</label>
              <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-300 text-blue-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white resize-y" placeholder="Tell us about your project..."></textarea>
            </div>
            
            <Button type="submit" variant="primary" className="w-full" size="lg" isLoading={loading}>Send Message</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
