/**
 * Telecommunications Types
 */

export interface Telecommunications {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateTelecommunicationsInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateTelecommunicationsInput {
  title?: string;
  description?: string;
  status?: string;
}
