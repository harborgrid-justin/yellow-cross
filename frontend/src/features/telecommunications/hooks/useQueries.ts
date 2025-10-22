/**
 * Telecommunications Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Telecommunications } from './types';

export function useTelecommunicationss(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Telecommunications>>(`/telecommunications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useTelecommunications(id: string, options?: { skip?: boolean }) {
  return useQuery<Telecommunications>(`/telecommunications/${id}`, options);
}
