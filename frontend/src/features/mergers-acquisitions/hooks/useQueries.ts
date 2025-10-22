/**
 * MergersAcquisitions Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { MergersAcquisitions } from './types';

export function useMergersAcquisitionss(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<MergersAcquisitions>>(`/manda${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useMergersAcquisitions(id: string, options?: { skip?: boolean }) {
  return useQuery<MergersAcquisitions>(`/manda/${id}`, options);
}
