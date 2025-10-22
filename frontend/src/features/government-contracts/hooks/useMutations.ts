/**
 * Government Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Government, CreateGovernmentInput, UpdateGovernmentInput } from './types';

export function useCreateGovernment(options?: { onSuccess?: (data: Government) => void; onError?: (error: string) => void }) {
  return useMutation<Government, CreateGovernmentInput>('/govcontracts/create', 'post', options);
}

export function useUpdateGovernment(id: string, options?: { onSuccess?: (data: Government) => void; onError?: (error: string) => void }) {
  return useMutation<Government, UpdateGovernmentInput>(`/govcontracts/${id}`, 'put', options);
}

export function useDeleteGovernment(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/govcontracts/${id}`, 'delete', options);
}
