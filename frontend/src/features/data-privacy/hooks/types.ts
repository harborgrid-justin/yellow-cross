/**
 * DataPrivacy Types
 */

export interface DataPrivacy {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateDataPrivacyInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateDataPrivacyInput {
  title?: string;
  description?: string;
  status?: string;
}
