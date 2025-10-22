/**
 * Corporate Types
 */

export interface Corporate {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCorporateInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateCorporateInput {
  title?: string;
  description?: string;
  status?: string;
}
