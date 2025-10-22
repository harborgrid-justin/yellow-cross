/**
 * Securities Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Securities, CreateSecuritiesInput, UpdateSecuritiesInput } from './types';

export function useCreateSecurities(options?: { onSuccess?: (data: Securities) => void; onError?: (error: string) => void }) {
  return useMutation<Securities, CreateSecuritiesInput>('/securities/create', 'post', options);
}

export function useUpdateSecurities(id: string, options?: { onSuccess?: (data: Securities) => void; onError?: (error: string) => void }) {
  return useMutation<Securities, UpdateSecuritiesInput>(`/securities/${id}`, 'put', options);
}

export function useDeleteSecurities(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/securities/${id}`, 'delete', options);
}
