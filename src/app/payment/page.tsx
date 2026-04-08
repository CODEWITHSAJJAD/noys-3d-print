'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/lib/toast/ToastContext';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CreditCard, CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';

function PaymentGatewayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { error } = useToast();
  
  const type = searchParams.get('type');
  const idStr = searchParams.get('id');

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderName, setOrderName] = useState('Digital Purchase');
  const [orderPrice, setOrderPrice] = useState('£0.00');

  useEffect(() => {

    if (type === 'subscription') {
      const plans: Record<string, { name: string, price: string }> = {
        'starter': { name: 'Starter Plan', price: 'Free' },
        'bronze': { name: 'Bronze Plan', price: '£5.00/mo' },
        'silver': { name: 'Silver Plan', price: '£9.99/mo' },
        'gold': { name: 'Gold Plan', price: '£14.99/mo' },
      };
      if (idStr && plans[idStr]) {
        setOrderName(plans[idStr].name);
        setOrderPrice(plans[idStr].price);
      }
    } else if (type === 'credits') {
      const packs: Record<string, { name: string, price: string }> = {
        '10-credits': { name: '10 AI Credits', price: '£2.99' },
        '25-credits': { name: '25 AI Credits', price: '£5.99' },
        '50-credits': { name: '50 AI Credits', price: '£9.99' },
        '100-credits': { name: '100 AI Credits', price: '£17.99' },
        '150-credits': { name: '150 AI Credits', price: '£24.99' },
        '200-credits': { name: '200 AI Credits', price: '£29.99' },
      };
      if (idStr && packs[idStr]) {
        setOrderName(packs[idStr].name);
        setOrderPrice(packs[idStr].price);
      }
    }
  }, [type, idStr]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      console.log(`POST /payments/${type} -> { id: ${idStr} }`);

      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsSuccess(true);

      setTimeout(() => {
          router.push('/profile');
      }, 3000);
    } catch (err) {
      console.error('Payment failed', err);
      error('Payment failed to process. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-300 text-blue-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white";

  if (isSuccess) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center pt-24 pb-20 px-4">
        <div className="bg-green-50 p-6 rounded-full border-4 border-[#1a4073] shadow-[4px_4px_0px_#1a4073] mb-6 animate-bounce">
          <CheckCircle2 size={64} className="text-green-500" />
        </div>
        <h1 className="text-4xl font-black text-[#0c2a50] mb-4 text-center">Payment Successful!</h1>
        <p className="text-[#1a4073] mb-8 text-center max-w-md text-lg font-bold">
          Your account has been instantly upgraded. Redirecting you exactly where you need to be...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] p-8 max-w-5xl mx-auto pt-24 relative">
      
      <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-500 font-bold hover:text-orange-500 transition-colors mb-6 absolute top-24 left-8">
          <ArrowLeft size={18} /> Back to Pricing
      </button>

      <h1 className="text-4xl sm:text-5xl font-black text-[#0c2a50] mb-8 drop-shadow-sm text-center md:text-left mt-10 md:mt-0">Secure Checkout</h1>
      
      <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-8">
        
        {}
        <div className="flex-1 space-y-8">
          
          <Card className="shadow-xl border-t-8 border-t-blue-500">
            <CardContent className="p-6 sm:p-8 bg-gradient-to-br from-white to-sky-50/50">
              <h2 className="text-2xl font-black text-[#0c2a50] mb-6 flex items-center gap-3">
                <ShieldCheck className="text-blue-500" size={28} />
                Payment Method
              </h2>
              
              <div className="bg-blue-50/80 p-6 rounded-2xl border-2 border-blue-200 mb-8 flex items-center gap-4 shadow-inner">
                <CreditCard className="text-blue-500 shrink-0" size={36} />
                <div>
                  <h4 className="font-black text-[#0a2342] text-lg">Mock Bank Transfer</h4>
                  <p className="text-sm font-semibold text-blue-600">Enter dummy card metrics to test integration flow.</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#1a4073]">Card Number</label>
                  <input required type="text" maxLength={19} className={inputClass} placeholder="0000 0000 0000 0000" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#1a4073]">Cardholder Name</label>
                  <input required type="text" className={inputClass} placeholder="JOHN DOE" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[#1a4073]">Expiry Date</label>
                    <input required type="text" maxLength={5} className={inputClass} placeholder="MM/YY" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-[#1a4073]">CVV</label>
                    <input required type="text" maxLength={4} className={inputClass} placeholder="123" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {}
        <div className="w-full lg:w-96">
          <Card className="sticky top-24 border-[#cc6200] shadow-[8px_8px_0px_#cc6200] border-2">
            <CardContent className="p-6 sm:p-8 bg-gradient-to-b from-orange-50 to-white flex flex-col min-h-[400px]">
              <h2 className="text-2xl font-black text-[#0c2a50] mb-6 pb-4 border-b-2 border-orange-200">Current Order</h2>
              
              <div className="mb-auto">
                <h3 className="text-xl font-bold text-[#1a4073] mb-2">Item Selected:</h3>
                <div className="p-4 bg-white rounded-xl border border-orange-100 shadow-sm mb-4">
                  <p className="text-lg font-black text-orange-600">{orderName}</p>
                </div>
                
                <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                  <span>Subtotal</span>
                  <span>{orderPrice}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-gray-500 mt-2">
                  <span>VAT (20%)</span>
                  <span>Included</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-3xl font-black text-[#0a2342] mb-8 pt-4 border-t-2 border-orange-200 mt-8">
                <span>Total</span>
                <span className="text-orange-600">{orderPrice}</span>
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                className="w-full h-14 text-lg font-black uppercase tracking-wider"
                isLoading={isProcessing}
              >
                {isProcessing ? 'Authorizing...' : 'Pay Now'}
              </Button>
            </CardContent>
          </Card>
        </div>

      </form>
    </div>
  );
}

export default function PaymentGatewayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-blue-500 font-bold text-xl">Loading secure checkout...</div>
      </div>
    }>
      <PaymentGatewayContent />
    </Suspense>
  );
}
