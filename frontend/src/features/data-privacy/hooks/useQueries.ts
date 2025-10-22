/**
 * DataPrivacy Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { DataPrivacy } from './types';

export function useDataPrivacys(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<DataPrivacy>>(`/privacy${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useDataPrivacy(id: string, options?: { skip?: boolean }) {
  return useQuery<DataPrivacy>(`/privacy/${id}`, options);
}
