/**
 * Compliance Service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '../common/base.service';
import { ComplianceItem } from '../../models/sequelize/ComplianceItem';

@Injectable()
export class ComplianceService extends BaseService<ComplianceItem> {
  constructor(
    @InjectModel(ComplianceItem)
    model: typeof ComplianceItem,
  ) {
    super(model);
  }
}
