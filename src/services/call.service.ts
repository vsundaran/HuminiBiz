import { apiClient } from './api/axios';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: any;
}

// ─── Initiate Call Response ───────────────────────────────────────────────────
export interface InitiateCallResponse {
  call: {
    _id: string;
    callerId: string;
    receiverId: string;
    momentId: string;
    organizationId: string;
    status: string;
    agoraChannelName: string;
  };
  token: string;
  channelName: string;
  agoraAppId: string;
  receiverId: string;
}

// ─── Update Call Status Response ─────────────────────────────────────────────
export interface UpdateCallStatusResponse {
  call: {
    _id: string;
    status: string;
  };
  token: string | null;
  channelName: string;
  agoraAppId: string | null;
}

export type CallStatus = 'accepted' | 'declined' | 'ended' | 'failed';

/**
 * Initiate a direct video call to a specific user on a specific moment.
 * Server will:
 *  1. Create Call record (status: ringing)
 *  2. Emit INCOMING_CALL socket event to the receiver
 *  3. Return Agora token so the caller can join the channel
 *
 * @route POST /api/calls/initiate
 */
export const initiateCall = async (
  receiverId: string,
  momentId: string,
): Promise<InitiateCallResponse> => {
  const { data } = await apiClient.post<ApiResponse<InitiateCallResponse>>(
    '/calls/initiate',
    { receiverId, momentId },
  );
  return data.data;
};

/**
 * Initiate a random call (meet someone new from any live moment).
 * Server finds an available user and emits INCOMING_CALL to them.
 *
 * @route POST /api/calls/meet-new
 */
export const initiateRandomCall = async (): Promise<InitiateCallResponse> => {
  const { data } = await apiClient.post<ApiResponse<InitiateCallResponse>>(
    '/calls/meet-new',
  );
  return data.data;
};

/**
 * Single unified endpoint to update any call state:
 *   - 'accepted'  → callee accepts  → server emits CALL_ACCEPTED to caller
 *   - 'declined'  → callee declines → server emits CALL_DECLINED to caller
 *   - 'ended'     → either party ends → server emits CALL_ENDED to counterpart
 *
 * @route PUT /api/calls/:id/status
 */
export const updateCallStatus = async (
  callId: string,
  status: CallStatus,
): Promise<UpdateCallStatusResponse> => {
  const { data } = await apiClient.put<ApiResponse<UpdateCallStatusResponse>>(
    `/calls/${callId}/status`,
    { status },
  );
  return data.data;
};
