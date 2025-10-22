/**
 * InternationalTrade Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { InternationalTrade } from './types';

export function useInternationalTrades(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<InternationalTrade>>(`/international-trade${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useInternationalTrade(id: string, options?: { skip?: boolean }) {
  return useQuery<InternationalTrade>(`/international-trade/${id}`, options);
}
