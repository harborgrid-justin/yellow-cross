/**
 * Energy Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Energy, CreateEnergyInput, UpdateEnergyInput } from './types';

export function useCreateEnergy(options?: { onSuccess?: (data: Energy) => void; onError?: (error: string) => void }) {
  return useMutation<Energy, CreateEnergyInput>('/energy-utilities/create', 'post', options);
}

export function useUpdateEnergy(id: string, options?: { onSuccess?: (data: Energy) => void; onError?: (error: string) => void }) {
  return useMutation<Energy, UpdateEnergyInput>(`/energy/${id}`, 'put', options);
}

export function useDeleteEnergy(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/energy/${id}`, 'delete', options);
}
