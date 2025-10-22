/**
 * Billing Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Billing } from './types';

export function useBillings(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Billing>>(`/billing${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useBilling(id: string, options?: { skip?: boolean }) {
  return useQuery<Billing>(`/billing/${id}`, options);
}
