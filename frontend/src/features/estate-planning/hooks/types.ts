/**
 * Estate Types
 */

export interface Estate {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateEstateInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateEstateInput {
  title?: string;
  description?: string;
  status?: string;
}
