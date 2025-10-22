/**
 * Franchise Types
 */

export interface Franchise {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateFranchiseInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateFranchiseInput {
  title?: string;
  description?: string;
  status?: string;
}
