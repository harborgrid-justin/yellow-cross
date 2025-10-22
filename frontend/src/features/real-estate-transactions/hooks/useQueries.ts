/**
 * RealEstate Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { RealEstate } from './types';

export function useRealEstates(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<RealEstate>>(`/real-estate-transactions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useRealEstate(id: string, options?: { skip?: boolean }) {
  return useQuery<RealEstate>(`/real-estate-transactions/${id}`, options);
}
