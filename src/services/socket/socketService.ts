import { io, Socket } from 'socket.io-client';
import { useSocketStore } from '../../store/socketStore';
import { SOCKET_EVENTS } from './events';

/**
 * ─── Global Socket Service (MNC-Grade Singleton) ─────────────────────────────
 *
 * Architecture:
 *   - Single socket instance shared across the entire app
 *   - Connected on user login, disconnected on logout
 *   - JWT token sent in handshake auth → verified server-side
 *   - Auto-reconnect with exponential backoff (handled by socket.io-client)
 *   - Org room joined automatically by server on connect
 *
 *   IMPORTANT — Pending Listener Queue:
 *   Listeners registered before the socket connects (e.g. from App.tsx global
 *   listeners that mount during hydration before login completes) are queued
 *   and automatically applied once the socket actually connects.
 *
 * Usage:
 *   socketService.connect(token, orgId)   → call on login
 *   socketService.disconnect()             → call on logout
 *   socketService.on(event, callback)      → subscribe to events (safe to call before connect)
 *   socketService.off(event, callback)     → unsubscribe
 *   socketService.emit(event, payload)     → send event to server
 */

const SOCKET_SERVER_URL = 'http://10.0.2.2:3000'; // Android emulator → localhost

// ─── Pending subscription entry ───────────────────────────────────────────────
interface PendingListener {
  event: string;
  callback: (...args: any[]) => void;
}

class SocketService {
  private socket: Socket | null = null;

  /**
   * Listeners registered before the socket is available are queued here.
   * When the socket connects, all pending listeners are applied.
   */
  private pendingListeners: PendingListener[] = [];

  // ─── Public API ─────────────────────────────────────────────────────────────

  /**
   * Establish a JWT-authenticated socket connection.
   * Called immediately after a successful login.
   *
   * @param token      - User's current JWT access token
   * @param orgId      - User's organization ID (for room joining)
   */
  connect(token: string, orgId: string): void {
    console.log(`[SocketService] connect() called with token length: ${token?.length}, orgId: ${orgId}`);

    // Prevent duplicate connections
    if (this.socket?.connected) {
      console.log('[SocketService] Already connected, skipping reconnect.');
      return;
    }

    // Disconnect any lingering socket before creating a new one
    if (this.socket) {
      console.log('[SocketService] Found existing dead socket, disconnecting...');
      this.socket.disconnect();
      this.socket = null;
    }

    console.log(`[SocketService] Initializing new socket to ${SOCKET_SERVER_URL}...`);

    this.socket = io(SOCKET_SERVER_URL, {
      // JWT token sent in handshake auth (verified server-side by socketAuth.js)
      auth: { token },

      // WhatsApp/FB style: prefer native WebSocket, fallback to polling
      transports: ['websocket', 'polling'],

      // Auto-reconnect with exponential backoff (socket.io-client built-in)
      reconnection: true,
      reconnectionAttempts: Infinity, // Never give up — critical for mobile
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,    // Cap at 30s
      randomizationFactor: 0.5,

      // Timeout waiting for initial connection
      timeout: 20000,
    });

    this._registerCoreListeners(orgId);
  }

  /**
   * Gracefully disconnect the socket.
   * Called on logout to ensure the server cleans up the socket entry.
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      useSocketStore.getState().setConnected(false);
      console.log('[SocketService] Disconnected.');
    }
  }

  /**
   * Subscribe to a socket event.
   * Returns a cleanup function for use in useEffect.
   *
   * SAFE TO CALL BEFORE CONNECT — if the socket is not yet active, the
   * subscription is queued and applied automatically on next connect.
   *
   * @example
   * const cleanup = socketService.on(SOCKET_EVENTS.USER_CALL_STATUS_CHANGED, handler);
   * useEffect(() => cleanup, []);
   */
  on<T = unknown>(event: string, callback: (data: T) => void): () => void {
    if (!this.socket) {
      // Queue the listener — will be applied once connect() is called
      const entry: PendingListener = { event, callback };
      this.pendingListeners.push(entry);
      console.log(`[SocketService] Queued listener for "${event}" until connected.`);

      // Return a cleanup that removes from the pending queue and from socket if applied
      return () => {
        this.pendingListeners = this.pendingListeners.filter((p) => p !== entry);
        this.socket?.off(event, callback);
      };
    }

    this.socket.on(event, callback);
    return () => {
      this.socket?.off(event, callback);
    };
  }

