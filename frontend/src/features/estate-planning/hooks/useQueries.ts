/**
 * Estate Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Estate } from './types';

export function useEstates(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Estate>>(`/estate${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useEstate(id: string, options?: { skip?: boolean }) {
  return useQuery<Estate>(`/estate/${id}`, options);
}
