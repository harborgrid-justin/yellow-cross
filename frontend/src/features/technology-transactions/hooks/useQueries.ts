/**
 * Technology Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Technology } from './types';

export function useTechnologys(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Technology>>(`/technology${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useTechnology(id: string, options?: { skip?: boolean }) {
  return useQuery<Technology>(`/technology/${id}`, options);
}
