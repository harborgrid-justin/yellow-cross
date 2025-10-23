/**
 * useSearchQueries Hook
 * Manages search queries and data fetching
 */

import { useState, useEffect } from 'react';
import type { SearchOptions, SearchResult, SavedSearch } from '../types';

interface UseSearchQueriesProps {
  entityType: 'case' | 'client' | 'document';
  query: string;
  filters: any[];
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  page: number;
  limit: number;
}

export const useSearchQueries = ({
  entityType,
  query,
  filters,
  sortBy,
  sortOrder,
  page,
  limit,
}: UseSearchQueriesProps) => {
  const [searchResults, setSearchResults] = useState<SearchResult<any> | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      if (!query && filters.length === 0) {
        setSearchResults(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/search/${entityType}s`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            query,
            filters,
            sortBy,
            sortOrder,
            page,
            limit,
          }),
        });

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();
        setSearchResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [entityType, query, filters, sortBy, sortOrder, page, limit]);

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `/api/search/suggestions?query=${encodeURIComponent(query)}&type=${entityType}&limit=5`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.suggestions || []);
        }
      } catch (err) {
        // Silently fail for suggestions
        console.error('Failed to fetch suggestions:', err);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, entityType]);

  // Fetch saved searches
  useEffect(() => {
    const fetchSavedSearches = async () => {
      try {
        const response = await fetch(`/api/search/saved?type=${entityType}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSavedSearches(data);
        }
      } catch (err) {
        console.error('Failed to fetch saved searches:', err);
      }
    };

    fetchSavedSearches();
  }, [entityType]);

  return {
    searchResults,
    suggestions,
    savedSearches,
    isLoading,
    error,
  };
};

export default useSearchQueries;
