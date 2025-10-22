/**
 * Insurance Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Insurance } from './types';

export function useInsurances(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Insurance>>(`/insurance-defense${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useInsurance(id: string, options?: { skip?: boolean }) {
  return useQuery<Insurance>(`/insurance-defense/${id}`, options);
}
