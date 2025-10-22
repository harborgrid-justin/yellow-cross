/**
 * Appellate Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Appellate } from './types';

export function useAppellates(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Appellate>>(`/appellate-practice${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useAppellate(id: string, options?: { skip?: boolean }) {
  return useQuery<Appellate>(`/appellate-practice/${id}`, options);
}
