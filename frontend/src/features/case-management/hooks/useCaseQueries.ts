/**
 * Case Management Query Hooks
 * Hooks for fetching case data
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Case, CaseNote, CaseTimelineEvent, CaseAnalytics } from './types';

/**
 * Fetch all cases with optional pagination and filters
 */
export function useCases(params?: PaginationParams & { status?: string; assignedTo?: string }) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.status) queryParams.append('status', params.status);
  if (params?.assignedTo) queryParams.append('assignedTo', params.assignedTo);

  const endpoint = `/cases${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  return useQuery<PaginatedResponse<Case>>(endpoint);
}

/**
 * Fetch a single case by ID
 */
export function useCase(id: string, options?: { skip?: boolean }) {
  return useQuery<Case>(`/cases/${id}`, options);
}

/**
 * Fetch case status and timeline
 */
export function useCaseStatus(id: string) {
  return useQuery<{
    case: Case;
    recentEvents: CaseTimelineEvent[];
    statusHistory: Array<{ status: string; changedAt: Date; changedBy: string }>;
  }>(`/cases/${id}/status`);
}

/**
 * Fetch case notes
 */
export function useCaseNotes(caseId: string) {
  return useQuery<CaseNote[]>(`/cases/${caseId}/notes`);
}

/**
 * Fetch case timeline events
 */
export function useCaseTimeline(caseId: string) {
  return useQuery<CaseTimelineEvent[]>(`/cases/${caseId}/timeline`);
}

/**
 * Fetch case analytics
 */
export function useCaseAnalytics() {
  return useQuery<CaseAnalytics>('/cases/analytics');
}
