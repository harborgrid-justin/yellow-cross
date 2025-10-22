/**
 * Estate Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Estate, CreateEstateInput, UpdateEstateInput } from './types';

export function useCreateEstate(options?: { onSuccess?: (data: Estate) => void; onError?: (error: string) => void }) {
  return useMutation<Estate, CreateEstateInput>('/estate-planning/create', 'post', options);
}

export function useUpdateEstate(id: string, options?: { onSuccess?: (data: Estate) => void; onError?: (error: string) => void }) {
  return useMutation<Estate, UpdateEstateInput>(`/estate/${id}`, 'put', options);
}

export function useDeleteEstate(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/estate/${id}`, 'delete', options);
}
