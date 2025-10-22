/**
 * Aviation Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Aviation } from './types';

export function useAviations(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Aviation>>(`/aviation${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useAviation(id: string, options?: { skip?: boolean }) {
  return useQuery<Aviation>(`/aviation/${id}`, options);
}
