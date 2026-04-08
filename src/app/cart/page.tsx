'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart/CartContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center pt-24 pb-20 px-4">
        <div className="bg-blue-50 p-8 rounded-full mb-6">
          <ShoppingBag size={64} className="text-blue-300 mx-auto" />
        </div>
        <h1 className="text-4xl font-black text-[#0c2a50] mb-4 text-center">Your cart is empty</h1>
        <p className="text-[#1a4073] mb-8 text-center max-w-md">Looks like you haven't added any miniature prints or custom models to your cart yet.</p>
        <Link href="/shop">
          <Button variant="primary" size="lg">Return to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] p-8 max-w-6xl mx-auto pt-24">
      <h1 className="text-4xl sm:text-5xl font-black text-[#0c2a50] mb-8 drop-shadow-sm">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        {}
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-visible shadow-[4px_4px_0px_#1a4073] hover:-translate-y-1 transition-transform">
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center">
                
                {}
                <div className="w-full sm:w-32 h-32 bg-blue-100 rounded-xl flex items-center justify-center shrink-0 border-2 border-blue-200 shadow-inner">
                  <span className="text-xs font-bold text-blue-400 capitalize">{item.name.substring(0, 15)}...</span>
                </div>
                
                {}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-[#0c2a50] mb-2">{item.name}</h3>
                  <p className="text-lg font-black text-orange-500">${item.price.toFixed(2)}</p>
                </div>
                
                {}
                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border-2 border-gray-200">
                  <button 
                    className="p-1 rounded-md text-gray-500 hover:text-[#0c2a50] hover:bg-white transition-colors"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus size={18} />
                  </button>
                  <span className="font-bold w-6 text-center">{item.quantity}</span>
                  <button 
                    className="p-1 rounded-md text-gray-500 hover:text-[#0c2a50] hover:bg-white transition-colors"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus size={18} />
                  </button>
                </div>
                
                {}
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-3 text-red-400 hover:text-white hover:bg-red-500 rounded-full transition-all border-2 border-transparent hover:border-[#1a4073] hover:shadow-[2px_2px_0px_#1a4073]"
                  title="Remove Item"
                >
                  <Trash2 size={24} />
                </button>
                
              </CardContent>
            </Card>
          ))}
        </div>

        {}
        <div className="w-full lg:w-96">
          <Card className="sticky top-24 bg-gradient-to-b from-white to-sky-50 shadow-[6px_6px_0px_#1a4073] border-[#0c2a50]">
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-2xl font-black text-[#0c2a50] mb-6 border-b-2 border-blue-100 pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6 text-[#1a4073] font-semibold">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm opacity-80">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-2xl font-black text-[#0a2342] mb-8 pt-4 border-t-2 border-blue-200 border-dashed">
                <span>Total</span>
                <span className="text-orange-600">${cartTotal.toFixed(2)}</span>
              </div>

              <Link href="/checkout" className="block w-full">
                <Button variant="primary" className="w-full h-14 text-lg">
                  Proceed to Checkout <span className="ml-2">→</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
