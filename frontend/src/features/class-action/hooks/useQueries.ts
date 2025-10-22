/**
 * ClassAction Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { ClassAction } from './types';

export function useClassActions(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<ClassAction>>(`/class-action${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useClassAction(id: string, options?: { skip?: boolean }) {
  return useQuery<ClassAction>(`/class-action/${id}`, options);
}
