/**
 * Antitrust Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Antitrust, CreateAntitrustInput, UpdateAntitrustInput } from './types';

export function useCreateAntitrust(options?: { onSuccess?: (data: Antitrust) => void; onError?: (error: string) => void }) {
  return useMutation<Antitrust, CreateAntitrustInput>('/antitrust-competition/create', 'post', options);
}

export function useUpdateAntitrust(id: string, options?: { onSuccess?: (data: Antitrust) => void; onError?: (error: string) => void }) {
  return useMutation<Antitrust, UpdateAntitrustInput>(`/antitrust/${id}`, 'put', options);
}

export function useDeleteAntitrust(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/antitrust/${id}`, 'delete', options);
}
