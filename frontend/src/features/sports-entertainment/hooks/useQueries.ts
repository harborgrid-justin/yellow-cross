/**
 * Sports Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Sports } from './types';

export function useSportss(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Sports>>(`/sports${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useSports(id: string, options?: { skip?: boolean }) {
  return useQuery<Sports>(`/sports/${id}`, options);
}
