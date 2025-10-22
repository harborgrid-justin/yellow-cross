/**
 * Calendar Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Calendar } from './types';

export function useCalendars(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Calendar>>(`/calendar${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useCalendar(id: string, options?: { skip?: boolean }) {
  return useQuery<Calendar>(`/calendar/${id}`, options);
}
