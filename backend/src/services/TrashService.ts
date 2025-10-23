/**
 * TrashService - Soft delete and recovery system
 * Adapted from Twenty CRM and Baserow trash systems for Yellow Cross
 * 
 * @module TrashService
 * @see {@link https://github.com/twentyhq/twenty}
 * @see {@link https://github.com/baserow/baserow}
 */

import winston from 'winston';
import { Case, Client, Document, Task, User } from '../models/sequelize';
import ActivityService from './ActivityService';
import { Op } from 'sequelize';

/**
 * Trash item interface for listing deleted items
 */
interface TrashItem {
  id: string;
  type: string;
  name: string;
  deletedAt: Date;
  deletedBy?: string;
  canRestore: boolean;
  metadata?: any;
}

/**
 * TrashService provides soft delete and recovery functionality
 * 
 * Features:
 * - Soft delete with 30-day retention
 * - Restore deleted items
 * - List deleted items by type
 * - Permanent deletion after retention period
 * - Cascade soft delete for related items
 */
export class TrashService {
  private logger: winston.Logger;
  private retentionDays: number;

  constructor(retentionDays: number = 30) {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [new winston.transports.Console()],
    });
    this.retentionDays = retentionDays;
  }

  /**
   * Soft delete a case
   */
  async deleteCase(caseId: string, userId: string): Promise<void> {
    try {
      const caseItem = await Case.findByPk(caseId);
      
      if (!caseItem) {
        throw new Error('Case not found');
      }

      if ((caseItem as any).deletedAt) {
        throw new Error('Case is already deleted');
      }

      // Soft delete the case
      await caseItem.update({
        deletedAt: new Date(),
        deletedBy: userId
      } as any);

      // Log activity
      await ActivityService.logCaseActivity(
        caseId,
        'deleted',
        `Case ${(caseItem as any).caseNumber || caseId} moved to trash`,
        userId
      );

      this.logger.info('Case soft deleted', { caseId, userId });
    } catch (error) {
      this.logger.error('Failed to delete case', { error, caseId, userId });
      throw error;
    }
  }

  /**
   * Restore a deleted case
   */
  async restoreCase(caseId: string, userId: string): Promise<void> {
    try {
      const caseItem = await Case.findByPk(caseId, {
        paranoid: false // Include soft-deleted records
      });

      if (!caseItem) {
        throw new Error('Case not found');
      }

      if (!(caseItem as any).deletedAt) {
        throw new Error('Case is not deleted');
      }

      // Check if retention period expired
      const deletedAt = new Date((caseItem as any).deletedAt);
      const expirationDate = new Date(deletedAt.getTime() + this.retentionDays * 24 * 60 * 60 * 1000);
      
      if (new Date() > expirationDate) {
        throw new Error('Case retention period has expired and cannot be restored');
      }

      // Restore the case
      await caseItem.update({
        deletedAt: null,
        deletedBy: null
      } as any);

      // Log activity
      await ActivityService.logCaseActivity(
        caseId,
        'restored',
        `Case ${(caseItem as any).caseNumber || caseId} restored from trash`,
        userId
      );

      this.logger.info('Case restored', { caseId, userId });
    } catch (error) {
      this.logger.error('Failed to restore case', { error, caseId, userId });
      throw error;
    }
  }

  /**
   * Soft delete a document
   */
  async deleteDocument(documentId: string, userId: string): Promise<void> {
    try {
      const document = await Document.findByPk(documentId);
      
      if (!document) {
        throw new Error('Document not found');
      }

      if ((document as any).deletedAt) {
        throw new Error('Document is already deleted');
      }

      await document.update({
        deletedAt: new Date(),
        deletedBy: userId
      } as any);

      await ActivityService.logDocumentActivity(
        documentId,
        'deleted',
        `Document ${(document as any).fileName || documentId} moved to trash`,
        userId
      );

      this.logger.info('Document soft deleted', { documentId, userId });
    } catch (error) {
      this.logger.error('Failed to delete document', { error, documentId, userId });
      throw error;
    }
  }

  /**
   * Restore a deleted document
   */
  async restoreDocument(documentId: string, userId: string): Promise<void> {
    try {
      const document = await Document.findByPk(documentId, { paranoid: false });

      if (!document) {
        throw new Error('Document not found');
      }

      if (!(document as any).deletedAt) {
        throw new Error('Document is not deleted');
      }

      const deletedAt = new Date((document as any).deletedAt);
      const expirationDate = new Date(deletedAt.getTime() + this.retentionDays * 24 * 60 * 60 * 1000);
      
      if (new Date() > expirationDate) {
        throw new Error('Document retention period has expired');
      }

      await document.update({
        deletedAt: null,
        deletedBy: null
      } as any);

      await ActivityService.logDocumentActivity(
        documentId,
        'restored',
        `Document ${(document as any).fileName || documentId} restored from trash`,
        userId
      );

      this.logger.info('Document restored', { documentId, userId });
    } catch (error) {
      this.logger.error('Failed to restore document', { error, documentId, userId });
      throw error;
    }
  }

  /**
   * Soft delete a task
   */
  async deleteTask(taskId: string, userId: string): Promise<void> {
    try {
      const task = await Task.findByPk(taskId);
      
      if (!task) {
        throw new Error('Task not found');
      }

      if ((task as any).deletedAt) {
        throw new Error('Task is already deleted');
      }

      await task.update({
        deletedAt: new Date(),
        deletedBy: userId
      } as any);

      await ActivityService.logTaskActivity(
        taskId,
        'deleted',
        `Task ${(task as any).title || taskId} moved to trash`,
        userId
      );

      this.logger.info('Task soft deleted', { taskId, userId });
    } catch (error) {
      this.logger.error('Failed to delete task', { error, taskId, userId });
      throw error;
    }
  }

  /**
   * Restore a deleted task
   */
  async restoreTask(taskId: string, userId: string): Promise<void> {
    try {
      const task = await Task.findByPk(taskId, { paranoid: false });

      if (!task) {
        throw new Error('Task not found');
      }

      if (!(task as any).deletedAt) {
        throw new Error('Task is not deleted');
      }

      const deletedAt = new Date((task as any).deletedAt);
      const expirationDate = new Date(deletedAt.getTime() + this.retentionDays * 24 * 60 * 60 * 1000);
      
      if (new Date() > expirationDate) {
        throw new Error('Task retention period has expired');
      }

      await task.update({
        deletedAt: null,
        deletedBy: null
      } as any);

      await ActivityService.logTaskActivity(
        taskId,
        'restored',
        `Task ${(task as any).title || taskId} restored from trash`,
        userId
      );

      this.logger.info('Task restored', { taskId, userId });
    } catch (error) {
      this.logger.error('Failed to restore task', { error, taskId, userId });
      throw error;
    }
  }

  /**
   * Soft delete a client
   */
  async deleteClient(clientId: string, userId: string): Promise<void> {
    try {
      const client = await Client.findByPk(clientId);
      
      if (!client) {
        throw new Error('Client not found');
      }

      if ((client as any).deletedAt) {
        throw new Error('Client is already deleted');
      }

      await client.update({
        deletedAt: new Date(),
        deletedBy: userId
      } as any);

      await ActivityService.logClientActivity(
        clientId,
        'deleted',
        `Client ${(client as any).name || clientId} moved to trash`,
        userId
      );

      this.logger.info('Client soft deleted', { clientId, userId });
    } catch (error) {
      this.logger.error('Failed to delete client', { error, clientId, userId });
      throw error;
    }
  }

  /**
   * Restore a deleted client
   */
  async restoreClient(clientId: string, userId: string): Promise<void> {
    try {
      const client = await Client.findByPk(clientId, { paranoid: false });

      if (!client) {
        throw new Error('Client not found');
      }

      if (!(client as any).deletedAt) {
        throw new Error('Client is not deleted');
      }

      const deletedAt = new Date((client as any).deletedAt);
      const expirationDate = new Date(deletedAt.getTime() + this.retentionDays * 24 * 60 * 60 * 1000);
      
      if (new Date() > expirationDate) {
        throw new Error('Client retention period has expired');
      }

      await client.update({
        deletedAt: null,
        deletedBy: null
      } as any);

      await ActivityService.logClientActivity(
        clientId,
        'restored',
        `Client ${(client as any).name || clientId} restored from trash`,
        userId
      );

      this.logger.info('Client restored', { clientId, userId });
    } catch (error) {
      this.logger.error('Failed to restore client', { error, clientId, userId });
      throw error;
    }
  }

  /**
   * Get all deleted items (trash bin view)
   */
  async getTrashItems(userId: string, type?: string): Promise<TrashItem[]> {
    try {
      const items: TrashItem[] = [];
      const now = new Date();

      // Helper function to check if item can be restored
      const canRestore = (deletedAt: Date): boolean => {
        const expirationDate = new Date(deletedAt.getTime() + this.retentionDays * 24 * 60 * 60 * 1000);
        return now <= expirationDate;
      };

      // Fetch deleted cases if type is not specified or is 'case'
      if (!type || type === 'case') {
        const cases = await Case.findAll({
          where: { deletedAt: { [Op.ne]: null } } as any,
          paranoid: false
        });

        items.push(...cases.map(c => ({
          id: c.id as string,
          type: 'case',
          name: (c as any).title || (c as any).caseNumber || 'Untitled Case',
          deletedAt: (c as any).deletedAt,
          deletedBy: (c as any).deletedBy,
          canRestore: canRestore((c as any).deletedAt),
          metadata: {
            caseNumber: (c as any).caseNumber,
            status: (c as any).status
          }
        })));
      }

      // Fetch deleted documents
      if (!type || type === 'document') {
        const documents = await Document.findAll({
          where: { deletedAt: { [Op.ne]: null } } as any,
          paranoid: false
        });

        items.push(...documents.map(d => ({
          id: d.id as string,
          type: 'document',
          name: (d as any).fileName || 'Untitled Document',
          deletedAt: (d as any).deletedAt,
          deletedBy: (d as any).deletedBy,
          canRestore: canRestore((d as any).deletedAt),
          metadata: {
            fileSize: (d as any).fileSize,
            mimeType: (d as any).mimeType
          }
        })));
      }

      // Fetch deleted tasks
      if (!type || type === 'task') {
        const tasks = await Task.findAll({
          where: { deletedAt: { [Op.ne]: null } } as any,
          paranoid: false
        });

        items.push(...tasks.map(t => ({
          id: t.id as string,
          type: 'task',
          name: (t as any).title || 'Untitled Task',
          deletedAt: (t as any).deletedAt,
          deletedBy: (t as any).deletedBy,
          canRestore: canRestore((t as any).deletedAt),
          metadata: {
            priority: (t as any).priority,
            status: (t as any).status
          }
        })));
      }

      // Fetch deleted clients
      if (!type || type === 'client') {
        const clients = await Client.findAll({
          where: { deletedAt: { [Op.ne]: null } } as any,
          paranoid: false
        });

        items.push(...clients.map(c => ({
          id: c.id as string,
          type: 'client',
          name: (c as any).name || 'Untitled Client',
          deletedAt: (c as any).deletedAt,
          deletedBy: (c as any).deletedBy,
          canRestore: canRestore((c as any).deletedAt),
          metadata: {
            email: (c as any).email,
            phone: (c as any).phone
          }
        })));
      }

      // Sort by deletion date (most recent first)
      items.sort((a, b) => b.deletedAt.getTime() - a.deletedAt.getTime());

      return items;
    } catch (error) {
      this.logger.error('Failed to get trash items', { error, userId });
      throw error;
    }
  }

  /**
   * Permanently delete expired items (cron job)
   */
  async cleanupExpiredItems(): Promise<{
    cases: number;
    documents: number;
    tasks: number;
    clients: number;
    total: number;
  }> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);

      let casesDeleted = 0;
      let documentsDeleted = 0;
      let tasksDeleted = 0;
      let clientsDeleted = 0;

      // Permanently delete expired cases
      const expiredCases = await Case.findAll({
        where: {
          deletedAt: { [Op.lt]: cutoffDate } as any
        },
        paranoid: false
      });

      for (const caseItem of expiredCases) {
        await caseItem.destroy({ force: true });
        casesDeleted++;
      }

      // Permanently delete expired documents
      const expiredDocuments = await Document.findAll({
        where: {
          deletedAt: { [Op.lt]: cutoffDate } as any
        },
        paranoid: false
      });

      for (const doc of expiredDocuments) {
        await doc.destroy({ force: true });
        documentsDeleted++;
      }

      // Permanently delete expired tasks
      const expiredTasks = await Task.findAll({
        where: {
          deletedAt: { [Op.lt]: cutoffDate } as any
        },
        paranoid: false
      });

      for (const task of expiredTasks) {
        await task.destroy({ force: true });
        tasksDeleted++;
      }

      // Permanently delete expired clients
      const expiredClients = await Client.findAll({
        where: {
          deletedAt: { [Op.lt]: cutoffDate } as any
        },
        paranoid: false
      });

      for (const client of expiredClients) {
        await client.destroy({ force: true });
        clientsDeleted++;
      }

      const total = casesDeleted + documentsDeleted + tasksDeleted + clientsDeleted;

      this.logger.info('Expired trash items cleaned up', {
        cases: casesDeleted,
        documents: documentsDeleted,
        tasks: tasksDeleted,
        clients: clientsDeleted,
        total
      });

      return {
        cases: casesDeleted,
        documents: documentsDeleted,
        tasks: tasksDeleted,
        clients: clientsDeleted,
        total
      };
    } catch (error) {
      this.logger.error('Failed to cleanup expired items', { error });
      throw error;
    }
  }

  /**
   * Empty trash for a specific entity type
   */
  async emptyTrash(type: string, userId: string): Promise<number> {
    try {
      let deleted = 0;

      switch (type) {
        case 'case':
          const cases = await Case.findAll({
            where: { deletedAt: { [Op.ne]: null } } as any,
            paranoid: false
          });
          for (const c of cases) {
            await c.destroy({ force: true });
            deleted++;
          }
          break;

        case 'document':
          const documents = await Document.findAll({
            where: { deletedAt: { [Op.ne]: null } } as any,
            paranoid: false
          });
          for (const d of documents) {
            await d.destroy({ force: true });
            deleted++;
          }
          break;

        case 'task':
          const tasks = await Task.findAll({
            where: { deletedAt: { [Op.ne]: null } } as any,
            paranoid: false
          });
          for (const t of tasks) {
            await t.destroy({ force: true });
            deleted++;
          }
          break;

        case 'client':
          const clients = await Client.findAll({
            where: { deletedAt: { [Op.ne]: null } } as any,
            paranoid: false
          });
          for (const c of clients) {
            await c.destroy({ force: true });
            deleted++;
          }
          break;

        default:
          throw new Error(`Unknown type: ${type}`);
      }

      await ActivityService.logSystemActivity(
        'trash_emptied',
        `Emptied trash for ${type} (${deleted} items)`,
        { type, count: deleted, userId },
        'info'
      );

      this.logger.info('Trash emptied', { type, count: deleted, userId });
      return deleted;
    } catch (error) {
      this.logger.error('Failed to empty trash', { error, type, userId });
      throw error;
    }
  }
}

export default new TrashService();
