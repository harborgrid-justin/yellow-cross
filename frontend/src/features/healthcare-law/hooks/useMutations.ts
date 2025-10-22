/**
 * Healthcare Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Healthcare, CreateHealthcareInput, UpdateHealthcareInput } from './types';

export function useCreateHealthcare(options?: { onSuccess?: (data: Healthcare) => void; onError?: (error: string) => void }) {
  return useMutation<Healthcare, CreateHealthcareInput>('/healthcare-law/create', 'post', options);
}

export function useUpdateHealthcare(id: string, options?: { onSuccess?: (data: Healthcare) => void; onError?: (error: string) => void }) {
  return useMutation<Healthcare, UpdateHealthcareInput>(`/healthcare/${id}`, 'put', options);
}

export function useDeleteHealthcare(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/healthcare/${id}`, 'delete', options);
}
