/**
 * Calendar Types
 */

export interface Calendar {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCalendarInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateCalendarInput {
  title?: string;
  description?: string;
  status?: string;
}
