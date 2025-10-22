/**
 * Environmental Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Environmental } from './types';

export function useEnvironmentals(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Environmental>>(`/environmental${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useEnvironmental(id: string, options?: { skip?: boolean }) {
  return useQuery<Environmental>(`/environmental/${id}`, options);
}
