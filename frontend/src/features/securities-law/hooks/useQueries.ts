/**
 * Securities Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Securities } from './types';

export function useSecuritiess(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Securities>>(`/securities${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useSecurities(id: string, options?: { skip?: boolean }) {
  return useQuery<Securities>(`/securities/${id}`, options);
}
