/**
 * Client CRM Composite Hook
 * Combines queries and mutations for complete client management
 */

import { useState, useCallback } from 'react';
import { useClients, useClient, useClientCommunications, useClientFeedback } from './useClientQueries';
import { useCreateClient, useUpdateClient, useDeleteClient, useAddCommunication, useSubmitFeedback } from './useClientMutations';

/**
 * Comprehensive hook for managing clients with all operations
 */
export function useClientManagement(clientId?: string) {
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(clientId);

  // Queries
  const clients = useClients();
  const currentClient = useClient(selectedClientId || '', { skip: !selectedClientId });
  const communications = useClientCommunications(selectedClientId || '');
  const feedback = useClientFeedback(selectedClientId || '');

  // Mutations
  const createClient = useCreateClient({
    onSuccess: (newClient) => {
      setSelectedClientId(newClient.id);
      clients.refetch();
    },
  });

  const updateClient = useUpdateClient(selectedClientId || '', {
    onSuccess: () => {
      currentClient.refetch();
      clients.refetch();
    },
  });

  const deleteClient = useDeleteClient(selectedClientId || '', {
    onSuccess: () => {
      setSelectedClientId(undefined);
      clients.refetch();
    },
  });

  const addCommunication = useAddCommunication({
    onSuccess: () => {
      communications.refetch();
    },
  });

  const submitFeedback = useSubmitFeedback(selectedClientId || '', {
    onSuccess: () => {
      feedback.refetch();
    },
  });

  // Helper functions
  const selectClient = useCallback((id: string) => {
    setSelectedClientId(id);
  }, []);

  const refreshAll = useCallback(() => {
    clients.refetch();
    if (selectedClientId) {
      currentClient.refetch();
      communications.refetch();
      feedback.refetch();
    }
  }, [selectedClientId, clients, currentClient, communications, feedback]);

  return {
    // Queries
    clients: clients.data,
    currentClient: currentClient.data,
    communications: communications.data,
    feedback: feedback.data,
    
    // Loading states
    loading: {
      clients: clients.loading,
      currentClient: currentClient.loading,
      communications: communications.loading,
      feedback: feedback.loading,
      creating: createClient.loading,
      updating: updateClient.loading,
      deleting: deleteClient.loading,
    },
    
    // Error states
    error: {
      clients: clients.error,
      currentClient: currentClient.error,
      communications: communications.error,
      feedback: feedback.error,
      mutation: createClient.error || updateClient.error || deleteClient.error,
    },
    
    // Mutations
    actions: {
      createClient: createClient.mutate,
      updateClient: updateClient.mutate,
      deleteClient: deleteClient.mutate,
      addCommunication: addCommunication.mutate,
      submitFeedback: submitFeedback.mutate,
      selectClient,
      refreshAll,
    },
    
    // Selected client ID
    selectedClientId,
  };
}
