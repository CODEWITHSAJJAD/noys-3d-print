'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import apiClient from '@/lib/api/client';
import { useToast } from '@/lib/toast/ToastContext';

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;
  const { success, error: toastError } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  });

  useEffect(() => {
    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  const fetchCategory = async () => {
    try {
      const response = await apiClient.get(`/categories/${categoryId}`);
      const category = response.data;
      setFormData({
        name: category.name || '',
        slug: category.slug || ''
      });
    } catch (err) {
      console.error('Failed to fetch category:', err);
      toastError('Failed to load category');
      router.push('/admin/categories');
    } finally {
      setLoadingCategory(false);
    }
  };

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
      await apiClient.put(`/categories/${categoryId}`, {
        name: formData.name,
        slug: formData.slug
      });
      success('Category updated successfully!');
      router.push('/admin/categories');
    } catch (err: any) {
      console.error('Failed to update category:', err);
      toastError(err.response?.data?.error || 'Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  if (loadingCategory) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/categories" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Edit Category <span className="font-normal text-slate-400">#{categoryId}</span></h1>
          <p className="text-sm text-slate-500 mt-1">Update product grouping details.</p>
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
            {loading ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}