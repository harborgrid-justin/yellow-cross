/**
 * Billing Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { BillingEntry } from '../../models/sequelize/BillingEntry';

@Injectable()
export class BillingService extends BaseService<BillingEntry> {
  constructor(
    @InjectModel(BillingEntry)
    model: typeof BillingEntry,
  ) {
    super(model);
  }
}
