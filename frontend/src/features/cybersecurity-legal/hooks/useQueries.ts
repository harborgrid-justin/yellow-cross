/**
 * Cybersecurity Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Cybersecurity } from './types';

export function useCybersecuritys(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Cybersecurity>>(`/cybersecurity-legal${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useCybersecurity(id: string, options?: { skip?: boolean }) {
  return useQuery<Cybersecurity>(`/cybersecurity-legal/${id}`, options);
}
