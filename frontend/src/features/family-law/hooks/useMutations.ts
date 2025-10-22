/**
 * Family Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Family, CreateFamilyInput, UpdateFamilyInput } from './types';

export function useCreateFamily(options?: { onSuccess?: (data: Family) => void; onError?: (error: string) => void }) {
  return useMutation<Family, CreateFamilyInput>('/family-law/create', 'post', options);
}

export function useUpdateFamily(id: string, options?: { onSuccess?: (data: Family) => void; onError?: (error: string) => void }) {
  return useMutation<Family, UpdateFamilyInput>(`/family-law/${id}`, 'put', options);
}

export function useDeleteFamily(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/family-law/${id}`, 'delete', options);
}
