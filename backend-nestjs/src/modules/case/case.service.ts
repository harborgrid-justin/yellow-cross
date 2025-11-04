/**
 * Case Service
 * Business logic for Case Management
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { Case } from '../../models/sequelize/Case';
import { CaseNote } from '../../models/sequelize/CaseNote';
import { CaseTimelineEvent } from '../../models/sequelize/CaseTimelineEvent';

@Injectable()
export class CaseService extends BaseService<Case> {
  constructor(
    @InjectModel(Case)
    caseModel: typeof Case,
    @InjectModel(CaseNote)
    private caseNoteModel: typeof CaseNote,
    @InjectModel(CaseTimelineEvent)
    private caseTimelineModel: typeof CaseTimelineEvent,
  ) {
    super(caseModel);
  }

  async findByStatus(status: string): Promise<Case[]> {
    return await this.findAll({
      where: { status, archived: false },
      order: [['priority', 'DESC'], ['openedDate', 'DESC']],
    });
  }

  async findByAssignee(assignedTo: string): Promise<Case[]> {
    return await this.findAll({
      where: {
        assignedTo,
        archived: false,
        status: { $ne: 'Closed' } as any,
      },
      order: [['priority', 'DESC'], ['dueDate', 'ASC']],
    });
  }

  async assignCase(
    caseId: string,
    assignedTo: string,
    assignedBy: string,
    reason?: string,
  ): Promise<Case | null> {
    const caseRecord = await this.findById(caseId);
    if (!caseRecord) return null;

    await caseRecord.update({
      assignedTo,
      assignedAt: new Date(),
      assignedBy,
    } as any);

    // Create timeline event
    await this.caseTimelineModel.create({
      caseId: caseRecord.id,
      caseNumber: caseRecord.caseNumber,
      title: 'Case Assigned',
      description: `Case assigned to ${assignedTo}${reason ? `: ${reason}` : ''}`,
      eventType: 'Assignment',
      eventDate: new Date(),
      createdBy: assignedBy,
    } as any);

    return caseRecord;
  }

  async addNote(
    caseId: string,
    content: string,
    createdBy: string,
  ): Promise<CaseNote> {
    return await this.caseNoteModel.create({
      caseId,
      content,
      createdBy,
      createdAt: new Date(),
    } as any);
  }

  async getCaseAnalytics() {
    const total = await this.count();
    const open = await this.count({ where: { status: 'Open' } });
    const closed = await this.count({ where: { status: 'Closed' } });
    const pending = await this.count({ where: { status: 'Pending' } });

    return {
      total,
      open,
      closed,
      pending,
      breakdown: {
        open: ((open / total) * 100).toFixed(2),
        closed: ((closed / total) * 100).toFixed(2),
        pending: ((pending / total) * 100).toFixed(2),
      },
    };
  }
}
