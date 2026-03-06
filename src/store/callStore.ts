import { create } from 'zustand';

/**
 * ─── Call Store ───────────────────────────────────────────────────────────────
 *
 * Holds the state for incoming and outgoing (active) calls.
 * Populated by socket listeners in App.tsx and consumed by call screens.
 */

// ─── Incoming call data (received from INCOMING_CALL socket event) ────────────
export interface IncomingCallData {
  callId: string;
  callerId: string;
  callerName: string;
  callerRole: string;
  categoryName?: string;
  subcategoryName?: string;
  momentDescription?: string;
  channelName: string;
  agoraAppId: string;
}

// ─── Active (outgoing) call data (set when caller initiates) ──────────────────
export interface ActiveCallData {
  callId: string;
  receiverId: string;
  receiverName: string;
  receiverRole: string;
  momentId: string;
  categoryName?: string;
  subcategoryName?: string;
  momentDescription?: string;
  channelName: string;
  token: string;
  agoraAppId: string;
}

interface CallState {
  /** Set when this user receives an incoming call */
  incomingCall: IncomingCallData | null;
  /** Set when this user initiates an outgoing call */
  activeCall: ActiveCallData | null;
  /** Flag: callee declined our outgoing call (shown on RingingScreen) */
  wasDeclinedByCallee: boolean;

  setIncomingCall: (data: IncomingCallData | null) => void;
  setActiveCall: (data: ActiveCallData | null) => void;
  setWasDeclinedByCallee: (value: boolean) => void;
  clearAll: () => void;
}

export const useCallStore = create<CallState>((set) => ({
  incomingCall: null,
  activeCall: null,
  wasDeclinedByCallee: false,

  setIncomingCall: (data) => set({ incomingCall: data }),
  setActiveCall: (data) => set({ activeCall: data }),
  setWasDeclinedByCallee: (value) => set({ wasDeclinedByCallee: value }),

  clearAll: () =>
    set({ incomingCall: null, activeCall: null, wasDeclinedByCallee: false }),
}));
