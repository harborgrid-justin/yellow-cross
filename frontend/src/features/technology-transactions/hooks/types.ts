/**
 * Technology Types
 */

export interface Technology {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateTechnologyInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateTechnologyInput {
  title?: string;
  description?: string;
  status?: string;
}
