'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/lib/toast/ToastContext';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CreditCard, CheckCircle2, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import apiClient from '@/lib/api/client';
import { useAuth } from '@/lib/auth/useAuth';

function PaymentGatewayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { error, success } = useToast();
  const { isAuthenticated } = useAuth();
  
  const type = searchParams.get('type');
  const idStr = searchParams.get('id');
  const status = searchParams.get('status');
  const sessionId = searchParams.get('session_id');

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderName, setOrderName] = useState('Digital Purchase');
  const [orderPrice, setOrderPrice] = useState('£0.00');
  const [itemId, setItemId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'success') {
      setIsSuccess(true);
      success('Payment completed successfully!');
      setTimeout(() => {
        router.push('/profile');
      }, 3000);
      return;
    }
    
    if (status === 'cancelled') {
      error('Payment was cancelled. Please try again.');
      router.push('/pricing');
      return;
    }
  }, [status, router, error, success]);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        if (type === 'subscription') {
          const response = await apiClient.get(`/plans/${idStr}`);
          if (response.data) {
            setOrderName(response.data.name);
            setOrderPrice(`£${response.data.price}/mo`);
            setItemId(idStr);
          }
        } else if (type === 'credits') {
          const response = await apiClient.get(`/credit-packs/${idStr}`);
          if (response.data) {
            setOrderName(`${response.data.credits} AI Credits`);
            setOrderPrice(`£${response.data.price}`);
            setItemId(idStr);
          }
        }
      } catch (err) {
        console.error('Failed to fetch item details:', err);
      }
    };
    
    if (type && idStr) {
      fetchItemDetails();
    }
  }, [type, idStr]);

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/payment?type=subscription&id=' + idStr);
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const response = await apiClient.post('/payments/checkout', {
        type: type,
        item_id: idStr,
        success_url: window.location.origin + '/payment',
        cancel_url: window.location.origin + '/payment'
      });
      
      if (response.data.checkout_url) {
        window.location.href = response.data.checkout_url;
      } else if (response.data.status === 'completed') {
        setIsSuccess(true);
        success('Purchase completed!');
        setTimeout(() => {
          router.push('/profile');
        }, 2000);
      } else {
        throw new Error(response.data.error || 'Payment failed');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      error(err.response?.data?.error || err.message || 'Payment failed. Please try again.');
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
        <h1 className="text-4xl font-black text-[#0c2a50] mb-4 text-center">Payment Successful!</h1>
        <p className="text-[#1a4073] mb-8 text-center max-w-md text-lg font-bold">
          Your account has been instantly upgraded. Redirecting you exactly where you need to be...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] p-8 max-w-5xl mx-auto pt-24 relative">
      
      <button onClick={() => router.push('/pricing')} className="flex items-center gap-2 text-blue-500 font-bold hover:text-orange-500 transition-colors mb-6 absolute top-24 left-8">
          <ArrowLeft size={18} /> Back to Pricing
      </button>

      <h1 className="text-4xl sm:text-5xl font-black text-[#0c2a50] mb-8 drop-shadow-sm text-center md:text-left mt-10 md:mt-0">Secure Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        <div className="flex-1 space-y-8">
          
          <Card className="shadow-xl border-t-8 border-t-blue-500">
            <CardContent className="p-6 sm:p-8 bg-gradient-to-br from-white to-sky-50/50">
              <h2 className="text-2xl font-black text-[#0c2a50] mb-6 flex items-center gap-3">
                <ShieldCheck className="text-blue-500" size={28} />
                Order Summary
              </h2>
              
              <div className="bg-blue-50/80 p-6 rounded-2xl border-2 border-blue-200 flex items-center gap-4 shadow-inner">
                <CreditCard className="text-blue-500 shrink-0" size={36} />
                <div>
                  <h4 className="font-black text-[#0a2342] text-lg">{orderName}</h4>
                  <p className="text-sm font-semibold text-blue-600">{orderPrice}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t-2 border-blue-100">
                <p className="text-sm font-bold text-gray-500">
                  You will be redirected to Stripe for secure payment.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:w-80">
          <Card className="shadow-xl border-t-8 border-t-orange-500 sticky top-24">
            <CardContent className="p-6 bg-gradient-to-br from-white to-orange-50/50">
              <h3 className="text-xl font-black text-[#0c2a50] mb-4">Total</h3>
              <p className="text-4xl font-black text-[#0c2a50] mb-6">{orderPrice}</p>
              
              <Button
                onClick={handleSubscribe}
                disabled={isProcessing || !itemId}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Processing...
                  </>
                ) : (
                  'Pay Now'
                )}
              </Button>
              
              <p className="text-xs text-gray-500 text-center mt-4 font-semibold">
                Secure payment powered by Stripe
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center pt-24">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    }>
      <PaymentGatewayContent />
    </Suspense>
  );
}