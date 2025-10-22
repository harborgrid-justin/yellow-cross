/**
 * SocialSecurity Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { SocialSecurity, CreateSocialSecurityInput, UpdateSocialSecurityInput } from './types';

export function useCreateSocialSecurity(options?: { onSuccess?: (data: SocialSecurity) => void; onError?: (error: string) => void }) {
  return useMutation<SocialSecurity, CreateSocialSecurityInput>('/social-security/create', 'post', options);
}

export function useUpdateSocialSecurity(id: string, options?: { onSuccess?: (data: SocialSecurity) => void; onError?: (error: string) => void }) {
  return useMutation<SocialSecurity, UpdateSocialSecurityInput>(`/socialsecurity/${id}`, 'put', options);
}

export function useDeleteSocialSecurity(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/socialsecurity/${id}`, 'delete', options);
}
