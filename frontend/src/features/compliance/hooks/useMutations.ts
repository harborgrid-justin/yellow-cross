/**
 * Compliance Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Compliance, CreateComplianceInput, UpdateComplianceInput } from './types';

export function useCreateCompliance(options?: { onSuccess?: (data: Compliance) => void; onError?: (error: string) => void }) {
  return useMutation<Compliance, CreateComplianceInput>('/compliance/create', 'post', options);
}

export function useUpdateCompliance(id: string, options?: { onSuccess?: (data: Compliance) => void; onError?: (error: string) => void }) {
  return useMutation<Compliance, UpdateComplianceInput>(`/compliance/${id}`, 'put', options);
}

export function useDeleteCompliance(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/compliance/${id}`, 'delete', options);
}
