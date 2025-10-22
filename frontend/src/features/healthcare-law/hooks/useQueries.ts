/**
 * Healthcare Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Healthcare } from './types';

export function useHealthcares(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Healthcare>>(`/healthcare-law${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useHealthcare(id: string, options?: { skip?: boolean }) {
  return useQuery<Healthcare>(`/healthcare-law/${id}`, options);
}
