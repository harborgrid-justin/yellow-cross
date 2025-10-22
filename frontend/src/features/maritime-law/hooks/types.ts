/**
 * Maritime Types
 */

export interface Maritime {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateMaritimeInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateMaritimeInput {
  title?: string;
  description?: string;
  status?: string;
}
