/**
 * Labor Types
 */

export interface Labor {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateLaborInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateLaborInput {
  title?: string;
  description?: string;
  status?: string;
}
