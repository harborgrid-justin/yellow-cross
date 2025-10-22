/**
 * WF-COMP-XXX | calendarSchedulingApi.ts - Calendar & Scheduling API service module
 * Purpose: Calendar and scheduling API operations
 * Upstream: ../config/apiConfig, ../utils/apiUtils | Dependencies: axios, zod
 * Exports: calendarSchedulingApi instance, types | Key Features: Events, appointments, reminders
 * Last Updated: 2025-10-22 | File Type: .ts
 */

import { apiInstance } from '../config/apiConfig';
import {
  buildUrlParams,
  handleApiError,
  extractApiData,
  PaginatedResponse,
} from '../utils/apiUtils';
import { z } from 'zod';
import { auditService, AuditAction, AuditStatus } from '../audit';

// ==========================================
// INTERFACES & TYPES
// ==========================================

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  eventType: 'Court Hearing' | 'Client Meeting' | 'Deadline' | 'Task' | 'Other';
  startTime: string;
  endTime: string;
  allDay: boolean;
  location?: string;
  attendees?: string[];
  caseId?: string;
  clientId?: string;
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled';
  reminders?: Reminder[];
  recurrence?: RecurrenceRule;
  createdBy: string;
  createdAt: string;
}

export interface Reminder {
  type: 'Email' | 'SMS' | 'Notification';
  minutesBefore: number;
}

export interface RecurrenceRule {
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  interval: number;
  endDate?: string;
  count?: number;
}

export interface CreateEventData {
  title: string;
  description?: string;
  eventType: 'Court Hearing' | 'Client Meeting' | 'Deadline' | 'Task' | 'Other';
  startTime: string;
  endTime: string;
  allDay?: boolean;
  location?: string;
  attendees?: string[];
  caseId?: string;
  clientId?: string;
  reminders?: Reminder[];
  recurrence?: RecurrenceRule;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  status?: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled';
}

export interface EventFilters {
  eventType?: string;
  status?: string;
  caseId?: string;
  clientId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface CalendarSchedulingApi {
  // Event operations
  getAll(filters?: EventFilters): Promise<PaginatedResponse<CalendarEvent>>;
  getById(id: string): Promise<CalendarEvent>;
  create(data: CreateEventData): Promise<CalendarEvent>;
  update(id: string, data: UpdateEventData): Promise<CalendarEvent>;
  delete(id: string): Promise<void>;
  
  // Calendar views
  getEventsForDay(date: string): Promise<CalendarEvent[]>;
  getEventsForWeek(startDate: string): Promise<CalendarEvent[]>;
  getEventsForMonth(year: number, month: number): Promise<CalendarEvent[]>;
  
  // Availability
  checkAvailability(startTime: string, endTime: string, attendees: string[]): Promise<{ available: boolean; conflicts: CalendarEvent[] }>;
  
  // Reminders
  getUpcomingReminders(days: number): Promise<CalendarEvent[]>;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const reminderSchema = z.object({
  type: z.enum(['Email', 'SMS', 'Notification']),
  minutesBefore: z.number().int().positive(),
});

const recurrenceSchema = z.object({
  frequency: z.enum(['Daily', 'Weekly', 'Monthly', 'Yearly']),
  interval: z.number().int().positive(),
  endDate: z.string().datetime().optional(),
  count: z.number().int().positive().optional(),
});

const createEventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  eventType: z.enum(['Court Hearing', 'Client Meeting', 'Deadline', 'Task', 'Other']),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  allDay: z.boolean().optional(),
  location: z.string().max(200).optional(),
  attendees: z.array(z.string()).optional(),
  caseId: z.string().optional(),
  clientId: z.string().optional(),
  reminders: z.array(reminderSchema).optional(),
  recurrence: recurrenceSchema.optional(),
}).refine(data => new Date(data.endTime) > new Date(data.startTime), {
  message: 'End time must be after start time',
  path: ['endTime'],
});

