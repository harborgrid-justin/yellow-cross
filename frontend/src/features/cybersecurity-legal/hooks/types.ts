/**
 * Cybersecurity Types
 */

export interface Cybersecurity {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCybersecurityInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateCybersecurityInput {
  title?: string;
  description?: string;
  status?: string;
}
