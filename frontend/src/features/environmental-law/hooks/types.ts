/**
 * Environmental Types
 */

export interface Environmental {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateEnvironmentalInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateEnvironmentalInput {
  title?: string;
  description?: string;
  status?: string;
}
