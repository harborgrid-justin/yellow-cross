/**
 * WhiteCollarCrime Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { WhiteCollarCrime, CreateWhiteCollarCrimeInput, UpdateWhiteCollarCrimeInput } from './types';

export function useCreateWhiteCollarCrime(options?: { onSuccess?: (data: WhiteCollarCrime) => void; onError?: (error: string) => void }) {
  return useMutation<WhiteCollarCrime, CreateWhiteCollarCrimeInput>('/whitecollar/create', 'post', options);
}

export function useUpdateWhiteCollarCrime(id: string, options?: { onSuccess?: (data: WhiteCollarCrime) => void; onError?: (error: string) => void }) {
  return useMutation<WhiteCollarCrime, UpdateWhiteCollarCrimeInput>(`/whitecollar/${id}`, 'put', options);
}

export function useDeleteWhiteCollarCrime(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/whitecollar/${id}`, 'delete', options);
}
