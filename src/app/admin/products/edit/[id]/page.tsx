'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import apiClient from '@/lib/api/client';
import { useToast } from '@/lib/toast/ToastContext';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  status: string;
  category_ids: string[];
  image_url: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const { success, error: toastError } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    status: 'active',
    category_ids: [] as string[],
    image_url: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      fetchProduct();
      fetchCategories();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await apiClient.get(`/products/${productId}`);
      const prod = response.data;
      setProduct(prod);
      setFormData({
        name: prod.name || '',
        description: prod.description || '',
        price: prod.price?.toString() || '',
        status: prod.status || 'active',
        category_ids: prod.category_ids || [],
        image_url: prod.image_url || ''
      });
      if (prod.image_url) {
        setImagePreview(prod.image_url);
      }
    } catch (err) {
      console.error('Failed to fetch product:', err);
      toastError('Failed to load product');
      router.push('/admin/products');
    } finally {
      setLoadingProduct(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/categories');
      setCategories(response.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleCategory = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      category_ids: prev.category_ids.includes(categoryId)
        ? prev.category_ids.filter(id => id !== categoryId)
        : [...prev.category_ids, categoryId]
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.description) {
      toastError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = formData.image_url || '';
      
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('file', imageFile);
        const uploadResponse = await apiClient.post('/upload/image', imageFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadResponse.data.url;
      }

      await apiClient.put(`/products/${productId}`, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        status: formData.status,
        category_ids: formData.category_ids,
        image_url: imageUrl
      });

      success('Product updated successfully!');
      router.push('/admin/products');
    } catch (err: any) {
      console.error('Failed to update product:', err);
      toastError(err.response?.data?.error || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Edit Product</h1>
          <p className="text-sm text-slate-500 mt-1">Update the details of product #{productId}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Product Name</label>
                <input 
                  required 
                  type="text" 
                  name="name"
                  value={formData.name}
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

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow bg-white text-slate-700"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-sm font-semibold text-slate-700 block mb-3">Categories</label>
                {categories.length === 0 ? (
                  <p className="text-sm text-slate-500">No categories available</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {categories.map(cat => (
                      <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            checked={formData.category_ids.includes(cat.id)}
                            onChange={() => toggleCategory(cat.id)}
                            className="peer sr-only"
                          />
                          <div className="w-5 h-5 rounded border-2 border-slate-300 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors select-none">
                          {cat.name}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6 flex flex-col">
              <div className="space-y-2 flex-1 flex flex-col">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <textarea 
                  required 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full flex-1 min-h-[160px] px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow resize-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Product Image</label>
            <div className="w-full">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg" />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="w-full flex justify-center px-6 pt-10 pb-12 border-2 border-slate-300 border-dashed rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <div className="space-y-2 text-center">
                    <div className="mx-auto h-12 w-12 text-slate-400 group-hover:text-blue-500 transition-colors flex items-center justify-center bg-slate-100 rounded-full mb-4">
                      <Upload size={24} />
                    </div>
                    <div className="text-sm text-slate-600 font-medium">
                      <span className="text-blue-600 hover:underline">Upload a file</span> or drag and drop
                    </div>
                    <p className="text-xs text-slate-500">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                </label>
              )}
            </div>
          </div>

        </div>

        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <Link href="/admin/products" className="px-5 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors">
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