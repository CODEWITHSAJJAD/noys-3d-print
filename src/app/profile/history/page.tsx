'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth/useAuth';
import { useCart } from '@/lib/cart/CartContext';
import { useToast } from '@/lib/toast/ToastContext';
import { Modal } from '@/components/ui/Modal';
import { Download, ShoppingBag, RefreshCw, Trash2, Wand2 } from 'lucide-react';
import apiClient from '@/lib/api/client';

interface GenerationItem {
  id: string;
  prompt: string;
  image_url: string;
  stl_url: string | null;
  is_saved: boolean;
  credits_used: number;
  created_at: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { addToCart } = useCart();
  const { success, error: toastError } = useToast();
  
  const [generations, setGenerations] = useState<GenerationItem[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchGenerations();
    }
  }, [isAuthenticated]);

  const fetchGenerations = async () => {
    try {
      const response = await apiClient.get('/generations');
      setGenerations(response.data || []);
    } catch (err) {
      console.error('Failed to fetch generations:', err);
      const stored = localStorage.getItem('2dtoy_gallery');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setGenerations(parsed);
        } catch (e) {
          console.error("Failed to parse generations", e);
        }
      }
    } finally {
      setIsDataLoaded(true);
    }
  };

  const handleOrderPrint = (item: GenerationItem) => {
    addToCart({
      id: `print_${item.id}`,
      name: `Custom Print: ${item.prompt.substring(0, 15)}...`,
      price: 24.99,
      quantity: 1,
      image: item.image_url
    });
    success('Custom Print added to your cart!');
  };

  const handleDownloadSTL = (item: GenerationItem) => {
    if (item.stl_url) {
      window.open(item.stl_url, '_blank');
    } else {
      toastError('STL file not available yet');
    }
  };

  const handleReuse = (prompt: string) => {
    router.push(`/ai-generator?prompt=${encodeURIComponent(prompt)}`);
  };

  const handleDelete = (id: string) => {
    setDeleteTarget(id);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    
    setDeleting(true);
    try {
      await apiClient.delete(`/generations/${deleteTarget}`);
      setGenerations(generations.filter(item => item.id !== deleteTarget));
      
      const stored = JSON.parse(localStorage.getItem('2dtoy_gallery') || '[]');
      const updatedStored = stored.filter((item: any) => item.id !== deleteTarget);
      localStorage.setItem('2dtoy_gallery', JSON.stringify(updatedStored));
      
      setDeleteTarget(null);
      success("Generation deleted successfully.");
    } catch (err) {
      console.error('Failed to delete generation:', err);
      toastError('Failed to delete generation');
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading || !isAuthenticated || !isDataLoaded) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center pt-24 pb-20">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] p-8 max-w-7xl mx-auto pt-24">
      <div className="flex flex-col mb-12 border-b-2 border-blue-100 pb-8 text-center sm:text-left">
        <h1 className="text-4xl sm:text-5xl font-black text-[#0c2a50] mb-2 drop-shadow-sm">My Designs</h1>
        <p className="text-[#1a4073] text-lg font-bold opacity-80">View and manage your generated models</p>
      </div>

      {generations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-white/50 backdrop-blur-sm rounded-[2rem] border-4 border-dashed border-blue-200 max-w-3xl mx-auto shadow-sm">
          <div className="bg-blue-100 p-6 rounded-full mb-6">
            <Wand2 size={48} className="text-blue-400 mx-auto" />
          </div>
          <h2 className="text-3xl font-black text-[#0c2a50] mb-4 text-center">You haven't generated anything yet</h2>
          <p className="text-[#1a4073] mb-8 text-center max-w-md">
            Head over to our AI generator to sculpt your first custom 3D masterpiece using just your imagination.
          </p>
          <Link href="/ai-generator">
            <Button variant="primary" size="lg" className="animate-pulse shadow-[0_6px_0_#cc6200]">
              Go to AI Generator
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {generations.map((gen) => (
            <Card key={gen.id} className="flex flex-col h-full hover:scale-105 transition-transform duration-300 border-2 border-transparent hover:border-blue-300 shadow-[6px_6px_0px_#1a4073]">
              
              <div className="h-56 bg-gradient-to-tr from-sky-100 to-white w-full border-b-2 border-slate-100 relative overflow-hidden flex items-center justify-center">
                {gen.image_url ? (
                  <img src={gen.image_url} alt={gen.prompt} className="object-cover w-full h-full" />
                ) : (
                  <span className="text-gray-400 font-bold tracking-widest uppercase">No Image</span>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#0c2a50] text-xs font-black px-3 py-1 rounded-full shadow-sm border border-gray-100">
                  {new Date(gen.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>

              <CardContent className="p-5 flex-1 flex flex-col bg-white">
                <div className="mb-4 flex-grow">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Prompt Details</p>
                  <p className="text-[#1a4073] font-semibold text-base line-clamp-3 leading-snug">"{gen.prompt}"</p>
                </div>
                
                <div className="flex flex-col gap-3 mt-auto pt-4 border-t-2 border-blue-50/50 border-dashed">
                   
                  <Button 
                    variant="primary" 
                    className="w-full justify-between px-5 font-bold shadow-md shadow-orange-500/20"
                    onClick={() => handleOrderPrint(gen)}
                  >
                    <span className="flex items-center gap-2"><ShoppingBag size={18} /> Order Print</span>
                    <span className="bg-orange-600 text-white rounded-md px-2 py-0.5 text-sm">+ Cart</span>
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="secondary" 
                      className="w-full text-sm py-2 shadow-sm shadow-blue-500/10"
                      onClick={() => handleDownloadSTL(gen)}
                    >
                      <Download size={16} className="mr-2" /> STL
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full text-sm py-2 font-black border-blue-200"
                      onClick={() => handleReuse(gen.prompt)}
                    >
                      <RefreshCw size={16} className="mr-2 text-blue-500" /> Reuse
                    </Button>
                  </div>
                  
                  <button 
                    onClick={() => handleDelete(gen.id)}
                    className="flex justify-center flex-row gap-1 items-center mt-2 mx-auto text-xs font-bold text-red-400 hover:text-red-600 active:scale-95 transition-all w-max py-1 px-3 rounded-full hover:bg-red-50"
                  >
                    <Trash2 size={12} /> <span className="uppercase tracking-wider">Delete Model</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Deletion">
        <div className="text-center space-y-6">
          <p className="text-[#1a4073] font-bold mb-6 text-lg">
            Are you sure you want to delete this model? This operation cannot be undone.
          </p>
          <div className="flex gap-4">
            <Button variant="outline" className="w-full font-bold border-gray-300" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button 
              variant="primary" 
              className="w-full bg-red-500 hover:bg-red-600 text-white border-red-600" 
              onClick={confirmDelete}
              isLoading={deleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
