/**
 * CivilRights Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { CivilRights } from './types';

export function useCivilRightss(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<CivilRights>>(`/civil-rights${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useCivilRights(id: string, options?: { skip?: boolean }) {
  return useQuery<CivilRights>(`/civil-rights/${id}`, options);
}
