/**
 * Immigration Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Immigration, CreateImmigrationInput, UpdateImmigrationInput } from './types';

export function useCreateImmigration(options?: { onSuccess?: (data: Immigration) => void; onError?: (error: string) => void }) {
  return useMutation<Immigration, CreateImmigrationInput>('/immigration-law/create', 'post', options);
}

export function useUpdateImmigration(id: string, options?: { onSuccess?: (data: Immigration) => void; onError?: (error: string) => void }) {
  return useMutation<Immigration, UpdateImmigrationInput>(`/immigration/${id}`, 'put', options);
}

export function useDeleteImmigration(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/immigration/${id}`, 'delete', options);
}
