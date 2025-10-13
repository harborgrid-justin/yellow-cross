/**
 * Client Service
 * Business logic for Client Management
 */

import { BaseService } from './BaseService';
import { Client } from '../models/sequelize/Client';
import { ClientCommunication } from '../models/sequelize/ClientCommunication';
import { ClientFeedback } from '../models/sequelize/ClientFeedback';

export class ClientService extends BaseService<Client> {
  constructor() {
    super(Client);
  }

  /**
   * Find clients by status
   */
  async findByStatus(status: string): Promise<Client[]> {
    return await this.findAll({
      where: { status },
      order: [['lastName', 'ASC'], ['firstName', 'ASC']]
    });
  }

  /**
   * Find clients by relationship manager
   */
  async findByManager(relationshipManager: string): Promise<Client[]> {
    return await this.findAll({
      where: { relationshipManager, status: 'Active' },
      order: [['lastName', 'ASC']]
    });
  }

  /**
   * Search clients
   */
  async search(query: string): Promise<Client[]> {
    return await this.findAll({
      where: {
        $or: [
          { firstName: { $iLike: `%${query}%` } },
          { lastName: { $iLike: `%${query}%` } },
          { companyName: { $iLike: `%${query}%` } },
          { email: { $iLike: `%${query}%` } }
        ] as any
      },
      order: [['lastName', 'ASC']]
    });
  }

  /**
   * Update client status
   */
  async updateStatus(
    clientId: string,
    newStatus: string,
    changedBy: string,
    reason?: string
  ): Promise<Client | null> {
    const client = await this.findById(clientId);
    if (!client) {
      return null;
    }

    client.updateStatus(newStatus, changedBy, reason);
    await client.save();

    return client;
  }

  /**
   * Record conflict check
   */
  async recordConflictCheck(
    clientId: string,
    performedBy: string,
    result: string,
    notes?: string
  ): Promise<Client | null> {
    const client = await this.findById(clientId);
    if (!client) {
      return null;
    }

    client.recordConflictCheck(performedBy, result, notes);
    await client.save();

    return client;
  }

  /**
   * Add communication record
   */
  async addCommunication(
    clientId: string,
    data: {
      communicationType: string;
      subject: string;
      content?: string;
      direction: string;
      contactedBy: string;
      communicationDate: Date;
    }
  ): Promise<ClientCommunication> {
    const client = await this.findById(clientId);
    if (!client) {
      throw new Error('Client not found');
    }

    return await ClientCommunication.create({
      clientId: client.id,
      ...data
    });
  }

  /**
   * Add feedback
   */
  async addFeedback(
    clientId: string,
    data: {
      feedbackType: string;
      rating?: number;
      comments?: string;
      feedbackDate: Date;
      relatedService?: string;
      relatedCaseId?: string;
    }
  ): Promise<ClientFeedback> {
    const client = await this.findById(clientId);
    if (!client) {
      throw new Error('Client not found');
    }

    return await ClientFeedback.create({
      clientId: client.id,
      ...data
    });
  }

  /**
   * Get client analytics
   */
  async getAnalytics(filters: any = {}): Promise<any> {
    const clients = await this.findAll({ where: filters });

    return {
      totalClients: clients.length,
      activeClients: clients.filter((c) => c.status === 'Active').length,
      prospects: clients.filter((c) => c.status === 'Prospect').length,
      inactiveClients: clients.filter((c) => c.status === 'Inactive').length,
      formerClients: clients.filter((c) => c.status === 'Former').length,
      totalLifetimeValue: clients.reduce((sum, c) => sum + (c.lifetimeValue || 0), 0),
      avgLifetimeValue:
        clients.length > 0
          ? clients.reduce((sum, c) => sum + (c.lifetimeValue || 0), 0) / clients.length
          : 0
    };
  }
}

export default ClientService;
