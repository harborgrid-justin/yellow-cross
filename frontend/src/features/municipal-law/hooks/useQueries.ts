/**
 * Municipal Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Municipal } from './types';

export function useMunicipals(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Municipal>>(`/municipal${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useMunicipal(id: string, options?: { skip?: boolean }) {
  return useQuery<Municipal>(`/municipal/${id}`, options);
}
