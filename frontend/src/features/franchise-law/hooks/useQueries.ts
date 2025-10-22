/**
 * Franchise Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Franchise } from './types';

export function useFranchises(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Franchise>>(`/franchise${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useFranchise(id: string, options?: { skip?: boolean }) {
  return useQuery<Franchise>(`/franchise/${id}`, options);
}
