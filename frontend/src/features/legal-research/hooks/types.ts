/**
 * Research Types
 */

export interface Research {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateResearchInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateResearchInput {
  title?: string;
  description?: string;
  status?: string;
}
