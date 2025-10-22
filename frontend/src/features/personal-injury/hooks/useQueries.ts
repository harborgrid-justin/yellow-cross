/**
 * PersonalInjury Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { PersonalInjury } from './types';

export function usePersonalInjurys(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<PersonalInjury>>(`/personal-injury${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function usePersonalInjury(id: string, options?: { skip?: boolean }) {
  return useQuery<PersonalInjury>(`/personal-injury/${id}`, options);
}
