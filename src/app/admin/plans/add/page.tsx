'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api/client';
import { useToast } from '@/lib/toast/ToastContext';

export default function AddPlanPage() {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    credits: '',
    is_popular: false
  });
  const [features, setFeatures] = useState<string[]>(['']);

  const handleAddFeature = () => {
    setFeatures([...features, '']);
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.credits) {
      toastError('Please fill in all required fields');
      return;
    }

    const validFeatures = features.filter(f => f.trim() !== '');

    setLoading(true);
    try {
      await apiClient.post('/plans', {
        name: formData.name,
        price: parseFloat(formData.price),
        credits: parseInt(formData.credits),
        features: validFeatures,
        is_popular: formData.is_popular
      });
      success('Plan created successfully!');
      router.push('/admin/plans');
    } catch (err: any) {
      console.error('Failed to create plan:', err);
      toastError(err.response?.data?.error || 'Failed to create plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/plans" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Add New Plan</h1>
          <p className="text-sm text-slate-500 mt-1">Create a new membership tier.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Plan Name</label>
            <input 
              required 
              type="text" 
              name="name"
              value={formData.name} 
              onChange={handleInputChange} 
              placeholder="E.g. Professional Maker" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow" 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Price ($/mo)</label>
              <input 
                required 
                type="number" 
                name="price"
                step="0.01" 
                value={formData.price} 
                onChange={handleInputChange} 
                placeholder="0.00" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Credits/Month</label>
              <input 
                required 
                type="number" 
                name="credits"
                value={formData.credits} 
                onChange={handleInputChange} 
                placeholder="100" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow" 
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              name="is_popular"
              id="is_popular"
              checked={formData.is_popular}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="is_popular" className="text-sm font-semibold text-slate-700">Mark as Popular Plan</label>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700">Features List</label>
              <button type="button" onClick={handleAddFeature} className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                <Plus size={16} />
                <span>Add Feature</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {features.map((feature, idx) => (
                <div key={idx} className="flex gap-3">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(idx, e.target.value)}
                    placeholder="Enter feature description..."
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                  />
                  {features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <Link href="/admin/plans" className="px-5 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={loading} 
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors disabled:opacity-70"
          >
            {loading ? 'Saving...' : 'Save Plan'}
          </button>
        </div>
      </form>
    </div>
  );
}
