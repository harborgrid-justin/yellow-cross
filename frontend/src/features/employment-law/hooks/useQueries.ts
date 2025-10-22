/**
 * Employment Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Employment } from './types';

export function useEmployments(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Employment>>(`/employment-law${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useEmployment(id: string, options?: { skip?: boolean }) {
  return useQuery<Employment>(`/employment-law/${id}`, options);
}
