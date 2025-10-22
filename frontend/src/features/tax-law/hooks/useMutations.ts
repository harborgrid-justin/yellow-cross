/**
 * Tax Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Tax, CreateTaxInput, UpdateTaxInput } from './types';

export function useCreateTax(options?: { onSuccess?: (data: Tax) => void; onError?: (error: string) => void }) {
  return useMutation<Tax, CreateTaxInput>('/tax-law/create', 'post', options);
}

export function useUpdateTax(id: string, options?: { onSuccess?: (data: Tax) => void; onError?: (error: string) => void }) {
  return useMutation<Tax, UpdateTaxInput>(`/tax/${id}`, 'put', options);
}

export function useDeleteTax(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/tax/${id}`, 'delete', options);
}
