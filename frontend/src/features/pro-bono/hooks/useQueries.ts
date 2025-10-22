/**
 * ProBono Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { ProBono } from './types';

export function useProBonos(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<ProBono>>(`/probono${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useProBono(id: string, options?: { skip?: boolean }) {
  return useQuery<ProBono>(`/probono/${id}`, options);
}
