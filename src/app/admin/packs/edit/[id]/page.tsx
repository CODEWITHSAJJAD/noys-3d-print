'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import apiClient from '@/lib/api/client';
import { useToast } from '@/lib/toast/ToastContext';

export default function EditPackPage() {
  const router = useRouter();
  const params = useParams();
  const packId = params.id as string;
  const { success, error: toastError } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [loadingPack, setLoadingPack] = useState(true);
  const [formData, setFormData] = useState({
    credits: '',
    price: '',
    is_active: true
  });

  useEffect(() => {
    if (packId) {
      fetchPack();
    }
  }, [packId]);

  const fetchPack = async () => {
    try {
      const response = await apiClient.get(`/credit-packs/${packId}`);
      const pack = response.data;
      setFormData({
        credits: pack.credits?.toString() || '',
        price: pack.price?.toString() || '',
        is_active: pack.is_active !== false
      });
    } catch (err) {
      console.error('Failed to fetch credit pack:', err);
      toastError('Failed to load credit pack');
      router.push('/admin/plans');
    } finally {
      setLoadingPack(false);
    }
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
    
    if (!formData.credits || !formData.price) {
      toastError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await apiClient.put(`/credit-packs/${packId}`, {
        credits: parseInt(formData.credits),
        price: parseFloat(formData.price),
        is_active: formData.is_active
      });
      success('Credit pack updated successfully!');
      router.push('/admin/plans');
    } catch (err: any) {
      console.error('Failed to update credit pack:', err);
      toastError(err.response?.data?.error || 'Failed to update credit pack');
    } finally {
      setLoading(false);
    }
  };

  if (loadingPack) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/plans" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Edit Credit Pack <span className="text-slate-400 font-normal">#{packId}</span></h1>
          <p className="text-sm text-slate-500 mt-1">Update the details for this credit package.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Credits Included</label>
              <input 
                required 
                type="number" 
                name="credits"
                value={formData.credits}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Price ($)</label>
              <input 
                required 
                type="number" 
                name="price"
                step="0.01" 
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow" 
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              name="is_active"
              id="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="text-sm font-semibold text-slate-700">Active (visible in shop)</label>
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
            {loading ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}