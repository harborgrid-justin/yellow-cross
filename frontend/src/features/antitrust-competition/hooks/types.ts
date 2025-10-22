/**
 * Antitrust Types
 */

export interface Antitrust {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateAntitrustInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateAntitrustInput {
  title?: string;
  description?: string;
  status?: string;
}
