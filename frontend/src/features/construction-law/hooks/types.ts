/**
 * Construction Types
 */

export interface Construction {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateConstructionInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateConstructionInput {
  title?: string;
  description?: string;
  status?: string;
}