  /**
   * Unsubscribe a specific callback from an event.
   */
  off(event: string, callback?: (...args: any[]) => void): void {
    this.socket?.off(event, callback);
  }

  /**
   * Emit an event to the server.
   */
  emit(event: string, payload?: unknown): void {
    if (!this.socket?.connected) {
      console.warn(`[SocketService] Cannot emit "${event}" — not connected.`);
      return;
    }
    this.socket.emit(event, payload);
  }

  /**
   * Returns true if the socket is currently connected.
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  // ─── Private helpers ─────────────────────────────────────────────────────────

  /**
   * Flush all queued pending listeners onto the now-active socket.
   * Called once per connection (including reconnects).
   */
  private _flushPendingListeners(): void {
    if (this.pendingListeners.length === 0 || !this.socket) { return; }
    console.log(`[SocketService] Applying ${this.pendingListeners.length} queued listener(s).`);
    for (const { event, callback } of this.pendingListeners) {
      this.socket.on(event, callback);
    }
    // Keep the array intact (entries remain for cleanup reference)
    // but mark them as flushed by clearing (they're now on the socket)
    this.pendingListeners = [];
  }

  private _registerCoreListeners(orgId: string): void {
    if (!this.socket) { return; }

    const { setConnected } = useSocketStore.getState();

    // ─── Native socket.io events ──────────────────────────────────────────────
    this.socket.on('connect', () => {
      console.log(`🟢 [SocketService] Connected with socket ID: ${this.socket?.id}`);
      useSocketStore.getState().setConnected(true);
      
      console.log(`[SocketService] Found ${this.pendingListeners.length} pending listeners. Applying them...`);
      // Re-apply any listeners that were queued while connecting
      this.pendingListeners.forEach(({ event, callback }) => {
        this.socket?.on(event, callback);
      });
      this.pendingListeners = [];
    });

    this.socket.on('connect_error', (error) => {
      console.error(`🔴 [SocketService] Connection Error:`, error.message, error);
    });

    this.socket.on('disconnect', (reason) => {
      console.warn(`🔴 [SocketService] Disconnected. Reason: ${reason}`);
      useSocketStore.getState().setConnected(false);
    });

    // ── Server acknowledged connection ────────────────────────────────────
    this.socket.on(SOCKET_EVENTS.CONNECT_ACK, (data: { message: string }) => {
      console.log('[SocketService] Server ACK:', data.message);
    });

    // ── Disconnected (network loss, server restart, explicit logout) ──────
    this.socket.on('disconnect', (reason: string) => {
      console.log(`[SocketService] Disconnected: ${reason}`);
      setConnected(false);

      const { useCallStore } = require('../../store/callStore');
      const { navigationRef } = require('../../../App');
      const store = useCallStore.getState();

      if (store.activeCall || store.incomingCall) {
        console.log(`[SocketService] Connection dropped during an active call. Cleaning up.`);
        store.clearAll();
        
        if (navigationRef.isReady()) {
          navigationRef.navigate('CallCompleted');
        }
      }
    });

    // ── Reconnecting ──────────────────────────────────────────────────────
    this.socket.io.on('reconnect_attempt', (attempt: number) => {
      console.log(`[SocketService] Reconnect attempt #${attempt}...`);
    });

    this.socket.io.on('reconnect', (attempt: number) => {
      console.log(`[SocketService] Reconnected after ${attempt} attempts.`);
      setConnected(true);
      // Re-join org room after reconnect
      this.socket?.emit(SOCKET_EVENTS.JOIN_ORG_ROOM, { organizationId: orgId });
      // Re-apply pending listeners (already flushed once on initial connect,
      // but good defense for any late registrations)
      this._flushPendingListeners();
    });

    // ── Connection error ──────────────────────────────────────────────────
    this.socket.on('connect_error', (err: Error) => {
      console.warn(`[SocketService] Connect error: ${err.message}`);
      setConnected(false);
    });
  }
}

// Export a single global instance — the same object used everywhere in the app
export const socketService = new SocketService();
