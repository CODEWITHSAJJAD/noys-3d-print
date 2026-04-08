'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Tags } from 'lucide-react';
import apiClient from '@/lib/api/client';
import { useToast } from '@/lib/toast/ToastContext';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { error, success } = useToast();

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get('/categories');
      setCategories(res.data || []);
    } catch (err) {
      error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();

    const interval = setInterval(() => {
      if (window.location.pathname === '/admin/categories') {
        fetchCategories();
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await apiClient.delete(`/categories/${id}`);
      setCategories(categories.filter(c => c.id !== id));
      success('Category deleted successfully');
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 max-w-7xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Categories</h1>
          <p className="text-sm text-slate-500 mt-1">Manage product categories for filtering your shop.</p>
        </div>
        <Link 
          href="/admin/categories/add" 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={16} />
          <span>Add Category</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-2">
          <Tags size={20} className="text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-800">Shop Categories</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase w-1/3">Slug</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right w-1/4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{category.name}</td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-sm">{category.slug}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/categories/edit/${category.id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(category.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {categories.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No categories found. Click "Add Category" to create your first one.
          </div>
        )}
      </div>
    </div>
  );
}
