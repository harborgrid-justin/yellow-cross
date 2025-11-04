/**
 * Billing Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { TimeEntry } from '../../models/sequelize/TimeEntry';

@Injectable()
export class BillingService extends BaseService<TimeEntry> {
  constructor(
    @InjectModel(TimeEntry)
    model: typeof TimeEntry,
  ) {
    super(model);
  }
}
