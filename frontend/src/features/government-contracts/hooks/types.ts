/**
 * Government Types
 */

export interface Government {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateGovernmentInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateGovernmentInput {
  title?: string;
  description?: string;
  status?: string;
}
