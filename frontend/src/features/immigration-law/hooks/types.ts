/**
 * Immigration Types
 */

export interface Immigration {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateImmigrationInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateImmigrationInput {
  title?: string;
  description?: string;
  status?: string;
}
