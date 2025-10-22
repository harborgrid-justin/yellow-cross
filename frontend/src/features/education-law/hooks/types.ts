/**
 * Education Types
 */

export interface Education {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateEducationInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateEducationInput {
  title?: string;
  description?: string;
  status?: string;
}
