/**
 * Veterans Types
 */

export interface Veterans {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateVeteransInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateVeteransInput {
  title?: string;
  description?: string;
  status?: string;
}
