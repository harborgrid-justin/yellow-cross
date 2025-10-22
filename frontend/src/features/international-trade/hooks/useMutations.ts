/**
 * InternationalTrade Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { InternationalTrade, CreateInternationalTradeInput, UpdateInternationalTradeInput } from './types';

export function useCreateInternationalTrade(options?: { onSuccess?: (data: InternationalTrade) => void; onError?: (error: string) => void }) {
  return useMutation<InternationalTrade, CreateInternationalTradeInput>('/international-trade/create', 'post', options);
}

export function useUpdateInternationalTrade(id: string, options?: { onSuccess?: (data: InternationalTrade) => void; onError?: (error: string) => void }) {
  return useMutation<InternationalTrade, UpdateInternationalTradeInput>(`/international-trade/${id}`, 'put', options);
}

export function useDeleteInternationalTrade(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/international-trade/${id}`, 'delete', options);
}
