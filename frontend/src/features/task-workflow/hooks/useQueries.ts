/**
 * Task Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Task } from './types';

export function useTasks(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Task>>(`/task-workflow${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useTask(id: string, options?: { skip?: boolean }) {
  return useQuery<Task>(`/task-workflow/${id}`, options);
}
