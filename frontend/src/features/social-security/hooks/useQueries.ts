/**
 * SocialSecurity Query Hooks
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { SocialSecurity } from './types';

export function useSocialSecuritys(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return useQuery<PaginatedResponse<SocialSecurity>>(`/socialsecurity${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
}

export function useSocialSecurity(id: string, options?: { skip?: boolean }) {
  return useQuery<SocialSecurity>(`/socialsecurity/${id}`, options);
}
