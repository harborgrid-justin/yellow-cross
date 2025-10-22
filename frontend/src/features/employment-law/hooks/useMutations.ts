/**
 * Employment Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Employment, CreateEmploymentInput, UpdateEmploymentInput } from './types';

export function useCreateEmployment(options?: { onSuccess?: (data: Employment) => void; onError?: (error: string) => void }) {
  return useMutation<Employment, CreateEmploymentInput>('/employment/create', 'post', options);
}

export function useUpdateEmployment(id: string, options?: { onSuccess?: (data: Employment) => void; onError?: (error: string) => void }) {
  return useMutation<Employment, UpdateEmploymentInput>(`/employment/${id}`, 'put', options);
}

export function useDeleteEmployment(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/employment/${id}`, 'delete', options);
}
