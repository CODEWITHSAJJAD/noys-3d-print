'use client';

import React, { useEffect, useState } from 'react';
import { Edit2, Trash2, Shield, User } from 'lucide-react';
import apiClient from '@/lib/api/client';
import { useToast } from '@/lib/toast/ToastContext';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  credits: number;
  subscription_plan: string;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { error, success } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get('/admin/users');
      setUsers(response.data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await apiClient.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
      success('User deleted successfully');
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await apiClient.put(`/admin/users/${userId}`, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      success(`User role updated to ${newRole}`);
    } catch (err) {
      error('Failed to update user role');
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Users</h1>
          <p className="text-slate-500 mt-1">View and manage all registered users</p>
        </div>
        <span className="text-sm text-slate-500">{users.length} total users</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-slate-500 font-medium">User</th>
                <th className="px-6 py-4 text-slate-500 font-medium">Role</th>
                <th className="px-6 py-4 text-slate-500 font-medium">Credits</th>
                <th className="px-6 py-4 text-slate-500 font-medium">Plan</th>
                <th className="px-6 py-4 text-slate-500 font-medium">Joined</th>
                <th className="px-6 py-4 text-slate-500 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-800">{user.full_name || 'No name'}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                          <Shield size={14} /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded text-sm font-medium">
                          <User size={14} /> User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="font-semibold text-slate-900">{user.credits || 0}</span> credits
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {user.subscription_plan || 'starter'}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleUpdateRole(user.id, 'admin')}
                            className="text-slate-400 hover:text-blue-600 p-1.5 rounded hover:bg-blue-50 transition-colors"
                            title="Make Admin"
                          >
                            <Shield size={16} />
                          </button>
                        )}
                        {user.role === 'admin' && (
                          <button
                            onClick={() => handleUpdateRole(user.id, 'user')}
                            className="text-slate-400 hover:text-orange-600 p-1.5 rounded hover:bg-orange-50 transition-colors"
                            title="Remove Admin"
                          >
                            <User size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-slate-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
