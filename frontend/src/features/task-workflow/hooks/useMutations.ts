/**
 * Task Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Task, CreateTaskInput, UpdateTaskInput } from './types';

export function useCreateTask(options?: { onSuccess?: (data: Task) => void; onError?: (error: string) => void }) {
  return useMutation<Task, CreateTaskInput>('/task-workflow/create', 'post', options);
}

export function useUpdateTask(id: string, options?: { onSuccess?: (data: Task) => void; onError?: (error: string) => void }) {
  return useMutation<Task, UpdateTaskInput>(`/tasks/${id}`, 'put', options);
}

export function useDeleteTask(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/tasks/${id}`, 'delete', options);
}
