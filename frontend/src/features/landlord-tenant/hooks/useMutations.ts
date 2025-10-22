/**
 * LandlordTenant Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { LandlordTenant, CreateLandlordTenantInput, UpdateLandlordTenantInput } from './types';

export function useCreateLandlordTenant(options?: { onSuccess?: (data: LandlordTenant) => void; onError?: (error: string) => void }) {
  return useMutation<LandlordTenant, CreateLandlordTenantInput>('/landlord-tenant/create', 'post', options);
}

export function useUpdateLandlordTenant(id: string, options?: { onSuccess?: (data: LandlordTenant) => void; onError?: (error: string) => void }) {
  return useMutation<LandlordTenant, UpdateLandlordTenantInput>(`/landlord-tenant/${id}`, 'put', options);
}

export function useDeleteLandlordTenant(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/landlord-tenant/${id}`, 'delete', options);
}
