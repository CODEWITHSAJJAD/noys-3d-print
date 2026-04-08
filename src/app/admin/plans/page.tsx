'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import apiClient from '@/lib/api/client';
import { useToast } from '@/lib/toast/ToastContext';

interface Plan {
  id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
  is_popular: boolean;
  created_at: string;
}

interface CreditPack {
  id: string;
  credits: number;
  price: number;
  is_active: boolean;
  created_at: string;
}

export default function AdminPlansCreditsPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [packs, setPacks] = useState<CreditPack[]>([]);
  const [loading, setLoading] = useState(true);
  const { error } = useToast();

  const fetchData = async () => {
    try {
      const [plansRes, packsRes] = await Promise.all([
        apiClient.get('/plans'),
        apiClient.get('/credit-packs')
      ]);
      setPlans(plansRes.data || []);
      setPacks(packsRes.data || []);
    } catch (err) {
      console.error('Failed to fetch plans/packs:', err);
      error('Failed to load plans and credit packs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      if (window.location.pathname === '/admin/plans') {
        fetchData();
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    try {
      await apiClient.delete(`/plans/${planId}`);
      setPlans(plans.filter(p => p.id !== planId));
    } catch (err) {
      error('Failed to delete plan');
    }
  };

  const handleDeletePack = async (packId: string) => {
    if (!confirm('Are you sure you want to delete this credit pack?')) return;
    try {
      await apiClient.delete(`/credit-packs/${packId}`);
      setPacks(packs.filter(p => p.id !== packId));
    } catch (err) {
      error('Failed to delete credit pack');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-7xl">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Plans & Credits</h1>
        <p className="text-sm text-slate-500 mt-1">Manage membership tiers and one-time credit purchases.</p>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800">Membership Plans</h2>
          <Link href="/admin/plans/add" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
            <Plus size={16} />
            <span>Add Plan</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.length === 0 ? (
            <p className="text-slate-500 col-span-full">No plans yet. Add your first plan.</p>
          ) : (
            plans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                    {plan.is_popular && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-slate-900">${plan.price}</span>
                    <span className="text-slate-500 text-sm">/month</span>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 mb-4">
                    {plan.credits} credits/mo
                  </span>
                  <ul className="space-y-3">
                    {(plan.features || []).map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-slate-600">
                        <CheckCircle2 size={16} className="text-green-500 mr-2 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 mt-auto">
                  <Link href={`/admin/plans/edit/${plan.id}`} className="inline-block text-slate-600 hover:text-blue-600 transition-colors p-1.5 rounded">
                    <Edit2 size={18} />
                  </Link>
                  <button onClick={() => handleDeletePlan(plan.id)} className="text-slate-600 hover:text-red-600 transition-colors p-1.5 rounded">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800">Credit Packs</h2>
          <Link href="/admin/packs/add" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
            <Plus size={16} />
            <span>Add Pack</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {packs.length === 0 ? (
            <p className="text-slate-500 col-span-full">No credit packs yet. Add your first pack.</p>
          ) : (
            packs.map((pack) => (
              <div key={pack.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">{pack.credits} <span className="text-sm font-normal text-slate-500">Credits</span></h3>
                  <p className="text-slate-600 font-medium">${pack.price}</p>
                  {!pack.is_active && (
                    <span className="text-xs text-red-500 font-medium">Inactive</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/packs/edit/${pack.id}`} className="inline-block text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-md hover:bg-blue-50">
                    <Edit2 size={16} />
                  </Link>
                  <button onClick={() => handleDeletePack(pack.id)} className="text-slate-400 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-red-50">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
