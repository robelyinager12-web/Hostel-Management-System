import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  setUser: (user: AuthUser, accessToken?: string) => void;
  setAccessToken: (token: string) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setUser: (user, accessToken) =>
        set((state) => ({ user, accessToken: accessToken ?? state.accessToken })),
      setAccessToken: (accessToken) => set({ accessToken }),
      clearUser: () => set({ user: null, accessToken: null }),
    }),
    {
      name: 'hhms-auth',
      partialize: (state) => ({ user: state.user }), // don't persist the raw access token
    },
  ),
);