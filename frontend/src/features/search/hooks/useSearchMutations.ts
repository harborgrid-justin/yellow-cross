/**
 * useSearchMutations Hook
 * Manages search mutations (save, delete, update)
 */

import { useCallback } from 'react';
import type { SearchOptions, SaveSearchPayload } from '../types';

export const useSearchMutations = (entityType: string) => {
  const performSearch = useCallback(async (options: SearchOptions) => {
    // This is handled by useSearchQueries
    return options;
  }, []);

  const saveSearch = useCallback(async (payload: SaveSearchPayload) => {
    try {
      const response = await fetch('/api/search/saved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...payload,
          criteria: payload.criteria,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save search');
      }

      const data = await response.json();
      alert('Search saved successfully!');
      return data;
    } catch (err) {
      alert('Failed to save search');
      throw err;
    }
  }, []);

  const deleteSearch = useCallback(async (id: number) => {
    try {
      const response = await fetch(`/api/search/saved/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete search');
      }

      alert('Search deleted successfully!');
    } catch (err) {
      alert('Failed to delete search');
      throw err;
    }
  }, []);

  const updateSearch = useCallback(async (id: number, updates: Partial<SaveSearchPayload>) => {
    try {
      const response = await fetch(`/api/search/saved/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update search');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      alert('Failed to update search');
      throw err;
    }
  }, []);

  return {
    performSearch,
    saveSearch,
    deleteSearch,
    updateSearch,
  };
};

export default useSearchMutations;
