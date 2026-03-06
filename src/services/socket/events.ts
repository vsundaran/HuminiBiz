/**
 * ─── WebSocket Event Registry (Client) ───────────────────────────────────────
 *
 * This is the SINGLE SOURCE OF TRUTH for all Socket.IO event names used by
 * the HuminiBiz client. Must mirror the server's events.js exactly.
 *
 * Naming convention: UPPER_SNAKE_CASE
 */

export const SOCKET_EVENTS = {
  // ─── Connection Lifecycle ──────────────────────────────────────────────
  /** Server emits to client upon successful authenticated connection */
  CONNECT_ACK: 'connect_ack',

  /** Client emits to join their organization's broadcast room */
  JOIN_ORG_ROOM: 'join_org_room',

  /** Emitted automatically by Socket.IO on disconnect */
  DISCONNECT: 'disconnect',

  // ─── Presence / Status ─────────────────────────────────────────────────
  /**
   * Server → Client (org room broadcast)
   * Payload: { userId: string, organizationId: string, isInCall: boolean }
   */
  USER_CALL_STATUS_CHANGED: 'user_call_status_changed',

  // ─── Call Signaling ────────────────────────────────────────────────────
  /**
   * Server → callee socket
   * Payload: { callId, callerId, momentId, channelName, agoraAppId }
   */
  INCOMING_CALL: 'incoming_call',

  /**
   * Server → caller socket
   * Payload: { callId, channelName, token, agoraAppId }
   */
  CALL_ACCEPTED: 'call_accepted',

  /**
   * Server → caller socket
   * Payload: { callId }
   */
  CALL_DECLINED: 'call_declined',

  /**
   * Server → both sockets
   * Payload: { callId }
   */
  CALL_ENDED: 'call_ended',

  /**
   * Server → caller socket
   * Payload: { callId }
   */
  CALL_MISSED: 'call_missed',
} as const;

export type SocketEventName = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];
