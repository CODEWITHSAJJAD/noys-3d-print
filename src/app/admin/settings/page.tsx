'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api/client';
import { useAuth } from '@/lib/auth/useAuth';
import { useToast } from '@/lib/toast/ToastContext';

export default function AdminSettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { success, error: toastError } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    defaultFreeCredits: 15,
    stripeConfigured: false,
    aiServiceConfigured: false
  });

  const [emailForm, setEmailForm] = useState({ newEmail: '', password: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [systemForm, setSystemForm] = useState({ defaultFreeCredits: 15 });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSettings();
    }
  }, [isAuthenticated]);

  const fetchSettings = async () => {
    try {
      const response = await apiClient.get('/admin/settings');
      setSettings(response.data);
      setSystemForm({ defaultFreeCredits: response.data.default_free_credits || 15 });
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForm.newEmail || !emailForm.password) {
      toastError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await apiClient.put('/auth/me', { email: emailForm.newEmail });
      success('Email updated successfully!');
      setEmailForm({ newEmail: '', password: '' });
    } catch (err: any) {
      toastError(err.response?.data?.error || 'Failed to update email');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toastError('Please fill in all fields');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toastError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toastError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await apiClient.put('/user/password', {
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword
      });
      success('Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toastError(err.response?.data?.error || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleSystemSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.put('/admin/settings', systemForm);
      success('System settings saved successfully!');
    } catch (err: any) {
      toastError(err.response?.data?.error || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage admin account details and global site preferences.</p>
      </div>
      
      {}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-800">Change Email Address</h2>
        </div>
        <form onSubmit={handleEmailChange} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">New Email</label>
            <input 
              required 
              type="email" 
              placeholder="admin@example.com" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
              value={emailForm.newEmail}
              onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Password (Confirmation)</label>
            <input 
              required 
              type="password" 
              placeholder="Confirm your current password" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
              value={emailForm.password}
              onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
            />
          </div>
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              {loading ? 'Updating...' : 'Update Email'}
            </button>
          </div>
        </form>
      </section>

      {}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-800">Change Password</h2>
        </div>
        <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Current Password</label>
            <input 
              required 
              type="password" 
              placeholder="Enter current password" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">New Password</label>
              <input 
                required 
                type="password" 
                placeholder="Enter new password" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Confirm New Password</label>
              <input 
                required 
                type="password" 
                placeholder="Confirm new password" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
            </div>
          </div>
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </section>

      {}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-800">Global System Variables</h2>
        </div>
        <form onSubmit={handleSystemSettings} className="p-6 space-y-6">
          <div className="space-y-2 max-w-sm">
            <label className="text-sm font-semibold text-slate-700">Default Free Credits</label>
            <p className="text-xs text-slate-500 mb-2">Number of credits assigned to new user registrations automatically.</p>
            <input 
              required 
              type="number" 
              min="0" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
              value={systemForm.defaultFreeCredits}
              onChange={(e) => setSystemForm({ ...systemForm, defaultFreeCredits: parseInt(e.target.value) || 0 })}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Stripe Payment</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${settings.stripeConfigured ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {settings.stripeConfigured ? 'Configured' : 'Not Configured'}
                </span>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">AI Generation Service</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${settings.aiServiceConfigured ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {settings.aiServiceConfigured ? 'Configured' : 'Not Configured'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              {loading ? 'Saving...' : 'Save Variables'}
            </button>
          </div>
        </form>
      </section>

    </div>
  );
}
