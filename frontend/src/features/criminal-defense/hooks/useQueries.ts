/**
 * Criminal Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Criminal } from './types';

export function useCriminals(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Criminal>>(`/criminal${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useCriminal(id: string, options?: { skip?: boolean }) {
  return useQuery<Criminal>(`/criminal/${id}`, options);
}
