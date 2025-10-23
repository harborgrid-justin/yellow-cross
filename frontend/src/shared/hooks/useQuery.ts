/**
 * useQuery - Custom hook for data fetching with automatic state management
 * 
 * A reusable React hook that simplifies data fetching from API endpoints by
 * automatically managing loading, error, and data states. Provides a clean
 * interface similar to React Query but lightweight and tailored for this
 * application's API client.
 * 
 * Features:
 * - Automatic loading state management
 * - Error handling with user-friendly messages
 * - Optional callbacks for success and error cases
 * - Refetch capability for manual data refresh
 * - Skip option to prevent automatic fetching
 * - TypeScript generic support for type-safe data
 * 
 * @hook
 * @template T - The expected type of data returned from the API
 * @param {string} endpoint - API endpoint path (e.g., '/cases', '/users/123')
 * @param {Object} [options] - Hook configuration options
 * @param {boolean} [options.skip=false] - Skip automatic data fetching on mount
 * @param {Function} [options.onSuccess] - Callback fired when fetch succeeds
 * @param {Function} [options.onError] - Callback fired when fetch fails
 * 
 * @returns {QueryState<T>} Query state object
 * @returns {T|null} returns.data - The fetched data, null before first successful fetch
 * @returns {boolean} returns.loading - True while fetching, false otherwise
 * @returns {string|null} returns.error - Error message if fetch failed, null otherwise
 * @returns {Function} returns.refetch - Function to manually refetch data
 * 
 * @example
 * // Basic usage - fetch on mount
 * const { data, loading, error } = useQuery<Case[]>('/api/cases');
 * 
 * if (loading) return <Spinner />;
 * if (error) return <Error message={error} />;
 * return <CaseList cases={data} />;
 * 
 * @example
 * // With callbacks
 * const { data, loading, error, refetch } = useQuery<User>('/api/users/123', {
 *   onSuccess: (userData) => {
 *     console.log('User loaded:', userData.name);
 *     trackEvent('user_viewed');
 *   },
 *   onError: (errorMsg) => {
 *     console.error('Failed to load user:', errorMsg);
 *     showNotification('error', errorMsg);
 *   }
 * });
 * 
 * @example
 * // Skip initial fetch, fetch on demand
 * const { data, loading, refetch } = useQuery<Document[]>('/api/documents', {
 *   skip: true
 * });
 * 
 * // Later, trigger fetch
 * <button onClick={() => refetch()}>Load Documents</button>
 * 
 * @example
 * // Conditional fetching based on user input
 * const [userId, setUserId] = useState('');
 * const { data: user } = useQuery<User>(
 *   `/api/users/${userId}`,
 *   { skip: !userId } // Only fetch when userId is set
 * );
 * 
 * @see {@link useMutation} for data mutations (POST, PUT, DELETE)
 * @see {@link QueryState} for the return type structure
 * @see {@link api} for the underlying API client
 */
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
