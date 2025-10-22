/**
 * Maritime Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Maritime } from './types';

export function useMaritimes(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Maritime>>(`/maritime-law${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useMaritime(id: string, options?: { skip?: boolean }) {
  return useQuery<Maritime>(`/maritime-law/${id}`, options);
}
