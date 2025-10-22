/**
 * TaskWorkflowService
 * Business logic for TaskWorkflow
 * 
 * This service provides production-grade business logic including:
 * - CRUD operations via BaseService
 * - Status management
 * - Search and filtering
 * - Analytics and reporting
 * - Data validation
 */

import { BaseService } from './BaseService';
import { Task } from '../models/sequelize/Task';

export class TaskWorkflowService extends BaseService<Task> {
  constructor() {
    super(Task);
  }

  /**
   * Find records by status
   */
  async findByStatus(status: string): Promise<Task[]> {
    return await this.findAll({
      where: { status },
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * Find records assigned to a user
   */
  async findByAssignee(assignedTo: string): Promise<Task[]> {
    return await this.findAll({
      where: { assignedTo },
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * Update record status
   */
  async updateStatus(
    id: string,
    status: string,
    updatedBy: string
  ): Promise<Task | null> {
    const record = await this.findById(id);
    if (!record) {
      return null;
    }

    await record.update({
      status,
      lastModifiedBy: updatedBy,
      lastModifiedDate: new Date()
    });

    return record;
  }

  /**
   * Get analytics for this feature
   */
  async getAnalytics(filters: any = {}): Promise<any> {
    const records = await this.findAll({ where: filters });

    const statusCounts: Record<string, number> = {};
    records.forEach((record: any) => {
      const status = record.status || 'Unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return {
      totalRecords: records.length,
      statusBreakdown: statusCounts,
      recentRecords: records.slice(0, 10)
    };
  }

  /**
   * Archive old records
   */
  async archiveOldRecords(daysOld: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const oldRecords = await this.findAll({
      where: {
        createdAt: { $lt: cutoffDate } as any,
        archived: false
      }
    });

    for (const record of oldRecords) {
      await record.update({ archived: true });
    }

    return oldRecords.length;
  }
}

export default TaskWorkflowService;
