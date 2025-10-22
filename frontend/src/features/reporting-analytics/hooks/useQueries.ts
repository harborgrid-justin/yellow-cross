/**
 * Report Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Report } from './types';

export function useReports(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Report>>(`/reporting-analytics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useReport(id: string, options?: { skip?: boolean }) {
  return useQuery<Report>(`/reporting-analytics/${id}`, options);
}
