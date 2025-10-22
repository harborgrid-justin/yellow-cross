/**
 * Family Types
 */

export interface Family {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateFamilyInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateFamilyInput {
  title?: string;
  description?: string;
  status?: string;
}
