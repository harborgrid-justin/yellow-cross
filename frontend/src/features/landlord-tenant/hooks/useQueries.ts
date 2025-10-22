/**
 * LandlordTenant Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { LandlordTenant } from './types';

export function useLandlordTenants(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<LandlordTenant>>(`/landlord-tenant${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useLandlordTenant(id: string, options?: { skip?: boolean }) {
  return useQuery<LandlordTenant>(`/landlord-tenant/${id}`, options);
}
