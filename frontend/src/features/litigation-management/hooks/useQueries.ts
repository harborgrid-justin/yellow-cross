/**
 * Litigation Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Litigation } from './types';

export function useLitigations(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Litigation>>(`/litigation${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useLitigation(id: string, options?: { skip?: boolean }) {
  return useQuery<Litigation>(`/litigation/${id}`, options);
}
