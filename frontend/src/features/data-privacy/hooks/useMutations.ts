/**
 * DataPrivacy Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { DataPrivacy, CreateDataPrivacyInput, UpdateDataPrivacyInput } from './types';

export function useCreateDataPrivacy(options?: { onSuccess?: (data: DataPrivacy) => void; onError?: (error: string) => void }) {
  return useMutation<DataPrivacy, CreateDataPrivacyInput>('/privacy/create', 'post', options);
}

export function useUpdateDataPrivacy(id: string, options?: { onSuccess?: (data: DataPrivacy) => void; onError?: (error: string) => void }) {
  return useMutation<DataPrivacy, UpdateDataPrivacyInput>(`/privacy/${id}`, 'put', options);
}

export function useDeleteDataPrivacy(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/privacy/${id}`, 'delete', options);
}
