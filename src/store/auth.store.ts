import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { socketService } from '../services/socket/socketService';

export interface User {
  id: string;
  email: string;
  name?: string;
  jobRole?: string;
  department?: string;
  organizationId?: string;
  isProfileUpdated?: boolean;
}


interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;

  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,

      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      setUser: (user) => set({ user }),

      login: (user, accessToken, refreshToken) => {
        set({ user, accessToken, refreshToken });
        // Establish WebSocket connection immediately after login
        if (user.organizationId) {
          socketService.connect(accessToken, user.organizationId);
        }
      },

      logout: () => {
        // Tear down WebSocket before clearing state
        socketService.disconnect();
        set({ user: null, accessToken: null, refreshToken: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Re-establish socket connection when the store rehydrates (app restart with saved session)
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken && state?.user?.organizationId) {
          socketService.connect(state.accessToken, state.user.organizationId);
        }
      },
    }
  )
);

