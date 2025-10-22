/**
 * Contract Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Contract, CreateContractInput, UpdateContractInput } from './types';

export function useCreateContract(options?: { onSuccess?: (data: Contract) => void; onError?: (error: string) => void }) {
  return useMutation<Contract, CreateContractInput>('/contract-management/create', 'post', options);
}

export function useUpdateContract(id: string, options?: { onSuccess?: (data: Contract) => void; onError?: (error: string) => void }) {
  return useMutation<Contract, UpdateContractInput>(`/contract-management/${id}`, 'put', options);
}

export function useDeleteContract(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/contract-management/${id}`, 'delete', options);
}
