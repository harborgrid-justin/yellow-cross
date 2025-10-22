/**
 * InternationalTrade Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { InternationalTrade, CreateInternationalTradeInput, UpdateInternationalTradeInput } from './types';

export function useCreateInternationalTrade(options?: { onSuccess?: (data: InternationalTrade) => void; onError?: (error: string) => void }) {
  return useMutation<InternationalTrade, CreateInternationalTradeInput>('/trade/create', 'post', options);
}

export function useUpdateInternationalTrade(id: string, options?: { onSuccess?: (data: InternationalTrade) => void; onError?: (error: string) => void }) {
  return useMutation<InternationalTrade, UpdateInternationalTradeInput>(`/trade/${id}`, 'put', options);
}

export function useDeleteInternationalTrade(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/trade/${id}`, 'delete', options);
}
