/**
 * Integration Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Integration } from './types';

export function useIntegrations(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Integration>>(`/integrations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useIntegration(id: string, options?: { skip?: boolean }) {
  return useQuery<Integration>(`/integrations/${id}`, options);
}
