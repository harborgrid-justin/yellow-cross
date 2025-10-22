/**
 * Report Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Report, CreateReportInput, UpdateReportInput } from './types';

export function useCreateReport(options?: { onSuccess?: (data: Report) => void; onError?: (error: string) => void }) {
  return useMutation<Report, CreateReportInput>('/reporting-analytics/create', 'post', options);
}

export function useUpdateReport(id: string, options?: { onSuccess?: (data: Report) => void; onError?: (error: string) => void }) {
  return useMutation<Report, UpdateReportInput>(`/reporting-analytics/${id}`, 'put', options);
}

export function useDeleteReport(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/reporting-analytics/${id}`, 'delete', options);
}
