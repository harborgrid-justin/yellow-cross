/**
 * Criminal Types
 */

export interface Criminal {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCriminalInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateCriminalInput {
  title?: string;
  description?: string;
  status?: string;
}
