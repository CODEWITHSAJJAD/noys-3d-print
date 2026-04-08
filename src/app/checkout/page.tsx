'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart/CartContext';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/lib/toast/ToastContext';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import apiClient from '@/lib/api/client';
import { useAuth } from '@/lib/auth/useAuth';

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const { error, success } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  
  const [shipping, setShipping] = useState({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    city: '',
    zip_code: ''
  });

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchUserData();
    } else if (!authLoading && !isAuthenticated) {
      setLoadingUser(false);
    }
  }, [isAuthenticated, authLoading]);

  const fetchUserData = async () => {
    try {
      const response = await apiClient.get('/auth/me');
      const user = response.data;
      
      if (user) {

        const nameParts = (user.name || '').split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const shippingAddress = user.shipping_address || '';

        let address = '';
        let city = '';
        let zip_code = '';
        
        if (shippingAddress && typeof shippingAddress === 'string') {
          const parts = shippingAddress.split(',').map(p => p.trim());
          if (parts.length >= 1) address = parts[0];
          if (parts.length >= 2) city = parts[1];
          if (parts.length >= 3) zip_code = parts[2];
        } else if (shippingAddress && typeof shippingAddress === 'object') {
          address = shippingAddress.address || '';
          city = shippingAddress.city || '';
          zip_code = shippingAddress.zip_code || '';
        }
        
        setShipping({
          first_name: firstName,
          last_name: lastName,
          email: user.email || '',
          address: address,
          city: city,
          zip_code: zip_code
        });
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    } finally {
      setLoadingUser(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipping({
      ...shipping,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const orderItems = items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }));
      
      const response = await apiClient.post('/orders', {
        items: orderItems,
        shipping_address: {
          first_name: shipping.first_name,
          last_name: shipping.last_name,
          email: shipping.email,
          address: shipping.address,
          city: shipping.city,
          zip_code: shipping.zip_code
        }
      });
      
      if (response.data.id) {
        clearCart();
        setIsSuccess(true);
        success('Order placed successfully!');
      }
    } catch (err: any) {
      console.error('Checkout failed', err);
      error(err.response?.data?.error || 'Order failed to process. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center pt-24 pb-20 px-4">
        <div className="bg-green-50 p-6 rounded-full border-4 border-[#1a4073] shadow-[4px_4px_0px_#1a4073] mb-6 animate-bounce">
          <CheckCircle2 size={64} className="text-green-500" />
        </div>
        <h1 className="text-4xl font-black text-[#0c2a50] mb-4 text-center">Order Confirmed!</h1>
        <p className="text-[#1a4073] mb-8 text-center max-w-md text-lg">
          Your miniatures are being prepped. We'll email you the tracking details soon!
        </p>
        <Link href="/">
          <Button variant="primary" size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center pt-24 pb-20">
        <h1 className="text-3xl font-black text-[#0c2a50] mb-4">No Order to Process</h1>
        <Link href="/shop"><Button variant="primary">Return to Shop</Button></Link>
      </div>
    );
  }

  if (loadingUser) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center pt-24">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] p-8 max-w-6xl mx-auto pt-24">
      <h1 className="text-4xl sm:text-5xl font-black text-[#0c2a50] mb-8 drop-shadow-sm">Checkout</h1>
      
      <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <Card className="shadow-[4px_4px_0px_#1a4073]">
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-2xl font-black text-[#0c2a50] mb-6 flex items-center gap-3">
                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                Shipping Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-[#1a4073]">First Name</label>
                  <input required type="text" name="first_name" value={shipping.first_name} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-blue-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" placeholder="John" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-[#1a4073]">Last Name</label>
                  <input required type="text" name="last_name" value={shipping.last_name} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-blue-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" placeholder="Doe" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-sm font-bold text-[#1a4073]">Email Address</label>
                  <input required type="email" name="email" value={shipping.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-blue-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" placeholder="john@example.com" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-sm font-bold text-[#1a4073]">Shipping Address</label>
                  <input required type="text" name="address" value={shipping.address} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-blue-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white mb-2" placeholder="123 Creator St" />
                  <div className="grid grid-cols-2 gap-4">
                    <input required type="text" name="city" value={shipping.city} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-blue-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" placeholder="City" />
                    <input required type="text" name="zip_code" value={shipping.zip_code} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-blue-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" placeholder="Zip Code" />
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-4">
                {isAuthenticated ? 'Shipping info loaded from your account. You can also update it in My Account page.' : 'Create an account or login to save your shipping info for future orders.'}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-[4px_4px_0px_#1a4073]">
            <CardContent className="p-6 sm:p-8 bg-gradient-to-br from-white to-orange-50/30">
              <h2 className="text-2xl font-black text-[#0c2a50] mb-6 flex items-center gap-3">
                <span className="bg-orange-100 text-orange-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                Payment Options
              </h2>
              
              <div className="bg-blue-50/50 p-6 rounded-2xl border-2 border-blue-200 mb-6 flex items-center gap-4">
                <CreditCard className="text-blue-500 shrink-0" size={32} />
                <div>
                  <h4 className="font-extrabold text-[#0a2342]">Secure Mock Payment</h4>
                  <p className="text-sm text-[#1a4073]">Payment integration coming soon. Enter dummy data to test flow.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-[#1a4073]">Card Number</label>
                  <input required type="text" maxLength={19} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-blue-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" placeholder="0000 0000 0000 0000" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-[#1a4073]">Expiry Date</label>
                    <input required type="text" maxLength={5} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-blue-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-[#1a4073]">CVV</label>
                    <input required type="text" maxLength={4} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-blue-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" placeholder="123" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:w-96">
          <Card className="sticky top-24 border-[#cc6200] shadow-[6px_6px_0px_#cc6200]">
            <CardContent className="p-6 sm:p-8 bg-gradient-to-b from-orange-50 to-white">
              <h2 className="text-2xl font-black text-[#0c2a50] mb-6 pb-4 border-b-2 border-orange-200">Your Order</h2>
              
              <div className="space-y-4 mb-6 max-h-[30vh] overflow-y-auto custom-scrollbar pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm font-bold text-[#1a4073]">
                    <span className="truncate pr-4">{item.quantity}x {item.name}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-2xl font-black text-[#0a2342] mb-8 pt-4 border-t-2 border-orange-200">
                <span>Total</span>
                <span className="text-orange-600">${cartTotal.toFixed(2)}</span>
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                className="w-full h-14 text-lg animate-pulse"
                isLoading={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
