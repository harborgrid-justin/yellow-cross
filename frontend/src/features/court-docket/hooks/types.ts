/**
 * Docket Types
 */

export interface Docket {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateDocketInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateDocketInput {
  title?: string;
  description?: string;
  status?: string;
}
