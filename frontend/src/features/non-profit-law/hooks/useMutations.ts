/**
 * NonProfit Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { NonProfit, CreateNonProfitInput, UpdateNonProfitInput } from './types';

export function useCreateNonProfit(options?: { onSuccess?: (data: NonProfit) => void; onError?: (error: string) => void }) {
  return useMutation<NonProfit, CreateNonProfitInput>('/non-profit-law/create', 'post', options);
}

export function useUpdateNonProfit(id: string, options?: { onSuccess?: (data: NonProfit) => void; onError?: (error: string) => void }) {
  return useMutation<NonProfit, UpdateNonProfitInput>(`/non-profit-law/${id}`, 'put', options);
}

export function useDeleteNonProfit(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/non-profit-law/${id}`, 'delete', options);
}
