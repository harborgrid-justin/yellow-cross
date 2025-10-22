/**
 * IP Types
 */

export interface IP {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateIPInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateIPInput {
  title?: string;
  description?: string;
  status?: string;
}
