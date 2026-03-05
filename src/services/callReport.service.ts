import { apiClient } from './api/axios';
import { ReportReason, SubmitReportPayload } from '../types/call.types';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: any;
}

// ─── Fetch available report reasons ──────────────────────────────────────────
export const getReportReasons = async (): Promise<ReportReason[]> => {
  const { data } = await apiClient.get<ApiResponse<ReportReason[]>>('/call-reports/reasons');
  return data.data;
};

// ─── Submit a call report ─────────────────────────────────────────────────────
export const submitReport = async (payload: SubmitReportPayload): Promise<void> => {
  await apiClient.post('/call-reports', payload);
};
