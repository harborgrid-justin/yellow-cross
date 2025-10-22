/**
 * Generic Query Hook
 * Reusable pattern for data fetching with loading and error states
 */

import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import { QueryState } from './types';

export function useQuery<T>(
  endpoint: string,
  options?: {
    skip?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
  }
): QueryState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(!options?.skip);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (options?.skip) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get<T>(endpoint);
      setData(response);
      options?.onSuccess?.(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      options?.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [endpoint, options?.skip]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
