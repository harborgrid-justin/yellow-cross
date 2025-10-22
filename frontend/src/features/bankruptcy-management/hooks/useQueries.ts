/**
 * Bankruptcy Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Bankruptcy } from './types';

export function useBankruptcys(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Bankruptcy>>(`/bankruptcy${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useBankruptcy(id: string, options?: { skip?: boolean }) {
  return useQuery<Bankruptcy>(`/bankruptcy/${id}`, options);
}
