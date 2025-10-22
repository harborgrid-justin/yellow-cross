/**
 * Financial Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Financial } from './types';

export function useFinancials(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Financial>>(`/financial${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useFinancial(id: string, options?: { skip?: boolean }) {
  return useQuery<Financial>(`/financial/${id}`, options);
}
