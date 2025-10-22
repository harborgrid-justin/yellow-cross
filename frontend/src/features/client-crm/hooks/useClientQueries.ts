/**
 * Client CRM Query Hooks
 * Hooks for fetching client data
 */

import { useQuery } from '../../../shared/hooks/useQuery';
import { PaginationParams, PaginatedResponse } from '../../../shared/hooks/types';
import { Client, ClientCommunication, ClientFeedback } from './types';

/**
 * Fetch all clients with optional pagination and filters
 */
export function useClients(params?: PaginationParams & { status?: string; clientType?: string }) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.status) queryParams.append('status', params.status);
  if (params?.clientType) queryParams.append('clientType', params.clientType);

  const endpoint = `/clients${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  return useQuery<PaginatedResponse<Client>>(endpoint);
}

/**
 * Fetch a single client by ID
 */
export function useClient(id: string, options?: { skip?: boolean }) {
  return useQuery<Client>(`/clients/${id}`, options);
}

/**
 * Fetch client communication history
 */
export function useClientCommunications(clientId: string) {
  return useQuery<ClientCommunication[]>(`/clients/${clientId}/communications`);
}

/**
 * Fetch client feedback
 */
export function useClientFeedback(clientId: string) {
  return useQuery<ClientFeedback[]>(`/clients/${clientId}/feedback`);
}

/**
 * Search clients
 */
export function useClientSearch(query: string) {
  return useQuery<Client[]>(`/clients/search?q=${encodeURIComponent(query)}`, {
    skip: !query || query.length < 2,
  });
}

/**
 * Check for conflicts of interest
 */
export function useConflictCheck(clientData: { name: string; company?: string }) {
  return useQuery<{ hasConflict: boolean; conflicts: Array<{ type: string; details: string }> }>(
    `/clients/conflict-check?name=${encodeURIComponent(clientData.name)}${clientData.company ? `&company=${encodeURIComponent(clientData.company)}` : ''}`
  );
}
