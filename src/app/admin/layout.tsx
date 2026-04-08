'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/useAuth';
import { LayoutDashboard, Users, FileText, Settings, LogOut, Package, Tags } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/login');
      } else if (user?.role !== 'admin') {
        router.replace('/');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {}
      <aside className="w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <span className="text-xl font-bold text-slate-800 tracking-tight">Admin<span className="text-primary">Panel</span></span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/admin/categories" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <Tags size={20} />
            <span className="font-medium">Categories</span>
          </Link>
          <Link href="/admin/products" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <Package size={20} />
            <span className="font-medium">Products</span>
          </Link>
          <Link href="/admin/plans" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <FileText size={20} />
            <span className="font-medium">Plans</span>
          </Link>
          <Link href="/admin/users" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <Users size={20} />
            <span className="font-medium">Users</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-200">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => {
              logout();
              router.push('/login');
            }}
          >
            <LogOut size={20} className="mr-3" />
            <span className="font-medium">Sign Out</span>
          </Button>
        </div>
      </aside>

      {}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
