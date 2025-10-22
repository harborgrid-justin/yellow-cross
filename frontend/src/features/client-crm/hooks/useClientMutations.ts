/**
 * Client CRM Mutation Hooks
 * Hooks for creating, updating, and deleting clients
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Client, CreateClientInput, UpdateClientInput, CreateCommunicationInput, ClientCommunication } from './types';

/**
 * Create a new client
 */
export function useCreateClient(options?: {
  onSuccess?: (data: Client) => void;
  onError?: (error: string) => void;
}) {
  return useMutation<Client, CreateClientInput>('/clients/create', 'post', options);
}

/**
 * Update an existing client
 */
export function useUpdateClient(
  id: string,
  options?: {
    onSuccess?: (data: Client) => void;
    onError?: (error: string) => void;
  }
) {
  return useMutation<Client, UpdateClientInput>(`/clients/${id}`, 'put', options);
}

/**
 * Delete a client
 */
export function useDeleteClient(
  id: string,
  options?: {
    onSuccess?: (data: { success: boolean }) => void;
    onError?: (error: string) => void;
  }
) {
  return useMutation<{ success: boolean }, void>(`/clients/${id}`, 'delete', options);
}

/**
 * Add communication record
 */
export function useAddCommunication(options?: {
  onSuccess?: (data: ClientCommunication) => void;
  onError?: (error: string) => void;
}) {
  return useMutation<ClientCommunication, CreateCommunicationInput>('/clients/communications', 'post', options);
}

/**
 * Submit client feedback
 */
export function useSubmitFeedback(
  clientId: string,
  options?: {
    onSuccess?: (data: unknown) => void;
    onError?: (error: string) => void;
  }
) {
  return useMutation<unknown, { rating: number; feedback?: string; caseId?: string }>(
    `/clients/${clientId}/feedback`,
    'post',
    options
  );
}
