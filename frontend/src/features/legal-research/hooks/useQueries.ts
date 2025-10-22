/**
 * Research Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Research } from './types';

export function useResearchs(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Research>>(`/legal-research${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useResearch(id: string, options?: { skip?: boolean }) {
  return useQuery<Research>(`/legal-research/${id}`, options);
}
