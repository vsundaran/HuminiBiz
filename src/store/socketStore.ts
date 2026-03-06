import { create } from 'zustand';

/**
 * ─── Socket Connection Store ──────────────────────────────────────────────────
 *
 * Lightweight Zustand store to track global WebSocket connection state.
 * Components can subscribe to `isConnected` for conditional UI rendering.
 */

interface SocketState {
  isConnected: boolean;
  setConnected: (value: boolean) => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  isConnected: false,
  setConnected: (value) => set({ isConnected: value }),
}));
