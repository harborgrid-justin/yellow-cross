/**
 * Billing Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Billing, CreateBillingInput, UpdateBillingInput } from './types';

export function useCreateBilling(options?: { onSuccess?: (data: Billing) => void; onError?: (error: string) => void }) {
  return useMutation<Billing, CreateBillingInput>('/billing/create', 'post', options);
}

export function useUpdateBilling(id: string, options?: { onSuccess?: (data: Billing) => void; onError?: (error: string) => void }) {
  return useMutation<Billing, UpdateBillingInput>(`/billing/${id}`, 'put', options);
}

export function useDeleteBilling(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/billing/${id}`, 'delete', options);
}
