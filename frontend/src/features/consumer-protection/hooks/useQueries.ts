/**
 * Consumer Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Consumer } from './types';

export function useConsumers(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Consumer>>(`/consumer${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useConsumer(id: string, options?: { skip?: boolean }) {
  return useQuery<Consumer>(`/consumer/${id}`, options);
}
