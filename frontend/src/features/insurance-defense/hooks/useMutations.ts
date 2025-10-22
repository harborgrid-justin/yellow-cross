/**
 * Insurance Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Insurance, CreateInsuranceInput, UpdateInsuranceInput } from './types';

export function useCreateInsurance(options?: { onSuccess?: (data: Insurance) => void; onError?: (error: string) => void }) {
  return useMutation<Insurance, CreateInsuranceInput>('/insurance-defense/create', 'post', options);
}

export function useUpdateInsurance(id: string, options?: { onSuccess?: (data: Insurance) => void; onError?: (error: string) => void }) {
  return useMutation<Insurance, UpdateInsuranceInput>(`/insurance-defense/${id}`, 'put', options);
}

export function useDeleteInsurance(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/insurance-defense/${id}`, 'delete', options);
}
