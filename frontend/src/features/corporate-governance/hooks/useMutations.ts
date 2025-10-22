/**
 * Corporate Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Corporate, CreateCorporateInput, UpdateCorporateInput } from './types';

export function useCreateCorporate(options?: { onSuccess?: (data: Corporate) => void; onError?: (error: string) => void }) {
  return useMutation<Corporate, CreateCorporateInput>('/corporate-governance/create', 'post', options);
}

export function useUpdateCorporate(id: string, options?: { onSuccess?: (data: Corporate) => void; onError?: (error: string) => void }) {
  return useMutation<Corporate, UpdateCorporateInput>(`/corporate-governance/${id}`, 'put', options);
}

export function useDeleteCorporate(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/corporate-governance/${id}`, 'delete', options);
}
