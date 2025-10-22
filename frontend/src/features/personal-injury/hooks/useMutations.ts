/**
 * PersonalInjury Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { PersonalInjury, CreatePersonalInjuryInput, UpdatePersonalInjuryInput } from './types';

export function useCreatePersonalInjury(options?: { onSuccess?: (data: PersonalInjury) => void; onError?: (error: string) => void }) {
  return useMutation<PersonalInjury, CreatePersonalInjuryInput>('/personal-injury/create', 'post', options);
}

export function useUpdatePersonalInjury(id: string, options?: { onSuccess?: (data: PersonalInjury) => void; onError?: (error: string) => void }) {
  return useMutation<PersonalInjury, UpdatePersonalInjuryInput>(`/personalinjury/${id}`, 'put', options);
}

export function useDeletePersonalInjury(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/personalinjury/${id}`, 'delete', options);
}
