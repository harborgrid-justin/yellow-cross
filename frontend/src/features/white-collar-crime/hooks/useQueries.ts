/**
 * WhiteCollarCrime Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { WhiteCollarCrime } from './types';

export function useWhiteCollarCrimes(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<WhiteCollarCrime>>(`/whitecollar${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useWhiteCollarCrime(id: string, options?: { skip?: boolean }) {
  return useQuery<WhiteCollarCrime>(`/whitecollar/${id}`, options);
}
