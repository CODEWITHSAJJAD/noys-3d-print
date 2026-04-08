'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { SectionWrapper } from '@/components/pricing/SectionWrapper';
import { PricingCard } from '@/components/pricing/PricingCard';
import { CreditCard } from '@/components/pricing/CreditCard';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import apiClient from '@/lib/api/client';

interface Plan {
  id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
  is_popular: boolean;
}

interface CreditPack {
  id: string;
  credits: number;
  price: number;
}

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [creditPacks, setCreditPacks] = useState<CreditPack[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansRes, packsRes] = await Promise.all([
          apiClient.get('/plans'),
          apiClient.get('/credit-packs')
        ]);
        setPlans(plansRes.data || []);
        setCreditPacks(packsRes.data || []);
      } catch (err) {
        console.error('Failed to fetch pricing data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = async (planId: string) => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }
    router.push(`/payment?type=subscription&id=${planId}`);
  };

  const handleBuyCredits = async (creditPackageId: string) => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }
    router.push(`/payment?type=credits&id=${creditPackageId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-16 pb-20 px-4 relative overflow-hidden">
      <div className="fixed top-24 right-4 z-50 bg-white p-4 rounded-xl border-2 border-orange-400 shadow-md">
        <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Dev Auth controls</p>
        <button 
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${isLoggedIn ? 'bg-green-100 text-green-700 border-green-500' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
        >
          {isLoggedIn ? 'Logged In' : 'Logged Out'}
        </button>
      </div>

      <Modal 
        isOpen={isLoginModalOpen} 
        onClose={() => setLoginModalOpen(false)}
        title="Welcome Back!"
      >
        <div className="text-center space-y-6">
          <p className="text-gray-600 font-semibold mb-6">
            Please log in to continue with your purchase and access your account.
          </p>
          <div className="space-y-4">
            <Button 
              className="w-full" 
              onClick={() => {
                setIsLoggedIn(true);
                setLoginModalOpen(false);
              }}
            >
              Simulate Login
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setLoginModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15, duration: 0.8 }}
        className="relative w-full max-w-[1000px] mt-8 mb-4 h-[200px]"
      >
        <div className="absolute -top-[500px] left-1/2 -translate-x-1/2 w-[220vw] h-[1200px] bg-sky-50 -z-10" />
        <div className="absolute top-[300px] left-1/2 -translate-x-1/2 w-[180vw] h-[800px] bg-gradient-to-b from-white via-sky-100/30 to-transparent -z-10" />
        <div className="absolute top-[700px] left-1/2 -translate-x-1/2 w-[220vw] h-[250px] bg-gradient-to-b from-sky-50 to-transparent -z-10" />
        
        <div className="flex flex-col items-center justify-center w-full h-full relative z-10 text-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl sm:text-7xl font-black text-blue-600 drop-shadow-[0_4px_0_rgba(0,0,0,0.1)] mb-6"
          >
            Plans & Credits
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl sm:text-2xl font-black text-blue-500 drop-shadow-sm px-4"
          >
            Choose how you want to create — flexible credits or monthly plans
          </motion.p>
        </div>
      </motion.div>

      <SectionWrapper title="Membership Plans">
        {loading ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-slate-500">Loading plans...</p>
          </div>
        ) : plans.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No plans available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-6">
            {plans.map((plan) => (
              <PricingCard
                key={plan.id}
                id={plan.id}
                name={plan.name}
                price={String(plan.price)}
                features={plan.features}
                isPopular={plan.is_popular}
                ctaText="Subscribe"
                onAction={handleSubscribe}
              />
            ))}
          </div>
        )}
      </SectionWrapper>

      <SectionWrapper 
        title="Buy Credits" 
        subtitle="Top up anytime — no subscription required"
        delay={0.4}
      >
        {loading ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-slate-500">Loading credit packs...</p>
          </div>
        ) : creditPacks.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No credit packs available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 mb-4">
            {creditPacks.map((pack) => (
              <CreditCard
                key={pack.id}
                id={pack.id}
                credits={pack.credits}
                price={String(pack.price)}
                onAction={handleBuyCredits}
              />
            ))}
          </div>
        )}
        
        <div className="flex flex-col items-center justify-center mt-12 bg-blue-50/80 p-6 rounded-[2rem] border-2 border-blue-200 shadow-sm max-w-3xl mx-auto">
          <p className="text-xl font-black text-[#0c2a50] mb-2 text-center">
            1 credit = 1 AI-generated model
          </p>
          <p className="font-bold text-blue-500 text-center">
            Credits are used when generating custom designs via our AI Generator.
          </p>
        </div>
      </SectionWrapper>
    </div>
  );
}
