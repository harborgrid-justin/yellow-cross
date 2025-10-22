/**
 * Message Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Message, CreateMessageInput, UpdateMessageInput } from './types';

export function useCreateMessage(options?: { onSuccess?: (data: Message) => void; onError?: (error: string) => void }) {
  return useMutation<Message, CreateMessageInput>('/communication/create', 'post', options);
}

export function useUpdateMessage(id: string, options?: { onSuccess?: (data: Message) => void; onError?: (error: string) => void }) {
  return useMutation<Message, UpdateMessageInput>(`/communication/${id}`, 'put', options);
}

export function useDeleteMessage(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/communication/${id}`, 'delete', options);
}
