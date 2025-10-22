/**
 * Education Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Education, CreateEducationInput, UpdateEducationInput } from './types';

export function useCreateEducation(options?: { onSuccess?: (data: Education) => void; onError?: (error: string) => void }) {
  return useMutation<Education, CreateEducationInput>('/education-law/create', 'post', options);
}

export function useUpdateEducation(id: string, options?: { onSuccess?: (data: Education) => void; onError?: (error: string) => void }) {
  return useMutation<Education, UpdateEducationInput>(`/education-law/${id}`, 'put', options);
}

export function useDeleteEducation(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/education-law/${id}`, 'delete', options);
}
