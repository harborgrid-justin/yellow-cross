/**
 * ClassAction Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { ClassAction, CreateClassActionInput, UpdateClassActionInput } from './types';

export function useCreateClassAction(options?: { onSuccess?: (data: ClassAction) => void; onError?: (error: string) => void }) {
  return useMutation<ClassAction, CreateClassActionInput>('/class-action/create', 'post', options);
}

export function useUpdateClassAction(id: string, options?: { onSuccess?: (data: ClassAction) => void; onError?: (error: string) => void }) {
  return useMutation<ClassAction, UpdateClassActionInput>(`/classaction/${id}`, 'put', options);
}

export function useDeleteClassAction(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/classaction/${id}`, 'delete', options);
}
