'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth/useAuth';
import apiClient from '@/lib/api/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/login', { email, password });
      login(response.data.access_token, response.data.user);
      
      if (response.data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="absolute top-1/4 left-10 w-24 h-24 bg-orange-300 rounded-lg transform rotate-45 opacity-40 blur-[2px]" />
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-blue-300 rounded-full opacity-40 blur-[4px]" />

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-t-8 border-t-orange-500">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-[#0c2a50]">Welcome Back</h1>
            <p className="text-gray-500 mt-2 font-medium">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-sm font-bold text-[#1a4073]">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-blue-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" 
                placeholder="developer@example.com" 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-bold text-[#1a4073]">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-blue-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" 
                placeholder="••••••••" 
              />
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full mt-6" isLoading={loading}>
              Sign In
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600 font-medium">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:text-orange-500 underline underline-offset-2">
              Create one now
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
