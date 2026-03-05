// ─── Call & Report Domain Types ───────────────────────────────────────────────

export interface ReportReason {
  _id: string;
  label: string;
  description?: string;
}

export interface SubmitReportPayload {
  callId: string;
  reportedUserId: string;
  reasons: string[];             // Array of reason IDs or labels
  additionalNote?: string;       // "Others" free text
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
