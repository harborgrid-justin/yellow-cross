/**
 * Financial Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Financial, CreateFinancialInput, UpdateFinancialInput } from './types';

export function useCreateFinancial(options?: { onSuccess?: (data: Financial) => void; onError?: (error: string) => void }) {
  return useMutation<Financial, CreateFinancialInput>('/financial-services/create', 'post', options);
}

export function useUpdateFinancial(id: string, options?: { onSuccess?: (data: Financial) => void; onError?: (error: string) => void }) {
  return useMutation<Financial, UpdateFinancialInput>(`/financial-services/${id}`, 'put', options);
}

export function useDeleteFinancial(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/financial-services/${id}`, 'delete', options);
}
