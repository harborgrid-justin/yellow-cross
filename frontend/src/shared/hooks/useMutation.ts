/**
 * MutationMethod - Supported HTTP methods for mutations
 * 
 * @typedef {('post'|'put'|'patch'|'delete')} MutationMethod
 */
type MutationMethod = 'post' | 'put' | 'patch' | 'delete';

/**
 * useMutation - Custom hook for data mutations with automatic state management
 * 
 * A reusable React hook for performing data mutations (create, update, delete)
 * on API endpoints. Automatically manages loading and error states, provides
 * callbacks for success and error scenarios, and returns the mutation function
 * for triggering operations.
 * 
 * Unlike useQuery which fetches automatically, useMutation requires manual
 * invocation via the returned mutate function. This gives you control over
 * when mutations occur (e.g., on form submit, button click).
 * 
 * Features:
 * - Support for POST, PUT, PATCH, and DELETE methods
 * - Automatic loading and error state management
 * - Optional success and error callbacks
 * - Returns response data for optimistic updates
 * - TypeScript generics for type-safe requests and responses
 * - Throws errors for try-catch handling patterns
 * 
 * @hook
 * @template TData - The expected type of data returned from the API
 * @template TVariables - The type of variables/payload sent to the API
 * @param {string} endpoint - API endpoint path (e.g., '/cases', '/users/123')
 * @param {MutationMethod} [method='post'] - HTTP method (post, put, patch, delete)
 * @param {Object} [options] - Hook configuration options
 * @param {Function} [options.onSuccess] - Callback fired when mutation succeeds
 * @param {Function} [options.onError] - Callback fired when mutation fails
 * 
 * @returns {MutationState<TData, TVariables>} Mutation state object
 * @returns {Function} returns.mutate - Function to trigger the mutation
 * @returns {boolean} returns.loading - True while mutation is in progress
 * @returns {string|null} returns.error - Error message if mutation failed
 * @returns {TData|null} returns.data - Response data from last successful mutation
 * 
 * @throws {Error} Rethrows the error after handling for try-catch patterns
 * 
 * @example
 * // Create a new case (POST)
 * const { mutate: createCase, loading, error } = useMutation<Case, CreateCaseInput>(
 *   '/api/cases',
 *   'post'
 * );
 * 
 * const handleSubmit = async (formData) => {
 *   try {
 *     const newCase = await createCase(formData);
 *     navigate(`/cases/${newCase.id}`);
 *   } catch (err) {
 *     console.error('Failed to create case');
 *   }
 * };
 * 
 * @example
 * // Update a user (PUT) with callbacks
 * const { mutate: updateUser, loading } = useMutation<User, UpdateUserInput>(
 *   `/api/users/${userId}`,
 *   'put',
 *   {
 *     onSuccess: (updatedUser) => {
 *       showNotification('success', 'User updated successfully');
 *       refetchUserList();
 *     },
 *     onError: (errorMsg) => {
 *       showNotification('error', errorMsg);
 *     }
 *   }
 * );
 * 
 * <button onClick={() => updateUser(formData)} disabled={loading}>
 *   {loading ? 'Saving...' : 'Save'}
 * </button>
 * 
 * @example
 * // Delete a document (DELETE)
 * const { mutate: deleteDoc, loading: isDeleting } = useMutation(
 *   `/api/documents/${docId}`,
 *   'delete'
 * );
 * 
 * const handleDelete = async () => {
 *   if (confirm('Are you sure?')) {
 *     await deleteDoc();
 *     navigate('/documents');
 *   }
 * };
 * 
 * @example
 * // Partial update with PATCH
 * const { mutate: patchCase } = useMutation<Case, Partial<Case>>(
 *   `/api/cases/${caseId}`,
 *   'patch'
 * );
 * 
 * // Update only status field
 * await patchCase({ status: 'closed' });
 * 
 * @see {@link useQuery} for data fetching
 * @see {@link MutationState} for the return type structure
 * @see {@link api} for the underlying API client
 */
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
