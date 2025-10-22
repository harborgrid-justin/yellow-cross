/**
 * MergersAcquisitions Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { MergersAcquisitions, CreateMergersAcquisitionsInput, UpdateMergersAcquisitionsInput } from './types';

export function useCreateMergersAcquisitions(options?: { onSuccess?: (data: MergersAcquisitions) => void; onError?: (error: string) => void }) {
  return useMutation<MergersAcquisitions, CreateMergersAcquisitionsInput>('/mergers-acquisitions/create', 'post', options);
}

export function useUpdateMergersAcquisitions(id: string, options?: { onSuccess?: (data: MergersAcquisitions) => void; onError?: (error: string) => void }) {
  return useMutation<MergersAcquisitions, UpdateMergersAcquisitionsInput>(`/mergers-acquisitions/${id}`, 'put', options);
}

export function useDeleteMergersAcquisitions(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/mergers-acquisitions/${id}`, 'delete', options);
}
