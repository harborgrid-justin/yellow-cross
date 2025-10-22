/**
 * Security Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Security, CreateSecurityInput, UpdateSecurityInput } from './types';

export function useCreateSecurity(options?: { onSuccess?: (data: Security) => void; onError?: (error: string) => void }) {
  return useMutation<Security, CreateSecurityInput>('/security/create', 'post', options);
}

export function useUpdateSecurity(id: string, options?: { onSuccess?: (data: Security) => void; onError?: (error: string) => void }) {
  return useMutation<Security, UpdateSecurityInput>(`/security/${id}`, 'put', options);
}

export function useDeleteSecurity(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/security/${id}`, 'delete', options);
}
