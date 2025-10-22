/**
 * Client CRM Types
 * TypeScript interfaces for Client CRM feature
 */

export interface Client {
  id: string;
  clientNumber: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  status: 'Active' | 'Inactive' | 'Prospective' | 'Former';
  clientType?: 'Individual' | 'Business' | 'Government';
  company?: string;
  industry?: string;
  referralSource?: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ClientCommunication {
  id: string;
  clientId: string;
  communicationType: 'Email' | 'Phone' | 'Meeting' | 'Letter' | 'Other';
  subject: string;
  content?: string;
  communicationDate: Date;
  followUpRequired?: boolean;
  followUpDate?: Date;
  createdBy: string;
  createdAt?: Date;
}

export interface ClientFeedback {
  id: string;
  clientId: string;
  rating: number;
  feedback?: string;
  feedbackDate: Date;
  caseId?: string;
  createdAt?: Date;
}

export interface CreateClientInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  clientType?: string;
  company?: string;
  industry?: string;
  referralSource?: string;
  createdBy: string;
}

export interface UpdateClientInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: string;
  clientType?: string;
  company?: string;
  industry?: string;
}

export interface CreateCommunicationInput {
  clientId: string;
  communicationType: string;
  subject: string;
  content?: string;
  communicationDate: Date;
  followUpRequired?: boolean;
  followUpDate?: Date;
  createdBy: string;
}
