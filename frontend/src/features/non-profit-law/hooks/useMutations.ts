/**
 * NonProfit Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { NonProfit, CreateNonProfitInput, UpdateNonProfitInput } from './types';

export function useCreateNonProfit(options?: { onSuccess?: (data: NonProfit) => void; onError?: (error: string) => void }) {
  return useMutation<NonProfit, CreateNonProfitInput>('/nonprofit/create', 'post', options);
}

export function useUpdateNonProfit(id: string, options?: { onSuccess?: (data: NonProfit) => void; onError?: (error: string) => void }) {
  return useMutation<NonProfit, UpdateNonProfitInput>(`/nonprofit/${id}`, 'put', options);
}

export function useDeleteNonProfit(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/nonprofit/${id}`, 'delete', options);
}
