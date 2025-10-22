/**
 * Veterans Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Veterans, CreateVeteransInput, UpdateVeteransInput } from './types';

export function useCreateVeterans(options?: { onSuccess?: (data: Veterans) => void; onError?: (error: string) => void }) {
  return useMutation<Veterans, CreateVeteransInput>('/veterans/create', 'post', options);
}

export function useUpdateVeterans(id: string, options?: { onSuccess?: (data: Veterans) => void; onError?: (error: string) => void }) {
  return useMutation<Veterans, UpdateVeteransInput>(`/veterans/${id}`, 'put', options);
}

export function useDeleteVeterans(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/veterans/${id}`, 'delete', options);
}
