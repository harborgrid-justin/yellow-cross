/**
 * Case Service
 * Business logic for Case Management
 */

import { BaseService } from './BaseService';
import { Case } from '../models/sequelize/Case';
import { CaseNote } from '../models/sequelize/CaseNote';
import { CaseTimelineEvent } from '../models/sequelize/CaseTimelineEvent';

export class CaseService extends BaseService<Case> {
  constructor() {
    super(Case);
  }

  /**
   * Find cases by status
   */
  async findByStatus(status: string): Promise<Case[]> {
    return await this.findAll({
      where: { status, archived: false },
      order: [['priority', 'DESC'], ['openedDate', 'DESC']]
    });
  }

  /**
   * Find cases assigned to a user
   */
  async findByAssignee(assignedTo: string): Promise<Case[]> {
    return await this.findAll({
      where: {
        assignedTo,
        archived: false,
        status: { $ne: 'Closed' } as any
      },
      order: [['priority', 'DESC'], ['dueDate', 'ASC']]
    });
  }

  /**
   * Assign case to a user
   */
  async assignCase(
    caseId: string,
    assignedTo: string,
    assignedBy: string,
    reason?: string
  ): Promise<Case | null> {
    const caseRecord = await this.findById(caseId);
    if (!caseRecord) {
      return null;
    }

    caseRecord.assignCase(assignedTo, assignedBy, reason);
    await caseRecord.save();

    // Create timeline event
    await CaseTimelineEvent.create({
      caseId: caseRecord.id,
      caseNumber: caseRecord.caseNumber,
      title: 'Case Assigned',
      description: `Case assigned to ${assignedTo}`,
      eventType: 'Assignment',
      eventDate: new Date(),
      createdBy: assignedBy
    });

    return caseRecord;
  }

  /**
   * Update case status
   */
  async updateStatus(
    caseId: string,
    status: string,
    updatedBy: string
  ): Promise<Case | null> {
    const caseRecord = await this.findById(caseId);
    if (!caseRecord) {
      return null;
    }

    const oldStatus = caseRecord.status;
    caseRecord.status = status;
    caseRecord.lastModifiedBy = updatedBy;
    await caseRecord.save();

    // Create timeline event
    await CaseTimelineEvent.create({
      caseId: caseRecord.id,
      caseNumber: caseRecord.caseNumber,
      title: 'Status Changed',
      description: `Status changed from ${oldStatus} to ${status}`,
      eventType: 'Status Change',
      eventDate: new Date(),
      createdBy: updatedBy
    });

    return caseRecord;
  }

  /**
   * Close a case
   */
  async closeCase(
    caseId: string,
    closedBy: string,
    outcome: string,
    resolution: string
  ): Promise<Case | null> {
    const caseRecord = await this.findById(caseId);
    if (!caseRecord) {
      return null;
    }

    caseRecord.closeCase(closedBy, outcome, resolution);
    await caseRecord.save();

    // Create timeline event
    await CaseTimelineEvent.create({
      caseId: caseRecord.id,
      caseNumber: caseRecord.caseNumber,
      title: 'Case Closed',
      description: `Case closed with outcome: ${outcome}`,
      eventType: 'Case Closed',
      eventDate: new Date(),
      createdBy: closedBy
    });

    return caseRecord;
  }

  /**
   * Archive a case
   */
  async archiveCase(
    caseId: string,
    archivedBy: string,
    retentionDays?: number
  ): Promise<Case | null> {
    const caseRecord = await this.findById(caseId);
    if (!caseRecord) {
      return null;
    }

    caseRecord.archiveCase(archivedBy, retentionDays);
    await caseRecord.save();

    return caseRecord;
  }

  /**
   * Add a note to a case
   */
  async addNote(
    caseId: string,
    content: string,
    createdBy: string,
    noteType?: string
  ): Promise<CaseNote> {
    const caseRecord = await this.findById(caseId);
    if (!caseRecord) {
      throw new Error('Case not found');
    }

    return await CaseNote.create({
      caseId: caseRecord.id,
      caseNumber: caseRecord.caseNumber,
      content,
      noteType: noteType || 'General',
      createdBy
    });
  }

  /**
   * Get case analytics
   */
  async getAnalytics(filters: any = {}): Promise<any> {
    const cases = await this.findAll({ where: filters });

    const analytics = {
      totalCases: cases.length,
      openCases: cases.filter((c) => c.status === 'Open').length,
      inProgressCases: cases.filter((c) => c.status === 'In Progress').length,
      closedCases: cases.filter((c) => c.status === 'Closed').length,
      avgDuration: 0
    };

    const closedWithDuration = cases.filter((c) => c.closedDate && c.openedDate);
    if (closedWithDuration.length > 0) {
      const totalDuration = closedWithDuration.reduce((sum, c) => {
        return sum + (c.closedDate!.getTime() - c.openedDate.getTime()) / (1000 * 60 * 60 * 24);
      }, 0);
      analytics.avgDuration = totalDuration / closedWithDuration.length;
    }

    return analytics;
  }
}

export default CaseService;
