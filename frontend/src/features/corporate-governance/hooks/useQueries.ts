/**
 * Corporate Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Corporate } from './types';

export function useCorporates(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Corporate>>(`/governance${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useCorporate(id: string, options?: { skip?: boolean }) {
  return useQuery<Corporate>(`/governance/${id}`, options);
}
