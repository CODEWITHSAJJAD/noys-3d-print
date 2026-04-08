'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/lib/auth/useAuth';
import apiClient from '@/lib/api/client';

interface SavedGeneration {
  id: string;
  prompt: string;
  image_url: string;
  created_at: string;
}

export default function GalleryPage() {
  const { isAuthenticated } = useAuth();
  const [savedItems, setSavedItems] = useState<SavedGeneration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSavedGenerations();
    } else {
      loadLocalStorage();
    }
  }, [isAuthenticated]);

  const loadLocalStorage = () => {
    const existingSaved = JSON.parse(localStorage.getItem('2dtoy_gallery') || '[]');
    const mapped = existingSaved.map((item: any) => ({
      id: item.id,
      prompt: item.prompt,
      image_url: item.imageUrl,
      created_at: item.date
    }));
    setSavedItems(mapped);
    setLoading(false);
  };

  const fetchSavedGenerations = async () => {
    try {
      const response = await apiClient.get('/generations/gallery');
      setSavedItems(response.data || []);
    } catch (err) {
      console.error('Failed to fetch gallery:', err);
      loadLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center pt-24">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] p-8 max-w-7xl mx-auto pt-24">
      <h1 className="text-4xl font-bold text-[#0c2a50] mb-8 text-center pt-8">Miniature Gallery</h1>
      <p className="text-center text-[#1a4073] mb-12 max-w-2xl mx-auto">
        Browse our collection of custom 3D printed models, tabletop terrain, and hobby pieces.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {savedItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-2xl transition-shadow duration-300 border-2 border-orange-300 shadow-[4px_4px_0px_#cc6200]">
            <div className="h-64 bg-gray-100 w-full flex items-center justify-center overflow-hidden">
              {item.image_url ? (
                <img src={item.image_url} alt={item.prompt} className="object-cover h-full w-full" />
              ) : (
                <span className="text-gray-400 font-semibold">No Image</span>
              )}
            </div>
            <CardContent className="p-4 bg-orange-50 backdrop-blur-sm">
              <h3 className="font-bold text-lg text-[#0c2a50] line-clamp-1">{item.prompt}</h3>
              <p className="text-sm text-orange-600 font-bold tracking-wide">MY SAVED GENERATION</p>
            </CardContent>
          </Card>
        ))}

        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={`static_${i}`} className="overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="h-64 bg-blue-100 w-full flex items-center justify-center">
              <p className="text-blue-400 font-semibold">Gallery Image {i}</p>
            </div>
            <CardContent className="p-4 bg-white/50 backdrop-blur-sm">
              <h3 className="font-bold text-lg text-gray-800">Custom Model {i}</h3>
              <p className="text-sm text-gray-500">High Detail Resin</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
