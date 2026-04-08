'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api/client';
import { useToast } from '@/lib/toast/ToastContext';

export default function AddCategoryPage() {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData(prev => ({
      name: val,
      slug: val.toLowerCase().trim().replace(/[\s\W-]+/g, '-')
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.slug) {
      toastError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/categories', {
        name: formData.name,
        slug: formData.slug
      });
      success('Category created successfully!');
      router.push('/admin/categories');
    } catch (err: any) {
      console.error('Failed to create category:', err);
      toastError(err.response?.data?.error || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/categories" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Add New Category</h1>
          <p className="text-sm text-slate-500 mt-1">Create a new product grouping for the shop.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Category Name</label>
            <input 
              required 
              type="text" 
              value={formData.name} 
              onChange={handleNameChange} 
              placeholder="E.g. Sci-Fi Models" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">URL Slug</label>
            <input 
              required 
              type="text" 
              value={formData.slug} 
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })} 
              placeholder="e.g. sci-fi-models" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow font-mono text-sm bg-slate-50" 
            />
            <p className="text-xs text-slate-500">Auto-generated from name. This is used in the shop URL filtering.</p>
          </div>
        </div>

        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <Link href="/admin/categories" className="px-5 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={loading} 
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors disabled:opacity-70"
          >
            {loading ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </form>
    </div>
  );
}
