/**
 * Environmental Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Environmental, CreateEnvironmentalInput, UpdateEnvironmentalInput } from './types';

export function useCreateEnvironmental(options?: { onSuccess?: (data: Environmental) => void; onError?: (error: string) => void }) {
  return useMutation<Environmental, CreateEnvironmentalInput>('/environmental-law/create', 'post', options);
}

export function useUpdateEnvironmental(id: string, options?: { onSuccess?: (data: Environmental) => void; onError?: (error: string) => void }) {
  return useMutation<Environmental, UpdateEnvironmentalInput>(`/environmental/${id}`, 'put', options);
}

export function useDeleteEnvironmental(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/environmental/${id}`, 'delete', options);
}
