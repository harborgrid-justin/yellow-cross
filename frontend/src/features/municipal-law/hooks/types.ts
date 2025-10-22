/**
 * Municipal Types
 */

export interface Municipal {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateMunicipalInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateMunicipalInput {
  title?: string;
  description?: string;
  status?: string;
}
