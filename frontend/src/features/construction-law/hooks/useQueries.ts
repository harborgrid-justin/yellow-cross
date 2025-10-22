/**
 * Construction Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Construction } from './types';

export function useConstructions(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Construction>>(`/construction${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useConstruction(id: string, options?: { skip?: boolean }) {
  return useQuery<Construction>(`/construction/${id}`, options);
}
