/**
 * Compliance Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Compliance } from './types';

export function useCompliances(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Compliance>>(`/compliance${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useCompliance(id: string, options?: { skip?: boolean }) {
  return useQuery<Compliance>(`/compliance/${id}`, options);
}
