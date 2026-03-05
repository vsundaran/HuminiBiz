import { useQuery, useMutation } from '@tanstack/react-query';
import { getReportReasons, submitReport } from '../services/callReport.service';
import { SubmitReportPayload } from '../types/call.types';

// ─── Query Key ────────────────────────────────────────────────────────────────
export const reportKeys = {
  reasons: () => ['reportReasons'] as const,
};

// ─── Report Reasons Query ─────────────────────────────────────────────────────
export const useReportReasons = () => {
  return useQuery({
    queryKey: reportKeys.reasons(),
    queryFn: getReportReasons,
    staleTime: 1000 * 60 * 60,   // 1 hour — reasons are static
  });
};

// ─── Submit Report Mutation ────────────────────────────────────────────────────
export const useSubmitReport = () => {
  return useMutation({
    mutationFn: (payload: SubmitReportPayload) => submitReport(payload),
  });
};
