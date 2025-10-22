/**
 * Tax Types
 */

export interface Tax {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateTaxInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateTaxInput {
  title?: string;
  description?: string;
  status?: string;
}
