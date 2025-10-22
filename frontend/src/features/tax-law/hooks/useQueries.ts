/**
 * Tax Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Tax } from './types';

export function useTaxs(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Tax>>(`/tax${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useTax(id: string, options?: { skip?: boolean }) {
  return useQuery<Tax>(`/tax/${id}`, options);
}
