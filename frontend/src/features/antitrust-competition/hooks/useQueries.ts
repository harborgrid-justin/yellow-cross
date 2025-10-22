/**
 * Antitrust Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Antitrust } from './types';

export function useAntitrusts(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Antitrust>>(`/antitrust${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useAntitrust(id: string, options?: { skip?: boolean }) {
  return useQuery<Antitrust>(`/antitrust/${id}`, options);
}
