/**
 * Franchise Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Franchise, CreateFranchiseInput, UpdateFranchiseInput } from './types';

export function useCreateFranchise(options?: { onSuccess?: (data: Franchise) => void; onError?: (error: string) => void }) {
  return useMutation<Franchise, CreateFranchiseInput>('/franchise-law/create', 'post', options);
}

export function useUpdateFranchise(id: string, options?: { onSuccess?: (data: Franchise) => void; onError?: (error: string) => void }) {
  return useMutation<Franchise, UpdateFranchiseInput>(`/franchise-law/${id}`, 'put', options);
}

export function useDeleteFranchise(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/franchise-law/${id}`, 'delete', options);
}
