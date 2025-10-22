/**
 * Bankruptcy Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Bankruptcy, CreateBankruptcyInput, UpdateBankruptcyInput } from './types';

export function useCreateBankruptcy(options?: { onSuccess?: (data: Bankruptcy) => void; onError?: (error: string) => void }) {
  return useMutation<Bankruptcy, CreateBankruptcyInput>('/bankruptcy-management/create', 'post', options);
}

export function useUpdateBankruptcy(id: string, options?: { onSuccess?: (data: Bankruptcy) => void; onError?: (error: string) => void }) {
  return useMutation<Bankruptcy, UpdateBankruptcyInput>(`/bankruptcy/${id}`, 'put', options);
}

export function useDeleteBankruptcy(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/bankruptcy/${id}`, 'delete', options);
}
