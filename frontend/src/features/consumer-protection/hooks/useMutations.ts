/**
 * Consumer Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Consumer, CreateConsumerInput, UpdateConsumerInput } from './types';

export function useCreateConsumer(options?: { onSuccess?: (data: Consumer) => void; onError?: (error: string) => void }) {
  return useMutation<Consumer, CreateConsumerInput>('/consumer-protection/create', 'post', options);
}

export function useUpdateConsumer(id: string, options?: { onSuccess?: (data: Consumer) => void; onError?: (error: string) => void }) {
  return useMutation<Consumer, UpdateConsumerInput>(`/consumer-protection/${id}`, 'put', options);
}

export function useDeleteConsumer(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/consumer-protection/${id}`, 'delete', options);
}
