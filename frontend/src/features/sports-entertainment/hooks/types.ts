/**
 * Sports Types
 */

export interface Sports {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateSportsInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateSportsInput {
  title?: string;
  description?: string;
  status?: string;
}
