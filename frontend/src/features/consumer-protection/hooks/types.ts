/**
 * Consumer Types
 */

export interface Consumer {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateConsumerInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateConsumerInput {
  title?: string;
  description?: string;
  status?: string;
}
