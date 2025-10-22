/**
 * CivilRights Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { CivilRights, CreateCivilRightsInput, UpdateCivilRightsInput } from './types';

export function useCreateCivilRights(options?: { onSuccess?: (data: CivilRights) => void; onError?: (error: string) => void }) {
  return useMutation<CivilRights, CreateCivilRightsInput>('/civil-rights/create', 'post', options);
}

export function useUpdateCivilRights(id: string, options?: { onSuccess?: (data: CivilRights) => void; onError?: (error: string) => void }) {
  return useMutation<CivilRights, UpdateCivilRightsInput>(`/civilrights/${id}`, 'put', options);
}

export function useDeleteCivilRights(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/civilrights/${id}`, 'delete', options);
}
