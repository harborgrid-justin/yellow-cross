/**
 * Family Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Family } from './types';

export function useFamilys(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Family>>(`/family${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useFamily(id: string, options?: { skip?: boolean }) {
  return useQuery<Family>(`/family/${id}`, options);
}
