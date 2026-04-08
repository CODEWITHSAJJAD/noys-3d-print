'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/lib/cart/CartContext';
import { useToast } from '@/lib/toast/ToastContext';
import { useSearchParams } from 'next/navigation';
import apiClient from '@/lib/api/client';

function ShopContent() {
  const { addToCart } = useCart();
  const { success } = useToast();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const activeCategorySlug = searchParams.get('category');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          apiClient.get(`/products?active_only=true${activeCategorySlug ? `&category=${activeCategorySlug}` : ''}`),
          apiClient.get('/categories')
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error('Failed to fetch shop data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [activeCategorySlug]);

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image_url || null
    });
    success(`Added ${product.name} to your cart!`);
  };

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-5">
            <div className="animate-pulse space-y-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-8 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </aside>
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-72 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 shrink-0">
        <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-5 md:sticky md:top-24">
          <h2 className="font-bold text-[#0c2a50] mb-4 text-lg">Categories</h2>
          <ul className="space-y-2">
            <li>
              <Link 
                href="/shop" 
                className={`block px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                  !activeCategorySlug 
                    ? 'bg-blue-500 text-white shadow-md transform scale-105' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                All Products
              </Link>
            </li>
            {categories.map(cat => (
              <li key={cat.id}>
                <Link 
                  href={`/shop?category=${cat.slug}`} 
                  className={`block px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeCategorySlug === cat.slug 
                      ? 'bg-blue-500 text-white shadow-md transform scale-105' 
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="flex-1">
        {activeCategorySlug && (
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#0c2a50]">
              {categories.find(c => c.slug === activeCategorySlug)?.name}
            </h2>
            <span className="text-sm font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {products.length} Items
            </span>
          </div>
        )}

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="flex flex-col h-full hover:scale-105 transition-transform duration-300 border-2 border-transparent hover:border-blue-200">
                <div className="h-48 bg-blue-50 w-full flex items-center justify-center">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="object-cover w-full h-full" />
                  ) : (
                    <p className="text-blue-300 font-medium">Product Image</p>
                  )}
                </div>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-800 mb-2 leading-tight">{product.name}</h3>
                  <p className="text-xl font-black text-orange-500 mb-4">${Number(product.price).toFixed(2)}</p>
                  
                  <div className="mt-auto">
                    <Button 
                      variant="primary" 
                      className="w-full relative overflow-hidden group"
                      onClick={() => handleAddToCart(product)}
                    >
                      <span className="relative z-10">Add to Cart</span>
                      <div className="absolute inset-0 h-full w-full border-white/20 border-b-4 z-0 pointer-events-none group-active:border-none"></div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-xl border-2 border-dashed border-blue-200">
            <h3 className="text-xl font-bold text-[#0c2a50]">No products found.</h3>
            <p className="text-gray-500 mt-2">Try selecting a different category from the sidebar.</p>
            <Link href="/shop" className="inline-block mt-4 text-blue-500 font-bold hover:underline">
              View All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] p-8 max-w-7xl mx-auto pt-24">
      <h1 className="text-4xl font-bold text-[#0c2a50] mb-8 text-center pt-8">Shop Ready-Made Prints</h1>
      <Suspense fallback={<div className="text-center py-20 text-gray-500 font-bold animate-pulse">Loading shop...</div>}>
        <ShopContent />
      </Suspense>
    </div>
  );
}
