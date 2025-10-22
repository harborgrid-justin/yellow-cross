/**
 * Evidence Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Evidence } from './types';

export function useEvidences(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Evidence>>(`/ediscovery${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useEvidence(id: string, options?: { skip?: boolean }) {
  return useQuery<Evidence>(`/ediscovery/${id}`, options);
}
