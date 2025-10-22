/**
 * Immigration Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Immigration } from './types';

export function useImmigrations(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Immigration>>(`/immigration-law${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useImmigration(id: string, options?: { skip?: boolean }) {
  return useQuery<Immigration>(`/immigration-law/${id}`, options);
}
