/**
 * Labor Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Labor } from './types';

export function useLabors(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Labor>>(`/labor-relations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useLabor(id: string, options?: { skip?: boolean }) {
  return useQuery<Labor>(`/labor-relations/${id}`, options);
}
