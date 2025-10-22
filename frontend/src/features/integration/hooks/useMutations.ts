/**
 * Integration Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Integration, CreateIntegrationInput, UpdateIntegrationInput } from './types';

export function useCreateIntegration(options?: { onSuccess?: (data: Integration) => void; onError?: (error: string) => void }) {
  return useMutation<Integration, CreateIntegrationInput>('/integrations/create', 'post', options);
}

export function useUpdateIntegration(id: string, options?: { onSuccess?: (data: Integration) => void; onError?: (error: string) => void }) {
  return useMutation<Integration, UpdateIntegrationInput>(`/integrations/${id}`, 'put', options);
}

export function useDeleteIntegration(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/integrations/${id}`, 'delete', options);
}
