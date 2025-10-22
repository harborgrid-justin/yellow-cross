/**
 * Aviation Types
 */

export interface Aviation {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateAviationInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateAviationInput {
  title?: string;
  description?: string;
  status?: string;
}