const updateEventSchema = createEventSchema.partial().extend({
  status: z.enum(['Scheduled', 'Confirmed', 'Completed', 'Cancelled']).optional(),
});

// ==========================================
// API IMPLEMENTATION CLASS
// ==========================================

class CalendarSchedulingApiImpl implements CalendarSchedulingApi {
  private readonly baseEndpoint = '/api/calendar';
  private readonly auditResource = 'CALENDAR_EVENT';

  async getAll(filters?: EventFilters): Promise<PaginatedResponse<CalendarEvent>> {
    try {
      const params = buildUrlParams((filters || {}) as Record<string, unknown>);
      const url = `${this.baseEndpoint}${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await apiInstance.get(url);
      const data = extractApiData<PaginatedResponse<CalendarEvent>>(response);
      
      await auditService.logAction({
        action: AuditAction.READ,
        resourceType: this.auditResource,
        resourceId: 'multiple',
        status: AuditStatus.SUCCESS,
        details: { filters, count: data.data?.length || 0 }
      });
      
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getById(id: string): Promise<CalendarEvent> {
    try {
      const response = await apiInstance.get(`${this.baseEndpoint}/${id}`);
      return extractApiData<CalendarEvent>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async create(data: CreateEventData): Promise<CalendarEvent> {
    try {
      const validatedData = createEventSchema.parse(data);
      
      const response = await apiInstance.post(`${this.baseEndpoint}/create`, validatedData);
      const createdEvent = extractApiData<CalendarEvent>(response);
      
      await auditService.logAction({
        action: AuditAction.CREATE,
        resourceType: this.auditResource,
        resourceId: createdEvent.id,
        status: AuditStatus.SUCCESS,
        details: { title: createdEvent.title, eventType: createdEvent.eventType }
      });
      
      return createdEvent;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async update(id: string, data: UpdateEventData): Promise<CalendarEvent> {
    try {
      const validatedData = updateEventSchema.parse(data);
      
      const response = await apiInstance.put(`${this.baseEndpoint}/${id}`, validatedData);
      const updatedEvent = extractApiData<CalendarEvent>(response);
      
      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS,
        details: { updated: validatedData }
      });
      
      return updatedEvent;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiInstance.delete(`${this.baseEndpoint}/${id}`);
      
      await auditService.logAction({
        action: AuditAction.DELETE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS
      });
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getEventsForDay(date: string): Promise<CalendarEvent[]> {
    try {
      const response = await apiInstance.get(`${this.baseEndpoint}/day/${date}`);
      return extractApiData<CalendarEvent[]>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getEventsForWeek(startDate: string): Promise<CalendarEvent[]> {
    try {
      const response = await apiInstance.get(`${this.baseEndpoint}/week/${startDate}`);
      return extractApiData<CalendarEvent[]>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getEventsForMonth(year: number, month: number): Promise<CalendarEvent[]> {
    try {
      const response = await apiInstance.get(`${this.baseEndpoint}/month/${year}/${month}`);
      return extractApiData<CalendarEvent[]>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async checkAvailability(
    startTime: string,
    endTime: string,
    attendees: string[]
  ): Promise<{ available: boolean; conflicts: CalendarEvent[] }> {
    try {
      const response = await apiInstance.post(`${this.baseEndpoint}/check-availability`, {
        startTime,
        endTime,
        attendees,
      });
      
      return extractApiData<{ available: boolean; conflicts: CalendarEvent[] }>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getUpcomingReminders(days: number): Promise<CalendarEvent[]> {
    try {
      const response = await apiInstance.get(`${this.baseEndpoint}/reminders/upcoming?days=${days}`);
      return extractApiData<CalendarEvent[]>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// ==========================================
// SINGLETON EXPORT
// ==========================================

export const calendarSchedulingApi: CalendarSchedulingApi = new CalendarSchedulingApiImpl();
