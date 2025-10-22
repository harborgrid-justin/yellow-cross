/**
 * Message Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Message } from './types';

export function useMessages(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Message>>(`/communication${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useMessage(id: string, options?: { skip?: boolean }) {
  return useQuery<Message>(`/communication/${id}`, options);
}
