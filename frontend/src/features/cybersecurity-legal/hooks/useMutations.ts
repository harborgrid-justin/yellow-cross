/**
 * Cybersecurity Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Cybersecurity, CreateCybersecurityInput, UpdateCybersecurityInput } from './types';

export function useCreateCybersecurity(options?: { onSuccess?: (data: Cybersecurity) => void; onError?: (error: string) => void }) {
  return useMutation<Cybersecurity, CreateCybersecurityInput>('/cybersecurity-legal/create', 'post', options);
}

export function useUpdateCybersecurity(id: string, options?: { onSuccess?: (data: Cybersecurity) => void; onError?: (error: string) => void }) {
  return useMutation<Cybersecurity, UpdateCybersecurityInput>(`/cybersecurity/${id}`, 'put', options);
}

export function useDeleteCybersecurity(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/cybersecurity/${id}`, 'delete', options);
}
