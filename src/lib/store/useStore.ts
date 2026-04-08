import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
  credits?: number;
  subscription_plan?: string;
  shipping_address?: string;
}

interface AppState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),
}));
