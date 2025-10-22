/**
 * Mediation Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Mediation } from './types';

export function useMediations(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Mediation>>(`/mediation-adr${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useMediation(id: string, options?: { skip?: boolean }) {
  return useQuery<Mediation>(`/mediation-adr/${id}`, options);
}
