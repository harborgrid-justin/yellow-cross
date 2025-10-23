/**
 * Case Management Query Hooks
 * 
 * Collection of custom hooks for fetching case-related data from the API.
 * Provides a convenient interface for common case management queries with
 * automatic state management and error handling.
 * 
 * @module features/case-management/hooks/useCaseQueries
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Case, CaseNote, CaseTimelineEvent, CaseAnalytics } from './types';

/**
 * useCases - Fetches a paginated list of cases with optional filters
 * 
 * Retrieves cases from the API with support for pagination and filtering
 * by status and assigned user. Automatically manages loading and error states.
 * 
 * @hook
 * @param {Object} [params] - Query parameters for filtering and pagination
 * @param {number} [params.page] - Page number for pagination
 * @param {number} [params.limit] - Number of items per page
 * @param {string} [params.status] - Filter by case status (e.g., 'open', 'closed')
 * @param {string} [params.assignedTo] - Filter by assigned user ID
 * 
 * @returns {QueryState<PaginatedResponse<Case>>} Query state with cases data
 * @returns {PaginatedResponse<Case>|null} returns.data - Paginated case data
 * @returns {Case[]} returns.data.items - Array of cases
 * @returns {number} returns.data.total - Total number of cases
 * @returns {boolean} returns.loading - Loading state
 * @returns {string|null} returns.error - Error message if any
 * @returns {Function} returns.refetch - Function to refetch data
 * 
 * @example
 * // Fetch all cases
 * const { data, loading, error } = useCases();
 * 
 * @example
 * // Fetch open cases with pagination
 * const { data, loading } = useCases({
 *   page: 1,
 *   limit: 20,
 *   status: 'open'
 * });
 * 
 * @example
 * // Fetch cases assigned to specific user
 * const { data } = useCases({
 *   assignedTo: userId,
 *   limit: 50
 * });
 * 
 * @see {@link useCase} for fetching a single case
 * @see {@link Case} for case type definition
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
 * useCase - Fetches detailed information for a single case
 * 
 * Retrieves complete case data including all fields and relationships.
 * Supports conditional fetching via the skip option.
 * 
 * @hook
 * @param {string} id - Unique case identifier
 * @param {Object} [options] - Query options
 * @param {boolean} [options.skip] - Skip fetching if true
 * 
 * @returns {QueryState<Case>} Query state with case data
 * @returns {Case|null} returns.data - Complete case object
 * @returns {boolean} returns.loading - Loading state
 * @returns {string|null} returns.error - Error message if any
 * @returns {Function} returns.refetch - Function to refetch data
 * 
 * @example
 * // Fetch case by ID
 * const { data: case, loading } = useCase(caseId);
 * 
 * @example
 * // Conditional fetching
 * const { data: case } = useCase(caseId, {
 *   skip: !caseId // Only fetch when caseId is available
 * });
 * 
 * @see {@link useCases} for fetching multiple cases
 * @see {@link useCaseStatus} for case status and timeline
 */
export function useCase(id: string, options?: { skip?: boolean }) {
  return useQuery<Case>(`/cases/${id}`, options);
}

/**
 * useCaseStatus - Fetches case status information and timeline
 * 
 * Retrieves the current case status along with recent timeline events
 * and complete status change history. Useful for status tracking and
 * audit trail displays.
 * 
 * @hook
 * @param {string} id - Case identifier
 * 
 * @returns {QueryState} Query state with status data
 * @returns {Object|null} returns.data - Status information
 * @returns {Case} returns.data.case - Case object
 * @returns {CaseTimelineEvent[]} returns.data.recentEvents - Recent timeline events
 * @returns {Array} returns.data.statusHistory - History of status changes
 * @returns {boolean} returns.loading - Loading state
 * @returns {string|null} returns.error - Error message if any
 * 
 * @example
 * // Display case status and timeline
 * const { data, loading } = useCaseStatus(caseId);
 * 
 * if (data) {
 *   return (
 *     <>
 *       <StatusBadge status={data.case.status} />
 *       <Timeline events={data.recentEvents} />
 *       <StatusHistory history={data.statusHistory} />
 *     </>
 *   );
 * }
 * 
 * @see {@link useCase} for complete case data
 * @see {@link CaseTimelineEvent} for timeline event structure
 */
export function useCaseStatus(id: string) {
  return useQuery<{
    case: Case;
    recentEvents: CaseTimelineEvent[];
    statusHistory: Array<{ status: string; changedAt: Date; changedBy: string }>;
  }>(`/cases/${id}/status`);
}

/**
 * useCaseNotes - Fetches all notes associated with a case
 * 
 * Retrieves the complete list of notes for a specific case, including
 * note content, author information, and timestamps.
 * 
 * @hook
 * @param {string} caseId - Case identifier
 * 
 * @returns {QueryState<CaseNote[]>} Query state with notes array
 * @returns {CaseNote[]|null} returns.data - Array of case notes
 * @returns {boolean} returns.loading - Loading state
 * @returns {string|null} returns.error - Error message if any
 * @returns {Function} returns.refetch - Function to refetch notes
 * 
 * @example
 * // Display case notes
 * const { data: notes, loading, refetch } = useCaseNotes(caseId);
 * 
 * return (
 *   <>
 *     <NotesList notes={notes} />
 *     <Button onClick={refetch}>Refresh</Button>
 *   </>
 * );
 * 
 * @see {@link CaseNote} for note structure
 * @see {@link useAddCaseNote} for adding new notes
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
