/**
 * ClassAction Types
 */

export interface ClassAction {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateClassActionInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateClassActionInput {
  title?: string;
  description?: string;
  status?: string;
}
