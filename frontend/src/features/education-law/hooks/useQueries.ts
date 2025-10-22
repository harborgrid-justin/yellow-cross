/**
 * Education Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Education } from './types';

export function useEducations(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Education>>(`/education-law${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useEducation(id: string, options?: { skip?: boolean }) {
  return useQuery<Education>(`/education-law/${id}`, options);
}
