'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, Zap, CreditCard, Star, DollarSign, TrendingUp, 
  Activity, Package
} from 'lucide-react';
import apiClient from '@/lib/api/client';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, activityRes, usersRes] = await Promise.all([
          apiClient.get('/admin/stats'),
          apiClient.get('/admin/activity?limit=10'),
          apiClient.get('/admin/users?limit=5')
        ]);
        setStats(statsRes.data);
        setActivity(activityRes.data || []);
        setRecentUsers(usersRes.data || []);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 max-w-7xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>)}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats?.total_users || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Orders', value: stats?.total_orders || 0, icon: Zap, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Credits Used', value: stats?.total_credits_used || 0, icon: CreditCard, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Active Subs', value: stats?.active_subscriptions || 0, icon: Star, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Welcome back, Admin. Here's what's happening with your platform today.</p>
      </div>
      
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className={`p-3 rounded-lg ${stat.bg} w-fit mb-4`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <h3 className="text-slate-500 font-medium text-sm mb-1">{stat.label}</h3>
            <span className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value.toLocaleString()}</span>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-5">
            <div className="p-4 rounded-full bg-green-50 text-green-600">
              <DollarSign size={28} />
            </div>
            <div>
              <h3 className="text-slate-500 font-medium text-sm mb-1">Total Revenue</h3>
              <span className="text-3xl font-bold text-slate-900 tracking-tight">${(stats?.total_revenue || 0).toFixed(2)}</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-5">
            <div className="p-4 rounded-full bg-blue-50 text-blue-600">
              <TrendingUp size={28} />
            </div>
            <div>
              <h3 className="text-slate-500 font-medium text-sm mb-1">Monthly Revenue</h3>
              <span className="text-3xl font-bold text-slate-900 tracking-tight">${((stats?.total_revenue || 0) / 12).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
          <div className="space-y-3 flex-1 flex flex-col justify-center">
            <Link href="/admin/plans/add" className="flex items-center gap-3 w-full p-3 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors font-medium text-sm">
              <Star size={18} className="text-blue-600" />
              Add Plan
            </Link>
            <Link href="/admin/products/add" className="flex items-center gap-3 w-full p-3 bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-700 rounded-lg border border-slate-100 hover:border-orange-200 transition-colors font-medium text-sm">
              <Package size={18} className="text-orange-500" />
              Add Product
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 w-full p-3 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-lg border border-slate-100 hover:border-emerald-200 transition-colors font-medium text-sm">
              <Users size={18} className="text-emerald-600" />
              View Users
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Recent Users</h2>
            <Link href="/admin/users" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{user.name}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{user.email}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{new Date(user.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-2">
            <Activity size={20} className="text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[400px]">
            <ul className="divide-y divide-slate-100">
              {activity.slice(0, 8).map((item, idx) => (
                <li key={idx} className="p-5 flex gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="mt-1 bg-slate-100 p-2 rounded-full text-slate-500 shrink-0">
                    <Zap size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{item.action}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{item.user}</p>
                    <p className="text-xs text-slate-400 mt-1">{new Date(item.time).toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
