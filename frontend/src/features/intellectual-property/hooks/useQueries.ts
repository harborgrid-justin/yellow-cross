/**
 * IP Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { IP } from './types';

export function useIPs(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<IP>>(`/ip${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useIP(id: string, options?: { skip?: boolean }) {
  return useQuery<IP>(`/ip/${id}`, options);
}
