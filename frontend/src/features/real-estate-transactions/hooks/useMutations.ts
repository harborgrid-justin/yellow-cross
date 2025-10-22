/**
 * RealEstate Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { RealEstate, CreateRealEstateInput, UpdateRealEstateInput } from './types';

export function useCreateRealEstate(options?: { onSuccess?: (data: RealEstate) => void; onError?: (error: string) => void }) {
  return useMutation<RealEstate, CreateRealEstateInput>('/real-estate-transactions/create', 'post', options);
}

export function useUpdateRealEstate(id: string, options?: { onSuccess?: (data: RealEstate) => void; onError?: (error: string) => void }) {
  return useMutation<RealEstate, UpdateRealEstateInput>(`/real-estate-transactions/${id}`, 'put', options);
}

export function useDeleteRealEstate(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/real-estate-transactions/${id}`, 'delete', options);
}
