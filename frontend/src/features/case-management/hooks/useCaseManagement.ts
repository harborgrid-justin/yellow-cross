/**
 * Case Management Composite Hook
 * Combines queries and mutations for complete case management functionality
 */

import { useState, useCallback } from 'react';
import { useCases, useCase, useCaseStatus, useCaseNotes, useCaseTimeline, useCaseAnalytics } from './useCaseQueries';
import {
  useCreateCase,
  useUpdateCase,
  useUpdateCaseStatus,
  useAssignCase,
  useTagCase,
  useCloseCase,
  useDeleteCase,
  useCreateCaseNote,
} from './useCaseMutations';

/**
 * Comprehensive hook for managing a single case with all operations
 */
export function useCaseManagement(caseId?: string) {
  const [selectedCaseId, setSelectedCaseId] = useState<string | undefined>(caseId);

  // Queries
  const cases = useCases();
  const currentCase = useCase(selectedCaseId || '', { skip: !selectedCaseId });
  const caseStatus = useCaseStatus(selectedCaseId || '');
  const notes = useCaseNotes(selectedCaseId || '');
  const timeline = useCaseTimeline(selectedCaseId || '');
  const analytics = useCaseAnalytics();

  // Mutations
  const createCase = useCreateCase({
    onSuccess: (newCase) => {
      setSelectedCaseId(newCase.id);
      cases.refetch();
      analytics.refetch();
    },
  });

  const updateCase = useUpdateCase(selectedCaseId || '', {
    onSuccess: () => {
      currentCase.refetch();
      cases.refetch();
    },
  });

  const updateStatus = useUpdateCaseStatus(selectedCaseId || '', {
    onSuccess: () => {
      currentCase.refetch();
      caseStatus.refetch();
      cases.refetch();
    },
  });

  const assignCase = useAssignCase(selectedCaseId || '', {
    onSuccess: () => {
      currentCase.refetch();
      cases.refetch();
    },
  });

  const tagCase = useTagCase(selectedCaseId || '', {
    onSuccess: () => {
      currentCase.refetch();
      cases.refetch();
    },
  });

  const closeCase = useCloseCase(selectedCaseId || '', {
    onSuccess: () => {
      currentCase.refetch();
      cases.refetch();
      analytics.refetch();
    },
  });

  const deleteCase = useDeleteCase(selectedCaseId || '', {
    onSuccess: () => {
      setSelectedCaseId(undefined);
      cases.refetch();
      analytics.refetch();
    },
  });

  const createNote = useCreateCaseNote({
    onSuccess: () => {
      notes.refetch();
    },
  });

  // Helper functions
  const selectCase = useCallback((id: string) => {
    setSelectedCaseId(id);
  }, []);

  const refreshAll = useCallback(() => {
    cases.refetch();
    if (selectedCaseId) {
      currentCase.refetch();
      caseStatus.refetch();
      notes.refetch();
      timeline.refetch();
    }
    analytics.refetch();
  }, [selectedCaseId, cases, currentCase, caseStatus, notes, timeline, analytics]);

  return {
    // Queries
    cases: cases.data,
    currentCase: currentCase.data,
    caseStatus: caseStatus.data,
    notes: notes.data,
    timeline: timeline.data,
    analytics: analytics.data,
    
    // Loading states
    loading: {
      cases: cases.loading,
      currentCase: currentCase.loading,
      caseStatus: caseStatus.loading,
      notes: notes.loading,
      timeline: timeline.loading,
      analytics: analytics.loading,
      creating: createCase.loading,
      updating: updateCase.loading,
      deleting: deleteCase.loading,
    },
    
    // Error states
    error: {
      cases: cases.error,
      currentCase: currentCase.error,
      caseStatus: caseStatus.error,
      notes: notes.error,
      timeline: timeline.error,
      analytics: analytics.error,
      mutation: createCase.error || updateCase.error || deleteCase.error,
    },
    
    // Mutations
    actions: {
      createCase: createCase.mutate,
      updateCase: updateCase.mutate,
      updateStatus: updateStatus.mutate,
      assignCase: assignCase.mutate,
      tagCase: tagCase.mutate,
      closeCase: closeCase.mutate,
      deleteCase: deleteCase.mutate,
      createNote: createNote.mutate,
      selectCase,
      refreshAll,
    },
    
    // Selected case ID
    selectedCaseId,
  };
}
