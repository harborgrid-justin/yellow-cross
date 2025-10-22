/**
 * Message Types
 */

export interface Message {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateMessageInput {
  title: string;
  description?: string;
  createdBy: string;
}

export interface UpdateMessageInput {
  title?: string;
  description?: string;
  status?: string;
}
