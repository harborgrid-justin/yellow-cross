/**
 * Contract Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Contract } from './types';

export function useContracts(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<Contract>>(`/contract-management${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useContract(id: string, options?: { skip?: boolean }) {
  return useQuery<Contract>(`/contract-management/${id}`, options);
}
