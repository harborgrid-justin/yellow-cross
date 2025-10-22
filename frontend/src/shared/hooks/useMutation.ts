/**
 * Generic Mutation Hook
 * Reusable pattern for data mutations (POST, PUT, DELETE)
 */

import { useState, useCallback } from 'react';
import { api } from '../api/client';
import { MutationState } from './types';

type MutationMethod = 'post' | 'put' | 'patch' | 'delete';

export function useMutation<TData = unknown, TVariables = unknown>(
  endpoint: string,
  method: MutationMethod = 'post',
  options?: {
    onSuccess?: (data: TData) => void;
    onError?: (error: string) => void;
  }
): MutationState<TData, TVariables> {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData> => {
      setLoading(true);
      setError(null);

      try {
        let response: TData;

        if (method === 'delete') {
          response = await api.delete<TData>(endpoint);
        } else {
          response = await api[method]<TData>(endpoint, variables);
        }

        setData(response);
        options?.onSuccess?.(response);
        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        options?.onError?.(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, method, options]
  );

  return {
    mutate,
    loading,
    error,
    data,
  };
}
