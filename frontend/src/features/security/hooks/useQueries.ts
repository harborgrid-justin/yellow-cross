/**
 * Security Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Security } from './types';

export function useSecuritys(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Security>>(`/security${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useSecurity(id: string, options?: { skip?: boolean }) {
  return useQuery<Security>(`/security/${id}`, options);
}
