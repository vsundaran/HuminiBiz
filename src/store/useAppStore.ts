import { create } from 'zustand';

interface AppState {
  isFirstLaunch: boolean;
  completeOnboarding: () => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isFirstLaunch: true,
  completeOnboarding: () => set({ isFirstLaunch: false }),
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
}));
