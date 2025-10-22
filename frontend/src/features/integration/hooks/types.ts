/**
 * Integration Types
 */

export interface Integration {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateIntegrationInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateIntegrationInput {
  title?: string;
  description?: string;
  status?: string;
}
