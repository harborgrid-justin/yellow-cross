/**
 * Energy Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Energy } from './types';

export function useEnergys(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Energy>>(`/energy-utilities${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useEnergy(id: string, options?: { skip?: boolean }) {
  return useQuery<Energy>(`/energy-utilities/${id}`, options);
}
