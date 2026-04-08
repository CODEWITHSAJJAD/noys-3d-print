'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import apiClient from '@/lib/api/client';
import { useToast } from '@/lib/toast/ToastContext';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { error, success } = useToast();

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        apiClient.get('/products'),
        apiClient.get('/categories')
      ]);
      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (err) {
      error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      fetchData();
    };

    const interval = setInterval(() => {
      if (window.location.pathname === '/admin/products') {
        fetchData();
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await apiClient.delete(`/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
      success('Product deleted successfully');
    } catch (err) {
      error('Failed to delete product');
    }
  };

  const getCategoryNames = (categoryId: string | null) => {
    if (!categoryId) return [];
    const cat = categories.find(c => c.id === categoryId);
    return cat ? [cat.name] : [];
  };

  const filteredProducts = activeCategory 
    ? products.filter(p => p.category_id === activeCategory)
    : products;

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
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Products</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your shop inventory and listings.</p>
        </div>
        <Link 
          href="/admin/products/add" 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={16} />
          <span>Add Product</span>
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 pt-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
            !activeCategory 
              ? 'bg-slate-800 text-white shadow-md' 
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
          }`}
        >
          All Products
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              activeCategory === cat.id 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Product</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Price</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Categories</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 shrink-0">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <ImageIcon size={20} className="text-slate-400" />
                        )}
                      </div>
                      <div className="font-medium text-slate-900">{product.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    ${Number(product.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {product.category_id && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          {getCategoryNames(product.category_id)[0]}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.is_active 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/products/edit/${product.id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)}
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
        {filteredProducts.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No products found matching the selected category.
          </div>
        )}
      </div>
    </div>
  );
}
