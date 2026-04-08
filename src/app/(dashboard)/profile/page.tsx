'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/lib/toast/ToastContext';
import apiClient from '@/lib/api/client';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { success, error: toastError } = useToast();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loadingPwd, setLoadingPwd] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchUserData();
    }
  }, [isAuthenticated, authLoading]);

  const fetchUserData = async () => {
    try {
      const response = await apiClient.get('/auth/me');
      const userData = response.data;
      
      if (userData) {
        setName(userData.name || '');
        setEmail(userData.email || '');

        const shippingAddress = userData.shipping_address || '';
        
        if (shippingAddress && typeof shippingAddress === 'string') {
          const parts = shippingAddress.split(',').map(p => p.trim());
          setAddress1(parts[0] || '');
          setCity(parts[1] || '');
          setPostalCode(parts[2] || '');
          if (parts[3]) setCountry(parts[3]);
        } else if (shippingAddress && typeof shippingAddress === 'object') {
          setAddress1(shippingAddress.address || '');
          setCity(shippingAddress.city || '');
          setPostalCode(shippingAddress.zip_code || '');
          setCountry(shippingAddress.country || '');
        }
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    } finally {
      setLoadingUser(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const shippingAddress = `${address1}${address2 ? ', ' + address2 : ''}, ${city}, ${postalCode}${country ? ', ' + country : ''}`;
      
      await apiClient.put('/auth/me', {
        name: name,
        shipping_address: shippingAddress
      });
      
      success('Profile updated successfully!');
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      toastError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPwd(true);
    
    try {
      await apiClient.put('/user/password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      
      success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      console.error('Failed to update password:', err);
      toastError(err.response?.data?.error || 'Failed to update password');
    } finally {
      setLoadingPwd(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-300 text-blue-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-inner";

  if (authLoading || loadingUser) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center pt-24">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center pt-24 pb-20">
        <h1 className="text-3xl font-black text-[#0c2a50] mb-4">Please Login</h1>
        <p className="text-[#1a4073] mb-8">You need to be logged in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] p-8 max-w-5xl mx-auto pt-24">
      <h1 className="text-4xl font-black text-[#0c2a50] mb-8 drop-shadow-sm">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-8">
          <Card className="border-t-8 border-t-orange-500 shadow-xl">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="w-28 h-28 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center text-5xl font-black mb-6 shadow-inner border-4 border-white ring-2 ring-blue-200">
                {user?.name?.charAt(0).toUpperCase() || '?'}
              </div>
              <h2 className="text-2xl font-black text-[#0c2a50]">{user?.name}</h2>
              <p className="text-[#1a4073] font-medium">{user?.email}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="md:col-span-2 shadow-xl border-t-8 border-t-blue-500">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-2xl font-black text-[#0c2a50]">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#1a4073]">Full Name</label>
                  <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#1a4073]">Email Address</label>
                  <input type="email" value={email} disabled className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed font-medium" />
                  <p className="text-xs text-gray-400 font-medium ml-1">Email cannot be changed</p>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-dashed border-gray-100 space-y-6">
                <h3 className="text-lg font-black text-[#0c2a50]">Shipping Address</h3>
                <p className="text-sm text-slate-500">This address will be used for checkout orders.</p>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#1a4073]">Address Line 1</label>
                  <input required type="text" value={address1} onChange={(e) => setAddress1(e.target.value)} className={inputClass} placeholder="123 Creator St" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#1a4073]">Address Line 2 <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="text" value={address2} onChange={(e) => setAddress2(e.target.value)} className={inputClass} placeholder="Apt 4B" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#1a4073]">City</label>
                    <input required type="text" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} placeholder="New York" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#1a4073]">Postal Code</label>
                    <input required type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className={inputClass} placeholder="10001" />
                  </div>
                  <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                    <label className="text-sm font-bold text-[#1a4073]">Country</label>
                    <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass} placeholder="United States" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-8">
                <Button type="submit" variant="primary" size="lg" className="px-8 font-black shadow-[4px_4px_0px_#cc6200]" isLoading={loading}>
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 md:col-start-2 shadow-xl border-t-8 border-t-red-500 mt-8">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-2xl font-black text-[#0c2a50]">Change Password</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#1a4073]">Current Password</label>
                <input required type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#1a4073]">New Password</label>
                <input required type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" variant="primary" size="lg" className="px-8 font-black shadow-[4px_4px_0px_#cc6200]" isLoading={loadingPwd} style={{ backgroundColor: '#ef4444', borderColor: '#b91c1c' }}>
                  Update Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
