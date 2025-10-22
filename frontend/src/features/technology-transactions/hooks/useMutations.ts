/**
 * Technology Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Technology, CreateTechnologyInput, UpdateTechnologyInput } from './types';

export function useCreateTechnology(options?: { onSuccess?: (data: Technology) => void; onError?: (error: string) => void }) {
  return useMutation<Technology, CreateTechnologyInput>('/technology-transactions/create', 'post', options);
}

export function useUpdateTechnology(id: string, options?: { onSuccess?: (data: Technology) => void; onError?: (error: string) => void }) {
  return useMutation<Technology, UpdateTechnologyInput>(`/technology-transactions/${id}`, 'put', options);
}

export function useDeleteTechnology(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/technology-transactions/${id}`, 'delete', options);
}
