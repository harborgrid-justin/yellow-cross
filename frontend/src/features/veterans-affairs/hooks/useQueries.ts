/**
 * Veterans Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Veterans } from './types';

export function useVeteranss(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Veterans>>(`/veterans-affairs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useVeterans(id: string, options?: { skip?: boolean }) {
  return useQuery<Veterans>(`/veterans-affairs/${id}`, options);
}
