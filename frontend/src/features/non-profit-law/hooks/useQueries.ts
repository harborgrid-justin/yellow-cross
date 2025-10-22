/**
 * NonProfit Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { NonProfit } from './types';

export function useNonProfits(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<NonProfit>>(`/non-profit-law${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useNonProfit(id: string, options?: { skip?: boolean }) {
  return useQuery<NonProfit>(`/non-profit-law/${id}`, options);
}
