// ─── Call & Report Domain Types ───────────────────────────────────────────────

export interface ReportReason {
  _id: string;
  name: string;
  description?: string;
}

export interface SubmitReportPayload {
  callId: string;
  reportedUserId: string;
  reasonId: string;             // Single reason ID
  description?: string;       // "Others" free text
}

export interface Call {
  _id: string;
  callerId: string;
  receiverId: string;
  momentId: string;
  organizationId: string;
  status: 'ringing' | 'accepted' | 'declined' | 'missed' | 'failed' | 'ongoing' | 'ended';
  startedAt?: string;
  endedAt?: string;
  agoraChannelName?: string;
  createdAt: string;
}
