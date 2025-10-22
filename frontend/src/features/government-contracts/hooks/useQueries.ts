/**
 * Government Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Government } from './types';

export function useGovernments(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Government>>(`/govcontracts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useGovernment(id: string, options?: { skip?: boolean }) {
  return useQuery<Government>(`/govcontracts/${id}`, options);
}
