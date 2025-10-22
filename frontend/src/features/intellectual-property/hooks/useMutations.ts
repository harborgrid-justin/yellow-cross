/**
 * IP Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { IP, CreateIPInput, UpdateIPInput } from './types';

export function useCreateIP(options?: { onSuccess?: (data: IP) => void; onError?: (error: string) => void }) {
  return useMutation<IP, CreateIPInput>('/intellectual-property/create', 'post', options);
}

export function useUpdateIP(id: string, options?: { onSuccess?: (data: IP) => void; onError?: (error: string) => void }) {
  return useMutation<IP, UpdateIPInput>(`/intellectual-property/${id}`, 'put', options);
}

export function useDeleteIP(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/intellectual-property/${id}`, 'delete', options);
}
