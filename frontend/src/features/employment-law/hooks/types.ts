/**
 * Employment Types
 */

export interface Employment {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateEmploymentInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateEmploymentInput {
  title?: string;
  description?: string;
  status?: string;
}
