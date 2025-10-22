/**
 * Calendar Mutation Hooks
 */

import { useMutation } from '../../../shared/hooks/useMutation';
import { Calendar, CreateCalendarInput, UpdateCalendarInput } from './types';

export function useCreateCalendar(options?: { onSuccess?: (data: Calendar) => void; onError?: (error: string) => void }) {
  return useMutation<Calendar, CreateCalendarInput>('/calendar/create', 'post', options);
}

export function useUpdateCalendar(id: string, options?: { onSuccess?: (data: Calendar) => void; onError?: (error: string) => void }) {
  return useMutation<Calendar, UpdateCalendarInput>(`/calendar/${id}`, 'put', options);
}

export function useDeleteCalendar(id: string, options?: { onSuccess?: (data: { success: boolean }) => void; onError?: (error: string) => void }) {
  return useMutation<{ success: boolean }, void>(`/calendar/${id}`, 'delete', options);
}
